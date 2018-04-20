import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd'

class Sidebar extends Component {
  state = {
    openKeys: [],
    selectedKeys: [],
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    })
  }

  componentWillMount() {
    this.matchPath()
  }

  componentWillReceiveProps(nextProps) {
    this.matchPath(nextProps)
  }

  matchPath = nextProps => {
    let props = nextProps || this.props
    const match = props.location.pathname.match('^/api/operation/(.*)/(.*)$')
    const matchKey = props.location.pathname.match('^/api/guide/(.*)$')
    if (match) {
      this.setState({
        openKeys: [decodeURIComponent(match[1])],
        selectedKeys: [decodeURIComponent(match[2])],
      })
    } else if (matchKey) {
      this.setState({
        openKeys: ['guide'],
        selectedKeys: [matchKey[1]],
      })
    }
  }

  render() {
    const data = this.props.spec.getSpecMenu()
    if (!this.props.spec) return null
    return (
      <div className="main-menu">
        <Menu
          openKeys={this.state.openKeys}
          selectedKeys={this.state.selectedKeys}
          onOpenChange={this.onOpenChange}
          mode="inline"
          theme="dark"
        >
          <Menu.SubMenu key="guide" title="使用指南">
            <Menu.Item key="overview">
              <Link to="/api/guide/overview">概述</Link>
            </Menu.Item>
            <Menu.Item key="auth">
              <Link to="/api/guide/auth">授权</Link>
            </Menu.Item>
            <Menu.Item key="errorCode">
              <Link to="/api/guide/errorCode">错误处理</Link>
            </Menu.Item>
          </Menu.SubMenu>
          {Object.keys(data).map(menuKey => {
            const menu = data[menuKey]
            return (
              <Menu.SubMenu key={menuKey} title={menu.description || menu.name}>
                {Object.keys(menu.subMenu).map(subMenuKey => {
                  const subMenu = menu.subMenu[subMenuKey]
                  return (
                    <Menu.Item key={subMenuKey}>
                      <Link to={`/api/operation/${encodeURIComponent(menuKey)}/${encodeURIComponent(subMenuKey)}`}>
                        {subMenu.summary || subMenu.interface}
                      </Link>
                    </Menu.Item>
                  )
                })}
              </Menu.SubMenu>
            )
          })}
        </Menu>
      </div>
    )
  }
}

export default withRouter(Sidebar)
