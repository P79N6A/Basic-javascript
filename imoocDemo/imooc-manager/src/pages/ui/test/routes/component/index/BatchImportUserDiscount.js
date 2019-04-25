/**
 * 批量导入用户指定价
 */

import React from 'react';
import { Modal, Button, Popconfirm, Input, message, Radio } from 'antd';
import Api from '../../../services/index';
import { getLoginInfo } from '../../../../../utils/utils';
const { TextArea } = Input;
const RadioGroup = Radio.Group;

export default class BatchImportUserDiscount extends React.Component {
  state = {
    discountType: 'userDiscount',
    addUserRtx: getLoginInfo().name || '',
  };

  cancel() {
    this.setState({ discountType: 'userDiscount', batchDiscount: '' });
    this.props.onChangeState({ batchImportUserDiscount: false });
  }

  save(isForceAdd = 0) {
    const { discountType, batchDiscount, confirmLoading, addUserRtx } = this.state;
    if (confirmLoading) {
      return;
    }
    const tipMap = {
      discountType: '请选择优惠类型',
      batchDiscount: '没有数据',
      addUserRtx: '请先登录',
    };
    const flag = Object.keys(tipMap).every((key) => {
      if (!this.state[key].trim()) {
        message.error(tipMap[key]);
        return false;
      }
      return true;
    });
    if (!flag) {
      return;
    }
    const params = { addUserRtx, isForceAdd, content: batchDiscount.trim() };
    const interfaceName = discountType === 'userDiscount' ? 'importUserDiscount' : 'importUserDiscountPricePid';
    this.setState({ confirmLoading: true }, () => {
      Api[interfaceName](params)
        .then((res) => {
          if (res.code === 0) {
            message.success('导入成功', () => {
              window.location.reload();
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          let conflictDiscountIds = [];
          if (e.code === 600000 || e.code === 600001) {
            conflictDiscountIds = e.data.discountIds;
          } else {
            message.error(`提交出错！${e.message}`);
          }
          this.setState({
            confirmLoading: false,
            conflictDiscountIds,
            isForceAdd: e.code === 600000 ? conflictDiscountIds.some((ids = []) => ids.length > 0) : 0,
          });
        });
    });
  }

  onChange(key, value) {
    this.setState({ [key]: value ? value.trim() : value });
  }

  modalFooter() {
    return (
      <div>
        <Button onClick={this.cancel.bind(this)}>取消</Button>
        <Popconfirm
          title="确定保存吗？"
          okText="保存"
          cancelText="取消"
          onConfirm={this.save.bind(this, 0)}
        >
          <Button type="primary" loading={this.state.confirmLoading}>保存</Button>
        </Popconfirm>
      </div>
    );
  }

  render() {
    const { batchImportUserDiscount } = this.props;
    const { batchDiscount, discountType, confirmLoading, isForceAdd, conflictDiscountIds = [] } = this.state;
    const ConflictIdsCom = [];
    conflictDiscountIds.join(',').split(',').forEach((id) => {
      ConflictIdsCom.push(<a style={{ textDecorationLine: 'underline', marginRight: '10px' }} onClick={() => window.open(`/discountTool/index?Id=${id}`, '_blank')}>{`${id}`}</a >);
    });

    return (
      <Modal
        width="80%"
        title="批量导入用户优惠"
        maskClosable={false}
        visible={batchImportUserDiscount}
        onCancel={this.cancel.bind(this)}
        footer={this.modalFooter()}
      >
        <div style={{ marginBottom: '10px' }}>
          <span>优惠类型：</span>
          <RadioGroup
            onChange={val => this.onChange('discountType', val.target.value)}
            value={discountType}
          >
            <Radio value="userDiscount">折扣</Radio>
            <Radio value="userDiscountPrice">指定价</Radio>
          </RadioGroup>
        </div>
        <Button
          type="primary"
          icon="download"
          size="small"
          style={{ margin: '0 10px 20px 0' }}
          href={discountType === 'userDiscount' ? 'http://file.tapd.oa.com/pt_jifei/attachments/download/1010140771504222377/wiki' : 'http://file.tapd.oa.com/pt_jifei/attachments/download/1010140771504222573/wiki'}
        >
          下载{discountType === 'userDiscount' ? '折扣' : '指定价'}模板
        </Button>
        {
          discountType === 'userDiscountPrice'
            ?
            (
              <a href="http://tapd.oa.com/pt_jifei/markdown_wikis/view/#1010140771008129507" target="_blank" rel="noopener noreferrer">导入折扣指定价参数说明</a>
            )
            :
            null
        }
        <div style={{ color: 'rgb(234, 130, 11)', marginBottom: '10px' }}>温馨提示：不能复制标题，一次最多只能导入200条。</div>
        <TextArea
          cols="100"
          autosize={{ minRows: 10, maxRows: 25 }}
          style={{ width: '100%' }}
          value={batchDiscount}
          placeholder="请粘贴模板中填入的内容，不能复制标题。一次最多只能导入200条"
          onChange={val => this.onChange('batchDiscount', val.target.value)}
        />
        <Modal
          maskClosable={false}
          title="提交失败"
          visible={!!isForceAdd}
          confirmLoading={confirmLoading}
          onOk={this.save.bind(this, isForceAdd)}
          onCancel={() => { this.setState({ confirmLoading: false, isForceAdd: 0 }); }}
          okText="强制提交"
          cancelText="取消"
        >
          <p style={{ color: 'red' }}>提交失败，有可能相互覆盖的折扣存在，请确认是否强制提交</p>
          <p>冲突的折扣 ID：</p>
          {ConflictIdsCom}
        </Modal>
      </Modal >
    );
  }
}

