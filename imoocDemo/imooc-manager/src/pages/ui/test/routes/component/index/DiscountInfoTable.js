/**
 * @description: 折扣管理的表格
 * @author: shirleyyu
 * @date: 2018-02-24
 */
import React from 'react';
import { Resizable } from 'react-resizable';
import _ from 'lodash';
import moment from 'moment';
import { Table, message, Button, Input, Select, DatePicker, Popconfirm } from 'antd';
import Util from '../../../libraries/util';
import Api from '../../../services/index';
import { numberFloatInputExp, numberFloatExp } from '../../../config/index';
import styles from '../../discount.less';
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
    this.columns2 = [
      {
        title: '操作',
        dataIndex: 'Operation',
        key: 'Operation',
        fixed: 'right',
        width: 120,
        render: (text, record = {}) => {
          const btnIsAbled = Util.allowRenewal(record);

          return (
            <div>
              {
                Number(record.FStatus || 0) === 2 || this.props.batchQuickEdit
                  ?
                  null
                  :
                  (<Button size="small" type="primary" style={{ margin: '0 5px 5px 0' }} onClick={() => (Number(record.is_new_discount || 0) === 1 ? window.open(`/discountTool/addDiscountForFLP?Id=${record.FId}&Type=${record.Type}&operation=edit`, '_blank') : Util.jumpToNewWindowWithData(`/discountTool/addDiscount?Id=${record.FId}`, { edit: record }))}>编辑</Button>)
              }
              <Popconfirm
                title="续期后，系统将自动将到期时间延长一年。确定续期吗？"
                onConfirm={this.renewal.bind(this, record)}
              >
                <Button type="primary" size="small" disabled={!btnIsAbled}>续期</Button>
              </Popconfirm>
            </div>
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

  handleSearch(pagination = {}, filters = {}) {
    const { changedFields = {}, onChangeState, handleSearch } = this.props;
    const { current, pageSize } = pagination;
    const filtersMap = {
      payMode: 'payMode',
      FConditionsMap: 'discountCond',
      is_new_discount: 'is_new_discount',
    };
    Object.keys(filtersMap).forEach((k) => {
      if (filters[k]) {
        const [v] = filters[k];
        changedFields[filtersMap[k]] = k === 'is_new_discount' ? Number(v) : v;
      }
    });
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

  // 单个产品续期，即失效时间延后一年
  renewal(record = {}) {
    if (!Util.allowRenewal(record)) {
      message.error('不符合续期条件！');
      return;
    }
    const { FId, FEndTime } = record;
    if (this.state.renewalId === FId) {
      return;
    }
    const { Creator, changedFields = {} } = this.props;
    const fet = new Date(FEndTime);
    const EndTime = moment(fet.setFullYear(fet.getFullYear() + 1)).format('YYYY-MM-DD HH:MM:SS');
    const params = [{
      Id: FId,
      Type: changedFields.Type,
      EndTime,
      Creator,
    }];
    this.setState({ renewalId: FId }, () => {
      Api.updateDiscountBatch(params)
        .then((res) => {
          if (res.code === 0) {
            this.setState({ renewalId: '' });
            message.success('续期成功', () => {
              window.location.reload();
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ renewalId: '' });
          message.error(`续期失败！${e.message}`);
          console.log('updateDiscountBatch', e);
        });
    });
  }

  onChange(key, FId, val) {
    const { batchQuickEditData = [], onChangeState } = this.props;
    const index = _.findIndex(batchQuickEditData, (b = {}) => b.FId === FId);
    if (index > -1) {
      if (key === 'FDiscount' && !numberFloatInputExp.test(val)) {
        return;
      }
      batchQuickEditData[index] = {
        ...batchQuickEditData[index],
        [key]: val,
      };
      onChangeState({ batchQuickEditData });
    }
  }

  onBlur(key, FId, val) {
    const { value } = val.target;
    if (key === 'FDiscount' && !(numberFloatExp.test(value))) {
      val.target.focus();
      message.error('折扣值请输入小于100的数字');
      const { batchQuickEditData = [], onChangeState } = this.props;
      const index = _.findIndex(batchQuickEditData, (b = {}) => b.FId === FId);
      batchQuickEditData[index] = {
        ...batchQuickEditData[index],
        [key]: '',
      };
      onChangeState({ batchQuickEditData });
    }
  }

  getShowColumns() {
    const { columns = [], batchQuickEdit, batchQuickEditData = [] } = this.props;
    const { sizeColumns } = this.state;
    let totalWidth = 0;
    const newColumns = columns.map((col = {}, index) => {
      const { editType, key, render } = col;
      const editFlag = batchQuickEdit && editType;
      let width = (_.find(sizeColumns, sizeCol => sizeCol.key === col.key) || {}).width || col.width;
      if (editFlag) {
        width += 50; // 为了表格列对齐
      }
      totalWidth += width;
      const newCol = {
        ...col,
        width,
        onHeaderCell: column => ({
          width: column.width,
          onResize: this.handleResize(index),
        }),
      };
      // 更新时间处理
      if (newCol.key === 'realUpdateTime') {
        newCol.render = (text, record) => {
          const { changedFields = {} } = this.props;
          return changedFields.Type === 'user' ? record.FAutoUpdateTime : record.FUpdateTime;
        };
      }
      if (!editFlag) {
        return newCol;
      }
      return {
        ...newCol,
        render: (text, record) => {
          const { FId } = record;
          // 失效状态不能编辑
          const cur = _.find(batchQuickEditData, (b = {}) => b.FId === FId);
          if (!cur) {
            return render ? newCol.render(text, record) : text;
          }
          switch (editType) {
            case 'time':
              return (
                <DatePicker
                  className={styles.table_edit}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime
                  value={cur[key] && moment(cur[key]).isValid() ? moment(cur[key]) : null}
                  onChange={(val, date) => { this.onChange(key, FId, date); }}
                />
              );
            case 'select':
              return (
                <Select
                  className={styles.table_edit}
                  value={isNaN(cur[key]) ? cur[key] : cur[key].toString()}
                  onChange={(val) => { this.onChange(key, FId, val); }}
                >
                  {
                    Object.keys(newCol.selectOption || {}).map(sel => <Option value={sel} key={sel}>{newCol.selectOption[sel]}</Option>)
                  }
                </Select>
              );
            default:
              return key === 'FDiscount' && (isNaN(record.preferentialType) ? record.preferentialType : record.preferentialType.toString()) === '1' ? null : (
                <Input className={styles.table_edit} value={cur[key]} onChange={(val) => { this.onChange(key, FId, val.target.value); }} onBlur={val => this.onBlur(key, FId, val)} />
              );
          }
        },
      };
    });
    // 调整表格宽度
    const len = newColumns.length;
    if (len > 0) {
      delete newColumns[len - 1].width;
    }
    return { newColumns, totalWidth };
  }

  handleResize = index => (e, { size }) => {
    const { columns = [] } = this.props;
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    this.setState({ sizeColumns: nextColumns });
  };

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
      x: totalWidth + (newColumns.length * 9),
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
          rowKey={record => record.FId}
          onChange={this.handleSearch.bind(this)}
          columns={[...newColumns, ...this.columns2]}
        />
      </div>
    );
  }
}
