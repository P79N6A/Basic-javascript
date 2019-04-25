/**
 *页面配置
 *
 * @author shirleyyu
 */

const copyright = 'PM：lyronksun，产品：cathyxcheng，前台: shirleyyu&h_QCloudBilling_Web_Helper，后台：h_QCloudBilling_Helper';

// 非现网环境，去掉权限验证
const needAuthHost = 'tcb.oa.com';

// 输入折扣时的正则判断,0-100，最多4位小数
const numberFloatInputExp = /^(([1-9]\d?|0)(\.\d{0,4})?|100(\.0{0,4})?)?$/;

// 输入完成的正则判断，小于100，最多4位小数
const numberFloatExp = /^(([1-9]\d?|0)(\.\d{1,4})?|100(\.0{1,4}))$/;

// 付费模式
const localPayModeMap = {
  prepay: '预付费',
  postpay: '后付费',
};

const localOperList = {
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

const localCurrencyMap = {
  CNY: '元',
  USD: '美元',
};

// 时间单位, 1:年 2:月 3:日 4:小时 5:分钟 6:秒 7:打包价与时间无关
const localTimeUnitMap = {
  1: '年',
  2: '月',
  3: '日',
  4: '小时',
  5: '分钟',
  6: '秒',
};

const oldPriceTypeMap = {
  3: '到达阶梯价',
};

export {
  copyright,
  needAuthHost,
  numberFloatInputExp,
  numberFloatExp,
  localPayModeMap,
  localOperList,
  localCurrencyMap,
  localTimeUnitMap,
  oldPriceTypeMap,
};
