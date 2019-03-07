import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import Home from './home';
import About from './about';
import Topic from './topic';

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
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/topic" component={Topic} />
        </div>
      </HashRouter>
    );
  }
}