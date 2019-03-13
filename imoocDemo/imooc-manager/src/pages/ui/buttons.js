import React , { Component } from 'react';
import { Card, Button } from 'antd';
import './ui.less';
export default class Buttons extends Component {

  render() {
    return (
      <div>
        <Card title="基础按钮" className="card-warp">
          <Button type="primary">按钮</Button>
          <Button>按钮</Button>
        </Card>
      </div>
    );
  }
}