/*eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import { Table, Modal, Row, Col, Popconfirm } from 'antd';
import { cumulativeMap, payTypeMap, preMethodMap, priceModelMap } from '../../../config/account';
export default class AccountListInfo extends Component {
  state = {
    visible: false,
    cumulativeObj: null, //阶梯区间对象
    discountConfigList: [
      {
        ownerUinList: ['112321', '1231', '333'],
        objProductInfo: {
          include: [{ productCode: '全部', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }, { productCode: '全部2', subProductCode: '全部2', billingItem: '全部2', subBillingItem: '全部2' }],
          exclude: [{ productCode: '云服务器', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }, { productCode: '云服务器', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }],
        },
        objPayMode: 0,
        objRegionInfo: {
          include: [1, 3, 5, 7, 9],
          exclude: [],
        },
        preMethod: 1,
        preType: 2,
        preInfo: [
          { low: 0, high: 100, value: 80 },
          { low: 101, high: 999999999, value: 70 }
        ],
        statMethod: 1,
        isDefineRange: 1,
        key: 0,
        condPayMode: 0,
        condProductInfo: {
          include: [{ productCode: 'c全部', subProductCode: 'c全部', billingItem: 'c全部', subBillingItem: 'c全部' }, { productCode: '全部2', subProductCode: '全部2', billingItem: '全部2', subBillingItem: '全部2' }],
          exclude: [{ productCode: '云服务器', subProductCode: 'd全部', billingItem: '全部', subBillingItem: '全部' }, { productCode: '云服务器', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }],
        },
        condRegionInfo: {
          include: [1, 5, 7, 9],
          exclude: [],
        },
      },
      {
        ownerUinList: ['112321', '1231', '333'],
        objProductInfo: {
          include: [{ productCode: '全部', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }, { productCode: '全部2', subProductCode: '全部2', billingItem: '全部2', subBillingItem: '全部2' }],
          exclude: [{ productCode: '云服务器', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }, { productCode: '云服务器', subProductCode: '全部', billingItem: '全部', subBillingItem: '全部' }],
        },
        objPayMode: 0,
        preMethod: 1,
        preType: 2,
        preInfo: [
          { low: 0, high: 200, value: 80 },
          { low: 200, high: -1, value: 70 }
        ],
        statMethod: 1,
        isDefineRange: 0,
        key: 1,
      },
    ],
  }
  getColumns() {
    return [
      {
        title: '优惠UIN',
        dataIndex: 'ownerUinList',
        align: 'center',
        width: 100,
        render: (text) => {
          return (
            <span>{text.join(',')}</span>
          );
        }
      },
      {
        title: '产品名称',
        dataIndex: 'objProductInfo.include',
        align: 'center',
        width: 240,
        render: (text) => {
          return (
            <div>
              {
                text.map((item) => {
                  return (
                    <p key={item.productCode}>{Object.values(item).join('|')}</p>
                  );
                })
              }
            </div>
          );
        }
      },
      {
        title: '排除产品',
        dataIndex: 'objProductInfo.exclude',
        align: 'center',
        width: 240,
        render: (text) => {
          return (
            <div>
              {
                text.map((item, index) => {
                  return (
                    <p key={`${index}_${item.productCode}`}>{Object.values(item).join('|')}</p>
                  );
                })
              }
            </div>
          );
        }
      },
      {
        title: '计费模式',
        dataIndex: 'objPayMode',
        align: 'center',
        width: 100,
        render: (text) => {
          return payTypeMap[text];
        }
      },
      {
        title: '优惠类型',
        dataIndex: 'preMethod',
        align: 'center',
        width: 100,
        render: (text) => {
          return preMethodMap[text];
        }
      },
      {
        title: '价格模型',
        dataIndex: 'preType',
        align: 'center',
        width: 100,
        render: (text) => {
          return priceModelMap[text];
        }
      },
      {
        title: '折扣',
        dataIndex: 'preInfo',
        align: 'center',
        width: 240,
        render: (text) => {
          return (
            <div>
              {
                text.map((item, index) => {
                  if (item.high === -1) {
                    return (
                      <p key={`${index}_${item.low}`}>{`${item.low}以上，${item.value}%`}</p>
                    );
                  }
                  return (
                    <p key={`${index}_${item.low}`}>{`${item.low} - ${item.high}元，${item.value}%`}</p>
                  );
                })
              }
            </div>
          );
        }
      },
      {
        title: '阶梯累计对象',
        dataIndex: 'statMethod',
        align: 'center',
        width: 140,
        render: (text) => {
          return cumulativeMap[text];
        }
      },
      {
        title: '自定义阶梯区间',
        dataIndex: 'isDefineRange',
        align: 'center',
        width: 140,
        render: (text) => {
          return text ? <span style={{ color: '#4d4cc7' }}>是</span> : <span>否</span>;
        }
      },
      {
        title: '阶梯区间计算',
        align: 'center',
        width: 140,
        render: (text, record, index) => {
          return record.isDefineRange ? <span style={{ color: '#4d4cc7', cursor: 'pointer' }} onClick={this.showcumulative.bind(this, index)}>查看</span> : null;
        }
      },
      {
        title: '操作',
        align: 'center',
        fixed: 'right',
        width: 140,
        render: (text, record, index) => {
          return (
            <div>
              <a onClick={this.handleEdit.bind(this, index)}>编辑</a>
              <a style={{ padding: '0px 4px' }} onClick={this.handleCopy.bind(this, index)}>复制</a>
              <Popconfirm title="你确定要删除吗?" onConfirm={this.handleDelete.bind(this, index)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        }
      },
    ];
  }
  showcumulative = (index) => {
    const { discountConfigList } = this.state;
    const newObj = {
      condProductInfo: discountConfigList[index].condProductInfo,
      condPayMode: discountConfigList[index].condPayMode,
      condRegionInfo: discountConfigList[index].condRegionInfo,
    };
    this.setState({
      visible: true,
      cumulativeObj: newObj,
    });
  }
  handleEdit = (index) => {
    console.log(index);
    // this.setState({
    //   showAccountConfig: true
    // });
  }
  handleCopy = (index) => {
    const { discountConfigList } = this.state;
    const tempOneList = JSON.parse(JSON.stringify(discountConfigList[index]));
    const newList = [...discountConfigList];
    tempOneList.key = newList[newList.length - 1].key + 1;
    newList.push(tempOneList);
    this.setState({
      discountConfigList: newList
    });
  }
  handleDelete = (index) => {
    const { discountConfigList } = this.state;
    const newList = [...discountConfigList];
    newList.splice(index, 1);
    this.setState({
      discountConfigList: newList
    });
  }
  render() {
    const { discountConfigList, visible, cumulativeObj } = this.state;
    return (
      <div style={{ marginLeft: 20 }}>
        <Table
          columns={this.getColumns()}
          dataSource={discountConfigList}
          scroll={{ x: 1600 }}
          bordered
          pagination={false}
        />
        <Modal
          title="阶梯计算逻辑"
          visible={visible}
          onCancel={() => {
            this.setState({
              visible: false
            });
          }}
          footer={null}
        >
          <Row style={{ border: '1px solid #ccc', textAlign: 'center', minHeight: '30px' }}>
            <Col span={6} style={{ paddingTop: '6px' }}>
              阶梯区间产品
            </Col>
            <Col span={14} style={{ paddingLeft: '10px', paddingTop: '6px', borderLeft: '1px solid #ccc' }}>
              {
                cumulativeObj && cumulativeObj.condProductInfo.include.map((item, index) => {
                  return (
                    <p key={index} style={{ marginTop: -4 }}>{`包含 ${Object.values(item).join('|')}`}</p>
                  );
                })
              }
              {
                cumulativeObj && cumulativeObj.condProductInfo.exclude.map((item, index) => {
                  return (
                    <p key={index} style={{ marginTop: -4 }}>{`排除 ${Object.values(item).join('|')}`}</p>
                  );
                })
              }
            </Col>
          </Row>
          <Row style={{ borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', textAlign: 'center', minHeight: '30px' }}>
            <Col span={6} style={{ paddingTop: '6px' }}>
              计费模式
            </Col>
            <Col span={14} style={{ paddingLeft: '10px', paddingTop: '6px', borderLeft: '1px solid #ccc', minHeight: '30px' }}>
              {
                cumulativeObj && payTypeMap[cumulativeObj.condPayMode]
              }
            </Col>
          </Row>
          <Row style={{ border: '1px solid #ccc', textAlign: 'center', minHeight: '30px' }}>
            <Col span={6} style={{ paddingTop: '6px' }}>
              地域
            </Col>
            <Col span={14} style={{ paddingLeft: '10px', paddingTop: '6px', borderLeft: '1px solid #ccc', minHeight: '30px' }}>
              {
                cumulativeObj && cumulativeObj.condRegionInfo.include.map((item, index) => {
                  return (
                    <p key={index} style={{ marginTop: -4 }}>{`包含 ${item}`}</p>
                  );
                })
              }
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
