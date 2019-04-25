import React, { Component } from 'react';
import { Row, Col, Table, Button, Card } from 'antd';

export default class SaveAccount extends Component {
  render() {
    const columns = [
      {
        title: '优惠UIN',
        dataIndex: '',
      },
      {
        title: '优先级',
        dataIndex: '',
      },
      {
        title: '产品名称',
        dataIndex: '',
      },
      {
        title: '排除产品',
        dataIndex: '',
      },
      {
        title: '计费模式',
        dataIndex: '',
      },
      {
        title: '优惠条件',
        dataIndex: '',
      },
      {
        title: '优惠类型',
        dataIndex: '',
      },
      {
        title: '价格模型',
        dataIndex: '',
      },
      {
        title: '折扣',
        dataIndex: '',
      },
      {
        title: '阶梯累计对象',
        dataIndex: '',
      },
      {
        title: '阶梯计算逻辑',
        dataIndex: '',
      },
    ];
    return (
      <Card>
        <Row gutter={2}>
          <Col span={2}>优惠ID：</Col>
          <Col span={10} style={{ color: '#40a8ff' }}>100000032132131</Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20 }}>
          <Col span={2}>客户名称：</Col>
          <Col span={10}>xxxxxxxxx</Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20 }}>
          <Col span={2}>客户UIN：</Col>
          <Col span={10}>10808，1031321</Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20 }}>
          <Col span={2}>有效期：</Col>
          <Col span={10}>2018年1月到2019年2月</Col>
        </Row>
        <Row gutter={2} style={{ marginTop: 20 }}>
          <Table
            columns={columns}
            dataSource={[]}
          />
        </Row>
        <Row gutter={2} style={{ marginTop: 20 }}>
          <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button type="primary" style={{ marginRight: 30 }}>立即发布</Button>
            <Button>返回查询页</Button>
          </Col>
        </Row>
      </Card>
    );
  }
}
