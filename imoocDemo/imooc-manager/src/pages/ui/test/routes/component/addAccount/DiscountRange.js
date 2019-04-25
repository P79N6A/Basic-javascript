import React, { Component } from 'react';
import { Row, Col } from 'antd';
import styles from './addAccount.less';
import RegionSelect from './RegionSelect';
import FLPSelect from './FLPSelect';

export default class DiscountRange extends Component {
  render() {
    return (
      <div className={styles.discountRange}>
        <h4>Step1: 选择优惠范围</h4>
        <Row gutter={2} style={{ marginLeft: 10 }}>
          <Col span={3}>
            <span style={{ fontWeight: 'bold' }}>优惠产品</span>
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={21} style={{ minHeight: 100 }}>
            <FLPSelect />
          </Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>
            <span style={{ fontWeight: 'bold' }}>计费模式</span>
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={20}>后付费</Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>
            <span style={{ fontWeight: 'bold' }}>地域</span>
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={10}>
            <RegionSelect />
          </Col>
        </Row>
        {/* <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>
            <span style={{ fontWeight: 'bold' }}>优惠条件</span>
          </Col>
          <Col span={10}>
            嘻嘻嘻
          </Col>
        </Row> */}
      </div>
    );
  }
}
