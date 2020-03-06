import React, { Component } from 'react'
import { Form, Input, Table, Modal, Button, Card } from "antd"
import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../../components/LinkButton';
import logUtils from '../../utils/logUtils';

export default class User extends Component {
    constructor(props) {
        super(props)
        this.columns = [];
        this.state = {
            loading: false,
            users: [{
                _id: "dadsad",
                username: "name",
                email: "123@qq.com",
                phone: "18200291576",
                create_time: Date.now(),
                role_id: "admin"
            }]
        }
    }
    initColumns = () => {
        this.columns = [
            { title: '用户名', dataIndex: 'username' },
            { title: '邮箱', dataIndex: 'email' },
            { title: '电话', dataIndex: 'phone' },
            { title: '注册时间', dataIndex: 'create_time', render: formateDate },
            { title: '所属角色', dataIndex: 'role_id' },
            {
                title: '操作', render: () => (
                    <div>
                        <LinkButton>修改</LinkButton>
                        <LinkButton>删除</LinkButton>
                    </div>
                )
            },
        ]
    }
    // 获取用户列表
    getUsers = () => {

    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getUsers();
    }
    render() {
        const { loading, users } = this.state;
        const title = <Button type="primary" onClick={() => logUtils.log('创建用户')}>创建用户</Button>
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
            </Card>
        )
    }
}
