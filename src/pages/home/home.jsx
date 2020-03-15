import React, { Component } from 'react'
import { Card, Icon, DatePicker, Timeline, Statistic } from 'antd'
import './home.less'
import Line from './line'
import Bar from './bar'
import mement from 'moment'
import { Date_FORMAT } from '../../config/constant'

const { RangePicker } = DatePicker;
const { Item } = Timeline
export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisited: true
        }
    }

    render() {
        const { isVisited } = this.state;
        // 第二个card的title
        const cardTileTwo = (
            <div className='home-menu'>
                <span className={isVisited ? "home-menu-active home-menu-visited" : 'home-menu-visited'} onClick={() => this.setState({ isVisited: true })}>访问量</span>
                <span className={isVisited ? "" : 'home-menu-active'} onClick={() => this.setState({ isVisited: false })}>销售量</span>
            </div>
        )
        // 第二个card的扩展
        const cardExtraTwo = (
            <RangePicker defaultValue={[mement('2019/01/01', Date_FORMAT), mement('2019/06/01', Date_FORMAT)]} format={Date_FORMAT} />
        )
        return (
            <div className='home'>
                <Card
                    className='home-card'
                    title="商品总量"
                    extra={<Icon type='question-circle' style={{ color: 'rgba(0,0,0,.5)' }} />}
                    style={{ width: '250px' }}
                    headStyle={{ color: 'rgba(0,0,0,.5)' }}
                >
                    <Statistic
                        value={1128163}
                        suffix="个"
                        style={{ fontWeight: 'bolder' }}
                    />
                    <Statistic
                        value={15}
                        valueStyle={{ fontSize: 15 }}
                        prefix='周同比'
                        suffix={<div>%<Icon style={{ color: 'red', marginLeft: 10 }} type='arrow-down' /></div>}
                    />
                    <Statistic
                        value={10}
                        valueStyle={{fontSize:15}}
                        prefix='日同比'
                        suffix={<div>%<Icon style={{color: '#3f8600', marginLeft: 10}} type="arrow-up"/></div>}
                    />
                </Card>
                <Line />
                <Card
                    className='home-content'
                    title={cardTileTwo}
                    extra={cardExtraTwo}
                >
                    <Card
                        className='home-table-left'
                        title={isVisited ? '访问趋势' : '销售趋势'}
                        bodyStyle={{ padding: 0, height: '275px' }}
                        extra={<Icon type='reload' />}
                    >
                        <Bar />
                    </Card>

                    <Card
                        className='home-table-right'
                        title='任务'
                        extra={<Icon type='reload' />}
                    >
                        <Timeline>
                            <Item color='green'>版本迭代会</Item>
                            <Item color='yellow'>网站设计初版</Item>
                            <Item color='red'>
                                <p>登录功能设计</p>
                                <p>权限验证</p>
                            </Item>
                            <Item color="gray">
                                <p>联调接口</p>
                                <p>功能验收</p>
                            </Item>
                        </Timeline>
                    </Card>
                </Card>
            </div>
        )
    }
}
