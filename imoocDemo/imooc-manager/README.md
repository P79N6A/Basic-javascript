This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`
运行本地服务

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**这是一个不可逆的操作,一旦暴露了配置就无法返回**
在暴露之前,需要把修改的文件commit一次, 这样不会报错
暴露的文件有: config, scripts

### 插件的安装
**种类** : react-router-dom axios less less-loader antD  babel-plugin-import

### webpack配置less-loader
需要配置在424行的css配置后面才能成功，原因未知？待解决？
配置的按需插件：https://ant.design/docs/react/introduce-cn
定制主题配置： https://ant.design/docs/react/customize-theme-cn

### 架构定义
目前流行的框架进行开发，团队之间，友好的协议和规范是为了更好的约束和避免不良的代码的产生
components：公共组件存放目录
|-- Headers
  |-- index.js / index.less
|-- NavLeft
  |-- index.js / index.less
|-- Footer
  |-- index.js / index.less
pages：个人所开发的页面
admin.js : 主页面
config : 菜单的配置文件，变量的配置文件

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
