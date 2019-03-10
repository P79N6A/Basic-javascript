import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div>
        这里是动态路由home <br />
        <Link to="/home/test-id">嵌套1</Link>
        <br/>
        <Link to="/home/123">嵌套2</Link>
        {this.props.children}
      </div>
    );
  }
}