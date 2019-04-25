/**
 * @description 优惠条件查询，新增/查看优惠条件和取值
 * @author shirleyyu
 */

import React from 'react';
import { Spin, Card, Row, Col, Button, Select, Table, Input, Popconfirm, message } from 'antd';
import _ from 'lodash';
import styles from './discount.less';
import Exception from '../../../components/Exception';
import AddConditionAndValue from './component/condition/AddConditionAndValue';
import EditCondition from './component/condition/EditCondition';
import Api from '../services/index';
import { getUserAuth } from '../../../services/api';
import { getLoginInfo } from '../../../utils/utils';
import { needAuthHost } from '../config/index';
const { Option } = Select;

export default class Condition extends React.Component {
  constructor(props) {
    super(props);
    const pageSizeOptions = ['20', '50', '100', '200'];
    this.state = {
      loading: false,
      tableLoading: false,
      pagination: {
        total: 0,
        current: 1,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共${total}条`,
        pageSize: Number(pageSizeOptions[0]),
        pageSizeOptions,
      },
      FStatusMap: {
        0: '失效',
        1: '生效',
      },
      FCreator: getLoginInfo().name || '',
    };
  }

  columns = [
    {
      title: '优惠条件名称',
      dataIndex: 'FKeyName',
      key: 'FKeyName',
      width: 120,
    },
    {
      title: '优惠条件Key',
      dataIndex: 'FKey',
      key: 'FKey',
      width: 120,
    },
    {
      title: '条件取值名称',
      dataIndex: 'FValueName',
      key: 'FValueName',
      width: 100,
      editable: true,
    },
    {
      title: '条件取值码',
      dataIndex: 'FValue',
      key: 'FValue',
      width: 100,
      editable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'FUpdateTime',
      key: 'FUpdateTime',
      width: 120,
      render: (text, record = {}) => {
        const { FUpdateTime, FCreateTime } = record;
        return FUpdateTime || FCreateTime;
      },
    },
    {
      title: '创建人',
      dataIndex: 'FCreator',
      key: 'FCreator',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'FStatus',
      key: 'FStatus',
      width: 100,
      editable: true,
      render: text => this.state.FStatusMap[text],
    },
    {
      title: '备注',
      dataIndex: 'FRemark',
      key: 'FRemark',
      width: 120,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 80,
      render: (text, record) => {
        return (
          <React.Fragment>
            {
              record.FId === this.state.editingKey
                ?
                (
                  <React.Fragment>
                    <Popconfirm
                      title="确定修改吗？"
                      onConfirm={() => this.save(record)}
                      onCancel={() => this.cancel()}
                    >
                      <a style={{ marginRight: '5px' }}>保存</a>
                    </Popconfirm>
                    <a onClick={this.cancel.bind(this)}>取消</a>
                  </React.Fragment>
                )
                :
                (<a onClick={this.edit.bind(this, record)}>编辑</a>)
            }
          </React.Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    this.getInitData();
    this.handleSearch();
  }

  getInitData() {
    this.setState({
      loading: true,
    }, () => {
      Promise.all([getUserAuth({ opId: 37, needApply: 0, needLogin: 1 }), Api.getConditionTempKey()])
        .then((res) => {
          let conditionTempKeyList = [];
          let hasPermission;
          let applyPermissionLink = '';
          const [auth, con] = res;
          if (auth.code === 0) {
            hasPermission = true;
          } else {
            hasPermission = false;
            applyPermissionLink = auth.data.url;
          }
          if (con.code === 0) {
            conditionTempKeyList = con.data && con.data.rows;
          } else {
            throw con;
          }
          this.setState({
            loading: false,
            hasPermission,
            applyPermissionLink,
            conditionTempKeyList,
          });
        })
        .catch((e) => {
          this.setState({ loading: false }, () => {
            message.error(`获取接口出错！${e.message || e}`);
            console.log(e);
          });
        });
    });
  }

  handleSearch(tablePagination) {
    const { tableLoading } = this.state;
    if (tableLoading) {
      return false;
    }
    const pagination = tablePagination || this.state.pagination || {};
    const { current, pageSize } = pagination;
    const params = { page: current, rows: pageSize };
    const data = ['FKeyName', 'FKey', 'FValueName', 'FValue', 'FStatus'];
    data.forEach((v) => {
      const value = this.state[v];
      if (value) {
        params[v] = value;
      }
    });
    this.setState({
      tableLoading: true,
    }, () => {
      Api.getConditionTempList(params)
        .then((res) => {
          if (res.code === 0) {
            this.setState(prev => ({
              tableLoading: false,
              data: res.data.rows,
              pagination: {
                ...prev.pagination,
                current,
                pageSize,
                total: Number(res.data.total || ''),
              },
            }));
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ tableLoading: false });
          message.error(`获取条件列表出错！${e.message || e}`);
        });
    });
  }

  edit(record) {
    const obj = { editingKey: record.FId };
    this.columns.forEach((col) => {
      if (col.editable) obj[col.key] = record[col.key];
    });
    this.setState(obj);
  }

  cancel(callback) {
    const obj = { editingKey: '' };
    this.columns.forEach((col) => {
      if (col.editable) obj[col.key] = '';
    });
    this.setState(obj, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  }

  save() {
    const { editingKey, FCreator, tableLoading } = this.state;
    if (!editingKey) {
      message.error('此条信息不允许修改');
      return;
    }
    if (tableLoading) {
      return;
    }
    let params = {};
    ['FValueName', 'FValue', 'FRemark', 'FStatus'].forEach((key) => {
      let value = (this.state[key] || '').trim();
      if (value) {
        if (key === 'FValue') {
          if (isNaN(value)) {
            params.FKeyType = 'string';
          } else {
            params.FKeyType = 'integer';
            value = Number(value);
          }
        }
        params[key] = value;
      }
    });
    if (Object.keys(params).length > 0) {
      params = {
        ...params,
        FId: editingKey,
        FCreator,
      };
      this.setState({ tableLoading: true }, () => {
        Api.updateConditionTempValue(params)
          .then((res) => {
            if (res.code === 0) {
              this.setState({ tableLoading: false }, () => {
                this.cancel(() => { this.handleSearch(); });
                message.success('修改成功');
              });
            } else {
              throw res;
            }
          })
          .catch((e) => {
            message.error(`修改失败！${e.message || e}`);
            this.setState({ tableLoading: false });
          });
      });
    } else {
      message.info('未修改任何数据');
      this.cancel();
    }
  }

  onChange(key, val) {
    if (['batchValues', 'FValueName', 'FValue', 'FRemark'].indexOf(key) > -1) {
      this.setState({ [key]: val.target.value });
    } else {
      this.setState({ [key]: val });
    }
  }

  resetSearch() {
    this.setState({
      FKeyName: '',
      FKey: '',
      FValueName: '',
      FValue: '',
      FStatus: '',
    });
  }

  onClick(key) {
    this.setState(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  render() {
    const { loading,
      FKeyName = '',
      FKey = '',
      FValueName = '',
      FValue = '',
      FStatus = '',
      data,
      pagination,
      editingKey,
      tableLoading,
      hasPermission,
      applyPermissionLink,
      conditionTempKeyList = [],
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

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        render: (text, record) => {
          if (record.FId !== editingKey) {
            return col.render ? col.render(text, record) : text;
          }
          if (col.key === 'FStatus') {
            return (
              <Select
                style={{ width: '80px' }}
                value={this.state[col.key]}
                onChange={this.onChange.bind(this, col.key)}
              >
                <Option value="1" key="1">生效</Option>
                <Option value="0" key="0">失效</Option>
              </Select>
            );
          } else {
            return (
              <Input style={{ width: '100%' }} value={this.state[col.key]} onChange={this.onChange.bind(this, col.key)} />
            );
          }
        },
      };
    });

    return (
      <Spin spinning={loading}>
        <Card bodyStyle={{ padding: '10px 15px' }}>
          <h3 className={styles.mrbottom10}>优惠条件管理</h3>
          <Row>
            <Col className={styles.formcol}>
              <span style={{ margin: '0 10px 5px 0' }}>折扣条件名称</span>
              <Select
                size="small"
                className={styles.wid100}
                style={{ margin: '0 20px 5px 0' }}
                showSearch
                value={FKeyName}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.onChange.bind(this, 'FKeyName')}
              >
                <Option value="" key="-1">全部</Option>
                {
                  conditionTempKeyList.map(item => <Option value={item.FKeyName} key={item.FKey}>{item.FKeyName}</Option>)
                }
              </Select>
              <span style={{ margin: '0 10px 5px 0' }}>折扣条件 Key</span>
              <Select
                size="small"
                className={styles.wid100}
                style={{ margin: '0 20px 5px 0' }}
                showSearch
                value={FKey}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.onChange.bind(this, 'FKey')}
              >
                <Option value="" key="-1">全部</Option>
                {
                  conditionTempKeyList.map(item => <Option value={item.FKey} key={item.FKey}>{item.FKey}</Option>)
                }
              </Select>
              <span style={{ margin: '0 10px 5px 0' }}>状态</span>
              <Select
                size="small"
                className={styles.wid100}
                style={{ margin: '0 20px 5px 0' }}
                showSearch
                value={FStatus}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.onChange.bind(this, 'FStatus')}
              >
                <Option value="">全部</Option>
                <Option value="0">失效</Option>
                <Option value="1">生效</Option>
              </Select>
              <span style={{ margin: '0 10px 5px 0' }}>条件取值名称</span>
              <Input
                size="small"
                className={styles.wid100}
                style={{ margin: '0 20px 5px 0' }}
                value={FValueName}
                onChange={this.onChange.bind(this, 'FValueName')}
              />
              <span style={{ margin: '0 10px 5px 0' }}>条件取值码</span>
              <Input
                size="small"
                className={styles.wid100}
                style={{ margin: '0 20px 5px 0' }}
                value={FValue}
                onChange={this.onChange.bind(this, 'FValue')}
              />
            </Col>
          </Row>
          <Row>
            <Button type="primary" size="small" onClick={() => this.handleSearch()}>
              查询
            </Button>
            <Button type="primary" size="small" style={{ margin: '0 20px' }} onClick={this.resetSearch.bind(this)}>
              重置
            </Button>
          </Row>
          <Row style={{ margin: '20px 0 10px' }}>
            <Button size="small" style={{ marginRight: '20px' }} onClick={this.onClick.bind(this, 'addCondition')}>+ 新增优惠条件</Button>
            <Button size="small" style={{ marginRight: '20px' }} onClick={this.onClick.bind(this, 'editCondition')}>+ 编辑优惠条件</Button>
            <Button size="small" style={{ marginRight: '20px' }} onClick={this.onClick.bind(this, 'addValue')}>+ 新增优惠条件取值</Button>
            <Button size="small" style={{ marginRight: '20px' }} onClick={this.onClick.bind(this, 'batchImport')}>+ 批量导入</Button>
          </Row>
          <Table
            loading={tableLoading}
            size="small"
            bordered
            columns={columns}
            dataSource={data}
            scroll={{ y: 600 }}
            pagination={pagination}
            rowKey={record => record.FId}
            onChange={this.handleSearch.bind(this)}
          />
          <AddConditionAndValue
            {...this.state}
            Api={Api}
            onChange={this.onChange.bind(this)}
          />
          <EditCondition
            {...this.state}
            Api={Api}
            onChange={this.onChange.bind(this)}
          />
        </Card>
      </Spin >
    );
  }
}
