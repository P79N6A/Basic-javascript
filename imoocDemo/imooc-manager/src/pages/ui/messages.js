import React , { Component } from 'react';
import { Card, Button, message } from 'antd';

export default class Messages extends Component {
  handleMessage = (type) => {
    message[type]('恭喜，你加班了！！');
  }
  render() {
    return (
      <div>
        <Card title="消息通知框" className="card-warp">
          <Button type="primary" onClick={() => this.handleMessage('success')}>Success</Button>
          <Button type="primary" onClick={() => this.handleMessage('info')}>Info</Button>
          <Button type="primary" onClick={() => this.handleMessage('warning')}>Warning</Button>
          <Button type="primary" onClick={() => this.handleMessage('warn')}>Warn</Button>
          <Button type="primary" onClick={() => this.handleMessage('loading')}>Loading</Button>
        </Card>
      </div>
    );
  }
} 
