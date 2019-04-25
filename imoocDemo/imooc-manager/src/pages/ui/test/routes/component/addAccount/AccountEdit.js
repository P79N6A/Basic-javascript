/**
 * 优惠配置-区间控件
 */
/*eslint eqeqeq: 0, no-continue: 0 */
import React, { Component } from 'react';
import { Table, InputNumber, message } from 'antd';
import _ from 'lodash';
import { cumulativeMap } from '../../../config/account';

export default class AccountEdit extends Component {
  state = {
    dataSource: [{ low: 0, high: '', value: '', key: 0 }, { low: 0, high: -1, value: '', key: 1 }],
  }
  //改变区间值
  changeValue = (index, value) => {
    const { dataSource } = this.state;
    const newDataSource = dataSource;
    newDataSource[index].high = value;
    this.setState({
      dataSource: newDataSource
    });
  }
  changeHighValue = (index, value) => {
    const { dataSource } = this.state;
    const newDataSource = dataSource;
    const len = newDataSource.length;
    if (value <= newDataSource[index].low) {
      message.error('阶梯的结束用量必须大于起始用量');
      return;
    }
    if (len < 2) {
      newDataSource[index].high = value;
    } else {
      newDataSource[index + 1].low = value;
    }
    this.setState({
      dataSource: newDataSource
    });
  }
  //改变折扣值
  changeDiscountValue = (index, value) => {
    const { dataSource } = this.state;
    const newDataSource = dataSource;
    const regExp = /^\d*(?:\.\d{0,4})?$/;
    //验证小数点
    if (!regExp.test(value)) {
      message.error('小数点最多只能精确到4位数');
      return;
    }
    newDataSource[index].value = value;
    this.setState({
      dataSource: newDataSource
    });
  }
  //删除区间的数据
  handleDelete = (index) => {
    const { dataSource } = this.state;
    const newDataSource = dataSource;
    const len = newDataSource.length;
    if (len > 2 && len - 1 === index) { //删除最后一条数据且大于两条
      newDataSource[len - 2] = { ...newDataSource[len - 2], high: -1 };
    } else if (index === 0 && len === 2) { //删除第一条数据且只有两条
      newDataSource[index + 1] = { ...newDataSource[index + 1], low: 0, high: '' };
    } else if (len > 2) {
      newDataSource[index + 1].low = newDataSource[index].low;
    }
    newDataSource.splice(index, 1);
    this.setState({
      dataSource: newDataSource
    });
  }
  //添加区间操作
  handleAddPrice = () => {
    const newDataSource = [...this.state.dataSource];
    //验证起始用量和结束用量
    for (const item of newDataSource) {
      if (item.high === -1) {
        continue;
      }
      if (item.high < item.low) {
        message.error('阶梯的结束用量必须大于起始用量');
        return;
      }
    }
    const len = newDataSource.length;
    if (len >= 2) {
      newDataSource[len - 1] = { low: newDataSource[len - 2].high ? newDataSource[len - 2].high : newDataSource[len - 2].low, high: '', value: newDataSource[len - 1].value };
      const obj = { low: newDataSource[len - 2].high ? newDataSource[len - 2].high : newDataSource[len - 2].low, high: -1, value: '' };
      newDataSource.push(obj);
    } else if (len === 0) {
      newDataSource.push({ low: 0, high: '', value: '' });
    } else {
      newDataSource.push({ low: newDataSource[len - 1].high, high: -1, value: '' });
    }
    this.setState({
      dataSource: newDataSource,
    });
  }
  getColumn() {
    const { cumulativeObj } = this.props;
    const intervalTitle = cumulativeMap[cumulativeObj].slice(0, cumulativeMap[cumulativeObj].indexOf('求和'));
    return [{
      title: `区间(${intervalTitle})`,
      dataIndex: 'interval',
      align: 'center',
      width: 250,
      render: (text, record) => {
        if (record.high === -1) {
          return (
            <div>
              <span>{`${record.low} 以上`}</span>
            </div>
          );
        } else {
          return (
            <div>
              <span>{record.low}</span>
              <span style={{ margin: '0px 2px' }}>-</span>
              <InputNumber
                style={{ width: 100 }}
                value={record.high}
                onChange={this.changeValue.bind(this, record.key)}
                onBlur={this.changeHighValue.bind(this, record.key, record.high)}
              />
            </div>
          );
        }
      },
    }, {
      title: '折扣(请输入0~100的数,最多4位小数)',
      dataIndex: 'value',
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <InputNumber
              style={{ width: 130 }}
              value={record.value}
              onChange={this.changeDiscountValue.bind(this, record.key)}
            /> %
          </div>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <a onClick={this.handleDelete.bind(this, record.key)}>删除</a>
        );
      },
    }];
  }
  render() {
    const { dataSource } = this.state;
    const data = _.map(dataSource, (item, index) => {
      return {
        ...item,
        key: index
      };
    });
    return (
      <div>
        <Table
          columns={this.getColumn()}
          dataSource={data}
          bordered
          pagination={false}
          footer={() => {
            return <a onClick={this.handleAddPrice}>添加区间</a>;
          }}
        />
      </div>
    );
  }
}
