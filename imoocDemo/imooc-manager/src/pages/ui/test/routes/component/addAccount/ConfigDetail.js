/**
 * 自定义区间部分
 */
/*eslint eqeqeq: 0, no-continue: 0 */
import React, { Component } from 'react';
import { Row, Col, Select } from 'antd';
import RegionSelect from './RegionSelect';
import AccountEdit from './AccountEdit';
import FLPSelect from './FLPSelect';

const { Option } = Select;
export default class ConfigDetail extends Component {
  state = {
    isDefineRange: 0, //是否自定义阶梯区间
    cumulativeObj: 3, //阶梯累计对象
  }
  isDefineRange = (value) => {
    this.setState({
      isDefineRange: value
    });
  }
  //选择阶梯累计对象
  changeCumulative = (value) => {
    this.setState({
      cumulativeObj: value
    });
  }
  render() {
    const { isDefineRange, cumulativeObj } = this.state;
    return (
      <div>
        <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>自定义阶梯区间</Col>
          <Col span={8}>
            <Select value={isDefineRange} onChange={this.isDefineRange}>
              <Option value={0}>否</Option>
              <Option value={1}>是</Option>
            </Select>
          </Col>
        </Row>
        {
          isDefineRange ?
          (
            <div>
              <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
                <Col span={3}>—阶梯区间产品</Col>
                <Col span={21}>
                  <FLPSelect />
                </Col>
              </Row>
              <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
                <Col span={3}>—计费模式</Col>
                <Col span={8}>
                  后付费
                </Col>
              </Row>
              <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
                <Col span={3}>—地域</Col>
                <Col span={14}>
                  <RegionSelect />
                </Col>
              </Row>
              {/* <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
                <Col span={3}>—优惠条件</Col>
                <Col span={14}>
                  优惠条件选择控件
                </Col>
              </Row> */}
            </div>
          ) :
          null
        }
        <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>
            <span style={{ fontWeight: 'bold' }}>阶梯累计对象</span>
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={14}>
            <Select value={cumulativeObj}  style={{ width: 180 }} onChange={this.changeCumulative}>
              <Option value={3}>用量求和</Option>
              <Option value={2}>刊列价求和</Option>
              <Option value={1}>用量*时长求和</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20, marginLeft: 10 }}>
          <Col span={3}>
            <span style={{ fontWeight: 'bold' }}>优惠配置</span>
            <span style={{ color: 'red' }}>*</span>
          </Col>
          <Col span={18}>
            <AccountEdit cumulativeObj={cumulativeObj} />
          </Col>
        </Row>
      </div>
    );
  }
}
