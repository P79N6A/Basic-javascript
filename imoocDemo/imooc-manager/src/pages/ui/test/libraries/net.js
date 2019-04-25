/**
 * @description: 折扣相关的接口
 * @author: shirleyyu
 * @date: 2018-05-29
 */

import request from './request';
import Util from './util';
const $ = require('jquery');

export default {
  async post(iName, param = {}) {
    let data = param;
    const serviceType = iName.match(/^\/(\S*)\//)[1];
    if (serviceType === 'discountTool') {
      data = {
        caller: serviceType,
        seqId: Util.getSeqId(),
        ReqTime: Util.timestampForSeconds(),
        TransTime: Util.timestampForSeconds(),
        ...param,
      };
    }
    const res = await this.ajax(iName, data, 'POST');
    return res;
  },

  async get(iName, param = {}) {
    const data = {
      caller: 'discountTool',
      seqId: Util.getSeqId(),
      ...param,
    };
    const queryString = $.param(data);
    const res = await this.ajax(`${iName}?${queryString}`, null, 'GET');
    return res;
  },

  ajax(iName, data = {}, type = 'POST') {
    const url = `/api/discountTool${iName}`;
    return request(url, {
      method: type,
      body: data,
    });
  },
};
