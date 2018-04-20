import React, { Component } from 'react'

import Markdown from './Markdown'
import { parseSecurityDefinitions } from '../utility.js'

class Auth extends Component {
  render() {
    const securityDefinitions = parseSecurityDefinitions(this.props.spec.getSecurityDefinitions())
    return (
      <article className="main-content">
        <div className="markdown-body">
          {securityDefinitions.map(security => {
            return (
              <div key={security['x-securityHandler']} className="auth-item">
                <h2>{security['x-securityHandler'].toUpperCase()} 验证</h2>
                <Markdown source={security.description} />
              </div>
            )
          })}
        </div>
      </article>
    )
  }
}

export default Auth
