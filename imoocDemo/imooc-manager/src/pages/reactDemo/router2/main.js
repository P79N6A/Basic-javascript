import React, { Component } from 'react';
import { HashRouter, Link } from 'react-router-dom';

export default class Demo extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <ul>
            <li>
              <Link to="/">home</Link>
            </li>
            <li>
              <Link to="/about">about</Link>
            </li>
            <li>
              <Link to="/topic">topic</Link>
            </li>
          </ul>
          <hr />
          {this.props.children}
        </div>
      </HashRouter>
    );
  }
}