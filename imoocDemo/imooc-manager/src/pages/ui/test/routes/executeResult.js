/**
 * 账务级优惠总览
 * shirleyyu
 */

import React from 'react';
import { Link } from 'dva/router';
import { Spin, Card, message, Select, Input, DatePicker, Table, Button } from 'antd';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
// import XLSX from 'xlsx';
import Exception from '../../../components/Exception';
import styles from './discount.less';
// import Api from '../services/index';
// import Util from '../libraries/util';
import { getUserAuth } from '../../../services/api';
import { needAuthHost } from '../config/index';
const { Option } = Select;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;

const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    // const Id = Util.getSearchValueByName('Id');
    this.state = {
      loading: true,
      changedFields: {},
      // Id: Id ? Id.split(',') : '',
      columns: [
        {
          title: '优惠结果ID',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '月份',
          dataIndex: 'month',
          key: 'month',
          width: 120,
        },
        {
          title: '账单来源',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '优惠ID',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '客户UIN',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '客户名称',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '刊例价总额',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '优惠后总额',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '优惠减免总额',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '执行状态',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '执行完成时间',
          dataIndex: 'Operation',
          key: 'Operation',
          width: 120,
        },
        {
          title: '操作',
          dataIndex: 'Operation',
          key: 'Operation',
          fixed: 'right',
          width: 120,
          render: (text, record) => <Link onChange={this.downloadResult(record)}>下载优惠结果</Link>
        },
      ],
    };
    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };
  }

  componentDidMount() {
    // 判断是否有权限
    getUserAuth({ opId: 49, needApply: 0, needLogin: 1 })
      .then((res) => {
        const { code, data = {} } = res;
        if (code !== 0) {
          this.setState({
            hasPermission: false,
            applyPermissionLink: data.url || '',
          });
        } else {
          this.setState({
            hasPermission: true,
            loading: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        message.error(`权限获取失败${err.message}`);
        console.log('err', err);
      });
    // url 带参数，则执行 search 操作
    // if (this.state.changedFields.Id) {
    //   this.handleSearch();
    // }
  }

  handleSearch() {
    console.log(23456);
  }

  resetSearch() {
    this.props.onChangeState({
      changedFields: {},
      resetSearchFlag: true,
    }, this.handleSearch());
  }

  onChange(key, value, ext) {
    let obj;
    if (key === 'month') {
      obj = {
        [key]: value,
        showMonth: ext,
      };
    } else {
      obj = { [key]: value };
    }
    this.setState(prev => ({
      changedFields: {
        ...prev.changedFields,
        ...obj,
      },
    }));
  }

  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  exportList() {
    console.log('exportList');
  }

  render() {
    const {
      loading,
      hasPermission,
      applyPermissionLink,
      Id,
      status = '',
      data,
      columns,
      exportLaoding,
      changedFields = {},
    } = this.state;
    const { ownerUin, ruleId, showMonth } = changedFields;

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

    const resizableColumns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    return (
      <Spin spinning={loading}>
        <Card bodyStyle={{ padding: '10px 15px' }}>
          <h3 className={styles.mrbottom10}>账务级优惠执行结果</h3>
          <div>
            <span style={{ marginRight: '10px' }}>客户UIN</span>
            <TextArea
              style={{ verticalAlign: 'top', marginBottom: '10px' }}
              placeholder="支持批量查询，多个UIN请用英文逗号或回车符分开"
              className={styles.wid150}
              rows={3}
              value={ownerUin}
              onChange={this.onChange.bind(this, 'ownerUin')}
            />
            <span style={{ margin: '0 10px 0 20px' }}>优惠ID</span>
            <TextArea
              style={{ verticalAlign: 'top', marginBottom: '10px' }}
              placeholder="支持批量查询，多个UIN请用英文逗号或回车符分开"
              className={styles.wid150}
              rows={3}
              value={ruleId}
              onChange={this.onChange.bind(this, 'ruleId')}
            />
            <span style={{ margin: '0 10px 0 20px' }}>优惠结果ID</span>
            <TextArea
              style={{ verticalAlign: 'top', marginBottom: '10px' }}
              placeholder="支持批量查询，多个UIN请用英文逗号或回车符分开"
              className={styles.wid150}
              rows={3}
              value={Id}
              onChange={this.onChange.bind(this, 'Id')}
            />
          </div>
          <div>
            <span style={{ margin: '0 10px 0 20px' }}>账单月份</span>
            <MonthPicker
              size="small"
              value={showMonth}
              onChange={(value, dataString) => { this.onChange('month', dataString, value); }}
            />
            <span style={{ margin: '0 10px 0 20px' }}>执行状态</span>
            <Select
              showSearch
              size="small"
              value={status}
              className={styles.wid150}
              optionFilterProp="children"
              style={{ marginBottom: '10px' }}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.onChange.bind(this, 'status')}
            >
              <Option value="" key="-1">全部</Option>
            </Select>
          </div>
          <div>
            <Button type="primary" size="small" onClick={this.handleSearch.bind(this)}>搜索</Button>
            <Button type="primary" size="small" style={{ margin: '0 20px' }} onClick={this.resetSearch.bind(this)}>重置</Button>
          </div>
          <Button size="small" style={{ margin: '20px 5px 10px 5px' }} onClick={this.exportList.bind(this)} loading={exportLaoding}>导出EXCEL</Button>
          <Table
            bordered
            size="middle"
            scroll={{ y: 600 }}
            dataSource={data}
            components={this.components}
            rowKey={record => record.id}
            columns={resizableColumns}
          />
        </Card>
      </Spin>
    );
  }
}
