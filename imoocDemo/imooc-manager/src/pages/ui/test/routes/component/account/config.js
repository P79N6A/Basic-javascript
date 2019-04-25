const searchTimeMap = {
  BeginTime: ['minBeginTime', 'maxBeginTime'],
  EndTime: ['minEndTime', 'maxEndTime'],
  CreatTime: ['minCreateTime', 'maxCreateTime'],
  UpdateTime: ['minUpdateTime', 'maxUpdateTime'],
};

const allColumns = [
  {
    title: '优惠ID',
    dataIndex: 'id',
    key: 'id',
    width: 70,
  },
  {
    title: '客户名称',
    dataIndex: 'companyName',
    key: 'companyName',
    width: 70,
  },
  {
    title: '客户UIN列表',
    dataIndex: 'ownerUinList',
    key: 'ownerUinList',
    width: 150,
  },
  {
    title: '客户类型',
    dataIndex: 'uinType',
    key: 'uinType',
    width: 100,
  },
  {
    title: '生效时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
    width: 150,
  },
  {
    title: '失效时间',
    dataIndex: 'endTime',
    key: 'endTime',
    width: 150,
  },
  {
    title: '优惠状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    editType: 'select',
  },
  {
    title: '创建时间',
    dataIndex: 'addTime',
    key: 'addTime',
    width: 150,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 150,
  },
  {
    title: '创建人',
    dataIndex: 'operator',
    key: 'operator',
    width: 100,
  },
  {
    title: '更新人',
    dataIndex: 'modifyor',
    key: 'modifyor',
    width: 100,
  },
];

const initTableTitle = ['id', 'companyName', 'ownerUinList', 'uinType', 'beginTime', 'endTime', 'status', 'addTime', 'updateTime', 'operator', 'modifyor'];

export {
  searchTimeMap,
  allColumns,
  initTableTitle,
};
