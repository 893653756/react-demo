import React, { Component } from 'react'
import { Card, Button, Icon, Select, Input, Table, message } from "antd"
import { reqProducts, reqUpdateStatus } from '../../api';
import LinkButton from '../../components/LinkButton';
import { PAGE_SIZE } from '../../config/constant';

/**
 * 假数据
 */
// let products = [
//     {
//         name: "商品名称",
//         desc: "商品描述",
//         price: 1000,
//         status: 1,
//         _id: "dasdasdadasd",
//         imgs: [
//             "image-1583378529855.jpg",
//             "image-1583378589004.jpg"
//         ]
//     }
// ]

export default class ProductHome extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.state = {
            total: 0, // 商品总数量
            products: [], // 商品数组
            loading: false, // 是否加载中
            searchName: "", // 搜索的关键字
            searchType: "productName", // 搜索类型
        }
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
                dataIndex: 'desc'
            },
            {
                title: '价格',
                width: "100px",
                dataIndex: 'price',
                render: (price) => "￥" + price
            },
            {
                title: '状态',
                width: "100px",
                render: (product) => {
                    const { _id, status } = product;
                    return (
                        <div>
                            <Button type="primary" onClick={() => this.updateStatus(_id, status)}>
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            {status === 1 ? '已下架' : '在售'}
                        </div>
                    )
                }
            },
            {
                title: '操作',
                width: "100px",
                render: (product) => {
                    {/*将product对象使用state传递给目标路由组件*/ }
                    return (
                        <div>
                            <LinkButton onClick={() => this.props.history.push("/product/detail", { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push("/product/addupdate", { product, isUpdate: true })}>修改</LinkButton>
                        </div>
                    )
                }
            }
        ];
        const { searchType, searchName } = this.state;
        this.title = (
            <span>
                <Select value={searchType} style={{ width: "110px" }}>
                    <Select.Option value="productName">按名称搜索</Select.Option>
                    <Select.Option value="productDesc">按描述搜索</Select.Option>
                </Select>
                <Input
                    placeholder="搜索关键字"
                    style={{ width: "170px", margin: "0 15px" }}
                    value={searchName}
                    onChange={(e) => this.setState({ searchName: e.target.value })}
                />
                <Button type="primary" onClick={() => console.log(this.state)}>搜索</Button>
            </span>
        )
        this.extra = (
            <Button type="primary" onClick={() => this.props.history.push("/product/addupdate")}>
                <Icon type="plus" />
                添加商品
            </Button>
        )
    }
    updateStatus = async (_id, status) => {
        status = status === 1 ? 2 : 1;
        const result = await reqUpdateStatus(_id, status);
        if (result.status === 0) {
            message.success("更新商品成功");
            this.getProducts(this.pageNum)
        }
    }
    /**
     * 获取指定页码的商品列表
     */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        this.setState({ loading: true });
        // 保存页码, 方便后续有用
        this.pageNum = pageNum;
        const { searchName, searchType } = this.state;
        let result;
        if (searchName) {
            result = await reqProducts(pageNum, PAGE_SIZE);
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE);
        }
        if (result.status === 0) {
            const { total, list } = result.data;
            this.setState({
                loading: false,
                total: total,
                products: list
            })
        } else {
            this.setState({ loading: false })
        }
        console.log(result)
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1);
    }
    render() {
        const { total, products } = this.state;
        return (
            <Card title={this.title} extra={this.extra}>
                <Table
                    rowKey="_id"
                    bordered={true}
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        current: this.pageNum,
                        total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
