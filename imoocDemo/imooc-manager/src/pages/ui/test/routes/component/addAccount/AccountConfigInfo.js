import React, { Component } from 'react';
import { Row, Col, Select, Radio } from 'antd';
import styles from './addAccount.less';
import DiscountRange from './DiscountRange';
import ConfigureDiscount from './ConfigureDiscount';
import { DiscountRangeContext } from './context';

const { Option } = Select;

export default class AccountConfigInfo extends Component {
  render() {
    console.log(this.context);
    return (
      <div style={{ margin: -24 }}>
        <h3 className={styles.discountInfo}>优惠信息填写</h3>
        <Row gutter={2}>
          <Col span={3} className={styles.marginLeft20}>UIN</Col>
          <Col span={10}>
            <Select defaultValue="lucy" style={{ width: '100%' }} mode="multiple">
              <Option value="jack">1000892031122</Option>
              <Option value="lucy">90321002223</Option>
            </Select>
          </Col>
          <Col span={3} className={styles.marginLeft20}>支持选择多个UIN</Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 10 }}>
          <Col span={3} className={styles.requiredMargin}>优惠类型</Col>
          <Col span={4} className={styles.lineHeight30}>
            <Radio value={1} defaultChecked>折扣</Radio>
          </Col>
        </Row>
        {/* 选择优惠范围 */}
        <Row gutter={2} style={{ marginTop: 30 }}>
          <DiscountRange />
        </Row>
        {/* 配置优惠 */}
        <Row gutter={2} style={{ marginTop: -20 }}>
          <ConfigureDiscount />
        </Row>
      </div>
    );
  }
}
AccountConfigInfo.contextType = DiscountRangeContext;
