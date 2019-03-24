import React , { Component } from 'react';
import { Card, Form, Button, Icon, Input, Checkbox } from 'antd';

const FormItem = Form.Item;

class FormDemo extends Component {
  state = {
    status: true
  }
  handleLogin = () => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log(values);
      }
    });
  }

  handleChange = (e) => {
    this.setState({
      status: e.target.checked
    });
  }
  horziaLogin = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Card title="行内表单" style={{ marginBottom: 10 }}>
          <Form layout="inline">
            <FormItem>
              {
                getFieldDecorator('username', {
                  rules: [{
                    required: true, message: '请输入你的用户名'
                  }]
                })(
                  <Input prefix={<Icon type="user" />} placeholder="请输入你的用户名" />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('userpwd', {
                  rules: [{
                    required: true, message: '请输入你的密码'
                  }]
                })(
                  <Input type="password" prefix={<Icon type="lock" />} placeholder="请输入你的密码" />
                )
              }
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                onClick={this.handleLogin}
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Card title="水平表单">
          <Form style={{ width: 350 }}>
            <FormItem>
              {
                getFieldDecorator('userName', {
                  rules: [{
                    required: true, message: '用户名不能为空'
                  }]
                })(
                  <Input prefix={<Icon type="user" />} placeholder="请输入用户名" />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('userPwd', {
                  rules: [
                    {
                      required: true, message: '密码不能为空'
                    }
                  ]
                })(
                  <Input prefix={<Icon type="lock" />} placeholder="请输入密码" />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(
                  <Checkbox>
                    记住密码
                  </Checkbox>
                )
              }
              <a href="#" style={{ float: 'right' }}>
                忘记密码
              </a>
            </FormItem>
            <FormItem>
              <Button type='primary' style={{ width: 350 }} onClick={this.horziaLogin}>
                登录
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(FormDemo);