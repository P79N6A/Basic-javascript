/**
 * @description: 账户级优惠的筛选条件
 * @author: shirleyyu
 * @date: 2019-03-21
 */
import React from 'react';
import moment from 'moment';
import { Input, DatePicker } from 'antd';
import styles from '../../discount.less';
import { searchTimeMap } from './config';
const { RangePicker } = DatePicker;


export default class CommonSearchItem extends React.Component {
  state = {
    mode: ['month', 'month'],
  };

  onChange(key, val, ext) {
    if (['CreatTime', 'UpdateTime'].indexOf(key) > -1) {
      this.setState({ [key]: val });
    }
    this.props.onChange(key, val, ext);
  }

  onPanelChange(key, val) {
    this.setState({
      [key]: val,
      mode: ['month', 'month'],
    });
    this.props.onChange(key, val, [moment(val[0]).startOf('month').format('YYYY-MM-DD 00:00:00'), moment(val[1]).endOf('month').format('YYYY-MM-DD 23:59:59')]);
  }

  showTime(key) {
    const { changedFields = {} } = this.props;
    const subKeys = searchTimeMap[key] || [];
    const time = subKeys.every(sk => !!changedFields[sk]) ? this.state[key] : [];
    return time;
  }

  render() {
    const { Creator = '', modifyor = '' } = (this.props.changedFields || {});
    const showBeginTime = this.showTime('BeginTime');
    const showEndTime = this.showTime('EndTime');
    const showCreatTime = this.showTime('CreatTime');
    const showUpdateTime = this.showTime('UpdateTime');
    const { mode } = this.state;

    return (
      <React.Fragment>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '10px' }}>生效时间</span>
          <RangePicker
            mode={mode}
            size="small"
            value={showBeginTime}
            format="YYYY-MM"
            className={styles.search_date}
            onPanelChange={this.onPanelChange.bind(this, 'BeginTime')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>失效时间</span>
          <RangePicker
            mode={mode}
            size="small"
            value={showEndTime}
            format="YYYY-MM"
            className={styles.search_date}
            onPanelChange={this.onPanelChange.bind(this, 'EndTime')}
          />
        </div>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '10px' }}>创建时间</span>
          <RangePicker
            size="small"
            value={showCreatTime}
            format="YYYY-MM-DD hh:mm:ss"
            showTime={{ format: 'hh:mm:ss' }}
            className={styles.search_date}
            onChange={this.onChange.bind(this, 'CreatTime')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>更新时间</span>
          <RangePicker
            size="small"
            value={showUpdateTime}
            format="YYYY-MM-DD hh:mm:ss"
            showTime={{ format: 'hh:mm:ss' }}
            className={styles.search_date}
            onChange={this.onChange.bind(this, 'UpdateTime')}
          />
        </div>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '23px' }}>创建人</span>
          <Input
            placeholder="创建人RTX"
            size="small"
            className={styles.wid150}
            value={Creator}
            onChange={this.onChange.bind(this, 'Creator')}
          />
          <span style={{ margin: '0 10px 0 23px' }}>更新人</span>
          <Input
            placeholder="更新人RTX"
            size="small"
            className={styles.wid150}
            value={modifyor}
            onChange={this.onChange.bind(this, 'modifyor')}
          />
        </div>
      </React.Fragment>
    );
  }
}

