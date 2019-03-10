import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './main';
import Home from './home';
import About from './about';
import Topics from './topics';
import NoMatch from './NoMatch';
import Info from './info';

export default class IRouter extends Component {
  render() {
    return (
      <Router>
        <div>
          <Main>
            <Switch>
              <Route path="/home" render={() => {
                return (
                <Home>
                  <Route path="/home/:value" component={Info}></Route>
                </Home>
                );
              }} />
              <Route exact path="/about" component={About} />
              <Route exact path="/about/add" component={About} />
              <Route path="/topics" component={Topics} />
              <Route component={NoMatch} />
            </Switch>
          </Main>
        </div>
      </Router>
    );
  }
}