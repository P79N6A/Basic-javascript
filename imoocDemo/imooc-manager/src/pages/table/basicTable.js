import React, { Component } from 'react';
import { Card, Table, message, Button } from 'antd';
// import '../../mock/index';
import axios from '../../axios/index';

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
    axios.ajax({
      url: '/table/list',
      isShowLoading: true,
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          newData: res.data,
          selectedRowKeys: [],
          selectedRows: null,
        });
      } else {
        message.error(res.msg);
      }
    }).catch(error => {
      message.error(error);
    })
  }
  //点击行
  onRowClick = (record, index) => {
    let selectedRowKeys = [index+1];
    // console.log('seleKey', selectedRowKeys);
    let selectedItem = record;
    this.setState({
      selectedRowKeys,
      selectedItem,
    });
  }
  handleChangeSelection = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, selectedRows);
    let ids = [];
    selectedRows.map(item => {
      ids.push(item.id);
    })
    this.setState({
      selectedRowKeys,
      ids,
    })
  }
  handleDelete = () => {
    const { ids = [] } = this.state;
    message.success('删除成功'+ids.join(','), 1);
    setTimeout(() => {
      this.getList(); 
    }, 1100);
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
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
    };
    const rowMutilSelection = {
      type: 'checkbox',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange:this.handleChangeSelection
    }
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
        <Card title="单选框动态表格" style={{ marginTop: 30 }}>
          <Table 
            columns={columns}
            dataSource={this.state.newData}
            rowKey={(item) => item.id}
            rowSelection={rowSelection}
            onRow={(record, index) => {
              return {
                onClick: () => this.onRowClick(record, index)
              }
            }}
          />
        </Card>
        <Card title="多选框动态表格" style={{ marginTop: 30 }}>
          <div>
            <Button style={{ marginBottom: 20 }} onClick={this.handleDelete}>删除</Button>
          </div>
          <Table 
            columns={columns}
            dataSource={this.state.newData}
            rowKey={(item) => item.id}
            rowSelection={rowMutilSelection}
          />
        </Card>
      </div>
    );
  }
}