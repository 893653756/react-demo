import React, { Component } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import ProductDetail from './product-detial'
import ProductAddUpdate from './product-addupdate'
import ProductHome from './product-home'


export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path="/product" exact component={ProductHome} />
                <Route path="/product/detail" component={ProductDetail} />
                <Route path="/product/addupdate" component={ProductAddUpdate} />
                <Redirect to="/product" />
            </Switch>
        )
    }
}
