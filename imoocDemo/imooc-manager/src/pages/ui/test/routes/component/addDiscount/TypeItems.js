/**
 * 查询折扣页面、新增四层产品页面用到这个组件
 * @author: shirleyyu
 */

import React from 'react';
import { Input } from 'antd';
const { TextArea } = Input;

export default class TypeItems extends React.Component {
  state = {};

  onChange(key, val) {
    if (key === 'UserId') {
      const { value } = val.target;
      this.setState({ UserIdValue: value });
    }
    this.props.onChange(key, val);
  }

  // 批量查询实名认证名称
  onBlurUserId() {
    const { loading, UserId = [], Api, onChangeState } = this.props;
    if (loading || UserId.length > 20) {
      return;
    }
    if (UserId.length === 0) {
      onChangeState({
        loading: false,
        userVerifyName: '',
      });
      return;
    }
    onChangeState({ loading: true }, () => {
      Api.getVerifyNameBatch({ uins: UserId })
        .then((res) => {
          if (res.code === 0) {
            onChangeState({
              loading: false,
              userVerifyName: res.data,
            });
          } else {
            throw res;
          }
        })
        .catch((e) => {
          onChangeState({ loading: false });
          console.log('getVerifyNameBatch接口出错', e);
        });
    });
  }

  render() {
    const { Type, UserId = [], ActivityId, styles, userVerifyName, isEdit } = this.props;
    let { UserIdValue } = this.state;

    if (Type === 'user') {
      UserIdValue = isEdit ? UserId.join(',') : (UserId.length > 0 ? UserIdValue : '');
      return (
        <div>
          <span style={{ margin: '0 10px 0 0', verticalAlign: 'top' }}>客户UIN<span style={{ color: 'red', verticalAlign: 'top' }}>*</span></span>
          {
            !isEdit
              ?
              (
                <TextArea
                  rows={3}
                  disabled={isEdit}
                  value={UserIdValue}
                  className={styles.wid150}
                  placeholder="支持批量查询，多个UIN请用英文逗号或回车符分开"
                  onChange={this.onChange.bind(this, 'UserId')}
                  onBlur={() => this.onBlurUserId()}
                />
              )
              :
              (<span>{UserIdValue}</span>)
          }
          {
            !!userVerifyName
              ?
              (
                <span className={styles.verify_name}>
                  <table>
                    <tbody>
                      {
                        Object.keys(userVerifyName).map(k => (
                          <tr key={k}>
                            <td className={styles.verify_td}>{k}</td>
                            <td className={styles.verify_td}>{userVerifyName[k]}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </span>
              )
              :
              null
          }
        </div>
      );
    } else if (Type === 'activity') {
      return (
        <div>
          <span style={{ margin: '0 10px 0 0' }}>活动ID<span style={{ color: 'red' }}>* </span></span>
          {
            !isEdit
              ?
              (
                <Input
                  size="small"
                  disabled={isEdit}
                  value={ActivityId}
                  className={styles.wid150}
                  onChange={this.onChange.bind(this, 'ActivityId')}
                />
              )
              :
              (<span>{ActivityId}</span>)
          }
        </div>
      );
    } else {
      return null;
    }
  }
}
