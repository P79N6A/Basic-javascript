/**
 * @description: 折扣管理的筛选条件
 * @author: shirleyyu
 * @date: 2018-02-24
 * @interface: 产品名称和子产品名称：“获取商品列表”
 */
import React from 'react';
import { Input, DatePicker } from 'antd';
import styles from '../../discount.less';
import { searchTimeMap } from './config';
const { RangePicker } = DatePicker;


export default class CommonSearchItem extends React.Component {
  state = {};
  onChange(key, val, ext) {
    if (key === 'Id') {
      this.setState({ [key]: val.target.value });
    } else if (['BeginTime', 'EndTime', 'CreatTime', 'UpdateTime', 'AutoUpdateTime'].indexOf(key) > -1) {
      this.setState({ [key]: val });
    }
    this.props.onChange(key, val, ext);
  }

  showTime(key) {
    const { changedFields = {} } = this.props;
    const subKeys = searchTimeMap[key] || [];
    const time = subKeys.every(sk => !!changedFields[sk]) ? this.state[key] : [];
    return time;
  }

  render() {
    const { BuId = '', ProductId = '', Id = [], pricePid = '', Creator = '', Type } = (this.props.changedFields || {});
    const showId = Id.length > 0 ? this.state.Id : '';
    const showBeginTime = this.showTime('BeginTime');
    const showEndTime = this.showTime('EndTime');
    const showCreatTime = this.showTime('EndTime');
    const showUpdateTime = this.showTime('UpdateTime');
    const showAutoUpdateTime = this.showTime('AutoUpdateTime');

    return (
      <React.Fragment>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '10px' }}>旧商品码</span>
          <Input
            size="small"
            className={styles.wid120}
            value={BuId}
            onChange={this.onChange.bind(this, 'BuId')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>旧子商品码</span>
          <Input
            size="small"
            className={styles.wid120}
            value={ProductId}
            onChange={this.onChange.bind(this, 'ProductId')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>优惠ID</span>
          <Input
            size="small"
            className={styles.wid120}
            value={showId}
            onChange={this.onChange.bind(this, 'Id')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>合同价ID</span>
          <Input
            size="small"
            className={styles.wid120}
            value={pricePid}
            onChange={this.onChange.bind(this, 'pricePid')}
          />
        </div>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '10px' }}>生效时间</span>
          <RangePicker
            size="small"
            value={showBeginTime}
            format="YYYY-MM-DD HH:mm"
            showTime={{ format: 'HH:mm' }}
            className={styles.search_date}
            onChange={this.onChange.bind(this, 'BeginTime')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>失效时间</span>
          <RangePicker
            size="small"
            value={showEndTime}
            format="YYYY-MM-DD HH:mm"
            showTime={{ format: 'HH:mm' }}
            className={styles.search_date}
            onChange={this.onChange.bind(this, 'EndTime')}
          />
        </div>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '10px' }}>创建时间</span>
          <RangePicker
            size="small"
            value={showCreatTime}
            format="YYYY-MM-DD HH:mm"
            showTime={{ format: 'HH:mm' }}
            className={styles.search_date}
            onChange={this.onChange.bind(this, 'CreatTime')}
          />
          <span style={{ margin: '0 10px 0 20px' }}>更新时间</span>
          {
            Type === 'user'
              ?
              (
                <RangePicker
                  size="small"
                  value={showAutoUpdateTime}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  className={styles.search_date}
                  onChange={this.onChange.bind(this, 'AutoUpdateTime')}
                />
              )
              :
              (
                <RangePicker
                  size="small"
                  value={showUpdateTime}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  className={styles.search_date}
                  onChange={this.onChange.bind(this, 'UpdateTime')}
                />
              )
          }
        </div>
        <div className={styles.mrbottom10}>
          <span style={{ marginRight: '23px' }}>创建人</span>
          <Input
            placeholder="创建人 RTX"
            size="small"
            className={styles.wid150}
            value={Creator}
            onChange={this.onChange.bind(this, 'Creator')}
          />
        </div>
      </React.Fragment>
    );
  }
}

