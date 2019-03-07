##知识点
webpack配置整个项目
项目页面的整体布局
如何设计一个菜单的配置文件
calc属性的掌握，less预编译
jsonp解决跨域问题，使用promise进行二次封装
css语言
react： children要点, 

### 页面架构
布局为左右布局，右布局是上中下布局
采用了antd的栅格系统进行布局

### 菜单组件开发
- 配置menuConfig文件
- 配置静态资源文件： assets文件夹，包含图片资源 
  静态资源放在public的目录下直接引用就行
- antd的menu组件
**tips** Menu是动态渲染的，可以通过后台返回来进行权限的控制。渲染组件的方式采用的是递归的方法，简单实用。
一些资源的引用和布局，需要好好的看看。
https://www.html.cn/book/css/values/functional/calc().htm  有空看看！！！
会发现菜单的颜色没有填充整个页面，给布局加上背景色就行
使用calc进行布局高度的计算

### 头部组件开发
- 上下布局 展示用户信息
- 下布局 显示天气，调用百度天气api, 天气api调用不成功，使用作者的 (申请api失败)
**问题**
使用jsonp 解决调用api存在的跨域问题,
通过promise封装请求方法， 二次封装的好处：能够自己进行对应的控制：错误控制，请求的方式

### 底部组件开发
- 实现两个内容 1. 底部组件 2.中间的内容（暂时看成组件）
- 利用default.less 定义less变量来控制颜色
- css实现三角箭头


### 路由知识学习 https://reacttraining.com/react-router/web/guides/quick-start
- HashRouter 和 BrowserRouter
- 路由是组件的思想
- 核心api的使用 Router Route NavLink Link Switch Redirect ...
- 路由的传参方式，以及路由的权限控制等

**tips** 
1. 一个路由标签下只能有一个子元素
2. Switch 匹配第一个后就不往下匹配， exact 精确匹配 
3. 路由匹配的特点：如果没有Switch/exact，当出现同名的情况或者一级路由相同的情况（'/' 和 '/about' 或者 '/about/ttt'），那就一直往下匹配具备条件的路由（可能出现覆盖的情况）
4. 嵌套路由中，父路由不能使用精确匹配（会造成无法匹配到路由，原因？）
5. 使用this.props.children来剥离router.js 进行路由文件的嵌套
6. 动态路由获取参数和404路由的使用