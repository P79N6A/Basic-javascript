/**
 * 账务级优惠新增
 */

import React from 'react';
import { Spin, Card, message, Button, Icon, Modal } from 'antd';
import _ from 'lodash';
// import XLSX from 'xlsx';
// import Exception from '../../../components/Exception';
import styles from './discount.less';
// import Api from '../services/index';
import Util from '../libraries/util';
// import { getLoginInfo } from '../../../utils/utils';
// import { getUserAuth } from '../../../services/api';
import { needAuthHost } from '../config/index';

import Search from './component/addAccount/Search';
import AccountConfigInfo from './component/addAccount/AccountConfigInfo';
import AccountListInfo from './component/addAccount/AccountListInfo';
import { DiscountRangeContext } from './component/addAccount/context';

export default class AddAccount extends React.Component {
  constructor(props) {
    super(props);
    const pageSizeOptions = ['50', '100', '200'];
    const Id = Util.getSearchValueByName('Id');
    const UserId = Util.getSearchValueByName('UserId');
    const searchParams = {
      Id: Id ? Id.split(',') : '',
      Type: Util.getSearchValueByName('Type') || 'user',
      UserId: UserId ? UserId.split(',') : '',
      ActivityId: Util.getSearchValueByName('ActivityId'),
    };
    if (Id) {
      searchParams.Status = '';
    }
    this.state = {
      loading: false,
      changedFields: {
        // 查询参数
        page: 1,
        rows: Number(pageSizeOptions[0]),
        Status: 1,
        ...searchParams,
      },
      showAccountConfig: false,
      isDisabled: true,
    };
  }

  addAccountConfig = () => {
    this.setState({
      showAccountConfig: true
    });
  }
  handleCancel = () => {
    this.setState({
      showAccountConfig: false
    });
  }
  //设置配置Modal的页脚
  getFooter() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button type="primary">保存</Button>
        <Button type="primary" style={{ marginLeft: 50 }} onClick={this.handleCancel}>取消</Button>
      </div>
    );
  }
  //取消保存并返回到搜索页
  cancelSave = () => {
    window.location.href = '/discountTool/account';
  }
  //改变添加配置按钮的状态
  handleConfigStatus = (value) => {
    this.setState({
      isDisabled: value
    });
  }
  render() {
    const {
      hasPermission,
      // applyPermissionLink,
      loading,
      showAccountConfig,
      isDisabled
    } = this.state;

    if (window.location.host === needAuthHost && _.isBoolean(hasPermission) && !hasPermission) {
      return (
        <div>
          禁止操作....
        </div>
      );
    }
    return (
      <Spin spinning={loading}>
        <Card bodyStyle={{ padding: '10px 15px' }}>
          <h3 className={styles.mrbottom10} style={{ fontSize: 18 }}>新增帐务级优惠</h3>
          {/* 搜索功能部分 */}
          <Search
            onChange={this.handleConfigStatus}
          />
          {/* 添加配置 */}
          <Button style={{ margin: '10px 0px 20px 20px' }} onClick={this.addAccountConfig} disabled={!isDisabled}>
            <Icon type="plus" style={{ fontSize: 8, color: '#6b6963' }} />
            添加优惠配置
          </Button>
          {/* 数据展示及其编辑功能的部分 */}
          <AccountListInfo />
          <div style={{ marginTop: 20, marginLeft: 20 }}>
            <Button type="primary" style={{ marginRight: 20 }}>确认提交</Button>
            <Button type="primary" style={{ marginRight: 20 }}>保存草稿</Button>
            <Button onClick={this.cancelSave}>取消</Button>
          </div>
        </Card>
        {/* 配置框 ,取消在按钮实现*/}
        <Modal
          width="1000px"
          style={{ top: 50 }}
          visible={showAccountConfig}
          closable={false}
          footer={this.getFooter()}
        >
          <DiscountRangeContext.Provider value={{
            test: 1
          }}>
            <AccountConfigInfo />
          </DiscountRangeContext.Provider>
        </Modal>
      </Spin>
    );
  }
}
