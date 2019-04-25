### 浅出React的新Context API

> 自从React16.3发布以来, 一直被官方不被官方所提倡的不稳定Context Api , 如今,正式登上React的大舞台, 成为了在没有借助第三方库的情况下, 使用Context来进行数据共享的首选了, 因为它正式成为了一个稳定版本的Api. 

### 原有Context API的特点(在16.3版本前)

1. Context Api是实验性的api, 在未来的版本中可能移除
2. 致命缺陷: Context更新值后, 如果顶层组件在向目标组件props透传的过程中, 如果中间某个组件的`shouldComponentUpdate`函数返回的是false,因为无法继续触发底层组件的rerender, 新的Context值就无法到达目标组件, 这样对目标组件来说是不可控的存在.

### 新Context API的特点

> Context 提供了一种在组件之间共享此类值的方式，而不必通过组件树的每个层级显式地传递 props 。--React 官方文档

1. 不受中间组件的`shouldComponentUpdate`返回false的影响, 使得组件的变化可控
2. Context不必再通过组件一级一级的传递, 目标组件可以直接获取Context的值, 从而使用组件的更新

