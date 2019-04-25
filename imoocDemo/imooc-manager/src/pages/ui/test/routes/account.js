/**
 * 账务级优惠
 * shirleyyu
 */

import React from 'react';
import { Menu, Card, message, Spin } from 'antd';
import _ from 'lodash';
import Overview from './component/account/Overview';
import Detail from './component/account/Detail';
import Exception from '../../../components/Exception';
import { getUserAuth } from '../../../services/api';
import { needAuthHost } from '../config/index';
import Util from '../libraries/util';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    const currentMenu = Util.getSearchValueByName('currentMenu') || 'overview';
    this.state = {
      loading: true,
      currentMenu,
    };
  }

  componentDidMount() {
    // 判断是否有权限
    getUserAuth({ opId: 49, needApply: 0, needLogin: 1 })
      .then((res) => {
        if (res.code === 0) {
          this.setState({
            hasPermission: true,
            loading: false,
          });
        } else {
          throw res;
        }
      })
      .catch((err) => {
        const { data = {} } = err;
        this.setState({
          loading: false,
          hasPermission: false,
          applyPermissionLink: data.url || '',
        });
        message.error(`权限获取失败${err.message}`);
        console.log('err', err);
      });
  }

  handleMenuClick = (e) => {
    this.setState({ currentMenu: e.key });
  }

  render() {
    const {
      hasPermission,
      applyPermissionLink,
      loading,
      currentMenu,
    } = this.state;
    if (window.location.host === needAuthHost && _.isBoolean(hasPermission) && !hasPermission) {
      return (
        <div>
          <Exception
            type="403"
            style={{ minHeight: 500, height: '80%' }}
            desc="对不起，您没有操作当前页面的权限"
            actions={
              !!applyPermissionLink ? (
                <a href={applyPermissionLink}>申请权限</a>
              ) :
                (
                  <p style={{ fontSize: '20px' }}>
                    如需要申请权限请联系cathyxcheng(成晓)
                  </p>
                )
            }
          />
        </div>
      );
    }

    return (
      <Spin spinning={loading}>
        <Card bodyStyle={{ padding: '10px 15px' }}>
          <Menu
            onClick={this.handleMenuClick}
            selectedKeys={[currentMenu]}
            mode="horizontal"
          >
            <Menu.Item key="overview">优惠总览</Menu.Item>
            <Menu.Item key="detail">优惠明细</Menu.Item>
          </Menu>
          {
            currentMenu === 'overview'
              ?
              (<Overview />)
              :
              (<Detail />)
          }
        </Card>
      </Spin>
    );
  }
}
