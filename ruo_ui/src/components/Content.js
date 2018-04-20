import React, { Component } from 'react'
import { Tag, Icon, Collapse, Panel } from 'antd'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { prism } from 'react-syntax-highlighter/styles/prism'
import qs from 'querystring'
import { Link } from 'react-router-dom'

import Markdown from './Markdown'
import TreeView from './TreeView'
import { schemaToJson, fieldsToJson } from '../utility.js'

class ScopeItem extends Component {
  render() {
    const checked = (
      <svg style={{ marginRight: 5, position: 'relative', top: 2 }} viewBox="0 0 1024 1024" width="16" height="16">
        <path
          d="M408.156 846.967 76.6 515.341l130.835-130.765 200.721 200.87 408.411-408.411 130.835 130.84L408.156 846.967z"
          fill="#6CC788"
        />
      </svg>
    )
    const closed = (
      <svg style={{ marginRight: 5, position: 'relative', top: 2 }} viewBox="0 0 1024 1024" width="16" height="16">
        <path
          d="M851.428571 755.428571q0 22.857143-16 38.857143l-77.714285 77.714286q-16 16-38.857143 16t-38.857143-16l-168-168-168 168q-16 16-38.857143 16t-38.857143-16l-77.714285-77.714286q-16-16-16-38.857143t16-38.857142l168-168-168-168q-16-16-16-38.857143t16-38.857143l77.714285-77.714286q16-16 38.857143-16t38.857143 16l168 168 168-168q16-16 38.857143-16t38.857143 16l77.714285 77.714286q16 16 16 38.857143t-16 38.857143l-168 168 168 168q16 16 16 38.857142z"
          fill="#f44455"
        />
      </svg>
    )
    return (
      <div className="scope-item">
        {this.props.checked ? checked : closed}
        {this.props.title}
      </div>
    )
  }
}

class Header extends Component {
  render() {
    const content = this.props.data
    return (
      <div className="page-header markdown-body">
        <div className="header-title">
          <h1 className="page-title">{content.title}</h1>
          <Tag className={`method-tag method-${content.method}`}>{content.method}</Tag>
        </div>
        <div className="scope">
          <ScopeItem title="CDN" checked={!content.type || content.type.indexOf('cdn') !== -1} />
          <ScopeItem title="存储" checked={!content.type || content.type.indexOf('file') !== -1} />
          <ScopeItem title="直播" checked={!content.type || content.type.indexOf('live') !== -1} />
        </div>
        {content.description && (
          <div className="description">
            <Markdown source={content.description} />
          </div>
        )}
      </div>
    )
  }
}

class RequsetPath extends Component {
  render() {
    const content = this.props.data
    return (
      <div className="requset-path markdown-body">
        <h1>请求路径</h1>
        <SyntaxHighlighter language={'HTTP'} style={prism}>
          {content.path}
        </SyntaxHighlighter>
      </div>
    )
  }
}

class ParamsForm extends Component {
  render() {
    const content = this.props.data
    if (!content.consumes) return null
    return (
      <div className="params-form markdown-body">
        <h1>参数格式</h1>
        <SyntaxHighlighter language={'HTTP'} style={prism}>
          {content.consumes}
        </SyntaxHighlighter>
      </div>
    )
  }
}

class ParamsTable extends Component {
  render() {
    const tableData = this.props.data
    const validValues = data => {
      return (
        <p>
          Valid Values:
          {data.map(value => {
            return <span className="valid-value" key={value}>{`'${value}'`}</span>
          })}
        </p>
      )
    }
    const required = required => {
      return <span className={required ? 'tag-yes' : 'tag-no'}>{required ? 'Yes' : 'No'}</span>
    }

    return (
      <table className="params-table">
        <thead>
          <tr>
            <th width="19%">参数名</th>
            <th width="12%">类型</th>
            <th>描述</th>
            <th width="8%">必填</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(tableData.properties).map(paramName => {
            const param = tableData.properties[paramName]
            return (
              <tr key={param.name}>
                {Object.keys(tableData.properties).length !== 1 ? (
                  <td className="params-name">
                    <span className="params-name-content">{param.name}</span>
                  </td>
                ) : (
                  <td>{param.name}</td>
                )}
                <td>{param.type}</td>
                <td>
                  {param.enum && validValues(param.enum)}
                  <Markdown source={param.description} />
                </td>
                <td>{required(param.required)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

class ParamsList extends Component {
  render() {
    const content = this.props.data
    const parameters = content.parameters
    if (!parameters || parameters.length === 0) {
      return (
        <div className="params-form markdown-body">
          <h1>参数说明</h1>
          <p>无</p>
        </div>
      )
    }

    let examples
    let schema
    let data = {}
    if (parameters[0].in === 'body') {
      const parameter = parameters[0]
      schema = parameter.schema
      examples = parameter['x-examples'] || schemaToJson(schema)
      data = schema
    } else {
      examples = fieldsToJson(parameters)
      const properties = {}
      const required = []
      parameters.map((parameter, index) => {
        properties[parameter.name] = parameter
        if (parameter.required) {
          required.push(parameter.name)
        }
      })
      data = { properties, required }
    }

    if (content.method === 'GET' || content.method === 'DELETE') {
      examples = `${content.path.split(' ')[1]}?${qs.stringify(examples)}`
    }

    return (
      <div className="params-form markdown-body">
        <h1>参数说明</h1>
        <TreeView data={data} />
        <h3>示例</h3>
        <SyntaxHighlighter language={'json'} style={prism}>
          {typeof examples === 'object' ? JSON.stringify(examples, null, '  ') : examples}
        </SyntaxHighlighter>
      </div>
    )
  }
}

class Responses extends Component {
  render() {
    const responses = this.props.data.responses
    const keys = Object.keys(responses).map((_, index) => String(index))
    return (
      <div className="params-form markdown-body">
        <h1>响应说明</h1>
        <Collapse bordered={false} defaultActiveKey={keys}>
          {Object.keys(responses).map((status, index) => {
            const response = responses[status]
            let examples
            if (response['x-examples']) {
              examples = response['x-examples']
            } else {
              examples = schemaToJson(response.schema)
            }

            if (status === 'default') {
              if (index === 0) {
                // 只有 default response
                status = ''
              } else {
                status = '失败'
              }
            } else {
              status = `状态码 ${status}`
            }
            return (
              <Collapse.Panel header={status} key={index}>
                <Markdown source={response.description} />
                <TreeView data={response.schema} />
                <h3>示例</h3>
                <SyntaxHighlighter language={'json'} style={prism}>
                  {typeof examples === 'object' ? JSON.stringify(examples, null, '  ') : examples}
                </SyntaxHighlighter>
              </Collapse.Panel>
            )
          })}
        </Collapse>
      </div>
    )
  }
}

class Content extends Component {
  render() {
    const tag = decodeURIComponent(this.props.match.params.tag)
    const path = decodeURIComponent(this.props.match.params.path)
    const content = this.props.spec.getContent(tag, path)
    return (
      <div className="main-content">
        <article className="markdown-body">
          <Header data={content} />
          <RequsetPath data={content} />
          <ParamsForm data={content} />
          <ParamsList data={content} />
          <Responses data={content} />
          <p>
            错误返回值与错误代码，参见<Link to={{ pathname: '/api/guide/errorCode' }}>错误代码说明</Link>
          </p>
        </article>
      </div>
    )
  }
}

export default Content
