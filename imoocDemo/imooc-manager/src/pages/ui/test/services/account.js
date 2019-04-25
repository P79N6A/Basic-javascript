/**
 * 账户级优惠相关的接口
 */
import Net from '../libraries/net';
import Util from '../libraries/util';
import request from '../libraries/request';

// 查询优惠规则
export async function queryRuleApi(params) {
  const res = await Net.post('/discountAccount/queryRule', params);
  return res;
}

// 修改优惠时间(续期)
export async function modifyRuleTimeApi(params) {
  const res = await Net.post('/discountAccount/modifyRuleTime', params);
  return res;
}

// 修改优惠状态
export async function modifyRuleStatusApi(params) {
  const res = await Net.post('/discountAccount/modifyRuleStatus', params);
  return res;
}

// 删除规则
export async function deleteRuleApi(params) {
  const res = await Net.post('/discountAccount/deleteRule', params);
  return res;
}

/**
 * 获取用户信息云 API
 * http://10.198.144.46/document/product/727/30108?!document=1&!preview
*/
export async function GetAccountInfoByFieldsApi(params) {
  const res = await request('/api/capi', {
    method: 'POST',
    body: params,
  });
  return res;
}

//获取产品四层中的第一层
export async function getProductList() {
  const params = {
    method: 'POST',
    body: {
      seqId: Util.getSeqId(),
      caller: 'discountTool-product4Level',
      param: {
        is_private_cloud: 0,
        is_public_cloud: 1
      },
    },
  };
  const res = await request('/api/product4Level/getProductList', params);
  return res;
}

//获取产品四层中的第二层
export async function getSubProductList(opts) {
  const params = {
    method: 'POST',
    body: {
      seqId: Util.getSeqId(),
      caller: 'discountTool-product4Level',
      param: {
        ...opts,
        is_private_cloud: 0,
        is_public_cloud: 1
      },
    },
  };
  const res = await request('/api/product4Level/getSubProductList', params);
  return res;
}

//获取产品四层中的第一层
export async function getBillingItemList(opts) {
  const params = {
    method: 'POST',
    body: {
      seqId: Util.getSeqId(),
      caller: 'discountTool-product4Level',
      param: {
        ...opts,
        is_private_cloud: 0,
        is_public_cloud: 1
      },
    },
  };
  const res = await request('/api/product4Level/getBillingItemList', params);
  return res;
}

//获取产品四层中的第一层
export async function getSubBillingItemList(opts) {
  const params = {
    method: 'POST',
    body: {
      seqId: Util.getSeqId(),
      caller: 'discountTool-product4Level',
      param: {
        ...opts,
        is_private_cloud: 0,
        is_public_cloud: 1
      },
    },
  };
  const res = await request('/api/product4Level/getSubBillingItemList', params);
  return res;
}
