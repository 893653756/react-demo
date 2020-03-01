import React, { Component } from 'react'
import { Card, Form, Icon, Input } from "antd"
export default class ProductDetail extends Component {
    render() {
        const title = (
            <span>
                <Icon type="arrow-left" />
                商品详情
            </span>
        )
        return (
            <Card title={title}>

            </Card>
        )
    }
}
