/**
 * @description: 折扣管理的筛选条件
 * @author: shirleyyu
 * @date: 2018-02-24
 * @interface: 产品名称和子产品名称：“获取商品列表”
 */
import React from 'react';
import { Spin, Card, Row, Button, Divider, message } from 'antd';
import CommonSearchItem from './CommonSearchItem';
import AdvancedSearchItem from './AdvancedSearchItem';
import Util from '../../../libraries/util';
import Api from '../../../services/index';
import { searchTimeMap } from './config';

export default class SearchList extends React.Component {
  constructor(props) {
    super(props);
    const { changedFields, searchType } = this.props;
    this.state = {
      initChangedFields: { ...changedFields },
      subProductList: [],
      billingItemList: [],
      subBillingItemList: [],
      searchType, //是否高级查询
      advancedSearchText: '高级查询', //是否高级查询
    };
  }

  componentDidMount() {
    this.getInitInfo();
  }

  getInitInfo() {
    this.setState({ loading: true }, () => {
      Promise.all([Api.queryProductList(), Api.getDiscountConfig()])
        .then((res) => {
          const [pro, con] = res;
          let productList = [];
          let config = {};
          if (pro.code === 0) {
            productList = pro.data.infos;
          } else {
            message.error(pro.message);
          }
          if (con.code === 0) {
            config = con.data;
          } else {
            message.error(con.message);
          }
          this.setState({
            loading: false,
            productList,
            typeMap: config.typeMap,
            preferentialTypeMap: config.preferentialTypeMap,
          });
          // this.props.handleSearch();
        })
        .catch((err) => {
          this.setState({ loading: false });
          message.error(`获取产品信息出错！${err.message}`);
        });
    });
  }

  onChange(key, val, ext) {
    const { onChangeState, changedFields } = this.props;
    let changeObj = {};
    let extObj = {};

    if (['ActivityId', 'BuId', 'ProductId', 'Creator'].indexOf(key) > -1) {
      changeObj = { [key]: val.target.value.trim() };
    } else if (key === 'pricePid') {
      let value = val.target.value.trim();
      value = isNaN(value) ? value : Number(value);
      changeObj = { [key]: value };
    } else if (['UserId', 'Id'].indexOf(key) > -1) {
      const { value } = val.target;
      const list = Util.handleUserIds(value);
      changeObj = { [key]: key === 'Id' && Array.isArray(list) ? list.map(id => (id ? Number(id) : id)) : list };
    } else if (key === 'Type') {
      changeObj = {
        [key]: val,
        UserId: '',
        ActivityId: '',
      };
      extObj = { tableData: [] };
    } else if (key === 'Status') {
      changeObj = { [key]: val ? Number(val) : '' };
    } else if (key === 'product_code') {
      changeObj = {
        [key]: val,
        sub_product_code: '',
        billing_item_code: '',
        sub_billing_item_code: '',
      };
      const { productList = [] } = this.state;
      const values = {
        product_code: val,
      };

      this.setState({
        subProductList: Util.getItemFromFLProduct(productList, 'sub_product_code', values),
        billingItemList: [],
        subBillingItemList: [],
      });
    } else if (key === 'sub_product_code') {
      changeObj = {
        [key]: val,
        billing_item_code: '',
        sub_billing_item_code: '',
      };
      const { product_code } = this.props.changedFields;
      const { productList = [] } = this.state;
      const values = {
        product_code,
        sub_product_code: val,
      };

      this.setState(prevState => ({
        ...prevState,
        billingItemList: Util.getItemFromFLProduct(productList, 'billing_item_code', values),
        subBillingItemList: [],
      }));
    } else if (key === 'billing_item_code') {
      changeObj = {
        [key]: val,
        sub_billing_item_code: '',
      };
      const { product_code, sub_product_code } = this.props.changedFields;
      const { productList = [] } = this.state;
      const values = {
        product_code,
        sub_product_code,
        billing_item_code: val,
      };
      this.setState({
        subBillingItemList: Util.getItemFromFLProduct(productList, 'sub_billing_item_code', values),
      });
    } else if (['BeginTime', 'EndTime', 'CreatTime', 'AutoUpdateTime', 'UpdateTime'].indexOf(key) > -1) {
      extObj = { [key]: val };
      changeObj = {
        [searchTimeMap[key][0]]: ext[0],
        [searchTimeMap[key][1]]: ext[1],
      };
    } else {
      changeObj = { [key]: val };
    }
    const obj = {
      ...extObj,
      changedFields: {
        ...changedFields,
        ...changeObj,
      },
    };
    onChangeState(obj);
  }

  resetSearch() {
    this.props.onChangeState({
      changedFields: this.state.initChangedFields,
      resetSearchFlag: true,
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
    const { loading, searchType, subProductList, billingItemList, subBillingItemList, advancedSearchText, productList, typeMap, preferentialTypeMap } = this.state;

    return (
      <Spin spinning={loading || this.props.loading}>
        <Card bodyStyle={{ padding: '10px 15px' }}>
          <CommonSearchItem
            typeMap={typeMap}
            subProductList={subProductList}
            billingItemList={billingItemList}
            subBillingItemList={subBillingItemList}
            preferentialTypeMap={preferentialTypeMap}
            onChange={this.onChange.bind(this)}
            productList={productList}
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
      </Spin>
    );
  }
}

