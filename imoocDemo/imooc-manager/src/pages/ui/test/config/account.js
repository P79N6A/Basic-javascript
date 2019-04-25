/**
 * 账户级优惠配置
 */

const accountStatusMap = {
  1: '草稿',
  2: '待生效',
  3: '生效中',
  4: '审核失败',
  5: '已失效',
  6: '删除',
};
//阶梯累计对象
const cumulativeMap = {
  1: '用量*时长求和',
  2: '刊列价求和',
  3: '用量求和',
};
//付费模式
const payTypeMap = {
  0: '后付费',
  1: '预付费',
  5: '竞价实例',
};
//优惠类型映射
const preMethodMap = {
  1: '折扣',
  2: '合同价',
  3: '满返',
};
//价格模型映射
const priceModelMap = {
  1: '线性',
  2: '到达阶梯',
  3: '累进阶梯',
};
export {
  accountStatusMap, cumulativeMap, payTypeMap, preMethodMap, priceModelMap
};
