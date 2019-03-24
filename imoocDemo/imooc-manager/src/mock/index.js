import Mock from 'mockjs';
// const mockdata = Mock.mock({
//   'list|1-10': [{
//     'id|+1': 1,
//   }]
// });
/**
 * Mock.mock( rurl, rtype, template )
 * rurl: 匹配路径
 * rtype: 请求类型: get post ...
 * template: 数据模板,返回响应数据
 */
let baseUrl = "http://www.mymock.com/";
export let mockTest = Mock.mock(`${baseUrl}getList`, 'get', {
  code: 0,
  msg: 'ok',
  'res|10': [
    {
      'id|+1': 1,
      userName: '@cname',
      'sex|1-2': 1,
      'state|1-5': 1,
      'hobby|+1': ['篮球', '足球', '冰盘七', '网球', '游泳'],
      'birthday': '@date',
      address: '深圳市宝安区',
      time: '@time',
    },
  ],
});

