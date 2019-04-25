/**
 * @description: 账户级优惠的筛选条件
 * @author: shirleyyu
 * @date: 2019-03-21
 */
import React from 'react';
import { Select, Input } from 'antd';
import styles from '../../discount.less';
import { accountStatusMap } from '../../../config/account';

const { Option } = Select;
const { TextArea } = Input;

export default class sCommonSearchItem extends React.Component {
  onChange(key, val) {
    if (key === 'ruleIdList') {
      this.setState({ [key]: val.target.value });
    }
    this.props.onChange(key, val);
  }

  render() {
    const { changedFields = {} } = this.props;
    const { ownerUin, ruleIdList = [], status = '' } = changedFields;
    const showRuleId = ruleIdList.length > 0 ? this.state.ruleIdList : '';

    const accountStatusOptions = [];
    Object.keys(accountStatusMap).forEach((key) => {
      if (key !== '6') {
        accountStatusOptions.push(<Option value={key} key={key}>{accountStatusMap[key]}</Option>);
      }
    });

    return (
      <React.Fragment>
        <div>
          <span style={{ marginRight: '10px' }}>优惠ID</span>
          <TextArea
            style={{ verticalAlign: 'top', marginBottom: '10px' }}
            placeholder="支持批量查询，多个ID请用英文逗号或回车符分开"
            className={styles.wid150}
            rows={3}
            value={showRuleId}
            onChange={this.onChange.bind(this, 'ruleIdList')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>客户UIN</span>
          <Input
            style={{ verticalAlign: 'top', marginBottom: '10px' }}
            placeholder="只支持单个查询"
            className={styles.wid150}
            value={ownerUin}
            onChange={this.onChange.bind(this, 'ownerUin')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>优惠状态</span>
          <Select
            size="small"
            className={styles.wid100}
            showSearch
            value={status.toString()}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'status')}
          >
            <Option value="">全部</Option>{accountStatusOptions}</Select>
        </div>
      </React.Fragment>
    );
  }
}

