import React, { Component } from 'react';
import { Card, Table, message, Button } from 'antd';
import axios from '../../axios/index';
import utils from '../../utils/util';

export default class BasicTable extends Component {
  state = {
    data: [],
    dataLeft: [],
    pagination: {},
  }
  params = {
    page: 1
  }
  componentDidMount() {
    this.request();
  }
  request() {
    axios.ajax({
      url: '/table/highList',
      data: {
        page: this.params.page
      }
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          data: res.res.list,
          dataLeft: res.res.list,
          pagination: utils.pagination(res, (current) => {
            this.params.page = current;
            //重新请求
            this.request();
          })
        });
      }
    }).catch(error => {
      message.error(error);
    })
  }
  handleChange = (pagination, filters, sorter) => {
    this.setState({
      sorterOrder: sorter.order
    });
  }

  handleDelete = (record) => {
    console.log(record);
    message.success('删除成功'+record.id);
  }

  render() {
    const { data, dataLeft, sorterOrder } = this.state;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (item) => {
          return item == 1 ? '男' : '女';
        },
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (item) => {
          let config = ['风流倜傥', '才子佳人', '美女与野兽', '人生如梦', '你是我的']
          return config[item]
        },
        width: 140,
      },
      {
        title: '爱好',
        dataIndex: 'hobby',
        width: 100,
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        width: 100,
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        width: 160,
      },
      {
        title: '早起时间',
        dataIndex: 'time',
      },
    ];
    const columnsSort = [
      {
        title: 'id',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
        sorter: (a, b) => {
          return a.age - b.age;
        },
        // sorterOrder: sorterOrder
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (item) => {
          return item == 1 ? '男' : '女';
        },
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (item) => {
          let config = ['风流倜傥', '才子佳人', '美女与野兽', '人生如梦', '你是我的']
          return config[item]
        },
        width: 140,
      },
      {
        title: '爱好',
        dataIndex: 'hobby',
        width: 100,
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        width: 100,
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        width: 160,
      },
      {
        title: '早起时间',
        dataIndex: 'time',
      },
    ];
    const columnsLeft = [
      {
        title: 'id',
        dataIndex: 'id',
        width: 80,
        fixed: 'left',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
        fixed: 'left',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (item) => {
          return item == 1 ? '男' : '女';
        },
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (item) => {
          let config = ['风流倜傥', '才子佳人', '美女与野兽', '人生如梦', '你是我的']
          return config[item]
        },
        width: 140,
      },
      {
        title: '爱好',
        dataIndex: 'hobby',
        width: 100,
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        width: 160,
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        width: 160,
      },
      {
        title: '早起时间',
        dataIndex: 'time',
        width: 100,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'desc1',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'desc2',
        width: 100,
        fixed: 'right',
      },
    ];
    const columnsAction = [
      {
        title: 'id',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        width: 100,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: (item) => {
          return item == 1 ? '男' : '女';
        },
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (item) => {
          let config = ['风流倜傥', '才子佳人', '美女与野兽', '人生如梦', '你是我的']
          return config[item]
        },
        width: 140,
      },
      {
        title: '爱好',
        dataIndex: 'hobby',
        width: 100,
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        width: 160,
      },
      {
        title: '联系地址',
        dataIndex: 'address',
        width: 160,
      },
      {
        title: '早起时间',
        dataIndex: 'time',
        width: 100,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'desc',
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'desc1',
        width: 100,
      },
      {
        title: '操作',
        width: 100,
        render: (text, record) => { 
          return <Button onClick={() =>{ this.handleDelete(record) }}>删除</Button>
        }
      },
    ];
    
    return (
      <div>
        <Card title="头部固定">
          <Table
            bordered
            columns={columns}
            dataSource={data}
            rowKey={(item) => item.id}
            scroll={{ y: 300 }}
            pagination={this.state.pagination}
          />
        </Card>
        <Card title="左右固定">
          <Table
            bordered
            columns={columnsLeft}
            dataSource={dataLeft}
            rowKey={(item) => item.id}
            scroll={{ x: 1342 }}
          />
        </Card>
        <Card title="排序">
          <Table
            bordered
            columns={columnsSort}
            dataSource={dataLeft}
            rowKey={(item) => item.id}
            onChange={this.handleChange}
          />
        </Card>
        <Card title="操作">
          <Table
            bordered
            columns={columnsAction}
            dataSource={dataLeft}
            rowKey={(item) => item.id}
            onChange={this.handleChange}
          />
        </Card>
      </div>
    );
  }
}