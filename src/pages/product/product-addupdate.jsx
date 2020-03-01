import React, { Component } from 'react'
import { Card, Form, Icon, Input, Button } from "antd"
class ProductAddUpdate extends Component {

    /**
     * 验证价格是否大于0
     */
    validatePrice = (rule, value, callback) => {
        // 两种方式都可以
        if (+value >= 0) {
            // callback()
            return Promise.resolve()
        } else {
            // callback("价格不能小于0")
            return Promise.reject("价格不能小于0")
        }
    }
    render() {
        const title = (
            <span>
                <Icon
                    onClick={() => this.props.history.goBack()}
                    type="arrow-left"
                    style={{ fontSize: "20px", color: "#1da57a", marginRight: "10px", cursor: "pointer" }}
                />
                商品详情
            </span>
        )
        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        const { getFieldDecorator } = this.props.form
        return (
            <Card title={title}>
                <Form {...layout}>
                    <Form.Item name="name" label="商品名称">
                        {getFieldDecorator("name", {
                            rules: [{ required: true, message: "商品名称为必填项" }]
                        })(<Input placeholder="请输入商品名称" />)}
                    </Form.Item>
                    <Form.Item name="desc" label="商品描述">
                        {getFieldDecorator("desc", {
                            rules: [{ required: true, message: "商品描述为必填项" }]
                        })(<Input.TextArea placeholder="请输入商品描述" />)}
                    </Form.Item>
                    <Form.Item name="price" label="商品价格">
                        {getFieldDecorator("price", {
                            rules: [
                                { required: true, message: "商品价格为必填项" },
                                {validator: this.validatePrice}
                            ]
                        })(<Input prefix="￥" addonAfter="RMB" type="number" />)}
                    </Form.Item>
                </Form>
            </Card>
        )
    };
}

export default Form.create()(ProductAddUpdate)