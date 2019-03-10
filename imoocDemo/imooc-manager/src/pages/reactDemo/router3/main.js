import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Main extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/home">
              home
            </Link>
          </li>
          <li>
            <Link to="/about">
              about
            </Link>
          </li>
          <li>
            <Link to="/topics">
              tiops
            </Link>
          </li>
          <li>
            <Link to="/more">
              more
            </Link>
          </li>
        </ul>
        <hr />
        {this.props.children}
      </div>
    );
  }
}