/**
 * @description: 添加折扣组件
 * @author: shirleyyu
 * @date: 2018-02-24
 */

import React from 'react';
import { Row, Col, Icon, Input, message } from 'antd';
import ConditionItem from './ConditionItem';
import styles from '../../discount.less';
import CustomizeDatePicker from './CustomizeDatePicker';
import { numberFloatInputExp, numberFloatExp } from '../../../config/index';

export default class DiscountItem extends React.Component {
  OperList = {
    '=': '等于',
    '!=': '不等于',
    '>': '大于',
    '<': '小于',
    '>=': '不小于',
    '<=': '不大于',
    in: '在列表',
    'not in': '不在列表',
    'in range': '在范围',
    'not in range': '不在范围',
  };

  onDiscountInfoBlur(key, val) {
    const { discountIndex, onDiscountItemChange } = this.props;
    let obj = {};
    if (key === 'Discount') {
      const { value } = val.target;
      if (value) {
        const num = Number(value);
        if (numberFloatExp.test(value) && num >= 0 && num <= 100) {
          obj = { [key]: num.toFixed(4) };
        } else {
          message.error('具体折扣输入不正确！', 10);
          val.target.focus();
        }
      }
    } else {
      obj = { [key]: val };
    }
    onDiscountItemChange(obj, discountIndex);
  }

  onDiscountInfoChange(key, val) {
    const { discountIndex, onDiscountItemChange } = this.props;
    let obj = {};
    if (key === 'Discount') {
      const { value } = val.target;
      if (numberFloatInputExp.test(value)) {
        obj = { [key]: value };
      }
    } else if (['BeginTime', 'EndTime'].indexOf(key) > -1) {
      obj = { [key]: val };
    } else {
      obj = { [key]: val };
    }
    onDiscountItemChange(obj, discountIndex);
  }

  deleteDiscountItem = () => {
    const { discountIndex, deleteDiscountItem } = this.props;
    deleteDiscountItem(discountIndex);
  }

  render() {
    const {
      labelCol,
      optionType,
      discountIndex,
      conditionData,
      ConditionList,
      Discount,
      BeginTime,
      EndTime,
      onChange,
      onDiscountItemChange,
    } = this.props;

    return (
      <Row className={styles.mrbottom15}>
        <Col span={labelCol} />
        <Col span={22}>
          <div style={{ background: '#f0f2f5', width: '100%', padding: '20px 10px 10px' }}>
            {
              discountIndex !== 0 && optionType === 'add'
                ?
                (
                  <div style={{ textAlign: 'right' }}>
                    <Icon type="close" style={{ cursor: 'pointer' }} onClick={this.deleteDiscountItem} />
                  </div>
                )
                :
                null
            }
            <Row className={styles.mrbottom15}>
              <Col span={2}>优惠条件</Col>
              <Col span={20}>
                <ConditionItem
                  OperList={this.OperList}
                  conditionData={conditionData}
                  ConditionList={ConditionList}
                  discountIndex={discountIndex}
                  onDiscountItemChange={onDiscountItemChange}
                  onChange={onChange}
                />
              </Col>
            </Row>
            <Row className={styles.mrbottom15}>
              <Col span={2}>
                <div>具体折扣<span style={{ color: 'red' }}>*</span></div>
              </Col>
              <Col>
                <Input
                  style={{ width: 100, marginRight: '5px' }}
                  value={Discount}
                  onChange={this.onDiscountInfoChange.bind(this, 'Discount')}
                  onBlur={this.onDiscountInfoBlur.bind(this, 'Discount')}
                />
                %
                <span style={{ paddingLeft: '15px' }}>请输入0~100的数，最多4位小数</span>
              </Col>
            </Row>
            <Row className={styles.mrbottom15}>
              <Col span={2}>
                <div>优惠有效期<span style={{ color: 'red' }}>*</span></div>
              </Col>
              <Col>
                <CustomizeDatePicker
                  BeginTime={BeginTime}
                  EndTime={EndTime}
                  onChange={this.onDiscountInfoChange.bind(this)}
                />
              </Col>
            </Row>

          </div>
        </Col>
      </Row >
    );
  }
}
