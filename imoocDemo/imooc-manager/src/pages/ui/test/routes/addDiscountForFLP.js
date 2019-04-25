/**
 * 添加产品四层优惠
 * tapd: http://tapd.oa.com/pt_jifei/prong/stories/view/1010140771063096769
 * interface: http://tapd.oa.com/pt_jifei/markdown_wikis/view/#1010140771007992789
 */

import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'dva/router';
import { Spin, Card, Button, Radio, Row, Col, Modal, message, Table, Icon } from 'antd';
import styles from './discount.less';
import Api from '../services/index';
import Exception from '../../../components/Exception';
import TypeItems from './component/addDiscount/TypeItems';
import DiscountItemForFLP from './component/addDiscount/DiscountItemForFLP';
import { getUserAuth } from '../../../services/api';
import { getLoginInfo } from '../../../utils/utils';
import { needAuthHost, localPayModeMap, localOperList, localCurrencyMap, localTimeUnitMap, oldPriceTypeMap } from '../config/index';
import Util from '../libraries/util';
const RadioGroup = Radio.Group;

export default class AddDiscountForFLP extends React.Component {
  state = {
    loading: true,
    discountLoading: true,
    confirmLoading: false,
    showConfirm: false,
    Type: 'common',
    DiscountList: [], // 对象数组
    productList: [], // 四层产品列表
    Creator: getLoginInfo().name || '',
    is_new_discount: 1,
    discount_origin: 3,
    payModeMap: localPayModeMap,
    OperList: localOperList,
    currencyMap: localCurrencyMap,
    timeUnitMap: localTimeUnitMap,
  };

  columns = [
    {
      title: '优惠类型',
      dataIndex: 'preferentialType',
      key: 'preferentialType',
      width: 80,
      render: (text) => {
        const map = {
          0: '折扣',
          1: '合同价',
        };
        return map[text];
      },
    },
    {
      title: '产品名称',
      dataIndex: 'product_code',
      key: 'product_code',
      width: 120,
      render: (text, record) => record.product_name,
    },
    {
      title: '子产品名称',
      dataIndex: 'sub_product_code',
      key: 'sub_product_code',
      width: 120,
      render: (text, record) => record.sub_product_name,
    },
    {
      title: '计费项',
      dataIndex: 'billing_item_code',
      key: 'billing_item_code',
      width: 120,
      render: (text, record) => record.billing_item_name,
    },
    {
      title: '计费细项',
      dataIndex: 'sub_billing_item_code',
      key: 'sub_billing_item_code',
      width: 120,
      render: (text, record) => record.sub_billing_item_name,
    },
    {
      title: '付费模式',
      dataIndex: 'payMode',
      key: 'payMode',
      width: 80,
      render: text => (Array.isArray(text) ? text.map(p => <div>{this.state.payModeMap[p]}</div>) : this.state.payModeMap[text]),
    },
    {
      title: '优惠条件',
      dataIndex: 'ConditionList',
      key: 'ConditionList',
      width: 200,
    },
    {
      title: '定价类型',
      dataIndex: 'pricetype',
      key: 'pricetype',
      width: 100,
      render: (text, record) => record.pricetypeName || ((_.find(this.state.priceType, p => p.code === Number(text)) || {}).name || oldPriceTypeMap[text]),
    },
    {
      title: '合同价价格',
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (text, record) => {
        const { currencyMap, timeUnitMap } = this.state;
        const { pricetype, prices, productUnitDes, timeunit, currency } = record;
        return !Array.isArray(prices) ? null : prices.map((p, i) => {
          switch (Number(pricetype)) {
            case 1:
              return <div>{p.cnt}{productUnitDes}，{p.chinaPrice}{currencyMap[currency]}/{timeUnitMap[timeunit]}</div>;
            case 2:
              return <div>{p.chinaPrice}{currencyMap[currency]}/{productUnitDes}/{timeUnitMap[timeunit]}</div>;
            case 3: // 老的到达阶梯价，切换新的后要确认是否可以删除这段代码
            case 5:
              return <div>{p.low}{i + 1 === prices.length ? `${productUnitDes}以上` : `-${p.high}${productUnitDes}`}，价格{p.chinaPrice}{currencyMap[currency]}/{productUnitDes}/{timeUnitMap[timeunit]}</div>;
            case 7:
              switch (p.pricetype) {
                case 2:
                  return <div>{p.low}{i + 1 === prices.length ? `${productUnitDes}以上` : `-${p.high}${productUnitDes}`}，价格{p.chinaPrice}{currencyMap[currency]}/{productUnitDes}/{timeUnitMap[timeunit]}</div>;
                case 1:
                  return <div>{p.low}{i + 1 === prices.length ? `${productUnitDes}以上` : `-${p.high}${productUnitDes}`}，价格{p.chinaPrice}{currencyMap[currency]}/{timeUnitMap[timeunit]}</div>;
                case 6:
                  return <div>{p.low}{i + 1 === prices.length ? `${productUnitDes}以上` : `-${p.high}${productUnitDes}`}，在{p.chinaPrice}{currencyMap[currency]}/{timeUnitMap[timeunit]}的基础上，每增加{p.chinaStepSize}{productUnitDes}，增加{p.chinaStepPrice}{currencyMap[currency]}/{timeUnitMap[timeunit]}</div>;
                default:
                  return null;
              }
            default:
              return null;
          }
        });
      }
    },
    {
      title: '折扣',
      dataIndex: 'Discount',
      key: 'Discount',
      width: 80,
      render: text => (text ? `${text}%` : ''),
    },
    {
      title: '优先级',
      dataIndex: 'UpdateTime',
      key: 'UpdateTime',
      width: 120,
      render: (text, record) => {
        const map = {
          keep: '优先级保持不变',
          highest: '优先级设为最高（当前时间）',
          customize: '自定义优先级',
        };
        const { priority, customizePriority } = record;
        let html = map[priority] || text;
        if (priority === 'customize') {
          html += `：${customizePriority && moment(customizePriority).isValid() ? customizePriority : ''}`;
        }
        return html;
      },
    },
    {
      title: '生效时间',
      dataIndex: 'BeginTime',
      key: 'BeginTime',
      width: 150,
    },
    {
      title: '失效时间',
      dataIndex: 'EndTime',
      key: 'EndTime',
      width: 150,
    },
  ];

  componentDidMount() {
    // 判断是否有权限
    getUserAuth({ opId: 36, needApply: 0, needLogin: 1 })
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
        this.setState({
          loading: false,
        });
        message.error(`权限获取失败${err.message}`);
        console.log('err', err);
      });

    const Id = Util.getSearchValueByName('Id');
    const Type = Util.getSearchValueByName('Type');
    if (Id && Type) {
      const searchParams = { Type, Id: Id.split(',') };
      Api.searchDiscount(searchParams)
        .then((res = {}) => {
          const { data = {}, code } = res;
          if (code === 0) {
            const discountList = Array.isArray(data) ? data : data.rows;
            const operation = Util.getSearchValueByName('operation');
            this.handleDatas(operation, discountList);
          } else {
            throw res;
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({ discountLoading: false });
          message.error(`获取折扣信息失败！${(err.message || err)}`);
        });
    }

    Promise.all([Api.queryProductList(), Api.getDiscountConfig()])
      .then((res) => {
        const [pro, con] = res;
        let productList = [];
        let config = {};
        if (pro.code === 0) {
          productList = pro.data.infos;
        } else {
          message.error(pro.message);
        }
        if (con.code === 0) {
          config = con.data;
        } else {
          message.error(con.message);
        }
        const { payModeMap, timeUnitMap, OperList, typeMap, currencyMap, preferentialTypeMap, priceType } = config;
        this.setState({
          loading: false,
          productList,
          OperList,
          typeMap,
          priceType,
          payModeMap,
          timeUnitMap,
          currencyMap,
          preferentialTypeMap,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        message.error(`获取产品信息出错！${err.message}`);
      });
  }

  // 处理复制或者编辑的数据
  handleDatas(handleType, data) {
    let UserId = '';
    let curType = '';
    let ActivityId = '';
    let isEdit = false;
    let isCopy = false;
    if (handleType === 'edit') {
      isEdit = true;
    } else {
      isCopy = true;
    }

    const DiscountList = data.map((discount) => {
      const {
        FId,
        owner_class,
        product_code,
        product_name,
        sub_product_code,
        sub_product_name,
        sub_billing_item_code,
        sub_billing_item_name,
        billing_item_code,
        billing_item_name,
        FBeginTime,
        FEndTime,
        FRemark,
        FConditions = [],
        FUpdateTime,
        FUserId,
        preferentialType = '',
        FDiscount,
        FConflict,
        Type,
        pricePidDetail,
        pricetypeName,
        FActivityId,
      } = discount;

      let payMode;
      const ConditionList = [];
      FConditions.forEach((con) => {
        const { FKey, FValue, FOper, FKeyName, FValueName } = con;
        if (FKey === 'payMode') {
          payMode = FValue;
        } else if (FValue) {
          let condition = {
            Key: FKey,
            KeyName: FKeyName,
            Oper: FOper,
          };
          const val = FValue.split(',');
          const valName = FValueName.split(',');
          if (['in range', 'not in range'].indexOf(FOper) > -1) {
            condition = {
              ...condition,
              range1: val[0],
              range2: val[1],
              range1Name: valName[0],
              range2Name: valName[1],
            };
          } else if (['in', 'not in'].indexOf(FOper) > -1) {
            condition.Value = val;
            condition.ValueName = valName;
          } else {
            condition.Value = FValue;
            condition.ValueName = FValueName;
          }
          ConditionList.push(condition);
        }
      });
      const pd = pricePidDetail ? JSON.parse(pricePidDetail) : [];
      const { prices = [], product = {} } = (pd[0] || {});
      const { timeunit, productUnitDes, currency } = prices[0] || {};
      const newPrices = prices.map(p => ({
        ...p,
        chinaPrice: p.price,
        pricetype: [3, 7].indexOf(product.pricetype) > -1 ? 2 : '',
      }));
      const proKeys = ['product_code', 'sub_product_code', 'billing_item_code', 'sub_billing_item_code'];
      const showProducts = [];
      proKeys.forEach((k) => {
        const v = discount[k];
        if (v && v !== '*') {
          showProducts.push(v);
        }
      });
      const strPreferentialType = isNaN(preferentialType) ? preferentialType : preferentialType.toString();

      let item = {
        owner_class,
        product_code,
        product_name,
        sub_product_code,
        sub_product_name,
        sub_billing_item_code,
        sub_billing_item_name,
        billing_item_code,
        billing_item_name,
        showProducts,
        BeginTime: FBeginTime,
        EndTime: FEndTime,
        Remark: FRemark,
        ConditionList,
        Discount: FDiscount,
        Conflict: FConflict,
        Type,
        payMode: strPreferentialType === '0' && !!payMode ? payMode.split(',') : payMode,
        preferentialType: strPreferentialType,
        timeunit,
        productUnitDes,
        currency,
        pricetype: product.pricetype === 3 ? 7 : product.pricetype, //3是老的到达阶梯价
        pricetypeName,
        prices: newPrices,
        UpdateTime: FUpdateTime,
        priority: 'keep',
      };
      if (isEdit) {
        curType = Type;
        UserId = FUserId ? FUserId.split(',') : '';
        ActivityId = FActivityId;
        item = {
          ...item,
          Id: FId,
        };
      }
      return item;
    });
    this.setState({
      isEdit,
      isCopy,
      UserId,
      ActivityId,
      DiscountList,
      Type: curType,
      discountLoading: false,
    });
  }

  onChangeState = (obj, callback) => {
    this.setState((prevState) => {
      const data = {
        ...prevState,
        ...obj,
      };
      return data;
    }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  handleChange(key, val) {
    let obj = {};
    if (key === 'Remark') {
      obj = { [key]: val.target.value };
    } else if (key === 'Type') {
      const { isCopy, DiscountList } = this.state;
      const { value } = val.target;
      obj = {
        [key]: value,
        UserId: '',
        ActivityId: '',
        DiscountList: isCopy ? DiscountList : [],
      };
    } else if (key === 'ActivityId') {
      const { value } = val.target;
      if (/^[0-9]*$/.test(value)) {
        obj = { [key]: value };
      }
    } else if (key === 'UserId') {
      const { value } = val.target;
      const UserIdList = Util.handleUserIds(value);
      obj = { [key]: UserIdList };
    } else {
      obj = { [key]: val };
    }
    this.setState(obj);
  }

  getDiscountTableAttr() {
    const { submitSuccess, Type, UserId = [], ActivityId, conditionData, isEdit, typeMap, OperList, DiscountList = [] } = this.state;
    const showColumns = [...this.columns]; // 对象类型不能直接赋值，否则修改showColumns的值后， columns 也会被污染
    if (DiscountList.some(d => Array.isArray(d.conflictDiscountIds) && d.conflictDiscountIds.length > 0)) {
      showColumns.unshift({
        title: '冲突的折扣 ID',
        dataIndex: 'conflictDiscountIds',
        key: 'conflictDiscountIds',
        width: 120,
        render: (text = []) => {
          if (text.length > 0) {
            return <a style={{ textDecorationLine: 'underline' }} onClick={() => window.open(`/discountTool/index?Id=${text}&Type=${Type}&UserId=${UserId}&ActivityId=${ActivityId}`, '_blank')}>{`${text}`}</a >;
          }
          return null;
        },
      });
    }
    const conIndex = _.findIndex(showColumns, col => col.key === 'ConditionList');
    // 为了拿 conditionData 进行匹配
    showColumns[conIndex] = {
      ...showColumns[conIndex],
      render: (text = []) => {
        const arr = [];
        text.forEach((con) => {
          // 条件非必选，若是一整行都没有数据，则不处理
          const { Key, Value, Oper, range1, range2 } = con;
          const noValue = (!Value && (!range1 || !range2)) || (Array.isArray(Value) && Value.length === 0);
          if (Key && Oper && !noValue) {
            let arrValue = Value;
            if (!Value) {
              arrValue = [range1, range2];
            } else if (!Array.isArray(Value)) {
              arrValue = [Value];
            }
            let KeyName = Key;
            const ValueName = arrValue.map((v) => {
              if (conditionData) {
                const list = _.find(conditionData[Key], c => c.FKey === Key && c.FValue === v);
                if (list) {
                  KeyName = list.FKeyName;
                  return list.FValueName;
                }
              }
              return v;
            });
            arr.push(<div>{KeyName}：{OperList[Oper]} [{ValueName.join(',')}]</div>);
          }
        });
        return arr;
      },
    };
    if (submitSuccess) {
      if (Type === 'activity') {
        showColumns.unshift({
          title: '活动ID',
          dataIndex: 'ActivityId',
          key: 'ActivityId',
          width: 80,
          render: () => ActivityId,
        });
      } else if (Type === 'user') {
        showColumns.unshift({
          title: '客户UIN',
          dataIndex: 'UserId',
          key: 'UserId',
          width: 100,
          render: () => UserId.join(','),
        });
      }
      showColumns.unshift({
        title: '优惠对象',
        dataIndex: 'Type',
        key: 'Type',
        width: 100,
        render: () => typeMap[Type],
      });
    } else {
      showColumns.push({
        title: '操作',
        dataIndex: 'Operation',
        key: 'Operation',
        fixed: 'right',
        width: 120,
        render: (text, record, index) => {
          return (
            <React.Fragment>
              <Button size="small" type="primary" style={{ margin: '0 5px 5px 0' }} onClick={() => this.editDiscount(index)}>编辑</Button>
              {
                isEdit
                  ?
                  null
                  :
                  <Button type="primary" size="small" onClick={() => this.deleteDiscountItem(index)}>删除</Button>
              }
            </React.Fragment>
          );
        },
      });
    }
    const scroll = {
      x: showColumns.reduce((pre, cur = {}) => pre + (cur.width || 100), 0),
    };
    return { showColumns, scroll };
  }

  // 编辑折扣
  editDiscount(index) {
    this.setState({
      showDiscountItem: true,
      currentDiscountIndex: index,
    });
  }

  // 删除折扣
  deleteDiscountItem(index) {
    const { DiscountList = [] } = this.state;
    DiscountList.splice(index, 1);
    this.setState(DiscountList);
  }

  showDiscountItemModal() {
    this.setState(prev => ({
      currentDiscountIndex: prev.DiscountList.length,
      showDiscountItem: !prev.showDiscountItem,
    }));
  }

  validate() {
    const { DiscountList = [], Type, UserId = [], ActivityId } = this.state;
    const tipMap = {
      Creator: '请先登录',
      Type: '请选择优惠对象',
    };
    const flag = Object.keys(tipMap).every((key) => {
      if (!this.state[key]) {
        message.error(tipMap[key]);
        return false;
      }
      return true;
    });
    if (!flag) {
      return false;
    }
    if (Type === 'user' && UserId.length === 0) {
      message.error('请输入客户UIN');
      return false;
    }
    if (Type === 'activity' && !ActivityId) {
      message.error('请输入活动ID');
      return false;
    }
    if (DiscountList.length === 0) {
      message.error('请至少添加一条优惠配置');
      return false;
    }
    return true;
  }

  // 拼接要提交的参数
  processData(isForceAdd = 0) {
    const { Type, DiscountList, Creator, is_new_discount, discount_origin, conditionData, UserId, ActivityId, isEdit } = this.state;
    let params = [];
    const conflictIndexs = {}; // 若是提交时有冲突，需要和冲突的 conflictDiscountIds 对应上
    DiscountList.forEach((discount, index) => {
      const { Id, owner_class = '*', product_code, sub_product_code, billing_item_code, sub_billing_item_code, BeginTime, EndTime, Remark, ConditionList = [], payMode, preferentialType, Conflict, Discount, productUnitDes, prices = [], timeunit, pricetype, priority, UpdateTime, customizePriority, currency } = discount;
      const data = { owner_class, product_code, sub_product_code, billing_item_code, sub_billing_item_code, BeginTime, EndTime, Remark, Creator, is_new_discount, discount_origin, preferentialType };
      data.ConditionList = Util.processConditionList(ConditionList, conditionData);
      if (isEdit) {
        data.Id = Id;
      }
      if (Type === 'user') {
        data.UserId = UserId;
        data.Conflict = preferentialType === '0' ? Conflict : '1'; //合同价都是冲突的
        if (priority === 'keep') {
          data.UpdateTime = UpdateTime;
        } else if (priority === 'highest') {
          data.UpdateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        } else {
          data.UpdateTime = customizePriority;
        }
      } else if (Type === 'activity') {
        data.ActivityId = ActivityId;
      }

      if (preferentialType === '0') { // 折扣
        data.Discount = Discount;
        payMode.forEach((p) => {
          conflictIndexs[params.length] = index;
          params.push({
            ...data,
            ConditionList: [
              ...data.ConditionList,
              {
                Key: 'payMode',
                KeyType: 'string',
                Oper: '=',
                Value: p,
              },
            ],
          });
        });
      } else {
        const newPrice = prices.map((p) => {
          const { chinaPrice, low, high, cnt } = p;
          const item = {
            platform: '1', // 平台:1:云平 , 0:开平
            payMode,
            productUnitDes,
            timeunit,
            currency,
            price: chinaPrice,
            cnt: pricetype === '1' ? cnt : '1', // 指定价格需要,指定每几个基本单位单价多少, 其他类型都传:1
          };
          if (!isNaN(low) || low) {
            item.low = low.toString();
          }
          if (high) {
            item.high = high;
          }
          return item;
        });
        const finalPricetype = Number(pricetype) === 7 ? 3 : pricetype; // 组件是用的新版的，接口是用的老版的，新版到达阶梯价是7，老版阶梯价格是3
        const pricePidPara = { pricetype: finalPricetype, prices: newPrice };

        conflictIndexs[params.length] = index;
        params.push({
          ...data,
          pricePidPara,
          ConditionList: [
            ...data.ConditionList,
            {
              Key: 'payMode',
              KeyType: 'string',
              Oper: '=',
              Value: payMode,
            },
          ],
        });
      }
    });
    if (Type === 'user') {
      const newData = [];
      UserId.forEach((item) => {
        params.forEach((p, i) => {
          conflictIndexs[newData.length] = conflictIndexs[i];
          newData.push({
            ...p,
            UserId: item,
          });
        });
      });
      params = newData;
    }
    params = {
      isForceAdd,
      addUserRtx: Creator,
      discountPara: params,
    };
    return { params, conflictIndexs };
  }

  // 提交
  handleSubmit() {
    this.setState({
      showConfirm: this.validate(),
    });
  }

  save(isForceAdd) {
    if (this.state.confirmLoading) {
      return;
    }
    const { Type, isEdit, DiscountList = [] } = this.state;
    const { params, conflictIndexs } = this.processData(isForceAdd);  //isForceAdd：是否强制提交
    let func;
    switch (Type) {
      case 'common':
        func = !isEdit ? 'saveCommonDiscountForFourLayerPro' : 'updateCommonDiscountForFourLayerPro';
        break;
      case 'user':
        func = !isEdit ? 'saveUserDiscountForFourLayerPro' : 'updateUserDiscountForFourLayerPro';
        break;
      case 'activity':
        func = !isEdit ? 'saveActivityDiscountForFourLayerPro' : 'updateActivityDiscountForFourLayerPro';
        break;
      default:
        func = null;
    }
    this.setState({ confirmLoading: true }, () => {
      Api[func](params)
        .then((res) => {
          if (res.code === 0) {
            this.setState({
              submitSuccess: true,
              showConfirm: false,
              confirmLoading: false,
              publishIds: isEdit ? DiscountList.map(item => item.Id) : res.data,
              isForceAdd: false,
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          console.log(e);
          let tip = `提交出错！${e.message}`;
          // 600000:新增的时候折扣冲突处理，接口文档：http://tapd.oa.com/pt_jifei/markdown_wikis/#1010140771008427921
          let conflictDiscountIds = [];
          const idMaps = [];
          if (e.code === 600000 || e.code === 600001) {
            conflictDiscountIds = e.data.discountIds;
            for (const i in conflictIndexs) {
              if (Array.isArray(idMaps[conflictIndexs[i]])) {
                idMaps[conflictIndexs[i]] = [...new Set([...idMaps[conflictIndexs[i]], ...conflictDiscountIds[i]])]; //数组去重
              } else {
                idMaps[conflictIndexs[i]] = [...conflictDiscountIds[i]];
              }
            }
            tip = '提交出错，折扣冲突';
          }
          message.error(tip);
          this.setState(prev => ({
            ...prev,
            confirmLoading: false,
            showConfirm: false,
            isForceAdd: e.code === 600000 ? conflictDiscountIds.some((ids = []) => ids.length > 0) : 0,
            DiscountList: prev.DiscountList.map((item, index) => ({
              ...item,
              conflictDiscountIds: idMaps[index] || [],
            }))
          }));
        });
    });
  }

  // 立即发布
  publish() {
    const { loading, publishIds = [], Type, Creator } = this.state;
    if (loading) {
      return;
    }
    const params = publishIds.map(Id => ({ Id, Type, Creator, Status: 1 }));
    this.setState({ loading: true }, () => {
      Api.updateDiscountBatch(params)
        .then((res) => {
          if (res.code === 0) {
            this.setState({
              loading: false,
              publishSuccess: true,
            });
          } else {
            throw res;
          }
        })
        .catch((err) => {
          message.error(`发布失败${err}`);
          this.setState({
            loading: false,
            confirmLoading: false,
          });
        });
    });
  }

  render() {
    const {
      hasPermission,
      applyPermissionLink,
      loading,
      discountLoading,
      Type,
      ActivityId = '',
      UserId,
      DiscountList,
      showConfirm,
      confirmLoading,
      productList,
      userVerifyName,
      currentDiscountIndex,
      showDiscountItem,
      conditionData,
      submitSuccess,
      publishSuccess,
      isEdit,
      isCopy,
      typeMap = {},
      OperList,
      payModeMap,
      timeUnitMap,
      preferentialTypeMap,
      priceType,
      is_new_discount,
      isForceAdd,
    } = this.state;

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

    const labelColSpan = 2;
    const { showColumns, scroll } = this.getDiscountTableAttr();

    return (
      <Spin spinning={loading && discountLoading}>
        {
          !submitSuccess
            ?
            (
              <Card bodyStyle={{ padding: '10px 15px' }} title={isEdit ? '编辑折扣&合同价' : '新增折扣&合同价'} bordered={false}>
                <Row className={styles.mrbottom15}>
                  <Col span={labelColSpan}>
                    <div>优惠对象<span style={{ color: 'red' }}>*</span></div>
                  </Col>
                  <Col>
                    <RadioGroup
                      value={Type}
                      disabled={isEdit}
                      onChange={this.handleChange.bind(this, 'Type')}
                    >
                      {
                        Object.keys(typeMap).map(key => (<Radio value={key} key={key}>{typeMap[key]}</Radio>))
                      }
                    </RadioGroup>
                  </Col>
                </Row>
                <TypeItems
                  Api={Api}
                  Type={Type}
                  styles={styles}
                  isEdit={isEdit}
                  UserId={UserId}
                  loading={loading}
                  ActivityId={ActivityId}
                  userVerifyName={userVerifyName}
                  onChange={this.handleChange.bind(this)}
                  onChangeState={this.onChangeState}
                />
                <div>
                  {
                    !isEdit
                      ?
                      (<Button style={{ margin: '10px 0' }} onClick={this.showDiscountItemModal.bind(this)}>+ 添加优惠配置</Button>)
                      :
                      null
                  }
                </div>
                <DiscountItemForFLP
                  Type={Type}
                  isEdit={isEdit}
                  isCopy={isCopy}
                  OperList={OperList}
                  priceType={priceType}
                  payModeMap={payModeMap}
                  timeUnitMap={timeUnitMap}
                  productList={productList}
                  DiscountList={DiscountList}
                  conditionData={conditionData}
                  is_new_discount={is_new_discount}
                  onChangeState={this.onChangeState}
                  showDiscountItem={showDiscountItem}
                  discountIndex={currentDiscountIndex}
                  preferentialTypeMap={preferentialTypeMap}
                  deleteDiscountItem={this.deleteDiscountItem.bind(this)}
                />
                <Table
                  bordered
                  size="small"
                  scroll={scroll}
                  pagination={false}
                  columns={showColumns}
                  dataSource={DiscountList}
                  style={{ marginTop: '10px' }}
                  rowKey={(record, index) => index}
                />
                <div style={{ margin: '10px 0' }}>
                  <Button type="primary" style={{ marginRight: '30px' }} onClick={this.handleSubmit.bind(this)}>确认提交</Button>
                  <Link to="/discountTool/index">
                    <Button>取消</Button>
                  </Link>
                </div>
                <Modal
                  maskClosable={false}
                  title={isForceAdd ? '提交失败' : '确认提交折扣信息'}
                  visible={showConfirm || isForceAdd}
                  onOk={this.save.bind(this, isForceAdd ? 1 : 0)}
                  onCancel={() => { this.setState({ showConfirm: false, isForceAdd: false }); }}
                  confirmLoading={confirmLoading}
                  okText={isForceAdd ? '强制提交' : '确认'}
                  cancelText="取消"
                >
                  {
                    isForceAdd
                      ?
                      (<p style={{ color: 'red' }}>提交失败，有可能相互覆盖的折扣存在，请确认是否强制提交</p>)
                      :
                      (
                        <React.Fragment>
                          <p>保存策略将<span style={{ color: 'red' }}>同步到现网！且生效后无法修改，请确认已检测策略无误！</span> </p>
                          <p style={{ color: 'red' }}>点击保存后，折扣为待生效状态，需要再次确认修改为生效状态。</p>
                        </React.Fragment>
                      )
                  }
                </Modal>
              </Card >
            )
            :
            (
              <Card bodyStyle={{ padding: '10px 15px' }} bordered={false}>
                <h5 style={{ fontSize: '24px', textAlign: 'center' }}><Icon type="check-circle" theme="filled" style={{ color: '#4dde17', marginRight: '15px' }} />提交成功</h5>
                <p style={{ margin: '25px 0 10px 0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>你可以发布提交成功的优惠信息，使其立即生效</p>
                <Table
                  bordered
                  size="small"
                  scroll={scroll}
                  pagination={false}
                  columns={showColumns}
                  dataSource={DiscountList}
                  rowKey={(record, index) => index}
                />
                <div style={{ margin: '25px 0', textAlign: 'center' }}>
                  <Button type="primary" style={{ marginRight: '30px' }} onClick={this.publish.bind(this)}> 立即发布</Button>
                  <Link to="/discountTool/index">
                    <Button>以后再说</Button>
                  </Link>
                </div>
                <Modal
                  visible={publishSuccess}
                  maskClosable={false}
                  cancelText="继续申请优惠"
                  okText="查询优惠"
                  onOk={() => { this.props.history.push('/discountTool/index'); }}
                  onCancel={() => { window.location.reload(); }}
                  title={<h5 style={{ fontSize: '16px' }}><Icon type="check-circle" theme="filled" style={{ color: '#4dde17', marginRight: '15px' }} />提交成功</h5>}
                >
                  <p>优惠配置已生效，可以去优惠查询页面查看或编辑。</p>
                </Modal>
              </Card>
            )
        }
      </Spin >
    );
  }
}

