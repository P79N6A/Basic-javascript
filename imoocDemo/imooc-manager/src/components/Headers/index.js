import React , { Component } from 'react';
import { Row, Col, message } from 'antd';
import './index.less';
import util from '../../utils/util';
import axios from '../../axios';


let countTime = null;
export default class Headers extends Component {
  componentWillMount() {
    this.setState({
      userName: 'JianLiang',
    });
    //定时
    countTime = setInterval(() => {
      const date = util.formatDate(new Date());
      this.setState({
        date,
      });
    }, 1000);
    this.getWeather();
  }
  componentWillUnmount() {
    clearInterval(countTime);
  }
  getWeather() {
    let city = '深圳';
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${encodeURIComponent(city)}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    axios.jsonp({
      url,
    }).then(res => {
      if (res.status === 'success') {
        let data = res.results[0].weather_data[0];
        this.setState({
          picUrl: data.dayPictureUrl,
          weather: data.weather,
        });
      }
    });
  }
  render() {
    const { userName,date, picUrl, weather } = this.state;
    return (
      <div className="header">
        <Row className="header-top">
          <Col>
            <span>欢迎，{userName}</span>
            <a href="#">退出</a>
          </Col>
        </Row>
        <Row className="breadcrumb">
          <Col span={3} className="breadcrumb-title">
            首页
          </Col>
          <Col span={21} className="weather">
            <span className="date">{date}</span>
            <span className="weather-img">
              <img src={picUrl} />
            </span>
            <span className="weather-detail">{weather}</span>
          </Col>
        </Row>
      </div>
    );
  }
}