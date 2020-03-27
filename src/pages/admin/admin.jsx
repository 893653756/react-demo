import React, { Component } from "react";
import { Layout } from 'antd';
import { Redirect, Switch, Route } from "react-router-dom"
import memoryUtils from "../../utils/memoryUtils";
import LeftNav from "../../components/LeftNav";
import Header from "../../components/Header";
import Home from "../home/home";
// import Category from "../category/category";
// import Product from "../product/product";
// import User from "../user/user";
// import Role from "../role/role";
// import Bar from "../charts/bar";
// import Line from "../charts/line";
// import Pie from "../charts/pie";
// import Order from "../order/order";
import { asyncComponent } from "../../components/AsyncComponent";

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user;
        // 如果在内存中没有, 跳转到登录界面
        if (!user || !user._id) {
            return <Redirect to="/login"></Redirect>
        }
        return (
            <Layout style={{ minHeight: "100%" }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                        <Switch>
                            {/* <Route path='/home' component={Home} />
                            <Route path='/category' component={asyncComponent(() => import('../category/category'))} />
                            <Route path='/product' component={Product} />
                            <Route path='/user' component={User} />
                            <Route path='/role' component={Role} />
                            <Route path="/charts/bar" component={Bar} />
                            <Route path="/charts/pie" component={Pie} />
                            <Route path="/charts/line" component={Line} />
                            <Route path="/order" component={Order} />
                            <Redirect from='/' to='/home' /> */}
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={asyncComponent(() => import(/* webpackChunkName:"Category", webpackPrefetch: true */ '../category/category'))} />
                            <Route path='/product' component={asyncComponent(() => import(/* webpackChunkName:"Product", webpackPrefetch: true */ '..//product/product'))} />
                            <Route path='/user' component={asyncComponent(() => import(/* webpackChunkName:"User", webpackPrefetch: true */ '../user/user'))} />
                            <Route path='/role' component={asyncComponent(() => import(/* webpackChunkName:"Role", webpackPrefetch: true */ '../role/role'))} />
                            <Route path="/charts/bar" component={asyncComponent(() => import(/* webpackChunkName:"Bar", webpackPrefetch: true */ '../charts/bar'))} />
                            <Route path="/charts/pie" component={asyncComponent(() => import(/* webpackChunkName:"Pie", webpackPrefetch: true */ '../charts/pie'))} />
                            <Route path="/charts/line" component={asyncComponent(() => import(/* webpackChunkName:"Line", webpackPrefetch: true */ '../charts/line'))} />
                            <Route path="/order" component={asyncComponent(() => import(/* webpackChunkName:"Order", webpackPrefetch: true */ '../order/order'))} />
                            <Redirect from='/' to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#BBBBB' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}