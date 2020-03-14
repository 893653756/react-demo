/**
 * 左侧导航
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from "react-router-dom"
import logo from "../../assets/images/logo.png";
import "./index.less";
import menuList from "../../config/menuList"
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;
class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.openKey = "";
        this.menuNode = [];
    }
    /**
     * 判断用户有无相应的item标签权限
     */
    hasAuth = (item) => {
        const { key, isPublic, isPrivate } = item;
        const menus = memoryUtils.user.role.menus;
        const username = memoryUtils.user.username;
        // 1. 如果当前用户是admin
        // 2. 如果当前item是公开的
        // 3. 如果当前item是私有的
        // 4. 如果当前用户有此item权限
        // 5. 如果当前用户有此item的某个子item的权限
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true;
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        } else if (isPrivate) {
            return false
        }
        return false
    }
    /**
     * 根据配置表生成菜单--扩展性好
     */
    getMenuNodes = (menuList) => {
        let pathname = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    // 查找一个与当前请求路径匹配的子item
                    let val = item.children.find(val => pathname.indexOf(val.key) === 0);
                    if (val) {
                        this.openKey = item.key;
                    }
                    // 添加 <SubMenu />
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre;
        }, [])
    }
    componentWillMount() {
        this.menuNode = this.getMenuNodes(menuList);
    }
    render() {
        let selectKey = this.props.location.pathname;
        // console.log(selectKey)
        if (selectKey.indexOf("/product") === 0) {
            selectKey = "/product";
        }
        return (
            <div className="left-nav">
                <div className="left-nav-header">
                    <img src={logo} alt="logo" />
                    <h2>硅谷后台</h2>
                </div>
                {/* vertical horizontal inline */}
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[selectKey]}
                    defaultOpenKeys={[this.openKey]}
                >
                    {this.menuNode}
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)