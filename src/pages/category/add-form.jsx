import React, { Component } from 'react'
import { Form, Input, Select } from "antd"
class AddForm extends Component {
    componentWillMount() {
        this.props.setForm(this.props.form);
    }
    render() {
        const { categorys, parentId } = this.props;
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item>
                    {getFieldDecorator("parentId", {
                        initialValue: parentId
                    })(
                        <Select>
                            <Select.Option value="0" key="0">
                                一级分类
                            </Select.Option>
                            {categorys.map(c => (
                                <Select.Option value={c._id} key={c._id}>
                                    {c.name}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("categoryName", {
                        initialValue: "",
                        rules: [
                            { required: true, message: '分类名字必须填入' }
                        ]
                    })(
                        <Input placeholder="请输入分类名称" />
                    )}
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm);