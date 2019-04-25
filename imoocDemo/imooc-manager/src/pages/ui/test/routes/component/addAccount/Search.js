import React, { Component } from 'react';
import { Row, Col, Input, DatePicker } from 'antd';
import moment from 'moment';
import styles from './addAccount.less';
import Util from '../../../libraries/util';

const { TextArea } = Input;
const { MonthPicker } = DatePicker;
export default class Search extends Component {
  state = {
    startValue: null,
    endValue: null,
    ruleId: '',
    uinsValue: '',
    uinsInfo: [], //验证uin后返回的信息
  }
  disabledStartDate = (startValue) => {
    const { endValue } = this.state;
    const firstDay = moment().endOf('month').toDate().getTime(); //获取当前月份的最后一个时间戳
    if (!startValue || !endValue) {
      return startValue.valueOf() < firstDay;
    }
    return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() < firstDay;
  }
  disabledEndDate = (endValue) => {
    const { startValue } = this.state;
    if (!endValue || !startValue) {
      const lastDay = moment().endOf('month').toDate().getTime();
      return endValue.valueOf() < lastDay;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    // console.log(value.month(value.month()).startOf('month').format('YYYY-MM-DD'));
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    // console.log(value.month(value.month()).endOf('month').format('YYYY-MM-DD'));
    this.onChange('endValue', value);
  }

  handleUserUIN = (e) => {
    this.setState({
      uinsValue: e.target.value
    });
  }
  //获取uin的信息进行验证
  getUinInfo = () => {
    const { uinsValue } = this.state;
    const uinsArr = Util.handleUserIds(uinsValue) || [];
    const promises = uinsArr.map((item) => {
      if (!item) {
        return false;
      }
      return Util.GetAccountInfoByFields(item);
    });
    const newUinsInfo = [];
    Promise.all(promises).then((opts) => {
      opts.forEach((item, index) => {
        const obj =  {
          uin: uinsArr[index],
          name: item.customer_info.name || '--',
          country: item.account_info.country,
          key: index,
        };
        newUinsInfo.push(obj);
      });
      this.setState({
        uinsInfo: newUinsInfo
      }, () => {
        //需要判断都是国际站还是国内站或者已注销的情况
        if (newUinsInfo.length > 1) {
          this.props.onChange(false);
        }
      });
    });
  }
  render() {
    const { startValue, endValue, ruleId, uinsValue, uinsInfo } = this.state;
    return (
      <div>
        <Row gutter={2} className={styles.margin20}>
          <Col span={3} className={styles.left}>
            优惠ID
          </Col>
          <Col span={8}>
            <Input placeholder="系统自动生成" disabled value={ruleId} />
          </Col>
        </Row>
        <Row gutter={2} className={styles.margin20}>
          <Col span={3} className={styles.left}>
            客户UIN
          </Col>
          <Col span={8} style={{ marginRight: 20 }}>
            <TextArea
              placeholder="可批量输入,用英文逗号或换行分开"
              value={uinsValue}
              // disabled={isEdit}
              onChange={this.handleUserUIN}
              onBlur={this.getUinInfo}
            />
          </Col>
          <Col span={12}>
            <table border="1">
              <tbody className={styles.outBorder}>
                {
                  uinsInfo.map((item) => {
                    return (
                      <tr key={item.key}>
                        <td className={styles.tbBorder}>{item.uin}</td>
                        <td className={styles.tbBorder} style={{ width: 180 }}>{item.name}</td>
                        <td className={styles.tbBorder}>{!item.country ? '已注销' : (item.country === 'CN' ? '国内站' : '国际站')}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </Col>
        </Row>
        <Row gutter={2} className={styles.margin20}>
          <Col span={3} className={styles.left}>
            有效期
          </Col>
          <Col span={14}>
            <MonthPicker
              format="YYYY-MM"
              value={startValue}
              placeholder="请选择"
              disabledDate={this.disabledStartDate}
              onChange={this.onStartChange}
              showToday={false}
              style={{ width: 144 }}
            />
            <span style={{ margin: '0px 10px' }}>到</span>
            <MonthPicker
              format="YYYY-MM"
              value={endValue}
              placeholder="请选择"
              disabledDate={this.disabledEndDate}
              onChange={this.onEndChange}
              showToday={false}
              style={{ width: 144 }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
