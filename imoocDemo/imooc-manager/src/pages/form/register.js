import React, { Component } from 'react';
import { Card, Input, Radio, Switch, Form, InputNumber, Select, DatePicker, TimePicker, Upload, Icon, Checkbox, Button } from 'antd';
import moment  from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: 24,
    md: 4
  },
  wrapperCol: {
    sm: 24,
    md: 12
  }
};
const wrapperColLayout = {
  wrapperCol: {
    md: {
      span: 12,
      offset: 4,
    }
  }
}

class Register extends Component {
  state = {
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imgSrc: imageUrl,
        loading: false,
      }));
    }
  }
  handleSubmit = () => {
    const userInfo = this.props.form.getFieldsValue();
    console.log(userInfo);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const optionsMap = ['风流才子', '才子配佳人', '咸鱼一条', '鱼跃龙门'];
    const hobbyMap = ['篮球', '足球', '羽毛球', '兵乒球', '网球', '排球', '橄榄球'];
    return (
      <Card title="注册表单">
        <Form>
          <FormItem label="用户名" {...formItemLayout}>
            {
              getFieldDecorator('userName', {
                rules: [{
                  required: true, message: '用户名不能为空',
                }]
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem label="密码" {...formItemLayout}>
            {
              getFieldDecorator('userPwd', {
                rules: [{
                  required: true, message: '密码不能为空',
                }]
              })(
                <Input type="password" />
              )
            }
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {
              getFieldDecorator('gender', {
                initialValue: 1,
              })(
                <RadioGroup>
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem label="年龄" {...formItemLayout}>
            {
              getFieldDecorator('age', {
                initialValue: 18
              })(
                <InputNumber />
              )
            }
          </FormItem>
          <FormItem label="当前状态" {...formItemLayout}>
            {
              getFieldDecorator('status', {
                initialValue: optionsMap[0]
              })(
                <Select>
                  {
                    optionsMap.map((item, index) => {
                      return (
                        <Option value={item} key={index}>{item}</Option>
                      );
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label="爱好" {...formItemLayout}>
            {
              getFieldDecorator('hobby', {
                initialValue: [hobbyMap[0], hobbyMap[1]]
              })(
                <Select
                  mode="multiple"
                >
                  {
                    hobbyMap.map((item, index) => {
                      return (
                        <Option value={item} key={index}>{item}</Option>
                      );
                    })
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label="是否已婚" {...formItemLayout}>
            {
              getFieldDecorator('isMarried', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Switch />
              )
            }
          </FormItem>
          <FormItem label="生日" {...formItemLayout}>
            {
              getFieldDecorator('birthDay', {
                initialValue: moment('2018-01-01'),
              })(
                <DatePicker format="YYYY-MM-DD" />
              )
            }
          </FormItem>
          <FormItem label="联系地址" {...formItemLayout}>
            {
              getFieldDecorator('address')(
                <TextArea autosize={{ minRows:2, maxRows: 6 }} />
              )
            }
          </FormItem>
          <FormItem label="早起时间" {...formItemLayout}>
            {
              getFieldDecorator('time')(
                <TimePicker />
              )
            }
          </FormItem>
          <FormItem label="头像" {...formItemLayout}>
            {
              getFieldDecorator('picture')(
                <Upload
                  showUploadList={false}
                  listType="picture-card"
                  action="//jsonplaceholder.typicode.com/posts/"
                  onChange={this.handleChange}
                >
                  {
                    this.state.imgSrc ? <img src={this.state.imgSrc} /> : <Icon type="plus" />
                  }
                </Upload>
              )
            }
          </FormItem>
          <FormItem {...wrapperColLayout}>
            {
              getFieldDecorator('isReader', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>
                  我已阅读过<a href="#">慕课协议</a>
                </Checkbox>
              )
            }
          </FormItem>
          <FormItem {...wrapperColLayout}>
            <Button type='primary' onClick={this.handleSubmit}>
              注册
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(Register);