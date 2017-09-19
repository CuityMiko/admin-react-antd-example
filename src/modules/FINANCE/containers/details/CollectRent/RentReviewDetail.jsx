// 租金明细
import React from 'react'
import {Row, Col, notification, Icon, Popconfirm, Button, Modal} from 'antd'
import '../../style/test.less'
import { apiPost } from '../../../../../api'
import CollectRentLateConfirmComponent from '../../../components/CollectRent/CollectRentLateConfirm'
import CollectRentConfirmComponent from '../../../components/CollectRent/CollectRentConfirm'


class RentReviewDetail extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            view: true,
            isFirst: true,
            auditStatus: 2,
            payPeriod: '',
            invoiceRentStatus: '',
            invoiceLateStatus: '',
            id: 0,
            remark: '',
            openUpdate: false,
            openUpdate2: false,
            data2: [],
            data3: [],
            data: {}
        }
    }
    handleUpdate = () => {
        this.setState({
            openUpdate: true,
            id: this.state.id
        })
    }
    handleUpdate2 = () => {
        this.setState({
            openUpdate2: true,
            id: this.state.id
        })
    }
    invoiceRent = async () => {
        await apiPost(
            '/collectRent/updateCollectRentVoByInvoiceRent',
            {id: this.state.id,
                invoiceRentStatus: 1}
        )
        notification.open({
            message: '租金开票成功',
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.refresh()
    }
    invoiceLate = async () => {
        await apiPost(
            '/collectRent/updateCollectRentVoByInvoiceRent',
            {id: this.state.id,
                invoiceLateStatus: 1}
        )
        notification.open({
            message: '违约金开票成功',
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.refresh()
    }
    async initialRemarks (nextProps) {
        this.setState({
            id: nextProps.id,
            view: false
        })
        if (this.state.isFirst && nextProps.visible) {
            let resulData = await apiPost(
                '/collectRent/getCollectRentById',
                {id: nextProps.id}
            )
            let result2 = await apiPost(
                '/collectRent/getChargeRecordById',
                {
                    feeId: nextProps.id,
                    feeType: 0
                }
            )
            let result3 = await apiPost(
                '/collectRent/getChargeRecordById',
                {
                    feeId: nextProps.id,
                    feeType: 1
                }
            )
            if (resulData.data.invoiceRentStatus === 0) {
                this.setState({
                    invoiceRentStatus: '未开票'
                })
            } else if (resulData.data.invoiceRentStatus === 1) {
                this.setState({
                    invoiceRentStatus: '已开票'
                })
            }
            if (resulData.data.invoiceLateStatus === 0) {
                this.setState({
                    invoiceLateStatus: '未开票'
                })
            } else if (resulData.data.invoiceLateStatus === 1) {
                this.setState({
                    invoiceLateStatus: '已开票'
                })
            }
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
                data: resulData.data,
                data2: result2.data,
                data3: result3.data,
                isFirst: false,
                visible: nextProps.visible,
                view: true
            })
        }
    }
    componentWillReceiveProps (nextProps) {
        this.initialRemarks(nextProps)
    }
    refresh = async () => {
        let resulData = await apiPost(
            '/collectRent/getCollectRentById',
            {id: this.state.id}
        )
        let result2 = await apiPost(
            '/collectRent/getChargeRecordById',
            {
                feeId: this.state.id,
                feeType: 0
            }
        )
        let result3 = await apiPost(
            '/collectRent/getChargeRecordById',
            {
                feeId: this.state.id,
                feeType: 1
            }
        )
        if (resulData.data.invoiceRentStatus === 0) {
            this.setState({
                invoiceRentStatus: '未开票'
            })
        } else if (resulData.data.invoiceRentStatus === 1) {
            this.setState({
                invoiceRentStatus: '已开票'
            })
        }
        if (resulData.data.invoiceLateStatus === 0) {
            this.setState({
                invoiceLateStatus: '未开票'
            })
        } else if (resulData.data.invoiceLateStatus === 1) {
            this.setState({
                invoiceLateStatus: '已开票'
            })
        }
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
            data: resulData.data,
            data2: result2.data,
            data3: result3.data,
            isFirst: false,
            visible: true,
            view: true
        })
        // this.initialRemarks()
    }
    close = async () => {
        this.setState({
            openUpdate: false,
            openUpdate2: false
        })
    }
    handleCancel = (e) => {
        this.isFirst = true
        this.setState({ visible: false,
            isFirst: true})
        this.props.close()
    }
    render () {
        let chargeList = this.state.data2
        let chargeList2 = this.state.data3
        return (
            <Modal maskClosable={false}
                title= "物业费明细"
                style={{top: 20}}
                width={900}
                visible={this.state.visible}
                onCancel={this.handleCancel}
                footer={null}
            >
                <div style={this.props.style} className="contract">
                    <CollectRentConfirmComponent
                        id={this.state.id}
                        refreshTable={this.refresh}
                        close={this.close}
                        visible={this.state.openUpdate}
                    />
                    <CollectRentLateConfirmComponent
                        id={this.state.id}
                        refreshTable={this.refresh}
                        close={this.close}
                        visible={this.state.openUpdate2}
                    />
                    <h2>租户信息</h2>
                    <Row>
                        <Col span={24}><b>客户名称：</b>{this.state.data.rentClientName} </Col>
                    </Row>
                    <Row>
                        <Col span={10}><b>租赁周期：</b>{this.state.data.periodContract}</Col>
                        <Col span={14}><b>租赁面积：</b>{this.state.data.leaseArea} </Col>
                    </Row>
                    <Row>
                        <Col span={10}><b>所属楼宇：</b>{this.state.data.buildName} </Col>
                        <Col span={14}><b>房间编号：</b>{this.state.data.roomNum} </Col>
                    </Row>
                    <div className="wrapbox">
                        <div className="title">租金信息</div>
                        <div className="main">
                            <h2>费用设置</h2>
                            <Row>
                                <Col span={10}><b>合同单价：</b>
                                    <span className="color1">{this.state.data.unitPrice}</span>元/㎡/天</Col>
                                <Col span={14}><b>交费方式：</b>{this.state.payPeriod}</Col>
                            </Row>
                            <Row>

                                <Col span={10}><b>首年租金：</b>
                                    <span className="color1">{this.state.data.firstYearRent}</span>元</Col>
                                <Col span={14}>
                                    <span className="color1">{this.state.data.startIncNum}</span>年后租金每年递增 {this.state.data.rentIncrRate} % </Col>
                            </Row>
                            <p className="line" />
                            <h2>本期租金</h2>
                            <Row>
                                <Col span={10}><b>本期周期：</b>{this.state.data.periodRent}</Col>
                                <Col span={14}><b>交费期限：</b>{this.state.data.payDeadline}</Col></Row>
                            <Row>
                                <Col span={24}><b>本期租金：</b>
                                    <span className="color1">{this.state.data.actualPaidMoney}</span>元  （已优惠
                                    <span className="color1">{this.state.data.discountMoney}</span>元）</Col>
                            </Row>
                            <p className="line" />
                            <h2>其他信息</h2>
                            <Row>
                                <Col span={10}><b>录入日期：</b>{this.state.data.createName}{this.state.data.createDate}</Col>
                                <Col span={14}><b>最后修改：</b>{this.state.data.updateName}{this.state.data.updateDate}</Col>
                            </Row>
                            <Row>
                                <Col span={10}><b>审核人：</b>{this.state.data.auditName}{this.state.data.auditDate}</Col>
                                <Col span={14}><b>审核说明：</b>{this.state.data.auditStatus === 2 && '审核成功'}{this.state.data.auditStatus === 3 && '审核失败'}&nbsp;&nbsp;{this.state.data.remark}</Col>
                            </Row>
                        </div>
                    </div>
                    {this.state.data.whetherRentPaid !== 0 &&
                <div className="wrapbox">
                    <div className="title">
                        收款信息
                    </div>
                    <div className="main">
                        <h2>确认收款</h2>
                        <Row>
                            <Col span={8}><b>应收金额：</b>
                                <span style={{padding: '0 10px',
                                    color: 'red'}}
                                >{this.state.data.actualPaidMoney}</span> 元</Col>
                            <Col span={16}><b>开票状态：</b>{this.state.invoiceRentStatus}</Col>
                        </Row>
                        <table className="tb">
                            <tbody>
                                <tr className="hd">
                                    <td>时间</td>
                                    <td>实收金额</td>
                                    <td>未收金额</td>
                                    <td>收款方式</td>
                                    <td>经手人</td>
                                </tr>
                                {chargeList.map(collectRent => {
                                    if (collectRent.paidWay === 0) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>银行转账</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 1) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>支付宝</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 2) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>微信</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 3) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>支票</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 4) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>现金</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 5) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>其他</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    }
                                    return ''
                                })}
                            </tbody>
                        </table>
                    </div>
                    {this.state.data.lateMoney !== 0 && this.state.data.unpaidMoney === 0 && ((this.state.data.lateMoney - this.state.data.unpaidLateMoney) !== 0) &&
                    <div className="main">
                        <p className="line" />
                        <h2>确认违约金</h2>
                        <Row>
                            <Col span={8}><b>违约金额：</b>{this.state.data.lateMoney} 元 </Col>
                            <Col span={8}><b>开票状态：</b>{this.state.invoiceLateStatus}</Col>
                        </Row>
                        <table className="tb">
                            <tbody>
                                <tr className="hd">
                                    <td>时间</td>
                                    <td>实收金额</td>
                                    <td>未收金额</td>
                                    <td>优惠金额</td>
                                    <td>收款方式</td>
                                    <td>经手人</td>
                                </tr>
                                {chargeList2.map(collectRent => {
                                    if (collectRent.paidWay === 0) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>{collectRent.discountMoney}</td>
                                            <td>银行转账</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 1) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>{collectRent.discountMoney}</td>
                                            <td>支付宝</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 2) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>{collectRent.discountMoney}</td>
                                            <td>微信</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 3) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>{collectRent.discountMoney}</td>
                                            <td>支票</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 4) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>{collectRent.discountMoney}</td>
                                            <td>现金</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    } else if (collectRent.paidWay === 5) {
                                        return <tr key={collectRent.id}>
                                            <td>{collectRent.receiptDate}</td>
                                            <td>{collectRent.paidMoney}</td>
                                            <td>{collectRent.unpaidMoney}</td>
                                            <td>{collectRent.discountMoney}</td>
                                            <td>其他</td>
                                            <td>{collectRent.createName}</td>
                                        </tr>
                                    }
                                    return ''
                                })}
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
                    }
                    {this.state.data.unpaidMoney !== 0 &&
                <Button type="primary" onClick={this.handleUpdate} >确认收款</Button>}
                    {this.state.data.whetherRentPaid === 1 && this.state.data.lateMoney !== 0 && this.state.data.whetherLatePaid !== 1 &&
                <Button type="primary" onClick={this.handleUpdate2} >收违约金</Button>}
                    {this.state.data.invoiceRentStatus !== 1 &&
                <Popconfirm title="确定开票吗?" onConfirm={this.invoiceRent}>
                    <a className="btnred ant-btn">&nbsp; 租金开票 </a>
                </Popconfirm>}
                    {this.state.data.invoiceLateStatus !== 1 && this.state.data.lateMoney !== 0 &&
                <Popconfirm title="确定开票吗?" onConfirm={this.invoiceLate}>
                    <a className="btnred ant-btn">&nbsp; 违约金开票 </a>
                </Popconfirm>}</div>
            </Modal>
        )
    }
}

export default RentReviewDetail

