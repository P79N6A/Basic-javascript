/**
 * 产品四层定义选择器
 */
/*eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import { Select, Button, Icon, message } from 'antd';
import _ from 'lodash';
// import Util from '../../../libraries/util';
// import Api from '../../../services/index';
import { getProductList, getSubProductList, getBillingItemList, getSubBillingItemList } from '../../../services/account';
// import { searchTimeMap } from './config';

const { Option } = Select;
export default class FLPSelect extends Component {
  state = {
    FLPList: [{ action: 'include', productCode: '', subProductCode: '', billingItem: '', subBillingItemCode: '' }],
    productCodeList: [{
      "chn_name": "独享型云主机",
      "product_code": "p_indepsubmachine",
    }, ],
    subProductCodeList: [ {
      "chn_name": "独享型云主机",
      "product_code": "p_indepsubmachine",
      "sub_product_code": "sp_indepsubmachine",
    }],
    billingItemList: [{
      "billing_item_code": "v_indepsubmachine_bandwidth",
      "chn_name": "带宽",
      "product_code": "p_indepsubmachine",
    },
    {
      "billing_item_code": "v_indepsubmachine_rootdisk",
      "chn_name": "系统盘",
      "product_code": "p_indepsubmachine",
    },
    {
      "billing_item_code": "v_indepsubmachine_datadisk",
      "chn_name": "数据盘",
      "product_code": "p_indepsubmachine",
    }],
    subBillingItemCodeList: [{
      "billing_item_code": "v_indepsubmachine_bandwidth",
      "chn_name": "独享型云主机-带宽-按流量计费",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_bandwidth_traffic",
    },
    {
      "billing_item_code": "v_indepsubmachine_rootdisk",
      "chn_name": "独享型云主机-高性能云系统盘",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_rootdisk_cbspremium",
    },
    {
      "billing_item_code": "v_indepsubmachine_rootdisk",
      "chn_name": "独享型云主机-SSD云系统盘",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_rootdisk_cbsssd",
    },
    {
      "billing_item_code": "v_indepsubmachine_rootdisk",
      "chn_name": "独享型云主机-普通系统盘",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_rootdisk_cbs",
    },
    {
      "billing_item_code": "v_indepsubmachine_datadisk",
      "chn_name": "独享型云主机-高性能云数据盘",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_datadisk_cbspremium",
    },
    {
      "billing_item_code": "v_indepsubmachine_datadisk",
      "chn_name": "独享型云主机-SSD云数据盘",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_datadisk_cbsssd",
    },
    {
      "billing_item_code": "v_indepsubmachine_datadisk",
      "chn_name": "独享型云主机-普通云数据盘",
      "product_code": "p_indepsubmachine",
      "sub_billing_item_code": "sv_indepsubmachine_datadisk_cbs",
    }],
  }
  componentDidMount() {
    // this.getProductData();
  }
  //删除产品
  handleDelete = (index) => {
    const { FLPList } = this.state;
    const newList = [...FLPList];
    newList.splice(index, 1);
    this.setState({
      FLPList: newList
    });
  }
  //分别获取四层产品数据 { product_code: chn_name }
  getProductData = async () => {
    const res = await getProductList();
    if (res.code === 0) {
      this.setState({
        productCodeList: res.data.infos
      });
    } else {
      message.error(res.message);
    }
  }
  getSubProductData = async (opts) => {
    const res = await getSubProductList(opts);
    if (res.code === 0) {
      this.setState({
        subProductCodeList: res.data.infos
      });
    } else {
      message.error(res.message);
    }
  }
  getBillingItemList = async (opts) => {
    const res = await getBillingItemList(opts);
    if (res.code === 0) {
      this.setState({
        billingItemList: res.data.infos
      });
    } else {
      message.error(res.message);
    }
  }
  getSubBillingItemList = async (opts) => {
    const res = await getSubBillingItemList(opts);
    if (res.code === 0) {
      this.setState({
        subBillingItemCodeList: res.data.infos
      });
    } else {
      message.error(res.message);
    }
  }
  //选择四层产品
  handleChangeAction = (index, key, value) => {
    const list = [...this.state.FLPList];
    list[index][key] = value;
    if (key === 'productCode' && value) {
      list[index].subProductCode = '';
      list[index].billingItem = '';
      list[index].subBillingItemCode = '';
      this.setState({
        FLPList: list,
        subBillingItemCodeList: [],
      }, () => {
        // this.getSubProductData({ product_code: value });
        // this.getBillingItemList({ product_code: value });
      });
    } else if (key === 'productCode' && !value) {
      list[index].subProductCode = '';
      list[index].billingItem = '';
      list[index].subBillingItemCode = '';
      this.setState({
        FLPList: list,
        subProductCodeList: [],
        billingItemList: [],
        subBillingItemCodeList: [],
      });
    } else if (key === 'billingItem' && value) {
      list[index].subBillingItemCode = '';
      this.setState({
        FLPList: list,
      }, () => {
        // this.getSubBillingItemList({ billing_item_code: value });
      });
    } else if (key === 'billingItem' && !value) {
      list[index].subBillingItemCode = '';
      this.setState({
        FLPList: list,
        subBillingItemCodeList: [],
      });
    } else {
      this.setState({
        FLPList: list,
      });
    }
  }
  //增加产品
  handleAddProduct = () => {
    const { FLPList } = this.state;
    console.log('FLPList', FLPList);
    const item = { action: 'include', productCode: '', subProductCode: '', billingItem: '', subBillingItemCode: '' };
    const newList = JSON.parse(JSON.stringify(FLPList));
    newList.push(item);
    this.setState({
      FLPList: newList,
    });
  }
  render() {
    const { FLPList, productCodeList, subProductCodeList, billingItemList, subBillingItemCodeList } = this.state;
    return (
      <div>
        {
          FLPList.map((item, index) => {
            return (
              <div key={index} style={{ marginTop: 10 }}>
                <Select value={item.action} style={{ width: 80, marginRight: 4 }} onChange={this.handleChangeAction.bind(this, index, 'action')}>
                  <Option value="include">包含</Option>
                  <Option value="exclude">排除</Option>
                </Select>
                <Select
                  value={item.productCode}
                  style={{ width: 170, marginRight: 6 }}
                  onChange={this.handleChangeAction.bind(this, index, 'productCode')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    return option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0;
                  }
                  }
                >
                  <Option value="">全产品</Option>
                  {
                    _.map(productCodeList, (subItem, subIndex) => {
                      return (
                        <Option
                          key={`${subIndex}_${subItem.product_code}`}
                          value={subItem.product_code}
                          title={subItem.chn_name}
                        >
                          {subItem.chn_name}
                        </Option>
                      );
                    })
                  }
                </Select>
                <Select
                  value={item.subProductCode}
                  style={{ width: 170, marginRight: 6 }}
                  onChange={this.handleChangeAction.bind(this, index, 'subProductCode')}
                  optionFilterProp="children"
                >
                  <Option value="">全部</Option>
                  {
                    _.map(subProductCodeList, (subItem, subIndex) => {
                      return (
                        <Option
                          key={`${subIndex}_${subItem.sub_product_code}`}
                          value={subItem.sub_product_code}
                          title={subItem.chn_name}
                        >
                          {subItem.chn_name}
                        </Option>
                      );
                    })
                  }
                </Select>
                <Select value={item.billingItem} style={{ width: 170, marginRight: 6 }} onChange={this.handleChangeAction.bind(this, index, 'billingItem')}>
                  <Option value="">全部</Option>
                  {
                    _.map(billingItemList, (subItem, subIndex) => {
                      return (
                        <Option
                          key={`${subIndex}_${subItem.billing_item_code}`}
                          value={subItem.billing_item_code}
                          title={subItem.chn_name}
                        >
                          {subItem.chn_name}
                        </Option>
                      );
                    })
                  }
                </Select>
                <Select value={item.subBillingItemCode} style={{ width: 190 }} onChange={this.handleChangeAction.bind(this, index, 'subBillingItemCode')}>
                  <Option value="">全部</Option>
                  {
                    _.map(subBillingItemCodeList, (subItem, subIndex) => {
                      return (
                        <Option
                          key={`${subIndex}_${subItem.sub_billing_item_code}`}
                          value={subItem.sub_billing_item_code}
                          title={subItem.chn_name}
                        >
                          {subItem.chn_name}
                        </Option>
                      );
                    })
                  }
                </Select>
                {
                  FLPList.length > 1 ? <Icon type="close" onClick={() => this.handleDelete(index)} style={{ cursor: 'pointer' }} /> : null
                }
              </div>
            );
          })
        }
        <Button style={{ marginTop: 10 }} onClick={this.handleAddProduct}>
          <Icon type="plus" />增加产品
        </Button>
      </div>
    );
  }
}
