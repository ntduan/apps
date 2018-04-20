import React, { Component } from 'react'

import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import Main from './components/Main'
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/api" component={Main} />
          <Route exact path="/" component={Main} />
        </Switch>
      </Router>
    )
  }
}

export default App
