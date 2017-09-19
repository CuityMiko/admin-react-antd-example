// 财务管理 - 租金审核
import React from 'react'
import {Row, Col, textarea, Modal, Radio, notification, Icon} from 'antd'
import '../../style/test.less'
import { apiPost } from '../../../../../api'
const RadioGroup = Radio.Group

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            auditStatus: 2,
            payPeriod: '',
            remark: '',
            view: true,
            isFirst: true,
            data: {}
        }
    }
    async initialRemarks (nextProps) {
        this.setState({
            view: false
        })
        if (this.state.isFirst && nextProps.visible) {
            let resulData = await apiPost(
                '/collectRent/getCollectRentById',
                {id: nextProps.id}
            )
            if (resulData.data.payCycle === 3) {
                this.setState({
                    payPeriod: '季付'
                })
            } else if (resulData.data.payCycle === 6) {
                this.setState({
                    payPeriod: '半年付'
                })
            } else {
                this.setState({
                    payPeriod: '年付'
                })
            }
            this.setState({
                visible: nextProps.visible,
                data: resulData.data,
                isFirst: false,
                view: true,
                fileList: []
            })
        }
    }
    componentWillReceiveProps (nextProps) {
        this.initialRemarks(nextProps)
    }
    onChange = (e) => {
        this.setState({
            auditStatus: e.target.value
        })
    }
    onValueChange = (e) => {
        this.setState({
            remark: e.target.value
        })
    }
    handleCancel = (e) => {
        this.isFirst = true
        this.setState({ visible: false,
            isFirst: true})
        this.props.close()
    }
    // 单击确定按钮提交表单
    handleSubmit = async () => {
        let result = await apiPost(
            'collectRent/updateCollectRentVoByAudit',
            {auditStatus: this.state.auditStatus,
                remark: this.state.remark,
                id: this.state.data.id}
        )
        notification.open({
            message: result.data,
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.props.refreshTable()
        this.setState({visible: false,
            isFirst: false })
    }
    render () {
        const blueNumberStyle = {color: '#169BD5',
            padding: '0 10px'}
        return (
            <Modal maskClosable={false}
                title="租金明细"
                style={{top: 20}}
                width={900}
                visible={this.state.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
            >
                <div className="contract">
                    <h2>租户信息</h2>
                    <Row>
                        <Col span={8}><b>客户名称：</b>{this.state.data.rentClientName} </Col>
                        <Col span={8}><b>租赁周期：</b>{this.state.data.periodContract}</Col>
                        <Col span={8}><b>租赁面积：</b>{this.state.data.leaseArea} </Col>
                    </Row>
                    <Row>
                        <Col span={8}><b>所属楼宇：</b>{this.state.data.buildName} </Col>
                        <Col span={16}><b>房间编号：</b>{this.state.data.roomNum} </Col>
                    </Row>
                    <div className="wrapbox">
                        <div className="title">租金信息</div>
                        <div className="main">
                            <h2>费用设置</h2>
                            <Row>
                                <Col span={10}><b>合同单价：</b>
                                    <span style={blueNumberStyle}>{this.state.data.unitPrice}</span> 元/㎡/天</Col>
                                <Col span={14}><b>交费方式：</b>{this.state.payPeriod}</Col>
                            </Row>
                            <Row>

                                <Col span={10}><b>首年租金：</b>
                                    <span style={blueNumberStyle}>{this.state.data.firstYearRent}</span>  元</Col>
                                <Col span={14}>
                                    <span style={blueNumberStyle}>{this.state.data.startIncNum}</span> 年后租金每年递增 {this.state.data.rentIncrRate} % </Col>
                            </Row>
                            <p className="line" />
                            <h2>本期租金</h2>
                            <Row>
                                <Col span={10}><b>本期周期：</b>{this.state.data.periodRent}</Col>
                                <Col span={14}><b>交费期限：</b>{this.state.data.payDeadline}</Col></Row>
                            <Row>
                                <Col span={24}><b>本期租金：</b>
                                    <span style={blueNumberStyle}>{this.state.data.actualPaidMoney}</span> 元  （已优惠
                                    <span style={blueNumberStyle}>{this.state.data.discountMoney}</span> 元）</Col>
                            </Row>
                            <p className="line" />
                            <h2>其他信息</h2>
                            <Row>
                                <Col span={8}><b>录入日期：</b>{this.state.data.createName}{this.state.data.createDate}</Col>
                                <Col span={16}><b>最后修改：</b>{this.state.data.updateName}{this.state.data.updateDate}</Col>
                            </Row>
                            <Row>
                                <RadioGroup onChange={this.onChange} value={this.state.auditStatus}>
                                    <b>审批意见：</b><Radio value={2}>审核通过</Radio>
                                    <Radio value={3}>审核不通过</Radio>
                                </RadioGroup>
                            </Row>
                        </div>
                    </div>
                    <textarea style={{width: '50%'}} placeholder="请输入审批意见" onChange={this.onValueChange} />
                </div>
            </Modal>
        )
    }
}

export default App

