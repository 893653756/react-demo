import React, { Component } from 'react'
import { Form, Input } from "antd"
class AddForm extends Component {
    componentWillMount() {
        this.props.setForm(this.props.form);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator("roleName", {
                        initialValue: '',
                        rules: [
                            { required: true, message: '角色名必须输入' }
                        ]
                    })(<Input placeholder='请输入角色名...' />)}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm);
