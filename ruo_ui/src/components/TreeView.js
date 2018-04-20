import React, { Component } from 'react'
import classNames from 'classnames'
import { Icon } from 'antd'
import Markdown from './Markdown'

class TreeView extends Component {
  constructor(props) {
    super(props)
    const { schema } = props
    this.state = {
      schema,
      expands: {},
    }
  }

  handleParamClick(key) {
    let newExpands = this.state.expands
    newExpands[key] = !newExpands[key]
    this.setState({
      newExpands,
    })
  }

  renderType(schema) {
    let { type } = schema
    const { items } = schema
    if (type) {
      if (type === 'array' && items) {
        return (
          <span>
            <span className="param-type array">{items.type}</span>
            {this.renderRange.bind(this)(items)}
            {this.renderPattern.bind(this)(items)}
          </span>
        )
      } else {
        return (
          <span>
            <span className="param-type">{type}</span>
            {this.renderRange.bind(this)(schema)}
            {this.renderPattern.bind(this)(schema)}
          </span>
        )
      }
    }
  }

  renderRange(schema) {
    const { maxLength = '', minLength = '' } = schema
    if (minLength && maxLength) {
      return <span className="param-range">{`[ ${minLength} .. ${maxLength} ] `}</span>
    } else if (minLength && !maxLength) {
      return <span className="param-range">{`>= ${minLength}`}</span>
    } else if (!minLength && maxLength) {
      return <span className="param-range">{`<= ${maxLength}`}</span>
    }
  }

  renderPattern(schema) {
    const { pattern } = schema
    if (pattern) {
      return
    }
  }

  renderEnum(enumItems) {
    if (enumItems) {
      return (
        <p>
          Valid Values:
          {enumItems.map((value, index) => {
            return <span className="valid-value" key={`${index}_${value}`}>{`'${value}'`}</span>
          })}
        </p>
      )
    }
  }

  renderSchema(prop, key, nestRank) {
    const { items, properties, type } = prop
    const colors = ['#0cc2aa', '#f77a99', '#6cc788', '#f44f5f', '#6887ff']
    if (items && items.type === 'object' && type) {
      let havaNest = true
      const child = this.renderTree.bind(this)(items, type, nestRank + 1, result => {
        havaNest = result
      })

      return (
        <tr key={key} className="param-schema">
          <td colSpan="4">
            <div
              className={classNames({
                'param-schema-general': true,
                'last-nest': havaNest,
              })}
              style={{ borderLeftColor: colors[nestRank % colors.length] }}
            >
              {child}
            </div>
          </td>
        </tr>
      )
    } else if (properties && type) {
      let havaNest = true
      const child = this.renderTree.bind(this)(prop, type, nestRank + 1, result => {
        havaNest = result
      })
      return (
        <tr key={key} className="param-schema">
          <td colSpan="4">
            <div
              className={classNames({
                'param-schema-general': true,
                'last-nest': havaNest,
              })}
              style={{ borderLeftColor: colors[nestRank % colors.length] }}
            >
              {child}
            </div>
          </td>
        </tr>
      )
    }
  }

  renderTree(schema, parentType, nestRank, callback) {
    let { properties = {} } = schema
    const { patternProperties, required = [] } = schema

    // Combine pattern properties
    if (patternProperties) {
      properties = Object.assign({}, properties, patternProperties)
    }

    // Set Required attribute
    for (let name in properties) {
      if (typeof required === 'boolean') {
        properties[name].required = required
      } else if (Array.isArray(required)) {
        properties[name].required = required.indexOf(name) !== -1
      } else {
        properties[name].required = false
      }
    }

    // If schema properties type is array
    if (schema.type === 'array') {
      const { items, type } = schema
      if (items['type'] === 'object') {
        return this.renderTree(items, type)
      }
      return (
        <div>
          <span className="param-type">Array [{items['type']}]</span>
          <span className="param-required">Required</span>
        </div>
      )
    }

    const wrapCls = classNames({
      'params-wrap': true,
      'params-table': true,
      'params-array': parentType === 'array',
    })

    return (
      <table className={wrapCls}>
        {!nestRank && (
          <thead>
            <tr>
              <th>参数名</th>
              <th>类型</th>
              <th>描述</th>
              <th>必填</th>
            </tr>
          </thead>
        )}
        <tbody>
          {Object.keys(properties).map((prop, index) => {
            const key = `${nestRank}_${prop}`

            const { items, properties: subProps } = properties[prop]

            const isComplex = (!!items && items['type'] === 'object') || !!subProps
            if (this.state.expands[key] && callback) {
              callback(false)
            }

            const paramCls = classNames({
              param: true,
              last: index === Object.keys(properties).length - 1,
              complex: isComplex,
              expanded: this.state.expands[key],
            })

            return [
              <tr key={key} className={paramCls}>
                <td width="19%" className="param-name">
                  <span className="param-name-wrap" onClick={this.handleParamClick.bind(this, key)}>
                    <span className="param-name-content">{prop}</span>
                    {isComplex ? <Icon type="down" /> : ''}
                  </span>
                </td>
                <td width="12%" className="param-info">
                  <div>{this.renderType.bind(this)(properties[prop])}</div>
                </td>
                <td>
                  {this.renderEnum.bind(this)(properties[prop]['enum'])}
                  {properties[prop]['description'] ? (
                    <div className="param-description">
                      <Markdown source={properties[prop]['description']} />
                    </div>
                  ) : (
                    ''
                  )}
                </td>
                <td width="8%">
                  <span className={properties[prop]['required'] ? 'tag-yes' : 'tag-no'}>
                    {properties[prop]['required'] ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>,
              this.renderSchema.bind(this)(properties[prop], `${key}_sub`, nestRank),
            ]
          })}
        </tbody>
      </table>
    )
  }

  render() {
    const schema = this.props.data
    return <div>{this.renderTree.bind(this)(schema, undefined, 0)}</div>
  }
}

export default TreeView
