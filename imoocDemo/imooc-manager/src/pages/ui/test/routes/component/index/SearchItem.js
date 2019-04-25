/**
 * @author: shirleyyu
 */

import React from 'react';
import { Input } from 'antd';
import styles from '../../discount.less';
const { TextArea } = Input;

export default class SearchItem extends React.Component {
  state = {};

  onChange(key, val) {
    if (key === 'UserId') {
      const { value } = val.target;
      this.setState({ UserIdValue: value });
    }
    this.props.onChange(key, val);
  }
  render() {
    const { changedFields = {} } = this.props;
    const { Type, ActivityId, UserId = [] } = changedFields;
    let { UserIdValue } = this.state;
    UserIdValue = UserId.length > 0 ? UserIdValue : '';
    if (Type === 'user') {
      return (
        <React.Fragment>
          <span style={{ margin: '0 10px 0 20px' }}>客户UIN</span>
          <TextArea
            style={{ verticalAlign: 'top', marginBottom: '10px' }}
            placeholder="支持批量查询，多个UIN请用英文逗号或回车符分开"
            className={styles.wid150}
            rows={3}
            value={UserIdValue}
            onChange={this.onChange.bind(this, 'UserId')}
          />
        </React.Fragment>
      );
    } else if (Type === 'activity') {
      return (
        <React.Fragment>
          <span style={{ margin: '0 10px 0 20px' }}>活动ID</span>
          <Input
            size="small"
            style={{ marginBottom: '10px' }}
            className={styles.wid150}
            value={ActivityId}
            onChange={this.onChange.bind(this, 'ActivityId')}
          />
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}
