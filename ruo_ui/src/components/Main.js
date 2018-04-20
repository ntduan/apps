import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import Spec from '../spec'
import Sidebar from './Sidebar'
import Header from './Header'
import Content from './Content'
import Auth from './Auth'
import ErrorCode from './ErrorCode'
import Overview from './Overview'
import ScrollToTop from './ScrollToTop'

class Main extends Component {
  state = {
    collapsed: false,
    spec: null,
    defaultMenu: null,
    loading: true,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  fetchSpec = () => {
    Spec.getSpec().then(spec => {
      this.setState({
        spec: spec,
        loading: false,
      })
    })
  }

  componentWillMount() {
    this.fetchSpec()
  }

  render() {
    if (this.state.loading) return <div className="spinner" />
    return (
      <div className="main-wrapper">
        <ScrollToTop>
          <Header spec={this.state.spec} />
          <div className="main-body">
            <Sidebar spec={this.state.spec} />
            <Switch>
              <Route
                exact
                path="/api/guide/overview"
                render={props => <Overview spec={this.state.spec} {...props} />}
              />
              <Route exact path="/api/guide/auth" render={props => <Auth spec={this.state.spec} {...props} />} />
              <Route
                exact
                path="/api/guide/errorCode"
                render={props => <ErrorCode spec={this.state.spec} {...props} />}
              />
              <Route
                exact
                path="/api/operation/:tag/:path"
                render={props => <Content spec={this.state.spec} {...props} />}
              />
            </Switch>
          </div>
        </ScrollToTop>
        <Route exact path="/" render={() => <Redirect to="/api/guide/overview" />} />
      </div>
    )
  }
}

export default Main
