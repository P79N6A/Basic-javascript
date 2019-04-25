/**
 * 地域选择器
 */
import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;
export default class DiscountRange extends Component {
  render() {
    return (
      <div>
        <Select defaultValue="include" style={{ width: 80, marginRight: 20 }}>
          <Option value="include">包含</Option>
          <Option value="exclude">排除</Option>
        </Select>
        <Select defaultValue="" style={{ width: 180 }}>
          <Option value="">全部地域</Option>
          <Option value="1">广州</Option>
          <Option value="2">深圳</Option>
        </Select>
      </div>
    );
  }
}
