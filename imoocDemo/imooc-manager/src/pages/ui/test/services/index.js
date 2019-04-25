/**
 * @description 折扣管理相关接口
 * @author shirleyyu
 */

import Net from '../libraries/net';
import request from '../../../utils/request';
import Util from '../libraries/util';

export default {
  // 搜索折扣
  async searchDiscount(params) {
    const res = await Net.post('/discountManagement/searchDiscount', params);
    return res;
  },

  // 获取condition参数列表
  async searchCondition(params) {
    const res = await Net.post('/discountBilling/searchCondition', params);
    return res;
  },

  /**
   * 搜索四层产品列表 query_product_list
   * 接口文档：http://tapd.oa.com/10140771/markdown_wikis/view/#1010140771007417223
   */
  async queryProductList(option = {}) {
    const params = {
      method: 'POST',
      body: {
        seqId: Util.getSeqId(),
        caller: 'discountTool-product4Level',
        param: {
          ...option,
        },
      },
    };

    const res = await request('/api/product4Level/queryProductList', params);
    return res;
  },

  // 激活/废弃折扣
  async activateDiscount(params) {
    const res = await Net.post('/discountBilling/activateDiscount', params);
    return res;
  },

  // 保存用户折扣
  async saveUserDiscount(params) {
    const res = await Net.post('/discountBilling/saveUserDiscount', params);
    return res;
  },

  // 保存官网折扣
  async saveCommonDiscount(params) {
    const res = await Net.post('/discountBilling/saveCommonDiscount', params);
    return res;
  },

  // 保存活动折扣
  async saveActivityDiscount(params) {
    const res = await Net.post('/discountBilling/saveActivityDiscount', params);
    return res;
  },

  // 获取保存在 server 端的折扣配置
  async getDiscountConfig(params) {
    const res = await Net.post('/discountManagement/getDiscountConfig', params);
    return res;
  },

  // 查询条件模版-qcloud.discount.getConditionTempList，http://tapd.oa.com/pt_jifei/markdown_wikis/view/#1010140771007993023
  async getConditionTempList(params) {
    const res = await Net.post('/discountManagement/getConditionTempList', params);
    return res;
  },
  // 新增条件模版记录
  async addConditionTemp(params) {
    const res = await Net.post('/discountManagement/addConditionTemp', params);
    return res;
  },
  // 查询全量折扣条件key
  async getConditionTempKey(params) {
    const res = await Net.post('/discountManagement/getConditionTempKey', params);
    return res;
  },
  // 修改key
  async updateConditionTempKey(params) {
    const res = await Net.post('/discountManagement/updateConditionTempKey', params);
    return res;
  },
  // 修改模版value
  async updateConditionTempValue(params) {
    const res = await Net.post('/discountManagement/updateConditionTempValue', params);
    return res;
  },
  // 快速批量修改折扣、续期
  async updateDiscountBatch(params) {
    const res = await Net.post('/discountManagement/updateDiscountBatch', params);
    return res;
  },
  // 导入用户折扣指定价类折扣
  async importUserDiscountPricePid(params) {
    const res = await Net.post('/discountManagement/importUserDiscountPricePid', params);
    return res;
  },
  // 导入用户折扣值类折扣
  async importUserDiscount(params) {
    const res = await Net.post('/discountManagement/importUserDiscount', params);
    return res;
  },
  // 批量查询实名认证名称--qcloud.discount.getVerifyNameBatch
  async getVerifyNameBatch(params) {
    const res = await Net.post('/discountManagement/getVerifyNameBatch', params);
    return res;
  },
  // 新增产品四层用户折扣--qcloud.discount.saveUserDiscount
  async saveUserDiscountForFourLayerPro(params) {
    const res = await Net.post('/discountManagement/saveUserDiscountForFourLayerPro', params);
    return res;
  },
  // 新增产品四层官网折扣
  async saveCommonDiscountForFourLayerPro(params) {
    const res = await Net.post('/discountManagement/saveCommonDiscountForFourLayerPro', params);
    return res;
  },
  // 新增产品四层活动折扣
  async saveActivityDiscountForFourLayerPro(params) {
    const res = await Net.post('/discountManagement/saveActivityDiscountForFourLayerPro', params);
    return res;
  },
  // 批量更新产品四层用户折扣
  async updateUserDiscountForFourLayerPro(params) {
    const res = await Net.post('/discountManagement/updateUserDiscountForFourLayerPro', params);
    return res;
  },
  // 新增产品四层官网折扣
  async updateCommonDiscountForFourLayerPro(params) {
    const res = await Net.post('/discountManagement/updateCommonDiscountForFourLayerPro', params);
    return res;
  },
  // 新增产品四层活动折扣
  async updateActivityDiscountForFourLayerPro(params) {
    const res = await Net.post('/discountManagement/updateActivityDiscountForFourLayerPro', params);
    return res;
  },

};
