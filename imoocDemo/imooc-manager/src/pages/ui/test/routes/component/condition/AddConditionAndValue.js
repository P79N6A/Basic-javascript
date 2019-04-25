/**
 * @description 编辑优惠条件
 * @author shirleyyu
 */

import React from 'react';
import { Modal, Input, Table, Select, message, Button, Popconfirm } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

export default class AddConditionAndValue extends React.Component {
  state = {};

  columns = [
    {
      title: '操作',
      dataIndex: ' operation',
      key: 'operation',
      width: 80,
      render: (text, record, index) => {
        const { length } = this.state.newData;
        return (
          <React.Fragment>
            {
              index === length - 1
                ?
                (<a style={{ marginRight: '10px' }} onClick={this.add.bind(this)}>新增</a>)
                :
                null
            }
            {
              index === 0 && length === 1
                ?
                null
                :
                <a onClick={this.delete.bind(this, index)}>删除</a>
            }
          </React.Fragment>
        );
      },
    },
    {
      title: '条件取值名称',
      dataIndex: ' FValueName',
      key: 'FValueName',
      width: 120,
      render: (text, record, index) => <Input value={record.FValueName} onChange={this.onChangeTable.bind(this, 'FValueName', index)} />,
    },
    {
      title: '条件取值码',
      dataIndex: ' FValue',
      key: 'FValue',
      width: 120,
      render: (text, record, index) => <Input value={record.FValue} onChange={this.onChangeTable.bind(this, 'FValue', index)} />,
    },
    {
      title: '备注',
      dataIndex: ' FRemark',
      key: 'FRemark',
      width: 120,
      render: (text, record, index) => <Input value={record.FRemark} onChange={this.onChangeTable.bind(this, 'FRemark', index)} />,
    },
  ];

  componentWillReceiveProps(nextProps) {
    if (nextProps.addCondition || nextProps.addValue) {
      this.add();
    }
  }

  onChange(key, val) {
    let obj = {};
    if (key === 'oldF') {
      obj = { [key]: val };
    } else if (key === 'batchValues') {
      const { value = '' } = val.target;
      const newData = value.trim() ? this.dataProcess(value) : [];
      obj = { newData, [key]: value };
    } else {
      obj = { [key]: val.target.value };
    }
    this.setState(obj);
  }

  onChangeTable(key, index, val) {
    const { newData } = this.state;
    const obj = newData[index];
    obj[key] = val.target.value;
    newData[index] = obj;
    this.setState({ newData });
  }

  add() {
    const { newData = [] } = this.state;
    newData.push({
      FValueName: '',
      FValue: '',
      FRemark: '',
    });
    this.setState({ newData });
  }

  delete(index) {
    const { newData = [] } = this.state;
    newData.splice(index, 1);
    this.setState({ newData });
  }

  cancel() {
    const { addCondition, addValue, onChange } = this.props;
    const key = addCondition ? 'addCondition' : (addValue ? 'addValue' : 'batchImport');
    this.setState({
      oldF: undefined,
      newData: [],
      FKey: '',
      FKeyName: '',
      FRemark: '',
      batchValues: '',
    });
    onChange(key, false);
  }

  validate() {
    let flag = true;
    const { addCondition, batchImport, addValue } = this.props;
    const { batchValues = '', newData = [] } = this.state;
    const errTips = {
      FKeyName: '请输入优惠条件名称',
      FKey: '请输入优惠条件Key',
    };

    if (addCondition) {
      flag = Object.keys(errTips).every((key) => {
        const value = this.state[key];
        if (!value || !value.trim()) {
          message.error(errTips[key]);
        } else if (this.state.FKey.trim() === '0') {
          message.error('优惠条件Key不能为0');
          return false;
        }
        return !!value;
      });
    } else if (batchImport && (!batchValues.trim() || newData.length === 0)) {
      message.error('请通过模板导入数据');
      flag = false;
    } else if (addValue && (!this.state.oldF || Object.keys(this.state.oldF).length === 0)) {
      message.error('请选择优惠条件名称');
      flag = false;
    }

    const data = [...newData];
    if (flag && data.length > 0) {
      flag = data.every((item, index) => {
        let tag = true;
        const FValue = item.FValue.trim();
        const FValueName = item.FValueName.trim();
        if (FValue && FValueName) {
          if (FValue === '0') {
            message.error('条件取值名称不能为0');
            tag = false;
          } else {
            tag = true;
          }
        } else if (!FValue && !FValueName) {
          data.splice(index, 1);
          tag = true;
        } else {
          const tips = {
            FValue: '条件取值码',
            FValueName: '条件取值名称',
          };
          const msg = `第${index + 1}行，请输入${FValue ? tips.FValueName : tips.FValue}`;
          message.error(msg);
          tag = false;
        }
        if (batchImport) {
          const FKey = item.FKey.trim();
          const FKeyName = item.FKeyName.trim();
          if (!FKey || !FKeyName) {
            message.error(`第${index + 1}行，${FKey ? errTips.FKeyName : errTips.FKey}`);
            tag = false;
          } else if (FKey === '0') {
            message.error('优惠条件Key不能为0');
            tag = false;
          }
        }
        return tag;
      });
      if (data.length === 0) {
        message.error('请至少填写一行条件取值');
        flag = false;
      }
    }
    return flag;
  }

  dealData() {
    const { newData = [], oldF } = this.state;
    let { FKey, FKeyName } = this.state;
    const { FCreator, addValue, batchImport } = this.props;
    if (addValue) {
      FKey = oldF.key;
      FKeyName = oldF.label;
    }
    const params = [];
    newData.forEach((d) => {
      if (batchImport) {
        ({ FKey, FKeyName } = d);
      }
      let FValue = d.FValue.trim();
      const FValueName = d.FValueName.trim();
      let FKeyType = 'string';
      if (FValue && FValueName) {
        if (!isNaN(FValue)) {
          FKeyType = 'integer';
          FValue = Number(FValue);
        }
        const item = {
          FKey: FKey.trim(),
          FKeyName: FKeyName.trim(),
          FKeyType,
          FValue,
          FValueName,
          FCreator,
        };
        if (d.FStatus) {
          item.FStatus = d.FStatus;
        }
        if (d.FRemark) {
          item.FRemark = d.FRemark.trim();
        }
        params.push(item);
      }
    });
    return params;
  }

  /**
   * 批量导入
   * 解析粘贴到输入框中的模板数据
   */
  dataProcess(value) {
    const list = value.trim().split('\x0a'); // NewLine:'\x0a', TAB(制表符):'\t'
    const params = [];
    if (list.length > 1) {
      const titleList = list[0].split('\t');
      if (titleList.length > 0) {
        const key = titleList.map(t => t.match(/^\S*\((\S*)\)$/)[1]);
        list.splice(1, list.length).forEach((l) => {
          const item = l.split('\t');
          const p = {};
          item.forEach((k, i) => {
            p[key[i]] = k;
          });
          params.push(p);
        });
      }
    }
    return params;
  }

  save() {
    if (this.state.confirmLoading || !this.validate()) {
      return;
    }
    const params = this.dealData();
    if (params.length > 200) {
      message.error('一次最多只允许新增200条数据！');
      return;
    }

    this.setState({
      confirmLoading: true,
    }, () => {
      this.props.Api.addConditionTemp(params)
        .then((res) => {
          if (res.code === 0) {
            message.success('新增优惠条件成功', () => {
              window.location.reload();
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ confirmLoading: false });
          message.error(`保存失败！${e.message || e}`);
        });
    });
  }

  modalFooter() {
    return (
      <div>
        <Button onClick={this.cancel.bind(this)}>取消</Button>
        <Popconfirm
          title="确定保存吗？"
          okText="保存"
          cancelText="取消"
          onConfirm={this.save.bind(this)}
        >
          <Button type="primary" loading={this.state.confirmLoading}>保存</Button>
        </Popconfirm>
      </div>
    );
  }

  modalTitle() {
    const { addCondition, addValue } = this.props;
    let title = '';
    if (addCondition) {
      title = '新增优惠条件';
    } else if (addValue) {
      title = '新增优惠条件取值';
    } else {
      title = '批量导入';
    }
    return title;
  }

  render() {
    const {
      addCondition,
      addValue,
      batchImport,
      conditionTempKeyList = [],
    } = this.props;
    const { FKeyName = '', FKey = '', oldF, newData, batchValues = '' } = this.state;

    return (
      <Modal
        width="60%"
        title={this.modalTitle()}
        visible={addCondition || addValue || batchImport}
        maskClosable={false}
        onCancel={this.cancel.bind(this)}
        footer={this.modalFooter()}
      >
        {
          batchImport
            ?
            (
              <React.Fragment>
                <Button
                  type="primary"
                  icon="download"
                  size="small"
                  style={{ marginBottom: '10px' }}
                  href="http://file.tapd.oa.com/pt_jifei/attachments/download/1010140771002960143/wiki"
                >
                  下载模板
                </Button>
                <div style={{ color: 'rgb(234, 130, 11)', marginBottom: '10px' }}>温馨提示：标题一起复制，一次最多只能导入200条。</div>
                <TextArea
                  cols="100"
                  autosize={{ minRows: 5, maxRows: 20 }}
                  style={{ width: '100%' }}
                  value={batchValues}
                  placeholder="请粘贴模板中填入的内容，标题一起复制。一次最多只能导入200条"
                  onChange={this.onChange.bind(this, 'batchValues')}
                />
              </React.Fragment>
            )
            :
            (
              <React.Fragment>
                {
                  addCondition
                    ?
                    (
                      <React.Fragment>
                        <span>
                          优惠条件名称<span style={{ color: 'red' }}>*</span>
                          <Input
                            style={{ width: '110px', margin: '0 20px 10px 5px' }}
                            type="text"
                            value={FKeyName}
                            onChange={this.onChange.bind(this, 'FKeyName')}
                          />
                        </span>
                        <span>
                          优惠条件Key<span style={{ color: 'red' }}>*</span>
                          <Input
                            style={{ width: '110px', marginLeft: '5px' }}
                            type="text"
                            value={FKey}
                            onChange={this.onChange.bind(this, 'FKey')}
                          />
                        </span>
                      </React.Fragment>
                    )
                    :
                    (
                      <React.Fragment>
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
                        <span>
                          优惠条件Key：{oldF ? oldF.key : ''}
                        </span>
                      </React.Fragment>
                    )
                }
                <Table
                  size="small"
                  bordered
                  style={{ marginTop: '10px' }}
                  pagination={false}
                  columns={this.columns}
                  dataSource={newData}
                  rowKey={(record, index) => index}
                />
              </React.Fragment>
            )
        }
      </Modal >
    );
  }
}
