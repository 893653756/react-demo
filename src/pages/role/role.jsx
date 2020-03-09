import React, { Component } from 'react'
import { Card, Table, Button, Modal, message } from "antd"
import logUtils from "../../utils/logUtils"
import AddForm from './add-form';
import AuthForm from './auth-form';
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api';
import { formateDate } from '../../utils/dateUtils';
import memoryUtils from "../../utils/memoryUtils"


export default class Role extends Component {
    constructor(props) {
        super(props);
        this.auth = React.createRef();
        this.state = {
            roles: [],
            loading: false,
            role: {}, // 选中的某个角色
            isShowModal: 0, // 是否显示弹窗 0-不显示, 1-显示添加, 2-显示设置权限
        }
    }
    initColumns = () => {
        this.columns = [
            { title: "角色名称", dataIndex: "name" },
            { title: "创建时间", dataIndex: "create_time", render: formateDate },
            { title: "授权时间", dataIndex: "auth_time", render: formateDate },
            { title: "授权人", dataIndex: "auth_name" }
        ]
    }
    // 获取角色
    getRoles = async () => {
        this.setState({ loading: true })
        const result = await reqRoles();
        if (result.status === 0) {
            logUtils.log(result);
            this.setState({ roles: result.data })
        }
        this.setState({ loading: false })
    }
    // 添加角色
    addRole = () => {
        this.form.validateFields(async (error, values) => {
            if (!error) {
                logUtils.log(values);
                const { roleName } = values;
                this.handleCancel();
                const result = await reqAddRole(roleName);
                logUtils.log(result);
                if (result.status === 0) {
                    message.success('添加角色成功');
                    this.setState((state) => ({
                        roles: [...state.roles, result.data]
                    }))
                } else {
                    message.error('添加角色失败');
                }
            }
        })
    }
    // 更新权限
    updateRole = async () => {
        this.handleCancel();
        const role = this.state.role;
        // 获取最新的menu
        const menus = this.auth.current.getMenus();
        role.menus = menus;
        // 授权时间
        role.auth_time = Date.now();
        // 授权人
        role.auth_name = memoryUtils.user.username;
        // 请求更新
        const result = await reqUpdateRole(role);
        if (result.status === 0) {
            message.success('设置用户权限成功');
            this.setState({
                roles: [...this.state.roles]
            })
        }
    }
    handleCancel = () => {
        this.setState({ isShowModal: 0 })
        this.form && this.form.resetFields();
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles();
    }
    render() {
        const { roles, role, isShowModal, loading } = this.state;
        const title = (
            <div>
                <Button type="primary" style={{ marginRight: "10px" }} onClick={() => this.setState({ isShowModal: 1 })}>创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowModal: 2 })}>设置角色权限</Button>
            </div>
        )
        return (
            <Card title={title}>
                <Table
                    loading={loading}
                    rowKey="_id"
                    bordered={true}
                    dataSource={roles}
                    columns={this.columns}
                    rowSelection={{
                        type: "radio",
                        selectedRowKeys: [role._id],
                        onSelect: (role) => this.setState({ role })
                    }}
                    onRow={(role) => ({ onClick: () => this.setState({ role }) })
                    }
                />
                {/* 添加角色 */}
                <Modal
                    title="添加角色"
                    visible={isShowModal === 1}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                >
                    <AddForm setForm={(form) => this.form = form} />
                </Modal>

                {/* 设置权限 */}
                <Modal
                    title="设置权限"
                    visible={isShowModal === 2}
                    onOk={this.updateRole}
                    onCancel={this.handleCancel}
                >
                    <AuthForm ref={this.auth} role={role} />
                </Modal>
            </Card>
        )
    }
}
