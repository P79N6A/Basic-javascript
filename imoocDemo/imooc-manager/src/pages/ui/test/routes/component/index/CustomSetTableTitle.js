/**
 * 独立成一个 js 是为了控制 checkbox 对齐而不影响其它的 checkbox
 */

import React from 'react';
import { Modal, Checkbox } from 'antd';
import './settitle.less';
const CheckboxGroup = Checkbox.Group;

export default class CustomSetTableTitle extends React.Component {
  render() {
    const { isShowSetTableTitleModal, customTableTitle, colOptions, onChangeState, showSetTableTitleModal, cancelSetTableTitleModal } = this.props;

    return (
      <Modal
        title="自定义列表字段"
        visible={isShowSetTableTitleModal}
        onOk={showSetTableTitleModal}
        onCancel={cancelSetTableTitleModal}
      >
        <div style={{ padding: '6px 10px', backgroundColor: '#1d9fc56e', marginBottom: '20px' }}>请选择您想显示的列表详细信息。</div>
        <CheckboxGroup value={customTableTitle} options={colOptions} onChange={(value) => { onChangeState({ customTableTitle: value }); }} />
      </Modal>
    );
  }
}
