import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from "react-router-dom";
import "./login.less";
import Logo from "../../assets/images/logo.png";
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import logUtils from '../../utils/logUtils';
class Login extends Component {
    /**
     * 密码自定义校验
     */
    validatorPWD = (rule, value, callback) => {
        // console.log("validatorPWD",rule, value)
        if (!value) {
            callback("密码不能为空");
        } else if (value.length < 4) {
            callback("密码长度不能小于4");
        } else if (value.length > 12) {
            callback("密码长度不能大于12");
        } else if (/[^0-9a-zA-Z]/.test(value)) {
            callback("密码不能包含特殊字符");
        } else {
            callback();
        }
    }
    /**
     * 登录
     */
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { username, password } = values;
                const result = await reqLogin(username, password);
                logUtils.log("user", result)
                // 登录成功
                if (result.status === 0) {
                    message.success('登录成功');
                    const user = result.data;
                    // 保存登录信息到内存
                    memoryUtils.user = user;
                    // 保存到本地存储
                    storageUtils.saveUser(user);
                    // 跳转到管理界面
                    this.props.history.replace("/");
                } else {
                    // 登录错误提示
                    message.error(result.msg);
                }
                
            } else {
                console.log("登录失败", err);
            }
        });
    };
    render() {
        // 如果用户已登录, 自动登录跳转
        const user = memoryUtils.user;
        if (user && user._id) {
            return <Redirect to="/home"></Redirect>
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={Logo} alt="logo" />
                    <h1>React后台管理项目</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [
                                    { required: true, message: '用户名不能为空' },
                                    { min: 4, message: '用户名最少4个长度' },
                                    { max: 10, message: '用户名最长10个长度' },
                                    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名不能包含特殊字符' }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {/* 自定义校验 */}
                            {getFieldDecorator('password', {
                                rules: [{
                                    validator: this.validatorPWD
                                }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button">
                                登 录
                            </Button>

                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Form.create()(Login);