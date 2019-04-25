/**
 * @description: 折扣管理的筛选条件
 * @author: shirleyyu
 * @date: 2018-02-24
 * @interface: 产品名称和子产品名称：“获取商品列表”
 */
import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import SearchItem from './SearchItem';
import styles from '../../discount.less';
import { statusMap } from './config';

const { Option } = Select;

export default class CommonSearchItem extends React.Component {
  onChange(key, val) {
    this.props.onChange(key, val);
  }

  render() {
    const { changedFields = {}, productList = [], subProductList, billingItemList, subBillingItemList, typeMap = {}, preferentialTypeMap = {} } = this.props;
    const {
      Status = '',
      preferentialType = '',
      Type,
      product_code,
      sub_product_code,
      billing_item_code,
      sub_billing_item_code,
    } = changedFields;

    return (
      <React.Fragment>
        <div>
          <span style={{ marginRight: '10px' }}>优惠对象</span>
          <Select
            showSearch
            size="small"
            value={Type}
            className={styles.wid150}
            optionFilterProp="children"
            style={{ marginBottom: '10px' }}
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'Type')}
          >
            {
              Object.keys(typeMap).map(k => <Option value={k} key={k} title={typeMap[k]}>{typeMap[k]}</Option>)
            }
          </Select>
          <span style={{ margin: '0 10px 0 20px' }}>优惠类型</span>
          <Select
            size="small"
            className={styles.wid100}
            showSearch
            value={preferentialType}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'preferentialType')}
          >
            <Option value="">全部</Option>
            {
              Object.keys(preferentialTypeMap).map(k => <Option value={k} key={k} title={preferentialTypeMap[k]}>{preferentialTypeMap[k]}</Option>)
            }
          </Select>
          <span style={{ margin: '0 10px 0 20px' }}>优惠状态</span>
          <Select
            size="small"
            className={styles.wid100}
            showSearch
            value={Status.toString()}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'Status')}
          >
            <Option value="">全部</Option>
            {
              Object.keys(statusMap || {}).map(s => <Option value={s} key={s}>{statusMap[s]}</Option>)
            }
          </Select>
          <SearchItem
            changedFields={changedFields}
            onChange={this.onChange.bind(this)}
          />
        </div>
        <div className={styles.mrbottom10} style={{ whiteSpace: 'nowrap' }}>
          <span style={{ marginRight: '10px' }}>优惠产品</span>
          <Select
            size="small"
            className={styles.pfl_sel}
            showSearch
            value={product_code}
            placeholder="产品名称"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'product_code')}
          >
            <Option value="">全部</Option>
            {_.map(productList, (item, index) => (
              <Option
                key={`${index}_${item.product.product_code}`}
                value={item.product.product_code}
                title={item.product.chn_name}
              >
                {item.product.chn_name}
              </Option>
            ))}
          </Select>
          <Select
            size="small"
            className={styles.pfl_sel}
            showSearch
            value={sub_product_code}
            placeholder="子产品名称"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'sub_product_code')}
          >
            <Option value="">全部</Option>
            {_.map(subProductList, (item, index) => (
              <Option
                key={`${index}_${item.sub_product_code}`}
                value={item.sub_product_code}
                title={item.chn_name}
              >
                {item.chn_name}
              </Option>
            ))}
          </Select>
          <Select
            size="small"
            className={styles.pfl_sel}
            showSearch
            value={billing_item_code}
            placeholder="计费项名称"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'billing_item_code')}
          >
            <Option value="">全部</Option>
            {_.map(billingItemList, (item, index) => (
              <Option
                key={`${index}_${item.billing_item_code}`}
                value={item.billing_item_code}
                title={item.chn_name}
              >
                {item.chn_name}
              </Option>
            ))}
          </Select>
          <Select
            size="small"
            className={styles.pfl_sel}
            showSearch
            value={sub_billing_item_code}
            placeholder="计费细项名称"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={this.onChange.bind(this, 'sub_billing_item_code')}
          >
            <Option value="">全部</Option>
            {_.map(subBillingItemList, (item, index) => (
              <Option
                key={`${index}_${item.sub_billing_item_code}`}
                value={item.sub_billing_item_code}
                title={item.chn_name}
              >
                {item.chn_name}
              </Option>
            ))}
          </Select>
        </div>
      </React.Fragment>
    );
  }
}

