/**
 * 左侧导航
 */
import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { Link, withRouter } from "react-router-dom"
import logo from "../../assets/images/logo.png";
import "./index.less";
import menuList from "../../config/menuList"
const { SubMenu } = Menu;
class LeftNav extends Component {
    constructor(props) {
        super(props);
        this.openKey = "";
        this.menuNode = [];
    }
    /**
     * 根据配置表生成菜单--扩展性好
     */
    getMenuNodes = (menuList) => {
        let pathname = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
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
            return pre;
        }, [])
    }
    componentWillMount() {
        this.menuNode = this.getMenuNodes(menuList);
    }
    render() {
        const selectKey = this.props.location.pathname;
        console.log(selectKey)
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