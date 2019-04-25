
/** @description: 折扣管理中的新增和编辑折扣
 * @author: shirleyyu
 * @date: 2018-02-24
 * @interface: '获取condition参数列表'，若“Optional”字段为空，则第3个控件改为输入框供用户输入，否则使用选择控件
 */
import React from 'react';
import { Link } from 'dva/router';
import _ from 'lodash';
import { Spin, Card, Input, Select, Button, Radio, Row, Col, Modal, message } from 'antd';
import styles from './discount.less';
import Exception from '../../../components/Exception';
import DiscountItem from './component/addDiscount/DiscountItem';
import Api from '../services/index';
import { getLoginInfo } from '../../../utils/utils';
import { getUserAuth } from '../../../services/api';
import { needAuthHost } from '../config/index';
import Utils from '../libraries/util';

const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

function TypeItem(props) {
  const {
    Type,
    labelColSpan,
    optionType,
    handleChange,
    strFConflict,
    UserId,
    ActivityId,
  } = props;
  if (Type === 'user') {
    return (
      <div>
        <Row className={styles.mrbottom15}>
          <Col span={labelColSpan}>
            <div>用户UIN<span style={{ color: 'red' }}>*</span></div>
          </Col>
          <Col>
            {
              optionType === 'add'
                ?
                (
                  <Input
                    className={styles.wid300}
                    value={UserId}
                    placeholder="只支持单个UIN"
                    onChange={(val) => { handleChange('UserId', val); }}
                  />
                )
                :
                (<span>{UserId}</span>)
            }
          </Col>
        </Row>
        <Row className={styles.mrbottom15}>
          <Col span={labelColSpan}>
            <div>是否享受官网折扣<span style={{ color: 'red' }}>*</span></div>
          </Col>
          <Col>
            <RadioGroup
              value={strFConflict}
              onChange={(val) => { handleChange('Conflict', val); }}
            >
              <Radio value="0">是</Radio>
              <Radio value="1">否</Radio>
            </RadioGroup>
            <div style={{ marginTop: '5px' }}>选择“是”：用户在官网折扣和用户折扣同时存在时，享受较低的折扣；选择“否”：用户不享受官网折扣</div>
          </Col>
        </Row>
      </div >
    );
  } else if (Type === 'activity') {
    return (
      <Row className={styles.mrbottom15}>
        <Col span={labelColSpan}>
          <div>运营活动 ID<span style={{ color: 'red' }}>*</span></div>
        </Col>
        <Col>
          {
            optionType === 'add'
              ?
              (
                <Input
                  className={styles.wid300}
                  value={ActivityId}
                  onChange={(val) => { handleChange('ActivityId', val); }}
                />
              )
              :
              (<span>{ActivityId}</span>)
          }
        </Col>
      </Row>
    );
  } else {
    return null;
  }
}

export default class AddDiscount extends React.Component {
  state = {
    loading: false,
    confirmLoading: false,
    showConfirm: false,
    optionType: 'add',
    payMode: '',
    Business: '',
    Product: '',
    Type: 'common',
    Conflict: '0',
    DiscountList: [], // 对象数组
    payModeMap: {
      prepay: '预付费',
      postpay: '后付费',
    },
  };

  constructor(props) {
    super(props);
    // 接收编辑带过来的数据
    window.addEventListener('message', (event) => {
      if (event.origin === location.origin) {
        let { data } = event;
        try {
          data = JSON.parse(data);
        } catch (e) {
          // nothing
        }
        const handleType = Object.keys(data)[0];
        this.handleDatas(handleType, data);
      }
    });
  }

  handleDatas(handleType, query) {
    const Id = Utils.getSearchValueByName('Id');
    const edit = query[handleType];
    if (Id !== edit.FId.toString()) {
      this.addDiscountItem();
      return;
    }
    const { FConditions, FDiscount = '', FBeginTime, FEndTime, FId, FBuId, FProductId, FRemark, Type, FConflict, FActivityId, FUserId } = edit;
    const payModeIndex = _.findIndex(FConditions, item => item.FKey === 'payMode');
    let payMode = '';
    let editData = {};
    if (payModeIndex > -1) {
      const payModeItem = FConditions.splice(payModeIndex, 1) || [];
      payMode = (payModeItem[0] || {}).FValue || '';
    }
    const newFconditons = _.map(FConditions, (con) => {
      const { FKey, FOper, FValue } = con;
      let Value = '';
      let range1;
      let range2;
      if (_.indexOf(['in', 'not in'], FOper) > -1) {
        Value = _.uniq(FValue.split(','));
      } else if (_.indexOf(['in range', 'not in range'], FOper) > -1) {
        [range1, range2] = FValue.split(',');
      } else {
        Value = FValue;
      }
      return {
        Key: FKey,
        Oper: FOper,
        Value,
        range1,
        range2,
      };
    });

    editData = {
      optionType: 'edit',
      payMode,
      Type,
      Conflict: FConflict,
      ActivityId: FActivityId,
      UserId: FUserId,
      Business: FBuId,
      Product: FProductId,
      Remark: FRemark,
      DiscountList: [
        {
          Id: Number(FId),
          Discount: FDiscount.replace('%', ''),
          BeginTime: FBeginTime,
          EndTime: FEndTime,
          ConditionList: newFconditons,
        },
      ],
    };
    this.setState({ ...editData, loading: false });
  }

  componentWillMount() {
    // 判断是否有权限
    getUserAuth({ opId: 22, needApply: 0, needLogin: 1 })
      .then((res) => {
        const { code, data = {} } = res;
        if (code !== 0) {
          this.setState({
            hasPermission: false,
            applyPermissionLink: data.url || '',
          });
        } else {
          this.setState({
            hasPermission: true,
          });
        }
      })
      .catch((err) => {
        message.error(`权限获取失败${err.message}`);
        console.log('err', err);
      });

    const Id = Utils.getSearchValueByName('Id');
    if (Id === '') {
      // 新增折扣
      this.addDiscountItem();
    } else {
      this.setState({ loading: true });
    }
  }

  onChange = (obj, callback) => {
    this.setState((prevState) => {
      const data = {
        ...prevState,
        ...obj,
      };
      return data;
    }, () => {
      if (callback) {
        callback();
      }
    });
  }

  onDiscountItemChange = (obj, index) => {
    const { DiscountList } = this.state;
    DiscountList[index] = _.assign(DiscountList[index], obj);
    this.onChange({ DiscountList });
  }

  addDiscountItem = () => {
    const { DiscountList } = this.state;
    const item = {
      Discount: '',
      BeginTime: null,
      EndTime: null,
      ConditionList: [{}], // 对象数组
    };
    DiscountList.push(item);
    this.onChange({ DiscountList });
  }

  deleteDiscountItem = (index) => {
    const { DiscountList } = this.state;
    DiscountList.splice(index, 1);
    this.onChange(DiscountList);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      showConfirm: this.validate(),
    });
  }

  validate = () => {
    const {
      optionType,
      payMode,
      Product,
      Type,
      UserId,
      DiscountList,
      Conflict,
      ActivityId,
    } = this.state;
    const publicMap = {
      payMode: '请选择适用产品',
      Business: '请输入商品码',
      Type: '请选择折扣类型',
    };
    const discountMap = {
      ConditionList: '条件填写不完整',
      Discount: '请输入具体折扣',
      BeginTime: '请选择生效时间',
      EndTime: '请选择失效时间',
    };

    if (optionType === 'add') {
      const array = Object.keys(publicMap);
      for (let i = 0; i < array.length; i += 1) {
        if (!this.state[array[i]].trim()) {
          message.error(publicMap[array[i]]);
          return false;
        }
      }

      if (payMode === 'postpay' && !Product) {
        message.error('请输入子商品码');
        return false;
      }

      if (Type === 'user') {
        if (!UserId.trim()) {
          message.error('请输入用户UIN');
          return false;
        }
      }
      if (!Conflict) {
        message.error('请选择是否享受官网折扣');
        return false;
      }
    } else if (Type === 'activity' && !ActivityId.trim()) {
      message.error('请输入运营活动 ID');
      return false;
    }

    let discountFlag = true;
    _.each(DiscountList, (item, sub) => {
      Object.keys(discountMap).forEach((key) => {
        // 条件非必填，但如果填了就要填完整
        if (key === 'ConditionList' && item.ConditionList.length > 0) {
          _.each(item[key], (condition, index) => {
            const conditonKey = ['Key', 'Oper', 'Value'];
            const notAllNull = conditonKey.some(ck => !!condition[ck]);
            if (!notAllNull) {
              DiscountList[sub].ConditionList.splice(index, 1);
              this.setState({ DiscountList });
              return false;
            }
            _.each(conditonKey, (con) => {
              if (con === 'Value') {
                if (_.indexOf(['in', 'not in'], condition.Oper) > -1) {
                  if (Array.isArray(condition.Value) && condition.Value.length === 0) {
                    message.error(discountMap[key]);
                    discountFlag = false;
                    return false;
                  }
                } else if (_.indexOf(['in range', 'not in range'], condition.Oper) > -1) {
                  const { range1, range2 } = condition;
                  if (!range1 || !range2) {
                    message.error('请输入条件范围');
                    discountFlag = false;
                    return false;
                  }
                  if (condition.KeyType === 'integer' && (Number.isNaN(range1) || Number.isNaN(range2))) {
                    message.error('条件范围只允许输入数字');
                    discountFlag = false;
                    return false;
                  }
                } else if (!condition[con]) {
                  message.error(discountMap[key]);
                  discountFlag = false;
                  return false;
                } else if (condition.KeyType === 'integer' && Number.isNaN(condition.Value)) {
                  message.error(`条件${index + 1}中的值只允许输入数字`);
                  discountFlag = false;
                  return false;
                }
              } else if (!condition[con]) {
                message.error(discountMap[key]);
                discountFlag = false;
                return false;
              }
              return discountFlag;
            });
            return discountFlag;
          });
        } else if (!item[key]) {
          message.error(discountMap[key]);
          discountFlag = false;
          return false;
        }
        return discountFlag;
      });
      return discountFlag;
    });

    return discountFlag;
  }

  save = () => {
    const {
      DiscountList,
      Type,
      confirmLoading,
      payMode,
      Business,
      Product,
      UserId,
      Conflict,
      Remark,
      ActivityId,
      conditionData = {},
    } = this.state;
    const Creator = getLoginInfo().name || '';

    if (!Creator) {
      message.error('请先登录');
      return false;
    }
    if (confirmLoading) {
      return;
    }
    this.setState({ confirmLoading: true }, () => {
      const params = {};
      const submitDiscountList = [];
      // 复制 ConditionList
      _.each(DiscountList, (item, key) => {
        const ConditionList = Utils.processConditionList(item.ConditionList, conditionData);

        submitDiscountList[key] = {
          is_new_discount: 0,
          discount_origin: 3,
          ...item,
          Business,
          Product: Product || '*',
          Creator,
          Discount: parseFloat(item.Discount),
          ConditionList,
        };
        if (!!Remark) {
          submitDiscountList[key].Remark = Remark;
        }
        // 编辑的时候可能没有 payMode，新增的时候一定会验证 payMode
        if (!!payMode) {
          submitDiscountList[key].ConditionList = [
            ...ConditionList,
            {
              Key: 'payMode',
              KeyType: 'string',
              Oper: '=',
              Value: payMode,
            },
          ];
        }
        if (Type === 'user') {
          submitDiscountList[key].UserId = UserId;
          // 整数，必传，1表示否（冲突），0表示是（不冲突），不传默认为0
          submitDiscountList[key].Conflict = Number(Conflict);
        } else if (Type === 'activity') {
          submitDiscountList[key].ActivityId = ActivityId;
        }
      });
      params.DiscountList = submitDiscountList;
      console.log(params);

      let func = null;
      if (Type === 'user') {
        func = Api.saveUserDiscount;
      } else if (Type === 'activity') {
        func = Api.saveActivityDiscount;
      } else {
        func = Api.saveCommonDiscount;
      }

      func(params)
        .then((res) => {
          if (res.code === 0) {
            message.success('保存成功！', () => {
              this.props.history.push('/discountTool/index');
            });
          } else {
            throw new Error(res.message);
          }
        })
        .catch((err) => {
          this.setState({ confirmLoading: false });
          message.error(`保存失败！${err}`);
        });
    });
  }

  hideModal = () => {
    this.setState({ showConfirm: false });
  }

  handleChange(key, val) {
    let obj = {};
    if (key === 'payMode') {
      obj = { [key]: val };
      if (val === 'postpay') {
        obj = {
          ...obj,
          Business: '',
        };
      }
    } else if (_.indexOf(['Business', 'Product', 'Type', 'Conflict', 'Remark'], key) > -1) {
      obj = { [key]: val.target.value };
      if (key === 'Type') {
        obj = {
          ...obj,
          UserId: '',
          ActivityId: '',
          Conflict: '0',
        };
      }
    } else if (_.indexOf(['UserId', 'ActivityId'], key) > -1) {
      const { value } = val.target;
      if (/^[0-9]*$/.test(value)) {
        obj = { [key]: value };
      }
    } else {
      obj = { [key]: val };
    }
    this.onChange(obj);
  }

  render() {
    const labelColSpan = 2;
    const {
      hasPermission,
      applyPermissionLink,
      loading,
      optionType,
      payMode = '',
      Business = '',
      Product = '',
      Type,
      UserId = '',
      ActivityId = '',
      Conflict,
      DiscountList,
      showConfirm,
      confirmLoading,
      Remark,
      conditionData,
      payModeMap,
    } = this.state;
    const strFConflict = Conflict && Conflict.toString();
    const showPayMode = payMode ? payModeMap[payMode] : '';

    const radioDisabled = optionType === 'edit';

    if (window.location.host === needAuthHost && _.isBoolean(hasPermission) && !hasPermission) {
      return (
        <div>
          <Exception
            type="403"
            style={{ minHeight: 500, height: '80%' }}
            desc="对不起，您没有操作当前页面的权限"
            actions={!!applyPermissionLink ? <a href={applyPermissionLink}>申请权限</a> : <p style={{ fontSize: '20px' }}>如需要申请权限请联系cathyxcheng(成晓)</p>}
          />
        </div>
      );
    }

    return (
      <Spin spinning={loading}>
        <Card title={optionType === 'add' ? '新增折扣' : '编辑折扣'} bordered={false}>
          <Row className={styles.mrbottom15}>
            <Col span={labelColSpan}>
              <div>适用产品<span style={{ color: 'red' }}>*</span></div>
            </Col>
            <Col>
              {
                optionType === 'add'
                  ?
                  (
                    <Select
                      showSearch
                      className={styles.wid300}
                      value={payMode}
                      onChange={this.handleChange.bind(this, 'payMode')}
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {
                        _.map(payModeMap, (value, key) =>
                          <Option key={key} value={key}>{value}</Option>)
                      }
                    </Select>
                  )
                  :
                  (<span>{showPayMode}</span>)
              }
            </Col>
          </Row>
          <Row className={styles.mrbottom15}>
            <Col span={labelColSpan}>
              <div>商品码<span style={{ color: 'red' }}>*</span></div>
            </Col>
            <Col>
              {
                optionType === 'add'
                  ?
                  (
                    <Input
                      className={styles.wid300}
                      value={Business}
                      onChange={this.handleChange.bind(this, 'Business')}
                    />
                  )
                  :
                  (<span>{Business}</span>)
              }
            </Col>
          </Row>
          {
            payMode === 'postpay'
              ?
              (
                <Row className={styles.mrbottom15}>
                  <Col span={labelColSpan}>
                    <div>子商品码<span style={{ color: 'red' }}>*</span></div>
                  </Col>
                  <Col>
                    {
                      optionType === 'add'
                        ?
                        (
                          <Input
                            className={styles.wid300}
                            value={Product}
                            onChange={this.handleChange.bind(this, 'Product')}
                          />
                        )
                        :
                        (<span>{Product}</span>)
                    }
                  </Col>
                </Row>
              )
              :
              null
          }
          <Row className={styles.mrbottom15}>
            <Col span={labelColSpan}>
              <div>折扣类型<span style={{ color: 'red' }}>*</span></div>
            </Col>
            <Col>
              <RadioGroup
                value={Type}
                disabled={radioDisabled}
                onChange={this.handleChange.bind(this, 'Type')}
              >
                <Radio value="common">官网折扣</Radio>
                <Radio value="user">用户折扣</Radio>
                <Radio value="activity">运营活动折扣</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <TypeItem
            Type={Type}
            UserId={UserId}
            ActivityId={ActivityId}
            labelColSpan={labelColSpan}
            optionType={optionType}
            strFConflict={strFConflict}
            handleChange={this.handleChange.bind(this)}
          />
          <Row className={styles.mrbottom15}>
            <Col span={labelColSpan}>
              <div>折扣<span style={{ color: 'red' }}>*</span></div>
            </Col>
            <Col>
              {
                optionType === 'add'
                  ?
                  (<Button onClick={this.addDiscountItem}>+ 添加折扣</Button>)
                  :
                  null
              }
            </Col>
          </Row>
          {
            _.map(DiscountList, (discountInfo, index) =>
              (
                <DiscountItem
                  key={index}
                  optionType={optionType}
                  discountIndex={index}
                  {...discountInfo}
                  conditionData={conditionData}
                  labelCol={labelColSpan}
                  loading={loading}
                  deleteDiscountItem={this.deleteDiscountItem}
                  onDiscountItemChange={this.onDiscountItemChange}
                  onChange={this.onChange}
                />
              ))
          }
          <Row>
            <Col span={labelColSpan}>
              <div>备注</div>
            </Col>
            <Col span={22}>
              <TextArea
                className={styles.mrbottom15}
                value={Remark}
                autosize={{ minRows: 2 }}
                onChange={this.handleChange.bind(this, 'Remark')}
              />
            </Col>
          </Row>
          <Row>
            <Col span={labelColSpan} />
            <Col span={22} style={{ textAlign: 'right' }}>
              <Link to="/discountTool/index">
                <Button style={{ marginRight: '30px' }}>取消</Button>
              </Link>
              <Button type="primary" onClick={this.handleSubmit}>保存</Button>
              <Modal
                title="确认提交折扣信息"
                visible={showConfirm}
                onOk={this.save}
                onCancel={this.hideModal}
                confirmLoading={confirmLoading}
                okText="确认"
                cancelText="取消"
              >
                <p>保存策略将<span style={{ color: 'red' }}>同步到现网！且生效后无法修改，请确认已检测策略无误！</span> </p>
              </Modal>
            </Col>
          </Row>
        </Card >
      </Spin>
    );
  }
}

