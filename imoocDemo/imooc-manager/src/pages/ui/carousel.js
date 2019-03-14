import React , { Component } from 'react';
import { Carousel, Card } from 'antd';
import './ui.less';

export default class CarouselDemo extends Component {
  render() {
    return (
      <div>
        <Card title="数字轮播图" className="card-wrap">
          <Carousel autoplay>
            <div><h3>1</h3></div>
            <div><h3>2</h3></div>
            <div><h3>3</h3></div>
            <div><h3>4</h3></div>
          </Carousel>
        </Card>
      </div>
    );
  }
}