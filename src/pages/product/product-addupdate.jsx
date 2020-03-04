import React, { Component } from 'react'
import { Card, Form, Icon, Input, Button, Cascader, message } from "antd"
import { reqCategorys } from '../../api';

class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [], // 商品分类数组
        }
    }
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
    /**
     * 加载子分类
     */
    subOptions = async (selectedOptions) => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        const list = await this.getCategorys(targetOption.value);
        if (list && list.length > 0) {
            let sub = list.map(m => ({
                label: m.name,
                value: m._id,
                isLeaf: true // 是叶子
            }));
            targetOption.children = sub;
        } else {
            targetOption.isLeaf = true;
        }
        targetOption.loading = false;
        this.setState({
            options: [...this.state.options],
        });
    }
    initOptions = async () => {
        const list = await this.getCategorys("0");
        const options = list.map(m => ({
            label: m.name,
            value: m._id,
            isLeaf: false // 是叶子
        }))
        this.setState({ options })
    }
    /**
     * 请求分类数组
     */
    getCategorys = async (parentId) => {
        let result = await reqCategorys(parentId);
        if (result.status === 0) {
            return result.data;
        }
    }
    /**
     * 提交
     */
    submit = () => {
        this.props.form.validateFields((error, values) => {
            if (error) {
                message.error("部分填写有误")
            } else {
                // 收集数据, 并封装成 produce
                const { name, desc, price, categoryIds } = values;
                let pCategoryId, categoryId;
                if (categoryIds.length === 1) {
                    pCategoryId = "0";
                    categoryId = categoryIds[0];
                } else {
                    pCategoryId = categoryIds[0];
                    categoryId = categoryIds[1];
                }
            }
        })
    }
    componentWillMount() {
        const locationState = this.props.location.state || {};
        this.isUpdate = locationState.isUpdate;
        this.product = locationState.product || {}
    }
    componentDidMount() {
        this.initOptions();
    }
    render() {
        const { options } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { isUpdate, product } = this;
        const title = (
            <span>
                <Icon
                    onClick={() => this.props.history.goBack()}
                    type="arrow-left"
                    style={{ fontSize: "20px", color: "#1da57a", marginRight: "10px", cursor: "pointer" }}
                />
                {isUpdate ? "修改商品" : "添加商品"}
            </span>
        )
        const layout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        };
        return (
            <Card title={title}>
                <Form {...layout}>
                    <Form.Item name="name" label="商品名称">
                        {getFieldDecorator("name", {
                            initialValue: product.name,
                            rules: [{ required: true, message: "商品名称为必填项" }]
                        })(<Input placeholder="请输入商品名称" />)}
                    </Form.Item>

                    <Form.Item name="desc" label="商品描述">
                        {getFieldDecorator("desc", {
                            initialValue: product.desc,
                            rules: [{ required: true, message: "商品描述为必填项" }]
                        })(<Input.TextArea placeholder="请输入商品描述" />)}
                    </Form.Item>

                    <Form.Item name="price" label="商品价格">
                        {getFieldDecorator("price", {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: "商品价格为必填项" },
                                { validator: this.validatePrice }
                            ]
                        })(<Input prefix="￥" addonAfter="RMB" type="number" />)}
                    </Form.Item>

                    <Form.Item label="商品分类">
                        {getFieldDecorator("categoryIds", {
                            initialValue: [],
                            rules: [
                                { required: true, message: "商品分类为选项" }
                            ]
                        })(
                            <Cascader
                                options={options}
                                loadData={this.subOptions}
                                onChange={(value, selectedOptions) => console.log(value, selectedOptions)}
                            />
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    };
}

export default Form.create()(ProductAddUpdate)