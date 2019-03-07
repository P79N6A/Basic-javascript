import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './../home/home';
import About from './../home/about';
import Topic from './../home/topic';
import Main from './main';

export default class Demo extends Component {
  render() {
    return (
     <Main>
        <div>
          <Route path="/" render={() => {
            return (
              <Home>
                你好，JianLiang
              </Home>
            );
          }} />
          <Route path="/about" component={About} />
          <Route path="/topic" component={Topic} />
        </div>
     </Main>
    );
  }
}