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
import Messages from './pages/ui/messages';
import TabsDemo from './pages/ui/tabs';
import CarouselDemo from './pages/ui/carousel';
import UploadDemo from './pages/ui/upload';
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
                  <Route path="/admin/ui/messages" component={Messages} />
                  <Route path="/admin/ui/tabs" component={TabsDemo} />
                  <Route path="/admin/ui/carousel" component={CarouselDemo} />
                  <Route path="/admin/ui/upload" component={UploadDemo} />
                  <Route component={NoMatch} />
                </Switch>
              </Admin>
            } />
        </App>
      </Router>
    );
  }
}