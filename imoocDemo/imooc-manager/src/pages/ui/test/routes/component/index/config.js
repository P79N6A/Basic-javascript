import React from 'react';
import { Popover } from 'antd';
import { oldPriceTypeMap } from '../../../config/index';

const statusMap = {
  0: '待生效',
  1: '生效中',
  2: '已失效',
};

const searchTimeMap = {
  BeginTime: ['preFBeginTime', 'tailFBeginTime'],
  EndTime: ['preFEndTime', 'tailFEndTime'],
  CreatTime: ['preFCreateTime', 'tailFCreateTime'],
  UpdateTime: ['preFUpdateTime', 'tailFUpdateTime'], // 官网、运营折扣更新时间
  AutoUpdateTime: ['preFAutoUpdateTime', 'tailFAutoUpdateTime'], // 用户折扣更新时间（FUpdateTime在这里是优先级）
};

const user = [
  {
    title: '客户名称',
    dataIndex: 'verifyName',
    key: 'verifyName',
    width: 150,
    render: (text, record) => record.verifyName,
  },
  {
    title: 'UIN',
    dataIndex: 'FUserId',
    key: 'FUserId',
    width: 120,
  },
  {
    title: '是否享受官网折扣',
    dataIndex: 'FConflictText',
    key: 'FConflict',
    width: 90,
    render: (text, record) => record.FConflictText || text,
  },
  {
    title: '优先级',
    dataIndex: 'FUpdateTime',
    key: 'FUpdateTime',
    width: 135,
    editType: 'time',
  },
];
const activity = [
  {
    title: '活动ID',
    dataIndex: 'FActivityId',
    key: 'FActivityId',
    width: 100,
  },
];
const columns1 = [
  {
    title: '优惠ID',
    dataIndex: 'FId',
    key: 'FId',
    width: 70,
  },
  {
    title: '合同价ID',
    dataIndex: 'pricePid',
    key: 'pricePid',
    width: 60,
  },
  {
    title: '优惠对象',
    dataIndex: 'TypeName',
    key: 'Type',
    width: 130,
    render: (text, record) => record.TypeName,
  },
  {
    title: '产品大类',
    dataIndex: 'owner_class',
    key: 'owner_class',
    width: 100,
  },
  {
    title: '产品名称',
    dataIndex: 'product_name',
    key: 'product_name',
    width: 120,
  },
  {
    title: '子产品名称',
    dataIndex: 'sub_product_name',
    key: 'sub_product_name',
    width: 120,
  },
  {
    title: '计费项名称',
    dataIndex: 'billing_item_name',
    key: 'billing_item_name',
    width: 120,
  },
  {
    title: '计费细项名称',
    dataIndex: 'sub_billing_item_name',
    key: 'sub_billing_item_name',
    width: 120,
  },
  {
    title: '旧商品码',
    dataIndex: 'FBuId',
    key: 'FBuId',
    width: 120,
  },
  {
    title: '旧子商品码',
    dataIndex: 'FProductId',
    key: 'FProductId',
    width: 120,
  },
  {
    title: '付费模式',
    dataIndex: 'payMode',
    key: 'payMode',
    width: 100,
  },
  {
    title: '优惠条件',
    dataIndex: 'FConditionsMap',
    key: 'FConditionsMap',
    width: 300,
    render: text => text.map(c => <div>{c}</div>),
  },
  {
    title: '优惠类型',
    dataIndex: 'preferentialTypeText',
    key: 'preferentialType',
    width: 100,
    render: (text, record) => record.preferentialTypeText,
  },
  {
    title: '折扣',
    dataIndex: 'FDiscountText',
    key: 'FDiscount',
    width: 85,
    editType: 'input',
    render: (text, record) => record.FDiscountText,
  },
  {
    title: '合同价价格',
    dataIndex: 'pricesText',
    key: 'price',
    width: 150,
    render: (text, record) => (Array.isArray(record.pricesText) ? record.pricesText.map(price => <div>{price}</div>) : (record.pricesText || '')),
  },
  {
    title: '定价类型',
    dataIndex: 'pricetypeText',
    key: 'pricetype',
    width: 150,
    render: (text, record) => record.pricetypeText || oldPriceTypeMap[record.pricetype],
  },
  {
    title: '计费周期',
    dataIndex: 'timeunitText',
    key: 'timeunit',
    width: 150,
    render: (text, record) => record.timeunitText || text,
  },
  {
    title: '状态',
    dataIndex: 'FStatusText',
    key: 'FStatus',
    width: 80,
    editType: 'select',
    selectOption: statusMap,
    render: (text, record) => record.FStatusText,
  },
  {
    title: '生效时间',
    dataIndex: 'FBeginTime',
    key: 'FBeginTime',
    width: 165,
    editType: 'time',
  },
  {
    title: '失效时间',
    dataIndex: 'FEndTime',
    key: 'FEndTime',
    width: 165,
    editType: 'time',
  },
  {
    title: '创建时间',
    dataIndex: 'FCreateTime',
    key: 'FCreateTime',
    width: 165,
  },
  {
    title: '更新时间',
    dataIndex: 'realUpdateTime',
    key: 'realUpdateTime',
    width: 165,
  },
  {
    title: '是否新四层折扣',
    dataIndex: 'isNewDiscountText',
    key: 'is_new_discount',
    width: 80,
    render: (text, record) => record.isNewDiscountText,
  },
  {
    title: '创建人',
    dataIndex: 'FCreator',
    key: 'FCreator',
    width: 105,
  },
  {
    title: '备注',
    dataIndex: 'FRemarkAll',
    key: 'FRemark',
    width: 70,
    editType: 'input',
    render: (text, record) => {
      if (text) {
        return (
          <Popover content={record.FRemarkAll} title="">
            <a>查看</a>
          </Popover>
        );
      }
      return text;
    },
  },
  {
    title: '折扣来源',
    dataIndex: 'discount_origin',
    key: 'discount_origin',
    width: 80,
  },
];
const allColumns = {
  user,
  activity,
  columns1,
};

const initTableTitle = ['FId', 'product_name', 'sub_product_name', 'billing_item_name', 'sub_billing_item_name', 'preferentialType', 'payMode', 'FConditionsMap', 'FDiscount', 'price', 'pricetype', 'FStatus', 'FBeginTime', 'FEndTime', 'FCreator', 'FRemark', 'is_new_discount'];

export {
  statusMap,
  searchTimeMap,
  allColumns,
  initTableTitle,
};
