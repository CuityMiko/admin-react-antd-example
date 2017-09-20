// 物业费明细
import React from 'react'
import {Row, Col, Modal, Popconfirm, Icon, notification, Spin} from 'antd'
import '../../../style/test.less'
import { apiPost } from '../../../../../api'


class PropertyDetail extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
            auditStatus: 2,
            payPeriod: '',
            invoicePropertyStatus: '',
            invoiceLateStatus: '',
            id: 0,
            remark: '',
            openUpdate: false,
            visible: false,
            view: true,
            isFirst: true,
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
    handleCancel = (e) => {
        this.props.close()
        this.isFirst = true
        this.setState({ visible: false,
            isFirst: true})
    }
    async initialRemarks (nextProps) {
        this.setState({
            loading: true,
            view: false
        })
        if (this.state.isFirst && nextProps.visible) {
            let resulData = await apiPost(
                '/propertyFee/getPropertyFeeById',
                {id: nextProps.id}
            )
            let result2 = await apiPost(
                '/collectRent/getChargeRecordById',
                {
                    feeId: nextProps.id,
                    feeType: 3
                }
            )
            let result3 = await apiPost(
                '/collectRent/getChargeRecordById',
                {
                    feeId: nextProps.id,
                    feeType: 4
                }
            )
            if (resulData.data.invoicePropertyStatus === 0) {
                this.setState({
                    invoicePropertyStatus: '未开票'
                })
            } else if (resulData.data.invoicePropertyStatus === 1) {
                this.setState({
                    invoicePropertyStatus: '已开票'
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
            this.setState({
                data: resulData.data,
                data2: result2.data,
                data3: result3.data,
                visible: nextProps.visible,
                isFirst: false,
                loading: false,
                view: true
            })
        }
    }
    componentWillReceiveProps (nextProps) {
        this.initialRemarks(nextProps)
    }
    handleCommit = async () => {
        await apiPost(
            '/propertyFee/updatePropertyFee',
            {id: this.state.data.id,
                auditStatus: 1}
        )
        notification.open({
            message: '提交成功',
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.props.close()
        this.isFirst = true
        this.setState({ visible: false,
            isFirst: true})
        this.props.refreshTable()
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
                footer={null}
                onCancel={this.handleCancel}
            >
                <Spin spinning={this.state.loading}>
                    <div className="contract">
                        <Row style={{marginTop: 0}}>
                            <Col>
                                <div style={{textAlign: 'center',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    lineHeight: '40px'}}
                                >
                                    <span>{this.state.data.printClientName}</span>
                                    <span>物业服务费统计表</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div style={{color: '#666',
                                    textAlign: 'center',
                                    fontSize: '14px',
                                    lineHeight: '18px'}}
                                >
                                （ {this.state.data.startDate} ~ {this.state.data.endDate} ）
                                </div>
                            </Col>
                        </Row>
                        <Row style={{margin: '10px 0'}}>
                            <Col span={8}><i>房间编号：</i>{this.state.data.roomNum} </Col>
                            <Col span={8}><i>所在楼宇：</i>{this.state.data.buildName} </Col>
                            <Col span={8}><i>交费期限：</i>{this.state.data.payDeadline} </Col>
                        </Row>
                        <table className="tb">
                            <tbody>
                                <tr className="hd">
                                    <td>费用项目</td>
                                    <td>面积</td>
                                    <td />
                                    <td>单价</td>
                                    <td />
                                    <td>月份</td>
                                    <td>金额</td>
                                </tr>
                                <tr>
                                    <td>物业管理费</td>
                                    <td>{this.state.data.serviceArea}</td>
                                    <td>*</td>
                                    <td>{this.state.data.yearPmPrice === 0 ? this.state.data.pmUnitPrice : '--'}</td>
                                    <td>*</td>
                                    <td>{this.state.data.months}</td>
                                    <td>{this.state.data.yearPmPrice === 0 ? this.state.data.pmFee : this.state.data.yearPmPrice}</td>
                                </tr>
                                <tr>
                                    <td>电梯费</td>
                                    <td>{this.state.data.serviceArea}</td>
                                    <td>*</td>
                                    <td>{this.state.data.elevUnitPrice}</td>
                                    <td>*</td>
                                    <td>{this.state.data.months}</td>
                                    <td>{this.state.data.elevatorFee}</td>
                                </tr>
                                <tr>
                                    <td>空调费</td>
                                    <td>{this.state.data.serviceArea}</td>
                                    <td>*</td>
                                    <td>{this.state.data.yearAcPrice === 0 ? this.state.data.acUnitPrice : '--'}</td>
                                    <td>*</td>
                                    <td>{this.state.data.acUnitDay}/4</td>
                                    <td>{this.state.data.yearAcPrice === 0 ? this.state.data.airFee : this.state.data.yearAcPrice}</td>
                                </tr>
                                <tr>
                                    <td>水费</td>
                                    <td>{this.state.data.serviceArea}</td>
                                    <td>*</td>
                                    <td>{this.state.data.waterType === 0 ? this.state.data.waterUnitPrice : '--'}</td>
                                    <td>*</td>
                                    <td>{this.state.data.months}</td>
                                    <td>{this.state.data.waterType === 0 ? this.state.data.waterFee : '--'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style={{margin: '20px 0',
                            textAlign: 'right',
                            color: '#666666'}}
                        >优惠金额：¥{this.state.data.discountMoney}&nbsp;&nbsp;&nbsp;&nbsp;本期应收：
                            <span style={{color: 'red',
                                fontSize: '18px'}}
                            >¥{this.state.data.actualPaidMoney}</span></p>
                        <div className="other">
                            <div className="main">
                                <p className="line" />
                                <h2>其他信息</h2>
                                <Row>
                                    <Col span={8}><b>录入日期：</b>{this.state.data.createName}&nbsp;&nbsp;{this.state.data.createDate}</Col>
                                    <Col span={16}><b>最后修改：</b>{this.state.data.updateName}&nbsp;&nbsp;{this.state.data.updateDate}</Col>
                                </Row>
                                {this.state.data.auditStatus === 0 &&
                            <Row style={{textAlign: 'center'}}>
                                <Popconfirm title="确定提交吗?" onConfirm={this.handleCommit}>
                                    <a className="btnred ant-btn" >提交 </a>
                                </Popconfirm>
                            </Row>}
                                {this.state.data.auditStatus !== 0 && this.state.data.auditStatus !== 1 &&
                            <Row>
                                <Col span={8}><b>审核人：</b>{this.state.data.auditName}&nbsp;&nbsp;{this.state.data.auditDate}</Col>
                                <Col span={16}><b>审核说明：</b>{this.state.data.auditStatus === 2 && '审核成功'}{this.state.data.auditStatus === 3 && '审核失败'}&nbsp;&nbsp;{this.state.data.remark}</Col>
                            </Row>}</div>
                        </div>
                        {this.state.data.whetherRentPaid !== 0 &&
                        <div className="wrapbox">
                            <div className="title">
                                收款信息
                            </div>
                            <div className="main">
                                <h2>确认收款</h2>
                                <Row>
                                    <Col span={8}><i>应收金额：</i>
                                        <span style={{color: 'red'}}>{this.state.data.actualPaidMoney}</span>元
                                    </Col>
                                    <Col span={16}><i>开票状态：</i>{this.state.invoicePropertyStatus}</Col>
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
                                        {chargeList.map(propertyFee => {
                                            if (propertyFee.paidWay === 0) {
                                                return <tr key={propertyFee.id}>
                                                    <td>{propertyFee.receiptDate}</td>
                                                    <td>{propertyFee.paidMoney}</td>
                                                    <td>{propertyFee.unpaidMoney}</td>
                                                    <td>银行转账</td>
                                                    <td>{propertyFee.createName}</td>
                                                </tr>
                                            } else if (propertyFee.paidWay === 1) {
                                                return <tr key={propertyFee.id}>
                                                    <td>{propertyFee.receiptDate}</td>
                                                    <td>{propertyFee.paidMoney}</td>
                                                    <td>{propertyFee.unpaidMoney}</td>
                                                    <td>支付宝</td>
                                                    <td>{propertyFee.createName}</td>
                                                </tr>
                                            } else if (propertyFee.paidWay === 2) {
                                                return <tr key={propertyFee.id}>
                                                    <td>{propertyFee.receiptDate}</td>
                                                    <td>{propertyFee.paidMoney}</td>
                                                    <td>{propertyFee.unpaidMoney}</td>
                                                    <td>微信</td>
                                                    <td>{propertyFee.createName}</td>
                                                </tr>
                                            } else if (propertyFee.paidWay === 3) {
                                                return <tr key={propertyFee.id}>
                                                    <td>{propertyFee.receiptDate}</td>
                                                    <td>{propertyFee.paidMoney}</td>
                                                    <td>{propertyFee.unpaidMoney}</td>
                                                    <td>支票</td>
                                                    <td>{propertyFee.createName}</td>
                                                </tr>
                                            } else if (propertyFee.paidWay === 4) {
                                                return <tr key={propertyFee.id}>
                                                    <td>{propertyFee.receiptDate}</td>
                                                    <td>{propertyFee.paidMoney}</td>
                                                    <td>{propertyFee.unpaidMoney}</td>
                                                    <td>现金</td>
                                                    <td>{propertyFee.createName}</td>
                                                </tr>
                                            } else if (propertyFee.paidWay === 5) {
                                                return <tr key={propertyFee.id}>
                                                    <td>{propertyFee.receiptDate}</td>
                                                    <td>{propertyFee.paidMoney}</td>
                                                    <td>{propertyFee.unpaidMoney}</td>
                                                    <td>其他</td>
                                                    <td>{propertyFee.createName}</td>
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
                                    <Col span={8}><i>违约金额：</i>
                                        <span style={{color: 'red'}}>{this.state.data.lateMoney}  元 </span>
                                    </Col>
                                    <Col span={8}><i>开票状态：</i>{this.state.invoiceLateStatus}</Col>
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
                                            } else if (collectRent.paidWay === 6) {
                                                return <tr key={collectRent.id}>
                                                    <td>{collectRent.receiptDate}</td>
                                                    <td>{collectRent.paidMoney}</td>
                                                    <td>{collectRent.unpaidMoney}</td>
                                                    <td>{collectRent.discountMoney}</td>
                                                    <td>延期下月电费</td>
                                                    <td>{collectRent.createName}</td>
                                                </tr>
                                            }
                                            return ''
                                        })}
                                    </tbody>
                                </table>
                            </div>}
                        </div>}
                    </div>
                </Spin>
            </Modal>
        )
    }
}

export default PropertyDetail

