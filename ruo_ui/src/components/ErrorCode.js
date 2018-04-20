import React, { Component } from 'react'
import { Table } from 'antd'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { prism } from 'react-syntax-highlighter/styles/prism'

import Markdown from './Markdown'

class ErrorCode extends Component {
  render() {
    const errorData = this.props.spec.getErrorCode()
    let data = Object.values(errorData)
    let columns = [
      {
        title: '代码',
        dataIndex: 'code',
        width: '10%',
      },
      {
        title: '文本内容',
        dataIndex: 'message',
        width: '45%',
      },
      {
        title: '描述',
        dataIndex: 'description',
        width: '45%',
      },
    ]
    let example = {
      error_code: '21402',
      request: 'PUT /operators/',
      message: 'Operator already exists.',
    }
    return (
      <article className="main-content">
        <div className="markdown-body">
          <h2>错误处理</h2>
          <p>所有接口的错误信息都要JSON格式返回，返回值格式</p>
          <SyntaxHighlighter language="json" style={prism}>
            {JSON.stringify(example, null, '  ')}
          </SyntaxHighlighter>
          <p>
            其中，错误代码 error_code 由两部分组成。 第1位为错误级别，1表示系统级别错误，2表示模块级别错误,
            第2、3位表示模块代码，后两位表示具体的错误代码;
          </p>
          <Table className="markdown-table" columns={columns} dataSource={data} pagination={false} rowKey={(_, index) => index} />
        </div>
      </article>
    )
  }
}

export default ErrorCode
