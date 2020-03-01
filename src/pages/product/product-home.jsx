import React, { Component } from 'react'
import { Card, Button, Icon, Select, Input, Table } from "antd"
import { reqProducts } from '../../api';

export default class ProductHome extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
    }
    /**
     * 初始化列标题
     */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描述',
                dataIndex: 'name'
            },
            {
                title: '价格',
                width: "100px",
                dataIndex: 'name',
                render: (peice) => "￥" + 1000 
            },
            {
                title: '状态',
                width: "100px",
                dataIndex: 'name'
            },
            {
                title: '操作',
                width: "100px",
                dataIndex: 'name'
            }
        ]
    }
    getProducts = async() => {
        const result = await reqProducts(1, 2)
        console.log(result)
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts();
    }
    render() {
        const title = (
            <span>
                <Select value="1" style={{ width: "110px" }}>
                    <Select.Option value="1">按名称搜索</Select.Option>
                    <Select.Option value="2">按描述搜索</Select.Option>
                </Select>
                <Input placeholder="搜索关键字" style={{ width: "170px", margin: "0 15px" }} />
                <Button type="primary">搜索</Button>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={() => this.props.history.push("/product/addupdate")}>
                <Icon type="plus" />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered={true}
                    dataSource={[]}
                    columns={this.columns}
                />
            </Card>
        )
    }
}
