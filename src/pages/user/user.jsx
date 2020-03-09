import React, { Component } from 'react'
import { Table, Modal, Button, Card, message } from "antd"
import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../../components/LinkButton';
import logUtils from '../../utils/logUtils';
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api';
import UserForm from './user-form';

export default class User extends Component {
    constructor(props) {
        super(props)
        this.columns = [];
        this.roleNames = [];
        this.state = {
            loading: false,
            users: [],
            isShowModal: false
        }
    }
    initColumns = () => {
        this.columns = [
            { title: '用户名', dataIndex: 'username' },
            { title: '邮箱', dataIndex: 'email' },
            { title: '电话', dataIndex: 'phone' },
            { title: '注册时间', dataIndex: 'create_time', render: formateDate },
            { title: '所属角色', dataIndex: 'role_id', render: (role_id) => this.roleNames[role_id] },
            {
                title: '操作',
                render: (user) => (
                    <div>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </div>
                )
            },
        ]
    }
    // 获取用户列表
    getUsers = async () => {
        this.setState({ loading: false })
        const result = await reqUsers();
        logUtils.log(result);
        if (result.status === 0) {
            const { users, roles } = result.data;
            // 初始化角色名
            this.initRoleName(roles);
            this.setState({
                users
            })
        }
        this.setState({ loading: false });
    }
    /**
     * 初始化角色名称
     * @return {object} {_id: name}
     */
    initRoleName = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name;
            return pre;
        }, {});
        this.roleNames = roleNames;
    }
    /**
     * 创建用户
     */
    addOrUpdateUser = () => {
        // 检验数据
        this.form.validateFields(async (error, values) => {
            if (!error) {
                this.setState({ isShowModal: false });
                logUtils.log(values);
                // 如果是更新, 则加上 _id
                if (this.user) {
                    values._id = this.user._id;
                }
                // 通讯
                const result = await reqAddOrUpdateUser(values);
                this.form.resetFields();
                if (result.status === 0) {
                    message.success(`${this.user ? '修改' : '创建'}用户成功`);
                    this.getUsers();
                } else {
                    message.error(`${this.user ? '修改' : '创建'}用户失败`)
                }
            }
        })
    }
    showAdd = () => {
        this.user = null;
        this.setState({ isShowModal: true })
    }
    showUpdate = (user) => {
        this.user = user;
        this.setState({ isShowModal: true })
    }
    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: '你确定删除该用户吗?',
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0) {
                    message.success('删除用户成功');
                    this.getUsers();
                }
            }
        })
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers();
    }
    render() {
        const { loading, users, isShowModal } = this.state;
        const title = <Button type="primary" onClick={this.showAdd}>创建用户</Button>
        return (
            <Card title={title}>
                <Table
                    rowKey='_id'
                    bordered
                    loading={loading}
                    dataSource={users}
                    columns={this.columns}
                    pagination={{ defaultPageSize: 4 }}
                />
                {/* 添加/修改用户 */}
                <Modal
                    title={this.user ? '修改用户' : '添加用户'}
                    visible={isShowModal}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.form.resetFields();
                        this.setState({ isShowModal: false })
                    }}
                >
                    <UserForm
                        roleNames={this.roleNames}
                        user={this.user}
                        setForm={(form) => this.form = form}
                    />
                </Modal>
            </Card>
        )
    }
}
