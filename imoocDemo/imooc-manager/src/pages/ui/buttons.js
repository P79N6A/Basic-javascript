import React , { Component } from 'react';
import { Card, Button } from 'antd';
import './ui.less';
export default class Buttons extends Component {

  render() {
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
      </div>
    );
  }
}