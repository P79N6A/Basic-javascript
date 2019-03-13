import React , { Component } from 'react';
import { Card, Spin, Alert, Icon } from 'antd';
import './ui.less';

export default class Loadings extends Component {
  render() {
    return (
      <div>
        <Card title="loading演示" className="card-wrap">
          <Spin />
          <Spin
            indicator={<Icon type="loading" />}
          />
        </Card>
        <Card title="嵌套loading" className="card-wrap">
          <Spin
            indicator={<Icon type="loading" />}
          >
            <Alert
              message="React stduy"
              description="this is a new study"
              type="info"
            />
          </Spin>
          <Spin>
            <Alert
              message="React stduy"
              description="this is a new study"
              type="info"
            />
          </Spin>
        </Card>
      </div>
    );
  }
}