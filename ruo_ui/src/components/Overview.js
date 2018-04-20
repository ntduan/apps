import React, { Component } from 'react'

import Markdown from './Markdown'

class Overview extends Component {
  render() {
    const input = this.props.spec.getOverviewPage()
    return (
      <article className="main-content">
        <Markdown source={input} />
      </article>
    )
  }
}

export default Overview
