import React, { Component } from 'react';
import { Row, Col, Radio, Input } from 'antd';
import styles from './addAccount.less';
import ConfigDetail from './ConfigDetail';

const RadioGroup = Radio.Group;
export default class ConfigureDiscount extends Component {
  state = {
    priceModal: 1, //价格模型
  }
  choosePriceModal = (e) => {
    console.log('choosePriceModal', e.target.value);
    this.setState({
      priceModal: e.target.value
    });
  }

  render() {
    const { priceModal } = this.state;
    return (
      <div className={styles.discountRange}>
        <h4>Step2: 配置优惠</h4>
        <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>价格模型</Col>
          <Col span={20}>
            <RadioGroup value={priceModal} onChange={this.choosePriceModal}>
              <Radio value={1}>线性价</Radio>
              <Radio value={2}>到达阶梯</Radio>
            </RadioGroup>
          </Col>
        </Row>
        {
          priceModal === 2 ? <ConfigDetail /> : (
            <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
              <Col span={3}>
                <span style={{ fontWeight: 'bold' }}>优惠配置</span>
                <span style={{ color: 'red' }}>*</span>
              </Col>
              <Col span={6}>
                <Input style={{ width: '90%' }} />%
              </Col>
              <Col style={{ paddingTop: 4 }}>（请输入0~100%的数，最多4位小数）</Col>
            </Row>
          )
        }
      </div>
    );
  }
}
