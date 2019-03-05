import React , { Component } from 'react';
import { Menu, Icon} from 'antd';
import './index.less';
import menuConfig from '../../config/menuConfig';

const SubMenu = Menu.SubMenu;
export default class Headers extends Component {
  componentWillMount() {
    const menuNode = this.renderMenu(menuConfig);
    this.setState({
      menuNode
    });
  }
  //渲染菜单组件
  renderMenu = (data) => {
    return data.map(item => {
      if (item.children) {
        return (
          <SubMenu key={item.key} title={item.title}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.key} title={item.title}>
            {item.title}
          </Menu.Item>
        );
      }
    });
  }
  render() {
    return (
      <div className="navLeft">
        <div className="logo">
          <img src="/assets/logo-ant.svg" />
          <h1>JLiang</h1>
        </div>
        <Menu theme="dark" mode="vertical">
          {this.state.menuNode}
        </Menu>
      </div>
    );
  }
}