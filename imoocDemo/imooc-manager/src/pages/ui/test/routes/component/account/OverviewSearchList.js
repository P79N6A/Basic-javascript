/**
 * @description: 账户级优惠总览的筛选条件
 * @author: shirleyyu
 * @date: 2019-03-21
 */
import React from 'react';
import { Card, Row, Button, Divider } from 'antd';
import CommonSearchItem from './CommonSearchItem';
import AdvancedSearchItem from './AdvancedSearchItem';
import Util from '../../../libraries/util';
import { searchTimeMap } from './config';

export default class OverviewSearchList extends React.Component {
  constructor(props) {
    super(props);
    const { changedFields, searchType } = this.props;
    this.state = {
      initChangedFields: { ...changedFields },
      searchType, //是否高级查询
      advancedSearchText: '高级查询', //是否高级查询
    };
  }

  onChange(key, val, ext) {
    const { onChangeState, changedFields } = this.props;
    let changeObj = {};
    if (key === 'ruleIdList') {
      const { value } = val.target;
      const list = Util.handleUserIds(value);
      changeObj = { [key]: key === 'Id' && Array.isArray(list) ? list.map(id => (id ? Number(id) : id)) : list };
    } else if (key === 'status') {
      changeObj = {
        [key]: val,
      };
    } else if (['BeginTime', 'EndTime', 'CreatTime', 'UpdateTime'].indexOf(key) > -1) {
      changeObj = {
        [searchTimeMap[key][0]]: ext[0],
        [searchTimeMap[key][1]]: ext[1],
      };
    } else {
      changeObj = {
        [key]: val.target.value,
      };
    }
    onChangeState({
      changedFields: {
        ...changedFields,
        ...changeObj,
      },
    });
  }

  resetSearch() {
    this.props.onChangeState({
      changedFields: this.state.initChangedFields,
    }, this.props.handleSearch);
  }

  handleSearch() {
    const { handleSearch, changedFields, onChangeState } = this.props;

    onChangeState(
      {
        current: 1,
        changedFields: {
          ...changedFields,
          page: 1,
        },
      },
      handleSearch
    );
  }

  // 展开或收起高级查询
  onUnfoldMoreQuery() {
    this.setState(prev => ({
      ...prev,
      searchType: !!prev.searchType ? '' : 'advancedSearch',
      advancedSearchText: !!prev.searchType ? '高级查询' : '收起',
    }));
  }

  render() {
    const { searchType, advancedSearchText } = this.state;

    return (
      <Card bodyStyle={{ padding: '10px 15px' }}>
        <CommonSearchItem
          onChange={this.onChange.bind(this)}
          {...this.props}
        />
        {
          !!searchType
            ?
            (
              <AdvancedSearchItem
                {...this.props}
                onChange={this.onChange.bind(this)}
              />
            )
            :
            null
        }
        <Divider style={{ margin: '0px', fontSize: '12px' }}>
          <a style={{ textDecorationLine: 'underline' }} onClick={this.onUnfoldMoreQuery.bind(this)}>{advancedSearchText}</a>
        </Divider>
        <Row>
          <Button type="primary" size="small" onClick={this.handleSearch.bind(this)}>
            搜索
          </Button>
          <Button type="primary" size="small" style={{ margin: '0 20px' }} onClick={this.resetSearch.bind(this)}>
            重置
          </Button>
        </Row>
      </Card>
    );
  }
}

