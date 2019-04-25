/**
 * @description: 添加折扣组件
 * @author: shirleyyu
 * @date: 2018-02-24
 */

import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Modal, Radio, Cascader, Checkbox, Input, message, DatePicker } from 'antd';
import ConditionItem from './ConditionItem';
import CustomizeDatePicker from './CustomizeDatePicker';
import PriceType from '../../../../pricing/components/common/PriceType';
import Util from '../../../libraries/util';
import styles from '../../discount.less';
import { numberFloatInputExp, numberFloatExp } from '../../../config/index';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const { PriceEdit } = PriceType;

export default class DiscountItemForFLP extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceEditInstance: this.priceEditInstance || '', // 定价类型和价格配置相关
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showDiscountItem) {
      const { DiscountList = [], discountIndex } = nextProps;
      const item = DiscountList[discountIndex];
      const discountItem = discountIndex === DiscountList.length ?
        {
          showProducts: '',
          preferentialType: '0',
          ConditionList: [{}],
          currency: 'CNY', // 不显示给用户看了，直接配置人民币
        } : {
          ...item,
          ConditionList: _.map(item.ConditionList, con => ({ ...con })),
          prices: _.map(item.prices, p => ({ ...p })),
        };
      this.setState({
        discountItem,
        priceEditInstance: '',
      });
    }
  }

  onDiscountItemChange(key, value, ext) {
    this.setState((prev) => { // 若不这样，有可能之前的改变还来不及更新就被覆盖
      let obj = {};
      let { discountItem = {} } = prev;
      if (key === 'preferentialType') {
        discountItem = {
          ConditionList: [{}],
          currency: 'CNY', // 不显示给用户看了，直接配置人民币
        };
        if (value === '0') {
          discountItem.Conflict = '0';
        } else {
          discountItem.priority = this.props.isEdit ? 'keep' : 'highest';
        }
        obj = { [key]: value, showProducts: '' };
      } else if (key === 'products') {
        const productKeys = ['product_code', 'sub_product_code', 'billing_item_code', 'sub_billing_item_code'];
        value.forEach((item, index) => {
          obj[productKeys[index]] = item;
          obj[productKeys[index].replace(/code$/, 'name')] = ext[index].label;
        });
        productKeys.splice(0, value.length);
        productKeys.forEach((item) => {
          obj[item] = '*';
        });
        if (value.length === 4 && discountItem.preferentialType === '1') {
          obj.productUnitDes = ext[3].productUnitDes;
        } else {
          obj.productUnitDes = '';
          if (value.length === 0) {
            obj.product_code = '';
          }
        }
        obj.showProducts = value;
      } else if (key === 'ConditionList') {
        obj = value;
      } else if (key === 'Discount') {
        if (numberFloatInputExp.test(value)) {
          obj = { [key]: value };
        }
      } else if (key === 'pricetype') {
        const cur = _.find(this.state.priceType, item => item.code === Number(value)) || {};
        const { name } = cur;
        obj = {
          [key]: value,
          [`${key}Name`]: name,
        };
      } else {
        obj = { [key]: value };
      }

      return {
        ...prev,
        discountItem: {
          ...discountItem,
          ...obj,
        },
      };
    });
  }

  onDiscountItemBlur(key, val) {
    if (key === 'Discount') {
      const { value } = val.target;
      if (value) {
        const num = Number(value);
        if (!(numberFloatExp.test(value) && num >= 0 && num <= 100)) {
          this.setState(prev => ({
            ...prev,
            discountItem: {
              ...prev.discountItem,
              [key]: '',
            },
          }));
          message.error('具体折扣输入不正确！', 10);
          val.target.focus();
        }
      }
    }
  }

  getFourLayerProductName() {
    const { DiscountList = [], discountIndex } = this.props;
    const discount = DiscountList[discountIndex] || {};
    const keys = ['product_name', 'sub_product_name', 'billing_item_name', 'sub_billing_item_name'];
    const names = keys.map(k => discount[k] || discount[k.replace(/name$/, 'code')]);
    const productName = names.reduceRight((prev, cur) => (!prev || prev === '*' ? cur : `${cur}/${prev}`));
    return productName;
  }

  getProductOptions() {
    const { productList = [] } = this.props;
    const treeData = _.map(productList, (product) => {
      const { product_code, chn_name } = product.product || {};
      const item = {
        label: chn_name,
        value: product_code,
      };
      const subProductList = Util.getItemFromFLProduct(productList, 'sub_product_code', { product_code });
      item.children = _.map(subProductList, (subP) => {
        const { sub_product_code } = subP;
        const subPObj = {
          label: subP.chn_name,
          value: sub_product_code,
        };
        const billingItemList = Util.getItemFromFLProduct(productList, 'billing_item_code', { product_code, sub_product_code });
        subPObj.children = _.map(billingItemList, (billing) => {
          const { billing_item_code } = billing;
          const billingObj = {
            label: billing.chn_name,
            value: billing_item_code,
          };
          const subBillingItemList = Util.getItemFromFLProduct(productList, 'sub_billing_item_code', { product_code, sub_product_code, billing_item_code });
          billingObj.children = _.map(subBillingItemList, subB => ({ label: subB.chn_name, value: subB.sub_billing_item_code, productUnitDes: subB.good_num_unit }));
          return billingObj;
        });
        return subPObj;
      });
      return item;
    });
    if (this.state.preferentialType === '0') {
      treeData.unshift({
        label: '全产品',
        value: '*',
      });
    }
    return treeData;
  }

  // 填入参数校验
  validate() {
    const { Type } = this.props;
    const { discountItem = {} } = this.state;
    const { ConditionList = [], payMode, Conflict, preferentialType, Discount, priority, customizePriority, pricetype, prices = {} } = discountItem;
    const commonErrorMap = {
      preferentialType: '优惠类型',
      product_code: '优惠产品',
      BeginTime: '优惠有效期',
      EndTime: '优惠有效期',
    };
    let flag = Object.keys(commonErrorMap).every((k) => {
      if (!discountItem[k]) {
        message.error(`请选择${commonErrorMap[k]}`);
        return false;
      }
      return true;
    });
    if (!flag) {
      return false;
    }

    if (Type === 'user') {
      if (!priority) {
        message.error('请选择优先级');
        return false;
      } else if (priority === 'customize' && !customizePriority) {
        message.error('请选择自定义优先级');
        return false;
      }
    }

    flag = ConditionList.every((con = {}, index) => {
      const { Key, Oper, Value, range1, range2 } = con;
      const tip = `第${index + 1}行，`;
      const noValue = (!Value && (!range1 || !range2)) || (Array.isArray(Value) && Value.length === 0);
      if ((!Key && !Oper && noValue) || (Key && Oper && !noValue)) {
        return true;
      } else {
        message.error(`${tip}请完善优惠条件`);
        return false;
      }
    });
    if (!flag) {
      return false;
    }

    if (preferentialType === '0') { // 折扣
      if (!Array.isArray(payMode) || payMode.length === 0) {
        message.error('请选择付费类型');
        return false;
      }
      if (!Discount) {
        message.error('请输入具体折扣');
        return false;
      }
      if (Type === 'user' && !Conflict) {
        message.error('请选择“是否享受官网折扣”');
        return false;
      }
    } else {
      const errorMap1 = {
        sub_product_code: '请选择四层优惠产品',
        billing_item_code: '请选择四层优惠产品',
        sub_billing_item_code: '请选择四层优惠产品',
        productUnitDes: '未获取到产品的基本单位，请联系产品经理解决',
        timeunit: '请选择付费周期',
        pricetype: '请选择定价类型',
        payMode: '请选择付费类型',
      };
      flag = Object.keys(errorMap1).every((k) => {
        if (!discountItem[k]) {
          message.error(errorMap1[k]);
          return false;
        }
        return true;
      });
      if (!flag) {
        return false;
      }
      const keys = Object.keys(prices);
      flag = keys.every((k, i) => {
        const { cnt, low, high, chinaPrice, chinaStepSize, chinaStepPrice } = prices[k];
        let f = true;
        const tip = `价格配置，第${i + 1}行，请输入数字`;
        const customizePricetype = pricetype === '7' ? prices[k].pricetype : pricetype;
        switch (customizePricetype) {
          case '1':
            if (isNaN(cnt) || isNaN(chinaPrice)) {
              message.error(tip);
              f = false;
            }
            break;
          case '2':
            if (!isNaN(chinaPrice)) {
              message.error(tip);
              f = false;
            }
            break;
          case '5':
            if (isNaN(low) || isNaN(chinaPrice) || (i !== keys.length && isNaN(high))) {
              message.error(tip);
              f = false;
            }
            break;
          case '6':
            if (isNaN(low) || isNaN(chinaPrice) || isNaN(chinaStepPrice) || isNaN(chinaStepSize) || (i !== keys.length && isNaN(high))) {
              message.error(tip);
              f = false;
            }
            break;
          default:
            f = true;
        }
        return f;
      });
      if (!flag) {
        return false;
      }
    }
    return true;
  }

  onOkModal() {
    if (!this.validate()) {
      return;
    }
    const { onChangeState, discountIndex, DiscountList } = this.props;
    DiscountList[discountIndex] = this.state.discountItem;
    onChangeState({ DiscountList, showDiscountItem: false });
  }


  onCancel() {
    this.setState({ discountItem: '', priceEditInstance: '' });
    this.props.onChangeState({ showDiscountItem: false });
  }

  render() {
    const { isEdit, isCopy, discountIndex, conditionData, Type, showDiscountItem, OperList, payModeMap = {}, timeUnitMap = {}, preferentialTypeMap = {} } = this.props;
    const { discountItem = {}, priceEditInstance } = this.state;
    const { preferentialType, productUnitDes, ConditionList, payMode, pricetype, priority, Discount, Conflict, customizePriority, BeginTime, EndTime, Remark, timeunit, showProducts, prices } = discountItem;
    const productOptions = this.getProductOptions();
    const payModeGroup = Object.keys(payModeMap).map(k => ({ label: payModeMap[k], value: k }));
    const timeUnitGroup = Object.keys(timeUnitMap).map(k => ({ label: timeUnitMap[k], value: k }));
    const showCustomizePriority = customizePriority && moment(customizePriority).isValid() ? moment(customizePriority) : null;
    // PriceType 组件中用到，这里只有国内站，没有国际站
    const hasPrice = ['china'];
    const hideFooterStepButton = true;
    const hideFooterSpecifiedButton = true;

    return (
      <Modal
        width="80%"
        maskClosable={false}
        style={{ maxWidth: '730px' }}
        title="优惠信息填写"
        visible={showDiscountItem}
        okText="添加"
        onOk={this.onOkModal.bind(this)}
        onCancel={this.onCancel.bind(this)}
      >
        <table>
          <tbody>
            <tr>
              <td className={styles.add_d_t_left}>优惠类型<span style={{ color: 'red' }}>*</span></td>
              <td className={styles.add_d_t_right}>
                <RadioGroup
                  disabled={isEdit}
                  value={preferentialType}
                  onChange={val => this.onDiscountItemChange('preferentialType', val.target.value)}
                >
                  {
                    Object.keys(preferentialTypeMap).map(k => <Radio value={k} key={k}>{preferentialTypeMap[k]}</Radio>)
                  }
                </RadioGroup></td>
            </tr>
            <tr>
              <td className={styles.add_d_t_left}>优惠产品<span style={{ color: 'red' }}>*</span></td>
              <td className={styles.add_d_t_right}>
                {
                  !isEdit
                    ?
                    (
                      <Cascader
                        showSearch
                        className={styles.wid500}
                        options={productOptions}
                        value={showProducts}
                        changeOnSelect={preferentialType !== '1'}
                        onChange={this.onDiscountItemChange.bind(this, 'products')}
                      />
                    )
                    :
                    (<span>{this.getFourLayerProductName()}</span>)
                }
              </td>
            </tr>
            {
              preferentialType === '1'
                ?
                (
                  <tr>
                    <td className={styles.add_d_t_left}>基本单位<span style={{ color: 'red' }}>*</span></td>
                    <td className={styles.add_d_t_right}>{productUnitDes}</td>
                  </tr>
                )
                :
                null
            }
            <tr>
              <td className={styles.add_d_t_left}>优惠条件</td>
              <td className={styles.add_d_t_right}>
                <ConditionItem
                  OperList={OperList}
                  discountIndex={discountIndex}
                  conditionData={conditionData}
                  ConditionList={ConditionList}
                  onChange={this.props.onChangeState}
                  onDiscountItemChange={this.onDiscountItemChange.bind(this, 'ConditionList')}
                />
              </td>
            </tr>
            <tr>
              <td className={styles.add_d_t_left}>付费类型<span style={{ color: 'red' }}>*</span></td>
              <td className={styles.add_d_t_right}>
                {
                  preferentialType === '1'
                    ?
                    (
                      <RadioGroup options={payModeGroup} value={payMode} onChange={val => this.onDiscountItemChange('payMode', val.target.value)} />
                    )
                    :
                    (
                      <CheckboxGroup options={payModeGroup} value={payMode} onChange={this.onDiscountItemChange.bind(this, 'payMode')} />
                    )
                }
              </td>
            </tr>
            {
              preferentialType === '1'
                ?
                (
                  <React.Fragment>
                    <tr>
                      <td className={styles.add_d_t_left}>计费周期<span style={{ color: 'red' }}>*</span></td>
                      <td className={styles.add_d_t_right}>
                        <RadioGroup options={timeUnitGroup} value={timeunit} onChange={val => this.onDiscountItemChange('timeunit', val.target.value)} />
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.add_d_t_left}>定价类型<span style={{ color: 'red' }}>*</span></td>
                      <td className={styles.add_d_t_right}>
                        <PriceType
                          value={pricetype}
                          priceEditInstance={this.priceEditInstance || priceEditInstance}
                          unit={productUnitDes}
                          onChange={val => this.onDiscountItemChange('pricetype', val)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className={styles.add_d_t_left}>价格配置<span style={{ color: 'red' }}>*</span></td>
                      <td className={styles.add_d_t_right}>
                        <PriceEdit
                          ref={(instance) => {
                            this.priceEditInstance = instance;
                            return this.priceEditInstance;
                          }}
                          value={prices}
                          type={pricetype}
                          hasPrice={hasPrice}
                          unit={productUnitDes}
                          hideFooterStepButton={hideFooterStepButton}
                          hideFooterSpecifiedButton={hideFooterSpecifiedButton}
                          timeUnitName={timeUnitMap[timeunit]}
                          onChange={this.onDiscountItemChange.bind(this, 'prices')}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                )
                :
                (
                  <React.Fragment>
                    <tr>
                      <td className={styles.add_d_t_left}>具体折扣<span style={{ color: 'red' }}>*</span></td>
                      <td className={styles.add_d_t_right}>
                        <Input
                          style={{ width: 100, marginRight: '5px' }}
                          value={Discount}
                          onChange={val => this.onDiscountItemChange('Discount', val.target.value)}
                          onBlur={val => this.onDiscountItemBlur('Discount', val)}
                        />
                        %
                        <span style={{ paddingLeft: '15px' }}>请输入0~100的数，最多4位小数</span>
                      </td>
                    </tr>
                    {
                      Type === 'user'
                        ?
                        (
                          <tr>
                            <td className={styles.add_d_t_left}>是否享受官网折扣<span style={{ color: 'red' }}>*</span></td>
                            <td className={styles.add_d_t_right}>
                              <RadioGroup
                                value={Conflict}
                                onChange={val => this.onDiscountItemChange('Conflict', val.target.value)}
                              >
                                <Radio value="0">是</Radio>
                                <Radio value="1">否</Radio>
                              </RadioGroup>
                              <div style={{ marginTop: '5px' }}>
                                选择“是”：用户在官网折扣和用户折扣同时存在时，享受较低的折扣；选择“否”：用户不享受官网折扣
                              </div>
                            </td>
                          </tr>
                        )
                        :
                        null
                    }
                  </React.Fragment>
                )
            }
            <tr>
              <td className={styles.add_d_t_left}>优惠有效期<span style={{ color: 'red' }}>*</span></td>
              <td className={styles.add_d_t_right}>
                <CustomizeDatePicker
                  BeginTime={BeginTime}
                  EndTime={EndTime}
                  onChange={this.onDiscountItemChange.bind(this)}
                />
              </td>
            </tr>
            {
              Type === 'user'
                ?
                (
                  <tr>
                    <td className={styles.add_d_t_left}>优先级<span style={{ color: 'red' }}>*</span></td>
                    <td className={styles.add_d_t_right}>
                      <RadioGroup
                        value={priority}
                        onChange={val => this.onDiscountItemChange('priority', val.target.value)}
                      >
                        {
                          isEdit || isCopy
                            ?
                            (<Radio value="keep">优先级保持不变</Radio>)
                            :
                            null
                        }
                        <Radio value="highest">优先级设为最高（当前时间）</Radio>
                        <Radio value="customize">自定义优先级</Radio>
                      </RadioGroup>
                      {
                        priority === 'customize'
                          ?
                          (
                            <div style={{ marginTop: '10px' }}>
                              <DatePicker
                                placeholder="自定义优先级"
                                className={styles.wid200}
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                                value={showCustomizePriority}
                                onChange={(val, date) => this.onDiscountItemChange('customizePriority', date)}
                              />
                            </div>
                          )
                          :
                          null
                      }
                    </td>
                  </tr>
                )
                :
                null
            }
            <tr>
              <td className={styles.add_d_t_left}>备注信息</td>
              <td className={styles.add_d_t_right}>
                <TextArea
                  value={Remark}
                  autosize={{ minRows: 2 }}
                  onChange={val => this.onDiscountItemChange('Remark', val.target.value.trim())}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
    );
  }
}
