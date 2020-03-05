import React, { Component } from 'react'
import { Card, Icon, List } from "antd"
import "./product.less"
import { BASE_IMG_URL } from '../../config/constant';

export default class ProductDetail extends Component {
    render() {
        const { name, desc, price, imgs, detail } = this.props.location.state.product;
        const title = (
            <span>
                <Icon
                    onClick={() => this.props.history.goBack()}
                    type="arrow-left"
                    style={{ fontSize: "20px", color: "#1da57a", marginRight: "10px", cursor: "pointer" }}
                />
                商品详情
            </span>
        )
        return (
            <Card title={title} className="product-detail">
                <List>
                    <List.Item>
                        <span className="left">商品名称:</span>
                        <span>{name}</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">商品价格:</span>
                        <span>{price}元</span>
                    </List.Item>
                    <List.Item>
                        <span className="left">商品图片:</span>
                        <div>
                            {imgs.map(img => (
                                <img
                                    key={img}
                                    src={BASE_IMG_URL + img}
                                    className="product-img"
                                    alt="img"
                                />
                            ))}
                        </div>
                    </List.Item>
                    <List.Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{__html: detail}}></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
