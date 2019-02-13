### 关于函数的小结
> 将最近看的书进行总结，以便后续的学习和复习，形成更加整齐的学习资料和更加系统的学习
**函数**其实是一种代码的分组形式，它的本质是对于一个功能的或者处理某一事情的代码，有逻辑的集合在一起，可以说是具有目标性的一种特性
---
####  语法
1. **函数的声明定义及其调用**
  > 
  ```js
  //1.声明式
  function test1() {
    console.log('test');
  }
  //2.命名式
  var test2 = function() {
    console.log('test');
  };
  ```
2. **匿名函数**
它其实是没有名字的函数，因为没有命名的缘故，它可以被立即调用，所以可以形成**即时函数**。
3. **回调函数**
在js中函数是可以被看成数据的。即函数A的参数中是可以为函数B的，所以函数B被称之为回调函数。
```js

function multiplyByTwo(a, b, c, callback) {
  var i, arr = [];
  for (i = 0; i < 3; i++) {
    arr[i] = callback(arguments[i] * 2);
  }
  return arr;
}
//第一种添加回调函数的方式，使用匿名函数
multiplyByTwo(1,2,3, function(a) {
  return a + 1;
});
//第二种
var myarr = multiplyByTwo(1,2,3, addOne);
function addOne(a) {
  return a + 1;
}
```




> [markdown语法参考](https://coding.net/help/doc/project/markdown.html#i)

