import React, { PureComponent } from 'react'
import { Form, Input, Select } from 'antd'
import logUtils from '../../utils/logUtils';
const Item = Form.Item;
const Option = Select.Option;
class UserForm extends PureComponent {
    componentWillMount() {
        this.props.setForm(this.props.form);
    }
    render() {
        logUtils.log(this.props.form);
        const { getFieldDecorator } = this.props.form;
        const roleNames = this.props.roleNames;
        const user = this.props.user || {};
        return (
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                <Item label="用户名:">
                    {getFieldDecorator("username", {
                        initialValue: user.username,
                        rules: [{ required: true, message: '用户名为必填项' }]
                    })(<Input placeholder='请输入用户名...' />)}
                </Item>
                {user.password ? null : (
                    <Item label="密码:">
                    {getFieldDecorator("password", {
                        initialValue: '',
                        rules: [
                            { required: true, message: '密码为必填项' },
                            { pattern: /^[a-zA-Z0-9]+$/, message: '用户名不能包含特殊字符' }
                        ]
                    })(<Input placeholder='请输入密码...' />)}
                </Item>
                )}
                
                <Item label="手机号:">
                    {getFieldDecorator("phone", {
                        initialValue: user.phone,
                        rules: [
                            { required: true, message: '手机号为必填项' }
                        ]
                    })(<Input placeholder='请输入手机号...' />)}
                </Item>
                <Item label="邮箱:">
                    {getFieldDecorator("email", {
                        initialValue: user.email,
                        rules: [
                            { required: true, message: '邮箱为必填项' }
                        ]
                    })(<Input placeholder='请输入邮箱...' />)}
                </Item>
                <Item label="所属角色:">
                    {getFieldDecorator("role_id", {
                        initialValue: user.role_id,
                        rules: [
                            { required: true, message: '必选' }
                        ]
                    })(
                        <Select>
                            {Object.keys(roleNames).map((key) => (
                                <Option key={key} value={key}>{roleNames[key]}</Option>
                            ))}
                        </Select>
                    )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)
