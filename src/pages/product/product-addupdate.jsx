import React, { Component } from 'react'
import { Card, Form, Icon, Input, Button, Cascader, message } from "antd"
import { reqCategorys, reqAddOrUpdateProduct } from '../../api';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';


class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [], // 商品分类数组
        }
        this.pw = React.createRef();
        this.editor = React.createRef();
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
            isLeaf: false // 不是叶子
        }))
        const { isUpdate, product } = this;
        // 如果是商品更新
        if (isUpdate && product.pCategoryId !== "0") {
            // 获取二级分类
            const subCategorys = await this.getCategorys(product.pCategoryId);
            // 生成二级下拉列表
            const childOptions = subCategorys.map(sub => ({
                value: sub._id,
                label: sub.name,
                isLeaf: true
            }))
            // 找到商品对应的一级 options
            const targetOption = options.find(op => op.value === product.pCategoryId);
            // 关联二级列表
            targetOption.children = childOptions;
        }
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
        this.props.form.validateFields(async (error, values) => {
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
                const imgs = this.pw.current.getImgs();
                const detail = this.editor.current.getDetail();
                const product = {
                    name, desc, price, pCategoryId, categoryId, imgs, detail
                }
                // 如果更新, 需要添加id
                if (this.isUpdate) {
                    product._id = this.product._id;
                }
                // 调用接口
                const result = await reqAddOrUpdateProduct(product);
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`);
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`);
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
        const { name, desc, imgs, detail, pCategoryId, categoryId, price } = product;
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
        // 分类数组id
        let categoryIds = [];
        if (isUpdate) {
            product.pCategoryId === "0" ? categoryIds.push(categoryId) : (categoryIds = [pCategoryId, categoryId]);
        }
        return (
            <Card title={title}>
                <Form {...layout}>
                    <Form.Item name="name" label="商品名称">
                        {getFieldDecorator("name", {
                            initialValue: name,
                            rules: [{ required: true, message: "商品名称为必填项" }]
                        })(<Input placeholder="请输入商品名称" />)}
                    </Form.Item>

                    <Form.Item name="desc" label="商品描述">
                        {getFieldDecorator("desc", {
                            initialValue: desc,
                            rules: [{ required: true, message: "商品描述为必填项" }]
                        })(<Input.TextArea placeholder="请输入商品描述" />)}
                    </Form.Item>

                    <Form.Item name="price" label="商品价格">
                        {getFieldDecorator("price", {
                            initialValue: price,
                            rules: [
                                { required: true, message: "商品价格为必填项" },
                                { validator: this.validatePrice }
                            ]
                        })(<Input prefix="￥" addonAfter="RMB" type="number" />)}
                    </Form.Item>

                    <Form.Item label="商品分类">
                        {getFieldDecorator("categoryIds", {
                            initialValue: categoryIds,
                            rules: [
                                { required: true, message: "商品分类为选项" }
                            ]
                        })(
                            <Cascader
                                options={options}
                                loadData={this.subOptions}
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="商品图片" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Form.Item>

                    <Form.Item label="商品描述" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
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