/*eslint no-restricted-globals: 0 */
import Crypto from 'crypto';
import _ from 'lodash';
import { GetAccountInfoByFieldsApi } from '../services/account';

export default {
  getSeqId() {
    const seqId = this.md5ToUuid(this.getMd5());
    return seqId;
  },

  getMd5() {
    const md5 = Crypto.createHash('md5');
    const t = new Date().getTime();
    const r = Math.random() + Math.random();
    return md5.update(`${t}${r}`).digest('hex');
  },

  md5ToUuid(pMd5Str) {
    let md5Str = pMd5Str;
    md5Str += '';
    md5Str = md5Str.replace(/^(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/,
      '$1-$2-$3-$4-$5'
    );
    return md5Str;
  },

  /**
   * 获取时间戳，单位：秒
   * shirleyyu
   */
  timestampForSeconds(time) {
    const current = time || new Date();
    return Date.parse(current) / 1000;
  },

  /**
   * 四层产品中获取关联的四层信息列表
   * @param key:product_code/sub_product_code/billing_item_code/sub_billing_item_code
   *  values:{key 的value}
   * @author shirleyyu
   */
  getItemFromFLProduct(productList, key, values = {}) {
    const {
      product_code,
      sub_product_code,
      billing_item_code,
    } = values;

    let list = [];
    const currentProduct = _.find(productList, item => item.product.product_code === product_code) || {};
    const { product, sub_products, billing_items, sub_billing_items, relation = [] } = currentProduct;
    const mapRelation = [];
    switch (key) {
      case 'product_code':
        list = product;
        break;
      case 'sub_product_code':
        list = sub_products;
        break;
      case 'billing_item_code':
        relation.forEach((item) => {
          if (
            item.product_code === product_code &&
            item.sub_product_code === sub_product_code &&
            mapRelation.indexOf(item.billing_item_code) === -1
          ) {
            mapRelation.push(item.billing_item_code);
          }
        });
        list = _.filter(
          billing_items,
          item => mapRelation.indexOf(item.billing_item_code) > -1
        );
        break;
      case 'sub_billing_item_code':
        relation.forEach((item) => {
          if (
            item.product_code === product_code &&
            item.sub_product_code === sub_product_code &&
            item.billing_item_code === billing_item_code &&
            mapRelation.indexOf(item.sub_billing_item_code) === -1
          ) {
            mapRelation.push(item.sub_billing_item_code);
          }
        });
        list = _.filter(
          sub_billing_items,
          item => mapRelation.indexOf(item.sub_billing_item_code) > -1
        );
        break;
      default:
        list = [];
    }
    return list || [];
  },

  /**
   * 判断是否符合折扣等优惠的续期条件：折扣到期前90天或折扣已过期并且有效，才可进行折扣续期操作
   * shirleyyu
   */
  allowRenewal(record = {}) {
    const currentTime = new Date().getTime();
    if (Object.keys(record).length > 0 && (new Date(record.FEndTime).getTime() - currentTime) / (1000 * 60 * 60 * 24) <= 90 && (record.FStatus || '').toString() !== '2') {
      return true;
    }
    return false;
  },

  /**
   * 处理输入的客户UIN、id 等：多个 UIN使用英文逗号或回车符分开
   */
  handleUserIds(value) {
    let UserIdList;
    const val = value.trim();
    if (!!val) {
      let list = val.split('\x0a');
      const splitMap = [',', '，'];
      splitMap.forEach((s) => {
        if (val.indexOf(s) > -1) {
          UserIdList = [];
          list.forEach((v) => {
            UserIdList = UserIdList.concat(v.split(s));
          });
          list = UserIdList;
        }
      });
      UserIdList = [];
      list.forEach((v) => {
        if (!!v.trim() && !isNaN(v)) {
          UserIdList.push(v.trim());
        }
      });
    }
    return UserIdList;
  },

  /**
   * 处理要提交的条件数据
   */
  processConditionList(list = [], conditionData) {
    const ConditionList = [];
    _.each(list, (con) => {
      const { Key, Value, Oper, range1, range2 } = con;
      let FKeyType = 'string'; // 在列表、不在列表、在范围、不在范围，Oper 是 string
      let val = Value;
      // 条件非必选，若是一整行都没有数据，则不处理
      const noValue = (!Value && (!range1 || !range2)) || (Array.isArray(Value) && Value.length === 0);
      if (Key && Oper && !noValue) {
        if (Value) {
          if (Array.isArray(Value)) {
            val = Value.join(',');
          } else {
            const FKeyTypeItem = (conditionData[Key] || []).filter(cl => cl.FValue === Value);
            ({ FKeyType = 'string' } = (FKeyTypeItem[0] || {}));
            if (!isNaN(Value) && !['in', 'not in'].indexOf(Oper) > -1) {
              FKeyType = 'integer';
            }
          }
        } else if (_.indexOf(['in range', 'not in range'], Oper) > -1) {
          val = `${range1},${range2}`;
        }
        ConditionList.push({
          Key,
          KeyType: FKeyType,
          Oper,
          Value: val,
        });
      }
    });
    return ConditionList;
  },

  /**
   * 处理从后台取到的条件列表
   * @param {*} list 从后台获取的列表
   */
  handleConditionData(list = []) {
    const conditions = {};
    list.forEach((con) => {
      if (conditions[con.FKey]) {
        conditions[con.FKey].push(con);
      } else {
        conditions[con.FKey] = [con];
      }
    });
    return conditions;
  },

  /**
   * 根据 name 获取 url 中的 search 的 value 值
   */
  getSearchValueByName(name) {
    const match = location.search.match(new RegExp(`${name}=([^&]*)`));
    return (match && match[1]) || '';
  },

  /**
   * 使用 postMessage 带大数据跳转到新页面
   */
  jumpToNewWindowWithData(url, data, domain = '/') {
    const newWindow = window.open(url, '_blank');
    setTimeout(() => {
      newWindow.postMessage(JSON.stringify(data), domain);
    }, 4000);
  },

  /**
   * 根据 uin 查询用户信息
   * 云 API，接口文档：http://10.198.144.46/document/product/727/30108?!preview&!document=1
   * Fields:需要查询的信息域,详见接口文档
   */
  async GetAccountInfoByFields(uin = '', Fields = []) {
    const params = {
      serviceType: 'clouddc',
      version: 'v20180830',
      endpoint: 'clouddc.ap-guangzhou.api.tencentyun.com',
      action: 'GetAccountInfoByFields',
      regionId: 'ap-guangzhou',
      data: {
        Id: uin.toString(),
        Fields: Fields.length > 0 ? Fields : ['customer_info', 'account_info'],
      },
    };
    if (window.location.host !== 'tcb.oa.com') {
      params.protocol = 'http://';
      params.endpoint = 'clouddc.test.ap-guangzhou.api.tencentyun.com';
    }
    try {
      const res = await GetAccountInfoByFieldsApi(params);
      const json = JSON.parse(res.JsonString || '{}');
      return json;
    } catch (e) {
      console.log(`获取客户信息失败!${e.message || e}`);
      return e;
    }
  }
};

