import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from "antd"
import LinkButton from "../../components/LinkButton";
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api';
import AddForm from './add-form';
import UpdateForm from './update-form';
import logUtils from "../../utils/logUtils";

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.columns = [];
        this.category = {}
        this.state = {
            showStatus: 0, // 标识添加、更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
            loading: false, // 加载数据
            parentId: "0", // 分类id
            parentName: "",
            categorys: [], // 一级分类
            subCategorys: [] // 二级分类
        }
    }
    /**
     * 初始化Table所有列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: "分类的名称",
                dataIndex: "name" // 显示数据对应属性名
            },
            {
                title: '操作',
                width: "300px",
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === "0" ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

                    </span>
                )
            }
        ]
    }
    /**
     * 显示二级分类
     */
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys(category._id);
        });
    }
    /**
     * 显示一级分类
     */
    showCategorys = () => {
        // 更新为显示一列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    /**
     * 获取分类列表数据
     */
    getCategorys = async (parentId) => {
        // 发送请求前, 显示loading
        this.setState({ loading: true });
        parentId = parentId || this.state.parentId;
        const result = await reqCategorys(parentId);
        logUtils.log(result)
        if (result.status === 0) {
            if (parentId === "0") {
                this.setState({
                    categorys: result.data,
                    loading: false
                })
            } else {
                this.setState({
                    subCategorys: result.data,
                    loading: false
                })
            }
        } else {
            this.setState({
                loading: false
            })
            message.error('获取分类列表失败')
        }
    }
    /**
     * 显示更新弹框
     */
    showUpdate = (category) => {
        this.category = category;
        logUtils.log(category);
        this.setState({ showStatus: 2 })
    }
    /**
     * 更新
     */
    updateCategory = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ loading: true, showStatus: 0 })
                const categoryId = this.category._id;
                const categoryName = values.categoryName;
                const result = await reqUpdateCategory(categoryId, categoryName);
                // 清除输入数据
                this.form.resetFields()
                if (result.status === 0) {
                    // 3. 重新显示列表
                    this.getCategorys()
                } else {
                    this.setState({ loading: false })
                    message.error("更新失败")
                }
            }
        })
    }
    /**
     * 显示添加确认框
     */
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    /**
     * 关闭确认框
     */
    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }
    /**
     * 添加分类
     */
    addCategory = () => {
        this.form.validateFields(async (err, values) => {
            logUtils.log(values)
            if (!err) {
                this.setState({ loading: true, showStatus: 0 })
                const { categoryName, parentId } = values;
                // 清除数据
                this.form.resetFields();
                const result = await reqAddCategory(categoryName, parentId);
                logUtils.log(result);
                if (result.status === 0) {
                    // 重新获取
                    if (parentId === this.state.parentId) {
                        this.getCategorys();
                    } else if (parentId === "0") {
                        this.getCategorys("0");
                    }
                    message.success("添加成功")
                }
            }
        })
    }
    componentWillMount() {
        this.initColumns();
    }
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const { loading, categorys, subCategorys, parentId, showStatus, parentName } = this.state;
        const extra = (
            <Button type="primary" onClick={this.showAdd}>
                <Icon type="plus" />
                添加
            </Button>
        )

        const title = (parentId === "0") ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{ marginRight: "5px" }} />
                <span>{parentName}</span>
            </span>
        );
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered={true}
                    loading={loading}
                    dataSource={parentId === "0" ? categorys : subCategorys}
                    columns={this.columns}
                    rowKey="_id"
                    pagination={{ defaultPageSize: 9, showQuickJumper: true }}
                />
                {/* 添加分类框 */}
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>

                {/* 更新分类 */}
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={this.category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}
