/**
 * 折扣配置的页面路由配置
 * @author shirleyyu
 * @date 2018-05-29
 */

module.exports = [
  {
    path: '/discountTool/index',
    page: () => import('./routes/index'),
  },
  {
    path: '/discountTool/addDiscount',
    page: () => import('./routes/addDiscount'),
  },
  {
    path: '/discountTool/addDiscountForFLP',
    page: () => import('./routes/addDiscountForFLP'),
  },
  {
    path: '/discountTool/condition',
    page: () => import('./routes/condition'),
  },
  {
    path: '/discountTool/account',
    page: () => import('./routes/account'),
  },
  {
    path: '/discountTool/addAccount',
    page: () => import('./routes/addAccount'),
  },
  {
    path: '/discountTool/executeResult',
    page: () => import('./routes/executeResult'),
  },
  {
    path: '/discountTool/saveAccount',
    page: () => import('./routes/component/addAccount/SaveAccount'),
  },
];
