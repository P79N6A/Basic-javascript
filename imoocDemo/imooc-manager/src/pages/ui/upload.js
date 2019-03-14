import React , { Component } from 'react';
import { Upload, Card, message, Button, Icon } from 'antd';
import './ui.less';


export default class UploadDemo extends Component {
  render() {
    return (
      <div>
        <Card title="基本上传按钮" className="card-wrap">
          <Upload>
            <Button>
              <Icon type="upload" />点击上传
            </Button>
          </Upload>
        </Card>
      </div>
    );
  }
}