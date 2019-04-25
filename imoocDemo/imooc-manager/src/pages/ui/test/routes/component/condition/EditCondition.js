
/**
 * @description 编辑优惠条件
 * @author shirleyyu
 */
import React from 'react';
import { Modal, Select, Input, message } from 'antd';
const { Option } = Select;

export default class EditCondition extends React.Component {
  state = {};

  onChange(key, val) {
    let obj = {};
    if (key === 'oldF') {
      obj = { [key]: val };
    } else {
      obj = { [key]: val.target.value };
    }
    this.setState(obj);
  }

  cancel() {
    this.setState({ oldF: undefined, FKeyName: '' });
    this.props.onChange('editCondition', false);
  }

  validate() {
    const { oldF, FKeyName = '' } = this.state;
    if (!oldF) {
      message.error('请选择修改前的优惠条件名称！');
      return false;
    }
    if (!FKeyName.trim()) {
      message.error('请输入修改后的优惠条件名称！');
      return false;
    }
    return true;
  }

  save() {
    const { oldF = {}, FKeyName, confirmLoading } = this.state;
    if (confirmLoading || !this.validate()) {
      return;
    }
    const { key, label } = oldF;
    const params = {
      oldFKey: key,
      oldFKeyName: label,
      FKeyName: FKeyName.trim(),
      FCreator: this.props.FCreator,
    };
    this.setState({
      confirmLoading: true,
    }, () => {
      this.props.Api.updateConditionTempKey(params)
        .then((res) => {
          if (res.code === 0) {
            message.success('编辑优惠条件成功', 10, () => {
              window.location.reload();
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ confirmLoading: false });
          message.error(`编辑优惠条件失败！${e.message || e}`);
        });
    });
  }

  render() {
    const { editCondition, conditionTempKeyList = [] } = this.props;
    const { oldF, FKeyName, confirmLoading } = this.state;
    const FKey = oldF ? oldF.key : '';
    return (
      <Modal
        width={550}
        title="编辑优惠条件"
        visible={editCondition}
        confirmLoading={confirmLoading}
        maskClosable={false}
        onOk={this.save.bind(this)}
        onCancel={this.cancel.bind(this)}
      >
        <div>
          <span style={{ color: '#fb0e08', paddingRight: '10px' }}>修改前</span>
          <span>
            优惠条件名称<span style={{ color: 'red' }}>*</span>
            <Select
              labelInValue
              showSearch
              value={oldF}
              placeholder="请选择"
              style={{ width: '110px', margin: '0 20px 10px 5px' }}
              onChange={this.onChange.bind(this, 'oldF')}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {
                conditionTempKeyList.map(con => <Option value={con.FKey} key={con.FKey}>{con.FKeyName}</Option>)
              }
            </Select>
          </span>
          <span>优惠条件Key：{FKey}</span>
        </div>
        <div>
          <span style={{ color: '#fb0e08', paddingRight: '10px' }}>修改后</span>
          <span>
            优惠条件名称<span style={{ color: 'red' }}>*</span>
            <Input
              style={{ width: '110px', margin: '0 20px 10px 5px' }}
              type="text"
              value={FKeyName}
              onChange={this.onChange.bind(this, 'FKeyName')}
            />
          </span>
          <span>优惠条件Key：{FKey}</span>
        </div>
      </Modal>
    );
  }
}
