/**
 * @description: 添加折扣组件
 * @author: shirleyyu
 * @date: 2018-02-24
 */

import React from 'react';
import moment from 'moment';
import { DatePicker, message } from 'antd';
import styles from '../../discount.less';

export default class CustomizeDatePicker extends React.Component {
  state = {
    endOpen: false,
  };

  onOpenChange = (key, open) => {
    const {
      BeginTime,
      EndTime,
      onChange,
    } = this.props;
    if (!!BeginTime && !!EndTime) {
      if (new Date(BeginTime).getTime() >= new Date(EndTime).getTime()) {
        message.error('生效时间不能大于失效时间', 10);
        onChange(key, '', '');
      }
    }
    if (key === 'BeginTime') {
      if (!open) {
        this.setState({ endOpen: true });
      }
    } else if (key === 'EndTime') {
      this.setState({ endOpen: open });
    }
  }

  disabledBeginDate = (BeginTime) => {
    if (!BeginTime) {
      return false;
    }
    return moment(BeginTime.format('YYYY-MM-DD')).toDate().getTime() < moment(moment(Date.now()).format('YYYY-MM-DD')).toDate().getTime();
  }

  disabledEndDate = (EndTime) => {
    if (!EndTime) {
      return false;
    }
    const { BeginTime } = this.props;
    if (!BeginTime) {
      return moment(EndTime.format('YYYY-MM-DD')).toDate().getTime() < moment(moment(Date.now()).format('YYYY-MM-DD')).toDate().getTime();
    }
    return moment(BeginTime).toDate().getTime() >= moment(EndTime).toDate().getTime();
  }

  render() {
    const {
      BeginTime,
      EndTime,
      onChange,
    } = this.props;
    const showBeginTime = BeginTime && moment(BeginTime).isValid() ? moment(BeginTime) : null;
    const showEndTime = EndTime && moment(EndTime).isValid() ? moment(EndTime) : null;
    const { endOpen = '' } = this.state;

    return (
      <React.Fragment>
        <DatePicker
          showTime
          placeholder="生效时间"
          value={showBeginTime}
          className={styles.wid200}
          format="YYYY-MM-DD HH:mm:ss"
          style={{ marginRight: '5px' }}
          disabledDate={this.disabledBeginDate}
          onChange={(val, date) => { onChange('BeginTime', date); }}
          onOpenChange={this.onOpenChange.bind(this, 'BeginTime')}
        />
        ~
        <DatePicker
          open={endOpen}
          value={showEndTime}
          placeholder="失效时间"
          className={styles.wid200}
          format="YYYY-MM-DD HH:mm:ss"
          style={{ marginLeft: '5px' }}
          disabledDate={this.disabledEndDate}
          showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
          onChange={(val, date) => { onChange('EndTime', date); }}
          onOpenChange={this.onOpenChange.bind(this, 'EndTime')}
        />
      </React.Fragment>
    );
  }
}
