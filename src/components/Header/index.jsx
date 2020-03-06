import React, { Component } from 'react';
import { Modal } from "antd";
import LinkButton from '../LinkButton';
import { withRouter } from "react-router-dom";
// 方法
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from "../../utils/storageUtils";
import menuList from '../../config/menuList';
import { reqWeather } from '../../api';
import "./index.less";


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: memoryUtils.user.username
        }
    }
    /**
     * 登出
     */
    loginOut = () => {
        Modal.confirm({
            title: '你确定退出登录?',
            onOk: () => {
                // 清除内存及本地存储数据
                memoryUtils.user = {};
                storageUtils.removeUser();
                this.props.history.replace("/login");
            }
        });

    }
    /**
     * 获取标题
     */
    getTitle = () => {
        const pathname = this.props.location.pathname;
        let title = '';
        menuList.forEach(item => {
            if (pathname === item.key) {
                title = item.title;
            } else if (item.children) {
                const val = item.children.find(val => pathname.indexOf(val.key) === 0);
                val && (title = val.title);
            }
        });
        return title;
    }
    /**
     * 获取天气
     */
    getWeather = async (city) => {
        const { dayPictureUrl, weather } = await reqWeather(city);
        this.setState({ dayPictureUrl, weather })
    }
    /**
     * 获取时间
     */
    getTime = () => {
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.timer = null;
            this.setState({
                time: new Date()
            })
            this.getTime && this.getTime();
        }, 1000)
    }
    componentDidMount() {
        this.getWeather("成都");
        this.getTime();
    }
    componentWillUnmount() {
        this.getTime = null;
        clearTimeout(this.timer);
        this.timer = null;
    }
    render() {
        const title = this.getTitle();
        const { dayPictureUrl, weather, username, time } = this.state;
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.loginOut}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{time && time.toLocaleString()}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header);