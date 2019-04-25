/** @description: 折扣管理中的折扣条件组件
 * @author: shirleyyu
 * @date: 2018-02-24
 */
import React from 'react';
import _ from 'lodash';
import { Icon, Select, message, Button, Spin } from 'antd';
import Api from '../../../services/index';
import Util from '../../../libraries/util';

const { Option } = Select;

function SelectOptions(props) {
  const {
    index,
    onChange,
    condition = {},
    conditionData = {},
  } = props;
  let selectValueType;
  let rangeInput;
  const { Key, Oper, Value, range1, range2 } = condition;

  if (['in', 'not in'].indexOf(Oper) > -1) {
    selectValueType = 'multiple';
  } else if (['in range', 'not in range'].indexOf(Oper) > -1) {
    rangeInput = true;
  }

  if (rangeInput) {
    return (
      <span style={{ whiteSpace: 'nowrap' }}>
        <Select
          showSearch
          value={range1}
          placeholder="请选择"
          style={{ width: 120 }}
          onChange={(val) => { onChange('range1', index, val); }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            (conditionData[Key] || [{ FValue: '', FKeyType: '', FValueName: '请选择' }]).map((v = {}) => <Option value={v.FValue} key={`${v.FId}_range1`} title={v.FValueName}>{v.FValueName}</Option>)
          }
        </Select>
        ~
        <Select
          showSearch
          value={range2}
          placeholder="请选择"
          style={{ width: 120 }}
          onChange={(val) => { onChange('range2', index, val); }}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {
            (conditionData[Key] || [{ FValue: '', FKeyType: '', FValueName: '请选择' }]).map((v = {}) => <Option value={v.FValue} key={`${v.FId}_range2`} title={v.FValueName}>{v.FValueName}</Option>)
          }
        </Select>
      </span>
    );
  } else {
    return (
      <Select
        showSearch
        value={Value}
        placeholder="请选择"
        mode={selectValueType}
        style={{ width: '200px' }}
        onChange={(val) => { onChange('Value', index, val); }}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {
          (conditionData[Key] || [{ FValue: '', FKeyType: '', FValueName: '请选择' }]).map((v = {}) => <Option value={v.FValue} key={`${v.FId}_Value`} title={v.FValueName}>{v.FValueName}</Option>)
        }
      </Select>
    );
  }
}

export default class ConditionItem extends React.Component {
  state = {
    conditionLoading: false,
  }

  componentDidMount() {
    const {
      conditionData = [],
      ConditionList = [],
    } = this.props;
    if (ConditionList.length === 0) {
      this.addConditionItem();
    }
    // 第一次请求条件，保存到父组件中，因为一个父组件中有可能多次调用 ConditionItem 组件
    if (conditionData.length === 0 && !this.state.conditionLoading) {
      const params = { page: 1, rows: 1000000 };
      Api.getConditionTempList(params)
        .then((res) => {
          if (res.code === 0) {
            this.setState({ conditionLoading: false });
            this.props.onChange({ conditionData: Util.handleConditionData((res.data && res.data.rows) || []) });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ conditionLoading: false });
          message.error(`获取条件列表出错！${e.message || e}`);
        });
    }
  }

  onChange(key, index, val) {
    let obj = {};
    if (key === 'Key') {
      obj = {
        [key]: val,
        Value: undefined,
        range1: undefined,
        range2: undefined,
      };
    } else if (key === 'Value') {
      obj = {
        [key]: val,
        range1: undefined,
        range2: undefined,
      };
    } else if (key === 'Oper') {
      if (['in range', 'not in range'].indexOf(val) > -1) {
        obj = {
          range1: undefined,
          range2: undefined,
        };
      }
      obj = {
        ...obj,
        [key]: val,
        Value: undefined,
      };
    } else if (['range1', 'range2'].indexOf(key) > -1) {
      obj = {
        Value: undefined,
        [key]: val,
      };
    }
    this.onConditionChange(obj, index);
  }

  onConditionChange(obj, conditionIndex) {
    const { ConditionList, onDiscountItemChange, discountIndex } = this.props;
    ConditionList[conditionIndex] = _.assign(ConditionList[conditionIndex], obj);
    onDiscountItemChange({ ConditionList }, discountIndex);
  }

  addConditionItem() {
    const { discountIndex, ConditionList = [], onDiscountItemChange } = this.props;
    ConditionList.push({});
    onDiscountItemChange({ ConditionList }, discountIndex);
  }

  deleteConditionItem(index) {
    const { discountIndex, ConditionList, onDiscountItemChange } = this.props;
    ConditionList.splice(index, 1);
    onDiscountItemChange({ ConditionList }, discountIndex);
  }

  render() {
    const {
      ConditionList = [],
      conditionData = {},
      OperList,
    } = this.props;
    // 付费模式单独使出来了
    const keyList = [];
    Object.keys(conditionData).forEach((d) => {
      const i = (conditionData[d] && conditionData[d][0]) || {};
      if (d !== 'payMode') {
        keyList.push(<Option value={d} key={i.FId} title={i.FKeyName}>{i.FKeyName || ''}</Option>);
      }
    });

    return (
      <Spin spinning={this.state.conditionLoading}>
        {
          ConditionList.map((con = {}, index) => {
            const { Key, Oper } = con;

            return (
              <div style={{ marginBottom: '10px', whiteSpace: 'nowrap' }} key={index.toString()}>
                <Select
                  showSearch
                  value={Key}
                  placeholder="请选择"
                  style={{ width: '200px' }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onChange={this.onChange.bind(this, 'Key', index)}
                >
                  {keyList}
                </Select>
                <Select
                  showSearch
                  value={Oper}
                  placeholder="请选择"
                  style={{ margin: '0 10px', width: '100px' }}
                  onChange={this.onChange.bind(this, 'Oper', index)}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {
                    _.map(OperList, (item, key) =>
                      <Option key={key} value={key}>{item}</Option>)
                  }
                </Select>
                <SelectOptions
                  index={index}
                  condition={con}
                  conditionData={conditionData}
                  onChange={this.onChange.bind(this)}
                />
                <span span={2}>
                  <Icon type="close" style={{ cursor: 'pointer' }} onClick={this.deleteConditionItem.bind(this, index)} />
                </span>
              </div>
            );
          })
        }
        <Button onClick={this.addConditionItem.bind(this)}>+ 增加条件</Button>
      </Spin>
    );
  }
}
