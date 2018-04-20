import React, { Component } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { prism } from 'react-syntax-highlighter/styles/prism'

import ReactMarkdown from 'react-markdown'

class Markdown extends Component {
  render() {
    return (
      <article>
        <ReactMarkdown
          className="markdown-body"
          {...this.props}
          renderers={{
            code: props => {
              return (
                <SyntaxHighlighter language={props.language} wrapLines={false} style={prism}>
                  {props.value}
                </SyntaxHighlighter>
              )
            },
          }}
        />
      </article>
    )
  }
}

export default Markdown
