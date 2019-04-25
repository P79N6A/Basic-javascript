/**
 * @description: 折扣管理
 * @author: shirleyyu
 */
import React from 'react';
import { Link } from 'dva/router';
import { Spin, Card, Button, message, Modal, Select, Dropdown, Icon, Menu, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import XLSX from 'xlsx';
import Exception from '../../../components/Exception';
import SearchList from './component/index/SearchList';
import DiscountInfoTable from './component/index/DiscountInfoTable';
import CustomSetTableTitle from './component/index/CustomSetTableTitle';
import BatchImportUserDiscount from './component/index/BatchImportUserDiscount';
import styles from './discount.less';
import Api from '../services/index';
import Util from '../libraries/util';
import { getLoginInfo } from '../../../utils/utils';
import { getUserAuth } from '../../../services/api';
import { needAuthHost } from '../config/index';
import { allColumns, initTableTitle, statusMap } from './component/index/config';
const { Option } = Select;

export default class Index extends React.Component {
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
      loading: true,
      searchLoading: false,
      searchType: Id ? 'advancedSearch' : '',
      tableData: [],
      showChangeStatusDialog: false,
      confirmLoading: false, // 修改状态时确定按钮的状态
      current: 1, // 分页中的当前页数
      pageSizeOptions, //分页中的
      changedFields: {
        // 查询参数
        page: 1,
        rows: Number(pageSizeOptions[0]),
        Status: 1,
        ...searchParams,
      },
      showTableTitle: initTableTitle,  // 初始化显示的表格列
      Creator: getLoginInfo().name || '',
    };
  }

  componentDidMount() {
    // 判断是否有权限
    getUserAuth({ opId: 21, needApply: 0, needLogin: 1 })
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
    // 获取条件信息
    this.getConditionList();
    // url 带参数，则执行 search 操作
    if (this.state.changedFields.Id) {
      this.handleSearch();
    }
  }

  /**
   * 获取条件信息，用于表格的筛选
   */
  getConditionList() {
    const params = { page: 1, rows: 1000000 };
    this.setState({ loading: true }, () => {
      Api.getConditionTempList(params)
        .then((res) => {
          if (res.code === 0) {
            this.setState({
              loading: false,
              conditionData: Util.handleConditionData((res.data && res.data.rows) || []),
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ loading: false });
          message.error(`获取条件列表出错！${e.message || e}`);
        });
    });
  }

  onChangeState(obj, callback) {
    this.setState(
      (prev) => {
        const data = {
          ...prev,
          ...obj,
        };
        return data;
      },
      () => {
        if (typeof callback === 'function') {
          callback();
        }
      }
    );
  }

  handleSearch() {
    const { searchLoading } = this.state;
    if (searchLoading) {
      return;
    }

    const params = this.getSearchParams();

    this.setState({ searchLoading: true },
      () => {
        Api.searchDiscount(params)
          .then((res = {}) => {
            const { data = {}, code } = res;
            if (code === 0) {
              const discountList = Array.isArray(data) ? data : data.rows;
              this.setState({
                resetSearchFlag: false,
                searchLoading: false,
                tableData: discountList,
                total: Number(data.total || 0),
              });
            } else {
              throw res;
            }
          })
          .catch((err) => {
            this.setState({ searchLoading: false });
            const tip = err.code === 600002 ? '折扣指定价配置异常！' : '搜索折扣失败！';
            message.error(tip + (err.message || err));
          });
      });
  }

  // 处理搜索折扣的参数
  getSearchParams() {
    const { changedFields } = this.state;
    const keys = Object.keys(changedFields);
    const params = {};

    keys.forEach((key) => {
      if (changedFields[key] !== '') {
        params[key] = changedFields[key];
      }
    });
    return params;
  }

  // 导出 EXCEL
  exportDiscountList() {
    if (this.state.exportLaoding) {
      return;
    }
    const { selectedRowKeys = [] } = this.state;
    let params = this.getSearchParams();
    const columns = this.setTableTitle();
    let page = 1;
    const rows = 500;
    const maxRows = 10000;  // 避免 CPU 占用过高，日志写入过多
    params = {
      ...params,
      page,
      rows,
    };
    if (selectedRowKeys.length > 0) {
      params.Id = selectedRowKeys;
    }
    this.setState({ exportLaoding: true }, async () => {
      try {
        const res = await Api.searchDiscount(params);
        let data;
        if (res.code === 0) {
          data = res.data.rows || [];
          let totalRows = Number(res.data.total);
          if (totalRows > maxRows) {
            message.error(`导出数据过大，一次导出不能超过${maxRows}条，请按条件筛选导出`);
            this.setState({ exportLaoding: false });
            return;
          }
          if (rows < totalRows) {
            totalRows -= rows;
            const func = [];
            while (totalRows > 0) {
              params.page = ++page;
              func.push(Api.searchDiscount(params));
              totalRows -= rows;
            }
            // 每次并发最高次数，避免 CPU 占用过高
            const everyParallelSum = 10;
            for (let i = 0; i < Math.ceil(func.length / everyParallelSum); i++) {
              const f = func.slice(i * everyParallelSum, (i + 1) * everyParallelSum);
              const list = await Promise.all(f); //eslint-disable-line
              const isFailRes = list.filter(l => l.code !== 0);
              if (isFailRes.length > 0) {
                throw isFailRes;
              }
              list.forEach((item) => { //eslint-disable-line
                data = [...data, ...(item.data.rows || [])];
              });
            }
          }
          if (data.length === 0) {
            message.warn('没有对应数据');
          }
          const exportData = [];
          data.forEach((item) => {
            const obj = {};
            columns.forEach((col) => {
              obj[col.title] = Array.isArray(item[col.dataIndex]) ? item[col.dataIndex].join('，') : item[col.dataIndex];
            });
            exportData.push(obj);
          });
          /* 创建worksheet */
          const ws = XLSX.utils.json_to_sheet(exportData);
          /* 新建空workbook，然后加入worksheet */
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws);

          const TypeName = data[0] ? data[0].TypeName : '折扣优惠';
          const fileName = `${TypeName}_${new Date().getTime()}.xlsx`;
          /* 生成xlsx文件 */
          XLSX.writeFile(wb, fileName);
          this.setState({ exportLaoding: false });
        } else {
          throw res;
        }
      } catch (err) {
        this.setState({ exportLaoding: false });
        message.error(`导出失败！${err.message || err}`);
      }
    });
  }

  async getDiscountListForExport(func, data) {
    let d;
    const list = await Promise.all(func);
    const isFailRes = list.filter(l => l.code !== 0);
    if (isFailRes.length > 0) {
      throw isFailRes;
    }
    list.forEach((item) => {
      d = [...data, ...(item.data.rows || [])];
    });
    return d;
  }

  /**
   * 弹出或者关闭批量更新、批量快速编辑状态框
   * @param {状态类型名称} flagType
   * @param {将要编辑的数据名称} batchData
   * @param {需要额外处理的数据} ext
   */
  batchModalControl(flagType, batchData, ext) {
    const { selectedDatas = [] } = this.state;
    let flag = !this.state[flagType];
    let data;
    let extData;
    if (flag) {
      data = selectedDatas.filter((d = {}) => d.FStatus !== '2');
      if (data.length === 0) {
        message.warn('请选择可编辑的行（已失效状态不能编辑）');
        flag = false;
      }
    } else {
      data = [];
      if (ext) {
        extData = '';
      }
    }
    this.setState({ [flagType]: flag, [batchData]: data, [ext]: extData });
  }

  // 是否允许续期
  judgeRenewal() {
    const { selectedDatas = [] } = this.state;
    let batchRenewalData = [];
    const tip = '请选择符合续期条件的折扣项';

    if (selectedDatas.length === 0) {
      message.warn(tip);
      batchRenewalData = [];
    } else {
      batchRenewalData = selectedDatas.filter(item => Util.allowRenewal(item));
      if (batchRenewalData.length === 0) {
        message.warn(tip);
      }
    }
    this.setState({ batchRenewalData });
  }

  // 批量续期
  batchRenewalSubmit() {
    const { batchRenewalData = [], loading, changedFields = {}, Creator } = this.state;
    if (loading) {
      return;
    }
    const params = batchRenewalData.map((item) => {
      const { FId, FEndTime } = item;
      const fet = new Date(FEndTime);
      const EndTime = moment(fet.setFullYear(fet.getFullYear() + 1)).format('YYYY-MM-DD HH:MM:SS');
      return {
        Id: FId,
        Type: changedFields.Type,
        EndTime,
        Creator,
      };
    });
    this.setState({ loading: true }, () => {
      Api.updateDiscountBatch(params)
        .then((res) => {
          if (res.code === 0) {
            this.setState({ loading: false });
            message.success('续期成功', () => {
              window.location.reload();
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          this.setState({ loading: false });
          message.error(`续期失败！${e.message}`);
          console.log('updateDiscountBatch', e);
        });
    });
  }

  // 校验批量快速编辑及参数组装
  checkBatchQuickEdit() {
    const { batchQuickEditData = [], changedFields = {}, Creator } = this.state;
    const { Type } = changedFields;
    const params = [];
    const flag = batchQuickEditData.every((b = {}, index) => {
      const { FId, FBeginTime, FEndTime, FRemark, FDiscount, FUpdateTime, FStatus, preferentialType } = b;
      const strPreferentialType = isNaN(preferentialType) ? preferentialType : preferentialType.toString();
      if (!FId) {
        message.error('没有id，不允许编辑');
        return false;
      }
      const tip = `选中的第${index + 1}行，`;
      const msgMap = {
        FBeginTime: !FBeginTime ? '生效时间不能为空' : '',
        FEndTime: !FEndTime ? '失效时间不能为空' : '',
        FStatus: !(isNaN(FStatus) ? FStatus : FStatus.toString()) ? '请选择状态' : '',
        FDiscount: strPreferentialType === '0' && !(isNaN(FDiscount) ? FDiscount : FDiscount.toString()) ? '折扣值不能为空' : '',
        FUpdateTime: Type === 'user' && !FUpdateTime ? '优先级不能为空' : '',
      };
      const isNotNull = Object.keys(msgMap).every((key) => {
        if (msgMap[key]) {
          message.error(tip + msgMap[key]);
          return false;
        }
        return true;
      });
      if (!isNotNull) {
        return false;
      }
      if (new Date(FBeginTime).getTime() >= new Date(FEndTime).getTime()) {
        message.error(`${tip}生效时间不能大于失效时间`, 10);
        return false;
      }
      const item = {
        Type: b.Type || Type,
        Id: FId,
        BeginTime: FBeginTime,
        EndTime: FEndTime,
        Remark: FRemark,
        Creator,
        Status: Number(FStatus),
      };
      if (strPreferentialType === '0') {
        item.Discount = parseFloat(FDiscount);
      }
      if (FUpdateTime) {
        item.UpdateTime = FUpdateTime;
      }
      params.push(item);
      return true;
    });
    return flag ? params : [];
  }

  // 保存批量快速编辑
  saveBatchQuickEdit() {
    const params = this.checkBatchQuickEdit();
    if (this.state.loading || params.length === 0) {
      return;
    }
    this.setState({ loading: true }, () => {
      Api.updateDiscountBatch(params)
        .then((res) => {
          if (res.code === 0) {
            message.success('保存成功', () => {
              window.location.href = '/discountTool/index';
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          message.error(`保存失败！${e.message}`);
          this.setState({ loading: false });
        });
    });
  }

  // 批量修改折扣状态
  saveBatchUpdateStatus() {
    const { changeStatus, batchUpdateStatusData = [], confirmLoading, Creator } = this.state;
    if (confirmLoading) {
      return;
    }
    if (!changeStatus) {
      message.error('请选择状态！');
      return;
    }
    const Operator = Creator;
    if (!Operator) {
      message.error('请先登录');
      return;
    }
    const params = batchUpdateStatusData.map(item => ({ Id: item.FId, Type: item.Type, Creator, Status: Number(changeStatus) }));
    this.setState({ confirmLoading: true }, () => {
      Api.updateDiscountBatch(params)
        .then((res) => {
          if (res.code === 0) {
            message.success('修改成功', () => {
              window.location.href = '/discountTool/index';
            });
          } else {
            throw res;
          }
        })
        .catch((err) => {
          message.error(`修改折扣状态失败${err}`);
          this.setState({ confirmLoading: false });
        });
    });
  }

  // 弹出或者关闭批量导入指定价状态框
  batchImportUserDiscount() {
    this.setState(prev => ({
      ...prev,
      batchImportUserDiscount: !prev.batchImportUserDiscount,
    }));
  }

  // 复制
  copyDiscountItem() {
    const { selectedDatas = [], changedFields = {} } = this.state;
    const Id = [];
    selectedDatas.forEach((d = {}) => {
      if (Number(d.is_new_discount) === 1) {
        Id.push(d.FId);
      }
    });
    if (Id.length === 0) {
      message.warn('请选择要复制的行（只有四层产品才能复制）');
    } else {
      window.open(`/discountTool/addDiscountForFLP?Id=${Id.join()}&Type=${changedFields.Type}&operation=copy`, '_blank');
    }
  }

  // 选择更多操作中的其中一项
  onClickMenu(e) {
    switch (e.key) {
      case 'batchImportUserDiscount':
        this.batchImportUserDiscount();
        break;
      case 'copyDiscountItem':
        this.copyDiscountItem();
        break;
      default:
    }
  }

  // 展示设置列表字段弹框
  showSetTableTitleModal() {
    const { isShowSetTableTitleModal, customTableTitle } = this.state;
    const obj = {
      isShowSetTableTitleModal: !isShowSetTableTitleModal,
    };
    if (!isShowSetTableTitleModal) {
      const colOptions = allColumns.columns1.map(col => ({ label: col.title, value: col.key }));
      obj.colOptions = colOptions;
    } else if (customTableTitle) {
      obj.showTableTitle = customTableTitle;
    }
    this.setState(obj);
  }

  // 设置实际要展示的列表字段
  setTableTitle() {
    const { showTableTitle, changedFields = {}, conditionData = {}, resetSearchFlag } = this.state;
    let columns = [];
    showTableTitle.forEach((v) => {
      let item = _.find(allColumns.columns1, col => col.key === v);
      if (item) {
        // 表头筛选
        let filters;
        let filteredValue;
        if (resetSearchFlag) {
          filteredValue = [];
        }
        switch (item.key) {
          case 'payMode':
            filters = (conditionData[item.key] && conditionData[item.key].map(c => ({ text: c.FValueName || c.FValue, value: c.FValue }))) || [{ text: '预付费', value: 'prepay' }, { text: '后付费', value: 'postpay' }];
            break;
          case 'FConditionsMap':
            filters = [];
            Object.keys(conditionData).forEach((k) => {
              if (k !== 'payMode' && conditionData[k]) {
                filters.push({
                  text: conditionData[k][0].FKeyName,
                  value: k,
                });
              }
            });
            break;
          case 'is_new_discount':
            filters = [{ text: '否', value: 0 }, { text: '是', value: 1 }];
            break;
          default:
            filters = [];
        }
        item = {
          ...item,
          filters,
          filteredValue,
          filterMultiple: false,
        };
      }
      columns.push(item);
    });
    columns = [...(allColumns[changedFields.Type] || []), ...columns];
    return columns;
  }

  // 取消设置列表字段弹框
  cancelSetTableTitleModal() {
    this.setState({
      isShowSetTableTitleModal: false,
      customTableTitle: this.state.showTableTitle,
    });
  }

  render() {
    const {
      hasPermission,
      applyPermissionLink,
      loading,
      searchLoading,
      tableData,
      changedFields,
      total,
      current,
      pageSizeOptions,
      showChangeStatusDialog,
      confirmLoading,
      changeStatus,
      showTableTitle,
      isShowSetTableTitleModal,
      colOptions = [],
      customTableTitle = showTableTitle,
      Creator,
      selectedRowKeys,
      batchQuickEdit,
      batchQuickEditData = [],
      batchImportUserDiscount,
      batchRenewalData = [],
      searchType,
      exportLaoding,
    } = this.state;

    const columns = this.setTableTitle();

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

    const menu = (
      <Menu onClick={this.onClickMenu.bind(this)}>
        <Menu.Item key="addDiscount">
          <Link to="/discountTool/addDiscount" target="_blank">新增老商品折扣</Link>
        </Menu.Item>
        <Menu.Item key="batchImportUserDiscount">批量导入用户优惠</Menu.Item>
        <Menu.Item key="copyDiscountItem">复制</Menu.Item>
      </Menu>
    );

    return (
      <Spin spinning={loading}>
        <Card bodyStyle={{ padding: '10px 15px' }}>
          <h3 className={styles.mrbottom10}>折扣管理</h3>
          <SearchList
            loading={searchLoading}
            searchType={searchType}
            changedFields={changedFields}
            onChangeState={this.onChangeState.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
          />
          <div style={{ margin: '10px 0' }}>
            <Button size="small" type="primary" style={{ marginBottom: '0 10px 10px' }}>
              <a href="/discountTool/addDiscountForFLP" target="_blank">+ 新增优惠</a>
            </Button>
            <Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={this.exportDiscountList.bind(this)} loading={exportLaoding} title="建议使用谷歌浏览器，按条件筛选导出，全量导出耗时较长，导出可能失败">导出EXCEL</Button>
            {
              batchQuickEdit
                ?
                (
                  <span>
                    <span>批量快速编辑：</span>
                    <Popconfirm
                      title="确定修改吗？"
                      onConfirm={() => this.saveBatchQuickEdit()}
                      onCancel={() => this.batchModalControl('batchQuickEdit', 'batchQuickEditData')}
                    >
                      <a style={{ marginRight: '5px' }}>保存</a>
                    </Popconfirm>
                    <a onClick={() => this.batchModalControl('batchQuickEdit', 'batchQuickEditData')}>取消</a>
                  </span>
                )
                :
                (<Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={() => this.batchModalControl('batchQuickEdit', 'batchQuickEditData')}>批量快速编辑</Button>)
            }
            <Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={() => this.batchModalControl('showChangeStatusDialog', 'batchUpdateStatusData', 'changeStatus')}>批量更新状态</Button>
            <Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={() => this.judgeRenewal()}>批量续期</Button>
            <Dropdown overlay={menu}>
              <Button size="small" style={{ margin: '0 5px 10px 5px' }}>
                更多操作<Icon type="down" />
              </Button>
            </Dropdown>
            <Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={this.showSetTableTitleModal.bind(this)}>
              <Icon type="setting" />设置列表字段
            </Button>
          </div>
          {
            exportLaoding
              ?
              (<div style={{ color: 'red', margin: '0 0 20px' }}>建议使用谷歌浏览器，按条件筛选导出，全量导出耗时较长，导出可能失败</div>)
              :
              null
          }
          <DiscountInfoTable
            data={tableData}
            total={total}
            current={current}
            columns={columns}
            Creator={Creator}
            changedFields={changedFields}
            batchQuickEdit={batchQuickEdit}
            pageSizeOptions={pageSizeOptions}
            selectedRowKeys={selectedRowKeys}
            batchQuickEditData={batchQuickEditData}
            onChangeState={this.onChangeState.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
          />
          <Modal
            title="折扣更新状态"
            visible={showChangeStatusDialog}
            onOk={this.saveBatchUpdateStatus.bind(this)}
            confirmLoading={confirmLoading}
            onCancel={() => this.batchModalControl('showChangeStatusDialog', 'batchUpdateStatusData', 'changeStatus')}
          >
            <span>状态：</span>
            <Select
              placeholder="请选择"
              style={{ width: 200 }}
              value={changeStatus}
              onChange={(value) => {
                this.onChangeState({ changeStatus: value });
              }}
            >
              {
                Object.keys(statusMap).map(key => <Option value={key} key={key}>{statusMap[key]}</Option>)
              }
            </Select>
            <div style={{ color: 'rgb(234, 130, 11)', marginTop: '10px' }}>温馨提示：已失效状态不能更新状态</div>
          </Modal>
          <Modal
            title="优惠续期"
            visible={batchRenewalData.length > 0}
            onOk={this.batchRenewalSubmit.bind(this)}
            confirmLoading={loading}
            onCancel={() => this.setState({ batchRenewalData: [] })}
          >
            <p>您选择的折扣记录中，有{batchRenewalData.length}条记录满足续期条件：当前日期-优惠到期日&lt;3个月或优惠已过期。</p>
            <p>续期后，系统将自动将到期时间延长一年。</p>
            <p>请确认是否续期？</p>
          </Modal>
          <CustomSetTableTitle
            isShowSetTableTitleModal={isShowSetTableTitleModal}
            customTableTitle={customTableTitle}
            colOptions={colOptions}
            onChangeState={this.onChangeState.bind(this)}
            showSetTableTitleModal={this.showSetTableTitleModal.bind(this)}
            cancelSetTableTitleModal={this.cancelSetTableTitleModal.bind(this)}
          />
          <BatchImportUserDiscount
            Creator={Creator}
            onChangeState={this.onChangeState.bind(this)}
            batchImportUserDiscount={batchImportUserDiscount}
          />
        </Card>
      </Spin>
    );
  }
}
