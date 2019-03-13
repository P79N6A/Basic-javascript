import React , { Component } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import App from './App';
import Login from './pages/login';
import Admin from './admin';
import NoMatch from './pages/nomatch';
import Buttons from './pages/ui/buttons';
import Modals from './pages/ui/modals';
import Loadings from './pages/ui/loading';
import Notifications from './pages/ui/notification';
export default class IRouter extends Component {
  render() {
    return (
      <Router>
        <App>
          {/* 临时添加一个重定向功能 */}
            <Route exact path="/" render={() => 
              <Redirect to="admin/ui/buttons" />
            } />
            <Route path="/login" component={Login} />
            <Route path="/admin" render={() => 
              <Admin>
                <Switch>
                  <Route path="/admin/ui/buttons" component={Buttons} />
                  <Route path="/admin/ui/modals" component={Modals} />
                  <Route path="/admin/ui/loadings" component={Loadings} />
                  <Route path="/admin/ui/notification" component={Notifications} />
                  <Route component={NoMatch} />
                </Switch>
              </Admin>
            } />
        </App>
      </Router>
    );
  }
}