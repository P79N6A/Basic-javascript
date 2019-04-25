import React , { Component } from 'react';
import { Card, Button, Select } from 'antd';
import './ui.less';
import Axios from 'axios';
import '../../mock/file';

const { Option } = Select;
export default class Buttons extends Component {
  state = {
    value: '',
    discountValue: 0,
    FLPSelect: [{action: 'include', productList: '', subProductList: '', billingItem: '', subBillingItem: ''}],
    productCodeList: [],
    subProductCodeList: [],
    billingItemList: [],
    subBillingItemList: [],
  }

  componentDidMount() {
    Axios.get('http://www.mymock.com/getFLPSelect').then(res => {
      console.log(res.data.data.infos);      
      if(res.data.code === 0) {
        this.setState({
          productCodeList: res.data.data.infos,
        });
      }
    });
  }
  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
  }
  changeSelectData = (value) => {

  }
  render() {
    const {
      productCodeList,
      subProductCodeList,
      billingItemList,
      subBillingItemList,
      FLPSelect
    } = this.state;
    return (
      <div>
        <Card title="基本按钮" className="card-warp">
          <Button type="primary">按钮</Button>
          <Button>按钮</Button>
          <Button type="dashed">按钮</Button>
          <Button type="danger">按钮</Button>
        </Card>
        <Card title="图形按钮" className="card-warp">
          <Button shape="circle" icon="search" />
          <Button icon="search" />
          <Button type="dashed" loading shape="circle" />
        </Card>
        <Card title="选择器" className="card-warp">
        {
          FLPSelect.map((pItem, pIndex) => {
            return (
              <div key={pIndex}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={this.changeSelectData}
                  value={pItem.productList}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">全部</Option>
                  {
                    productCodeList.map((item, index) => {
                      return (
                        <Option value={item.product.product_code} key={`${index}_${item.product.product_code}`}>{item.product.chn_name}</Option>
                      );
                    })
                  }
                </Select>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={this.changeSelectData}
                  value=""
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">全部</Option>
                  {
                    subProductCodeList.map((item, index) => {
                      return (
                        <Option value={item.product_code} key={`${index}_${item.product_code}`}>{item.chn_name}</Option>
                      );
                    })
                  }
                </Select>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={this.changeSelectData}
                  value=""
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">全部</Option>
                  {
                    billingItemList.map((item, index) => {
                      return (
                        <Option value={item.product_code} key={`${index}_${item.product_code}`}>{item.chn_name}</Option>
                      );
                    })
                  }
                </Select>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  optionFilterProp="children"
                  onChange={this.changeSelectData}
                  value=""
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  <Option value="">全部</Option>
                  {
                    subBillingItemList.map((item, index) => {
                      return (
                        <Option value={item.product_code} key={`${index}_${item.product_code}`}>{item.chn_name}</Option>
                      );
                    })
                  }
                </Select>
              </div>
            );
          })
        }
          <Button>添加</Button>
        </Card>
      </div>
    );
  }
}