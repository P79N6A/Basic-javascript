import React, { Component } from 'react';
import { Card, Table, message } from 'antd';
import axios from 'axios';
import '../../mock/index';

export default class BasicTable extends Component {
  state={
    data: [],
    newData: [],
  }
  componentDidMount() {
    const data=[
      {
        id: '1',
        userName: 'ljl',
        sex: '1',
        state: '1',
        hobby: '篮球',
        birthday: '2018-01-01',
        address: '深圳市宝安区',
        time: '09:00',
      },
      {
        id: '2',
        userName: 'wjh',
        sex: '1',
        state: '1',
        hobby: '篮球',
        birthday: '2018-01-01',
        address: '深圳市宝安区',
        time: '09:00',
      },
      {
        id: '3',
        userName: 'Tom',
        sex: '1',
        state: '1',
        hobby: '篮球',
        birthday: '2018-01-01',
        address: '深圳市宝安区',
        time: '09:00',
      },
      {
        id: '4',
        userName: 'Jack',
        sex: '1',
        state: '1',
        hobby: '篮球',
        birthday: '2018-01-01',
        address: '深圳市宝安区',
        time: '09:00',
      }
    ];
    this.setState({
      data
    });
    this.getList();
  }

  getList() {
    let baseUrl = 'http://www.mymock.com/';
    axios.get(`${baseUrl}getList`).then(res => {
      // console.log('res', res.data);
      if (res.data.code === 0) {
        this.setState({
          newData: res.data.res,
        });
      } else {
        message.error('数据为空');
      }
    });
  }
  render() {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (item) => {
          return item == 1 ? '男' : '女';
        }
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (item) => {
          let config = ['风流倜傥', '才子佳人', '美女与野兽', '人生如梦', '你是我的']
          return config[item]
        }
      },
      {
        title: '爱好',
        dataIndex: 'hobby',
      },
      {
        title: '生日',
        dataIndex: 'birthday',
      },
      {
        title: '联系地址',
        dataIndex: 'address',
      },
      {
        title: '早起时间',
        dataIndex: 'time',
      },
    ];
    return (
      <div>
        <Card title="基础表格">
          <Table 
            columns={columns}
            dataSource={this.state.data}
            rowKey={(item) => item.id}
          />
        </Card>
        <Card title="动态表格">
          <Table 
            columns={columns}
            dataSource={this.state.newData}
            rowKey={(item) => item.id}
          />
        </Card>
      </div>
    );
  }
}