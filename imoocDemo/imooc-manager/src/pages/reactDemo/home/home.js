import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Home extends Component {
  render() {
    return (
      <div>
        this is home
        <Link to="/about">{this.props.children}</Link>
      </div>
    );
  }
}