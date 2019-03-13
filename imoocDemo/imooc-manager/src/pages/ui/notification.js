import React , { Component } from 'react';
import { Card, Button, notification } from 'antd';

export default class Notifications extends Component {
  handleNotification = (type) => {
    notification[type]({
      message: '今天是好日子',
      description: '今天是潇洒的日子,所以灰常好',
    });
  }
  changeFanxian = (direction, type) => {
    notification.config({
      placement: direction,
    });
    notification[type]({
      message: '今天是好日子',
      description: '今天是潇洒的日子,所以灰常好',
    });
  }
  render() {
    return (
      <div>
        <Card title="消息通知框" className="card-warp">
          <Button type="primary" onClick={() => this.handleNotification('success')}>Success</Button>
          <Button type="primary" onClick={() => this.handleNotification('info')}>Info</Button>
          <Button type="primary" onClick={() => this.handleNotification('warning')}>Warning</Button>
          <Button type="primary" onClick={() => this.handleNotification('error')}>Error</Button>
        </Card>
        <Card title="控制方向消息通知框" className="card-warp">
          <Button type="primary" onClick={() => this.changeFanxian('topLeft', 'success')}>左上</Button>
          <Button type="primary" onClick={() => this.changeFanxian('topRight', 'info')}>右上</Button>
          <Button type="primary" onClick={() => this.changeFanxian('bottomLeft', 'warning')}>左下</Button>
          <Button type="primary" onClick={() => this.changeFanxian('bottomRight', 'error')}>右下</Button>
        </Card>
      </div>
    );
  }
}