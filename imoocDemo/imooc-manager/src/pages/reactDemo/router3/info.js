import React, { Component } from 'react';

export default class IRouter extends Component {
  render() {
    return (
      <div>
        嵌套路由{this.props.match.params.value}
      </div>
    );
  }
}