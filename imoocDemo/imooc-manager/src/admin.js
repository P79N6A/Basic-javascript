import React , { Component } from 'react';
import { Row, Col } from 'antd';
import Header from './components/Headers';
import NavLeft from './components/NavLeft';
import Footer from './components/Footer';
import './style/common.less';

export default class Admin extends Component {

  render() {
    return (
      <Row className="container">
        <Col span={3} className="nav-left">
          <NavLeft />
        </Col>
        <Col span={21} className="main">
          <Header />
          <Row className="content">
            Content
          </Row>
          <Footer />
        </Col>
      </Row>
    );
  }
}