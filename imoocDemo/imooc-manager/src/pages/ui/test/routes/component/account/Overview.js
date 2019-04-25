import React from 'react';
import XLSX from 'xlsx';
import { Button, Icon, message, Spin } from 'antd';
import OverviewSearchList from './OverviewSearchList';
import CustomSetTableTitle from '../../component/index/CustomSetTableTitle';
import OverviewTable from './OverviewTable';
import Util from '../../../libraries/util';
import { queryRuleApi } from '../../../services/account';
import { getLoginInfo } from '../../../../../utils/utils';
import { allColumns, initTableTitle } from './config';

export default class Overview extends React.Component {
  constructor(props) {
    super(props);
    const id = Util.getSearchValueByName('id');
    const pageSizeOptions = ['50', '100', '200'];
    const searchParams = {
      id: id ? id.split(',') : '',
    };
    if (id) {
      searchParams.status = '';
    }
    this.state = {
      loading: false,
      searchType: id ? 'advancedSearch' : '',
      tableData: [],
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

  getClientNameByUin(uins = []) {
    const names = {};
    uins.forEach(async (uin) => {
      if (Object.keys(names).indexOf(uin) === -1) {
        const res = await Util.GetAccountInfoByFields(uin);
        const { name = '' } = res.customer_info || {};
        names[uin] = name;
      }
    });
    this.setState(prev => ({
      clientNames: {
        ...prev.clientNames,
        ...names,
      },
    }));
  }

  // 导出 EXCEL
  exportDiscountList() {
    if (this.state.exportLaoding) {
      return;
    }
    const { selectedRowKeys = [], showTableTitle = [] } = this.state;
    let params = this.getSearchParams();
    const columns = allColumns.filter(item => showTableTitle.indexOf(item.dataIndex) > -1);
    let page = 1;
    const rows = 500;
    const maxRows = 10000;  // 避免 CPU 占用过高，日志写入过多
    params = {
      ...params,
      page,
      rows,
    };
    if (selectedRowKeys.length > 0) {
      params.ruleIdList = selectedRowKeys;
    }
    this.setState({ exportLaoding: true }, async () => {
      try {
        const res = await queryRuleApi(params);
        let data;
        if (res.code === 0) {
          data = res.data.rules || [];
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
              func.push(queryRuleApi(params));
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
                data = [...data, ...(item.data.rules || [])];
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

  // 展示设置列表字段弹框
  showSetTableTitleModal() {
    const { isShowSetTableTitleModal, customTableTitle } = this.state;
    const obj = {
      isShowSetTableTitleModal: !isShowSetTableTitleModal,
    };
    if (!isShowSetTableTitleModal) {
      const colOptions = allColumns.map(col => ({ label: col.title, value: col.key }));
      obj.colOptions = colOptions;
    } else if (customTableTitle) {
      obj.showTableTitle = customTableTitle;
    }
    this.setState(obj);
  }

  // 取消设置列表字段弹框
  cancelSetTableTitleModal() {
    this.setState({
      isShowSetTableTitleModal: false,
      customTableTitle: this.state.showTableTitle,
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

  // 处理搜索折扣的参数
  getSearchParams() {
    const { changedFields } = this.state;
    const keys = Object.keys(changedFields);
    const params = {};

    keys.forEach((key) => {
      if (changedFields[key] !== '' && changedFields[key] !== undefined) {
        params[key] = changedFields[key];
      }
    });
    return params;
  }

  // 处理搜索折扣返回的数据
  processDiscountData(data) {
    return data;
  }

  handleSearch() {
    const { loading } = this.state;
    if (loading) {
      return;
    }

    const params = this.getSearchParams();

    this.setState({ loading: true },
      () => {
        queryRuleApi(params)
          .then((res = {}) => {
            const { data = {}, code } = res;
            if (code === 0) {
              this.setState({
                loading: false,
                tableData: data.rules || [],
                total: Number(data.total || 0),
              });
            } else {
              throw res;
            }
          })
          .catch((err) => {
            this.setState({ loading: false });
            const tip = '搜索折扣失败！';
            message.error(tip + (err.message || err));
          });
      });
  }

  render() {
    const {
      loading,
      searchType,
      exportLaoding,
      isShowSetTableTitleModal,
      colOptions = [],
      showTableTitle,
      customTableTitle = showTableTitle,
      tableData,
      total,
      current,
      Creator,
      changedFields,
      pageSizeOptions,
      selectedRowKeys,
    } = this.state;
    // for test
    const testData = [
      {
        id: 123,
        operator: 'kevindang',
        beginTime: '2018-01-01 00:00:00',
        endTime: '2018-05-31 23:59:59',
        addTime: '2018-01-01 00:00:00',
        updateTime: '2018-05-31 23:59:59',
        ownerUinList: ['909619400', '45537'],
        uinType: 0,
        status: 3, // 规则状态：1草稿，2审核中
        childRules: [
          {
            id: 111,
            ownerUinList: ['909619400'],
            objProductInfo: {
              include: [{ productCode: 'p_cvm', subProductCode: 'sv_cvm_s1', billingItem: 'sv_cvm_cpu' }, {}],
              exclude: [{ productCode: 'p_cdb' }, { productCode: 'p_cbs', subProductCode: 'sp_cbs_v1' }]
            },
            objRegionInfo: {
              include: [1, 3, 5, 7, 9],
              exclude: [2, 4, 6]
            },
            objPayMode: 0,
            objExtraInfo: {
              key1: ['v1', 'v2'],
              key2: ['v1', 'v2']
            },
            objIsCond: 0,
            condProductInfo: {
              include: [{ productCode: 'p_cvm', subProductCode: 'sv_cvm_s1', billingItem: 'sv_cvm_cpu' }],
              exclude: [{ productCode: 'p_cdb' }, { productCode: 'p_cbs', subProductCode: 'sp_cbs_v1' }]
            },
            condRegionInfo: {
              include: [1, 3, 5, 7, 9],
              exclude: [2, 4, 6]
            },
            condPayMode: 0,
            condExtraInfo: {
              key1: ['v1', 'v2'],
              key2: ['v1', 'v2']
            },
            preMethod: 1, // 优惠方案：1折扣、2合同价、3满返
            preType: 2, // 优惠类型：1线性、2到达阶梯、3累进阶梯
            statMethod: 1, // 阶梯区间统计方式：1组件用量 * 时长求和、2刊例价求和、3组件用量求和
            preInfo: [
              { low: 0, high: 100, value: 80 },
              { low: 101, value: 70 }
            ]
          }],
      }
    ] || tableData;

    return (
      <Spin spinning={loading} >
        <OverviewSearchList
          searchType={searchType}
          changedFields={changedFields}
          onChangeState={this.onChangeState.bind(this)}
          handleSearch={this.handleSearch.bind(this)}
        />
        <div style={{ margin: '10px 0' }}>
          <Button size="small" type="primary" style={{ marginBottom: '0 10px 10px' }}>
            <a href="/discountTool/addAccount" target="_blank">+ 新增优惠</a>
          </Button>
          <Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={this.exportDiscountList.bind(this)} loading={exportLaoding} title="建议使用谷歌浏览器，按条件筛选导出，全量导出耗时较长，导出可能失败">导出EXCEL</Button>
          <Button size="small" style={{ margin: '0 5px 10px 5px' }} onClick={this.showSetTableTitleModal.bind(this)}>
            <Icon type="setting" />设置列表字段
          </Button>
        </div>
        <CustomSetTableTitle
          isShowSetTableTitleModal={isShowSetTableTitleModal}
          customTableTitle={customTableTitle}
          colOptions={colOptions}
          onChangeState={this.onChangeState.bind(this)}
          showSetTableTitleModal={this.showSetTableTitleModal.bind(this)}
          cancelSetTableTitleModal={this.cancelSetTableTitleModal.bind(this)}
        />
        <OverviewTable
          data={testData}
          // data={tableData}
          total={total}
          current={current}
          Creator={Creator}
          allColumns={allColumns}
          showTableTitle={showTableTitle}
          changedFields={changedFields}
          pageSizeOptions={pageSizeOptions}
          selectedRowKeys={selectedRowKeys}
          onChangeState={this.onChangeState.bind(this)}
          handleSearch={this.handleSearch.bind(this)}
        />
      </Spin >
    );
  }
}
