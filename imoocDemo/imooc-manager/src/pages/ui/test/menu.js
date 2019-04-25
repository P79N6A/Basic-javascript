/**
 * 折扣配置菜单配置
 * @author shirleyyu
 * @date 2018-05-29
 */

module.exports = [{
  name: '总览页',
  icon: 'home',
  path: 'index',
  target: '_self'
}, {
  name: '计费运营',
  icon: 'profile',
  path: '/',
  children: [{
    name: '折扣管理',
    icon: 'pay-circle-o',
    path: 'discountTool/index',
  }, {
    name: '优惠条件管理',
    icon: 'setting',
    path: 'discountTool/condition',
  }, {
    name: '账务级优惠',
    icon: 'setting',
    path: 'discountTool/account',
  }],
}];
