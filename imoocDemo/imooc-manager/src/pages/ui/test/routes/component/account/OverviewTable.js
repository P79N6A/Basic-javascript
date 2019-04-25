/*eslint react/jsx-no-target-blank: 0 */
import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Resizable } from 'react-resizable';
import { Table, Select, message, Popconfirm, Button, Modal } from 'antd';
import styles from '../../discount.less';
import { deleteRuleApi, modifyRuleTimeApi, modifyRuleStatusApi } from '../../../services/account';
import { accountStatusMap } from '../../../config/account';
import { getUserAuth } from '../../../../../services/api';
import { needAuthHost } from '../../../config/index';

const { Option } = Select;
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

export default class DiscountInfoTable extends React.Component {
  constructor(props) {
    super(props);
    const { total = 0, current = 1, pageSizeOptions } = this.props;
    this.state = {
      pagination: {
        total,
        current,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: sum => `共${sum}条`,
        pageSize: Number(pageSizeOptions[0]),
        pageSizeOptions,
      },
    };
    this.operateCol = [
      {
        title: '操作',
        dataIndex: 'Operation',
        key: 'Operation',
        fixed: 'right',
        width: 150,
        render: (text, record = {}) => {
          const { status, id } = record;
          // 1草稿，2审核中，3审核成功，4审核失败，5失效，6删除
          const detailUrl = `/discountTool/account?currentMenu=detail&id=${id}`;
          const copyUrl = `/discountTool/addAccount?type=copy&id=${id}`;
          const executeUrl = `/discountTool/executeResult?ruleId=${id}`;
          return (
            <React.Fragment>
              {
                [1, 2, 3, 4].indexOf(status) > -1
                  ?
                  (
                    <a href={detailUrl} target="_blank" style={{ marginRight: '5px' }} >查看</a>
                  )
                  :
                  null
              }
              {
                [1, 3].indexOf(status) > -1
                  ?
                  (
                    <a style={{ marginRight: '5px' }} onClick={this.edit.bind(this, record)} >编辑</a>
                  )
                  :
                  null
              }
              {
                [1, 2, 3, 4, 5].indexOf(status) > -1
                  ?
                  (
                    <a href={copyUrl} target="_blank" style={{ marginRight: '5px' }} >复制</a>
                  )
                  :
                  null
              }
              {
                status === 1
                  ?
                  (
                    <a onClick={this.deleteRule.bind(this, id)} style={{ marginRight: '5px' }} >删除</a>
                  )
                  :
                  null
              }
              {
                status === 3 && this.allowRenewal(record)
                  ?
                  (
                    <Popconfirm
                      title="续期后，系统将自动将到期时间延长一年。确定续期吗？"
                      onConfirm={this.renewal.bind(this, record)}
                    >
                      <a style={{ marginRight: '5px' }} >续期</a>
                    </Popconfirm>
                  )
                  :
                  null
              }
              {
                [2, 3].indexOf(status) > -1
                  ?
                  (
                    this.state.canChangeStatusItem
                      ?
                      (
                        <div>
                          <div>编辑状态：</div>
                          <Button onClick={() => { this.setState({ canChangeStatusItem: '' }); }} style={{ marginRight: '5px' }} size="small" >取消</Button>
                          <Button onClick={this.modifyRuleStatus.bind(this, id)} style={{ marginRight: '5px' }} type="primary" size="small" >保存</Button>
                        </div>
                      )
                      :
                      (
                        <a onClick={this.changeStatus.bind(this, record)} style={{ marginRight: '5px' }} >编辑状态</a>
                      )
                  )
                  :
                  null
              }
              {
                [3, 5].indexOf(status) > -1
                  ?
                  (
                    <a href={executeUrl} target="_blank" style={{ marginRight: '5px' }} >查看执行结果</a>
                  )
                  :
                  null
              }
            </React.Fragment >
          );
        },
      },
    ];
    this.components = {
      header: {
        cell: ResizeableTitle,
      },
    };
  }

  // 没有权限时的提示框
  authInfo(url) {
    Modal.info({
      title: '系统提示',
      content: (
        <div>
          您无权限访问
          <a style={{ marginLeft: '5px' }} href={url} target="_blank">申请权限</a>
        </div>
      ),
      onOk() { },
    });
  }

  async edit(record) {
    const { id, status } = record;
    const editUrl = `/discountTool/addAccount?type=edit&id=${id}`;
    if (status === 3 && window.location.host === needAuthHost) {
      // 判断是否有权限
      const auth = await getUserAuth({ opId: 50, needApply: 0, needLogin: 1 });
      if (auth.code !== 0) {
        this.authInfo(auth.url);
        return;
      }
    }
    window.open(editUrl);
  }

  handleSearch(pagination = {}) {
    const { changedFields = {}, onChangeState, handleSearch } = this.props;
    const { current, pageSize } = pagination;

    onChangeState(
      {
        current,
        changedFields: {
          ...changedFields,
          page: current,
          rows: pageSize,
        },
      },
      handleSearch
    );
    this.setState(prev => ({
      pagination: {
        ...prev.pagination,
        current,
        pageSize,
      },
    }));
  }

  handleResize = index => (e, { size }) => {
    const { allColumns = [] } = this.props;
    const nextColumns = [...allColumns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    this.setState({ sizeColumns: nextColumns });
  };

  getShowColumns() {
    const { showTableTitle = [], allColumns } = this.props;
    const { sizeColumns, canChangeStatusItem } = this.state;
    let totalWidth = 0;
    const newColumns = [];
    allColumns.forEach((col = {}, index) => {
      const { editType, key, render } = col;
      if (showTableTitle.indexOf(key) === -1) {
        return;
      }
      const width = (_.find(sizeColumns, sizeCol => sizeCol.key === col.key) || {}).width || col.width;
      // 为了表格列对齐
      totalWidth += width;
      let newCol = {
        ...col,
        width,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      };
      if (canChangeStatusItem && editType) {
        newCol = {
          ...newCol,
          width: newCol.width + 50,
          render: (text, record) => {
            if (key === 'status') {
              const { id } = record;
              return (
                <Select
                  className={styles.table_edit}
                  value={isNaN(record[key]) ? record[key] : record[key].toString()}
                  onChange={(val) => { this.onChange(key, id, val); }}
                >
                  {
                    Object.keys(canChangeStatusItem || {}).map(sel => <Option value={sel} key={sel}>{canChangeStatusItem[sel]}</Option>)
                  }
                </Select>
              );
            } else {
              return render ? render(text, record) : text;
            }
          },
        };
      }
      newColumns.push(newCol);
    });
    // 调整表格宽度
    const len = newColumns.length;
    if (len > 0) {
      delete newColumns[len - 1].width;
    }
    return { newColumns, totalWidth };
  }

  deleteRule(ruleId) {
    if (this.state.loading) {
      return;
    }
    deleteRuleApi({ ruleId, operator: this.props.Creator, })
      .then((res) => {
        if (res.code === 0) {
          this.setState({ loading: false });
          this.props.handleSearch();
        } else {
          throw res;
        }
      })
      .catch((e) => {
        this.setState({ loading: false });
        message.error(`删除失败！${e.message || e}`);
      });
  }

  // 处理编辑状态按钮
  changeStatus(record) {
    const { status } = record;
    let canChangeStatusKeys = [];
    const canChangeStatusItem = {};
    if (status === 2) {
      canChangeStatusKeys = [3, 4];
    } else if (status === 3) {
      canChangeStatusKeys = [5];
    }
    canChangeStatusKeys.forEach((key) => {
      canChangeStatusItem[key] = accountStatusMap[key];
    });
    this.setState({ canChangeStatusItem });
  }

  //编辑状态保存
  async modifyRuleStatus(ruleId) {
    // 判断是否有权限
    if (window.location.host === needAuthHost) {
      const auth = await getUserAuth({ opId: 51, needApply: 0, needLogin: 1 });
      if (auth.code !== 0) {
        this.authInfo(auth.url);
        return;
      }
    }
    const { changeStatusItem = {}, Creator, loading } = this.state;
    if (loading) {
      return;
    }
    const status = changeStatusItem[ruleId];
    if (!status) {
      message.error('请选择状态');
      return;
    }
    const param = {
      ruleId,
      status: Number(status),
      operator: Creator,
    };
    modifyRuleStatusApi(param)
      .then((res) => {
        if (res.code === 0) {
          this.setState({
            loading: false,
            canChangeStatusItem: '',
          });
        } else {
          throw res;
        }
      })
      .catch((e) => {
        this.setState({ loading: false });
        message.error(`编辑状态保存失败！${e.message || e}`);
      });
  }

  /**
   * 判断是否符合折扣等优惠的续期条件：折扣到期前90天或折扣已过期并且有效，才可进行折扣续期操作
   */
  allowRenewal(record = {}) {
    const currentTime = new Date().getTime();
    if (Object.keys(record).length > 0 && (new Date(record.endTime).getTime() - currentTime) / (1000 * 60 * 60 * 24) <= 90 && record.status === 3) {
      return true;
    }
    return false;
  }

  // 单个产品续期，即失效时间延后一年
  async renewal(record) {
    // 判断是否有权限
    if (window.location.host === needAuthHost) {
      const auth = await getUserAuth({ opId: 47, needApply: 0, needLogin: 1 });
      if (auth.code !== 0) {
        this.authInfo(auth.url);
        return;
      }
    }
    if (!this.allowRenewal(record)) {
      message.error('不符合续期条件！');
      return;
    }
    const { id, beginTime, endTime } = record;
    const fet = new Date(endTime);
    const newEndTime = moment(fet.setFullYear(fet.getFullYear() + 1)).format('YYYY-MM-DD HH:MM:SS');
    const param = {
      ruleId: id,
      beginTime,
      endTime: newEndTime,
      operator: this.props.Creator,
    };
    modifyRuleTimeApi(param)
      .then((res) => {
        if (res.code === 0) {
          this.setState({ loading: false });
          this.props.handleSearch();
        } else {
          throw res;
        }
      })
      .catch((e) => {
        this.setState({ loading: false });
        message.error(`续期失败！${e.message || e}`);
      });
  }

  render() {
    const { total, current, data, selectedRowKeys, onChangeState } = this.props;
    let { pagination } = this.state;
    pagination = {
      ...pagination,
      total,
      current,
    };

    // 行是否可选择
    const rowSelection = {
      selectedRowKeys,
      onChange: (rowKeys, selData) => {
        onChangeState({ selectedRowKeys: rowKeys, selectedDatas: selData });
      },
    };

    const { newColumns, totalWidth } = this.getShowColumns();
    const scroll = {
      x: totalWidth + (newColumns.length * 15),
      y: 500,
    };

    return (
      <div>
        <Table
          bordered
          size="middle"
          scroll={scroll}
          dataSource={data}
          pagination={pagination}
          rowSelection={rowSelection}
          components={this.components}
          rowKey={record => record.id}
          onChange={this.handleSearch.bind(this)}
          columns={[...newColumns, ...this.operateCol]}
        />
      </div>
    );
  }
}
