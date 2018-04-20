import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { AutoComplete, Input, Icon, Tag } from 'antd'

import logo from '../assets/logo.png'

class Header extends Component {
  state = {
    searchValue: '',
  }

  render() {
    const dataSource = this.props.spec.getAllPath().map(option => {
      return (
        <AutoComplete.Option
          key={`${option.path}-${option.tag}`}
          value={`${option.path}-${option.tag}`}
          link={`/api/operation/${encodeURIComponent(option.tag)}/${encodeURIComponent(option.path)}`}
        >
          {/* <Link to={`/api/operation/${encodeURIComponent(option.tag)}/${encodeURIComponent(option.path)}`}> */}
          {option.path}
        </AutoComplete.Option>
      )
    })
    return (
      <div className="main-header">
        <a className="logo">
          <img src={window.DOC_PATH + logo} alt="又拍云" />
          <h1 className="title">又拍云 | 服务管理开放 API</h1>
        </a>
        <div className="search-form">
          <AutoComplete
            dataSource={dataSource}
            allowClear={true}
            value={this.state.searchValue}
            onSelect={(value, option) => {
              this.setState({
                searchValue: '',
              })
              this.props.history.push(option.props.link)
            }}
            onSearch={value => {
              this.setState({
                searchValue: value,
              })
            }}
            style={{ maxWidth: 650, display: 'block' }}
            filterOption={(inputValue, option) => {
              return option.props.children.toUpperCase().includes(inputValue.toUpperCase())
            }}
          >
            <Input placeholder="搜索" prefix={<Icon type="search" />} />
          </AutoComplete>
        </div>
        <Tag color="#2196f3">{this.props.spec.getVersion()}</Tag>
      </div>
    )
  }
}

export default withRouter(Header)
