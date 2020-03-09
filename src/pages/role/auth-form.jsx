import React, { PureComponent } from 'react'
import { Form, Input, Tree } from "antd"
import logUtils from '../../utils/logUtils';
import menuList from '../../config/menuList';

const { TreeNode } = Tree;
export default class AuthForm extends PureComponent {
    constructor(props) {
        super(props);
        // 根据传入角色的menus生成初始状态
        const { menus } = props.role;
        this.treeNodes = [];
        this.state = {
            checkedKeys: menus
        }
    }
    /**
     * 生成权限目录
     */
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push((
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            ))
            return pre;
        }, [])
    }
    onSelect = (selectedKeys, info) => {
        logUtils.log('selected', selectedKeys, info);
        this.setState({ checkedKeys: selectedKeys })
    };
    // 提供给父组件获取选择的权限列表
    getMenus = () => [...this.state.checkedKeys]
    onCheck = (checkedKeys, info) => {
        logUtils.log('onCheck', checkedKeys, info);
        this.setState({ checkedKeys })
    };
    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    /**
     * 组件将要接收新的props 和 state
     */
    componentWillReceiveProps(nextProps) {
        const { menus } = nextProps.role;
        this.setState({ checkedKeys: menus })
    }
    render() {
        const { checkedKeys } = this.state;
        const { name } = this.props.role;
        return (
            <div>
                <Form.Item label="角色名称:" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                    <Input value={name} disabled />
                </Form.Item>
                <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    defaultExpandAll={true}
                    onSelect={this.onSelect}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>

                </Tree>
            </div>
        );
    }
}
