import React , { Component } from 'react';
import { Card, Button, Modal } from 'antd';
import './ui.less';
export default class Modals extends Component {
  state={
    openModal: false,
    footModal: false,
    topModal: false,
    verticalModal: false,
  }

  handleModal = (key) => {
    this.setState({
      [key] : true,
    });
  }

  handleCancel = (key) => {
    this.setState({
      [key] : false,
    });
  }

  handleOk = (key) => {
    this.setState({
      [key] : false,
    });
  }

  showModal = (key) => {
    Modal[key]({
      title: '确认标题',
      content: '展示的内容',
    });
  }
  render() {
    return (
      <div>
        <Card title="基础模态框" className="card-warp">
          <Button type="primary" onClick={() => this.handleModal('openModal')}>open</Button>
          <Button type="primary" onClick={() => this.handleModal('footModal')}>自定义页脚</Button>
          <Button type="primary" onClick={() => this.handleModal('topModal')}>顶部20px</Button>
          <Button type="primary" onClick={() => this.handleModal('verticalModal')}>水平垂直居中</Button>
        </Card>
        <Card title="信息确认框" className="card-warp">
          <Button type="primary" onClick={() => this.showModal('confirm')}>Confirm</Button>
          <Button type="primary" onClick={() => this.showModal('info')}>Info</Button>
          <Button type="primary" onClick={() => this.showModal('success')}>Success</Button>
          <Button type="primary" onClick={() => this.showModal('error')}>Error</Button>
          <Button type="primary" onClick={() => this.showModal('warning')}>Warning</Button>
        </Card>
        <Modal
          title="study modal"
          visible={this.state.openModal}
          onOk={() => this.handleOk('openModal')}
          onCancel={() => this.handleCancel('openModal')}
        > 
          <p>hello React, come on !!!</p>
        </Modal>
        <Modal
          title="自定义页脚"
          visible={this.state.footModal}
          okText="好的"
          cancelText="算了"
          onOk={() => this.handleOk('footModal')}
          onCancel={() => this.handleCancel('footModal')}
        >
          <p>hello React, come on !!!</p>
        </Modal>
        <Modal
          title="顶部距离20px"
          style={{ top: 20 }}
          visible={this.state.topModal}
          onOk={() => this.handleOk('topModal')}
          onCancel={() => this.handleCancel('topModal')}
        >
          <p>hello React, come on !!!</p>
        </Modal>
        <Modal
          title="水平垂直居中"
          centered
          visible={this.state.verticalModal}
          onOk={() => this.handleOk('verticalModal')}
          onCancel={() => this.handleCancel('verticalModal')}
        >
          <p>hello React, come on !!!</p>
        </Modal>
      </div>
    );
  }
}