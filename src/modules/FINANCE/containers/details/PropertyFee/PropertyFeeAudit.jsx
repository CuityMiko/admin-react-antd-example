// 财务管理 - 物业费明细
import React from 'react'
import {Row, Col, Modal, Radio, textarea, Icon, notification} from 'antd'
import '../../style/test.less'
import { apiPost } from '../../../../../api'
const RadioGroup = Radio.Group


class InReview extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            auditStatus: 2,
            remark: null,
            view: true,
            isFirst: true,
            monthDay: 0,
            data: {}
        }
    }
    async initialRemarks (nextProps) {
        this.setState({
            view: false
        })
        if (this.state.isFirst && nextProps.visible) {
            let resulData = await apiPost(
                '/propertyFee/getPropertyFeeById',
                {id: nextProps.id}
            )
            if (Math.floor(resulData.data.days) === resulData.data.days) {
                this.setState({
                    monthDay: resulData.data.days,
                    visible: nextProps.visible,
                    data: resulData.data,
                    isFirst: false,
                    view: true,
                    fileList: []
                })
            } else {
                this.setState({
                    monthDay: parseFloat(resulData.data.days).toFixed(5),
                    visible: nextProps.visible,
                    data: resulData.data,
                    isFirst: false,
                    view: true,
                    fileList: []
                })
            }
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
        this.props.close()
        this.isFirst = true
        this.setState({ visible: false,
            isFirst: true})
    }
    // 单击确定按钮提交表单
    handleSubmit = async () => {
        let result = await apiPost(
            'propertyFee/updatePropertyFee',
            {auditStatus: this.state.auditStatus,
                remark: this.state.remark,
                id: this.state.data.id}
        )
        notification.open({
            message: result.data,
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.props.close()
        this.props.refreshTable()
        this.setState({visible: false,
            isFirst: false })
    }
    render () {
        return (
            <Modal maskClosable={false}
                title= "物业费明细"
                style={{top: 20}}
                width={900}
                visible={this.state.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
            >
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
                    <Row>
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
                        textAlign: 'right'}}
                    >优惠金额  ¥{this.state.data.discountMoney} 本期应收 ¥{this.state.data.actualPaidMoney}</p>

                    <div className="wrapbox">
                        <div className="main">
                            <p className="line" />
                            <h2>其他信息</h2>
                            <Row>
                                <Col span={8}><b>录入日期：</b>{this.state.data.createName}&nbsp;&nbsp;{this.state.data.createDate}</Col>
                                <Col span={16}><b>最后修改：</b>{this.state.data.updateName}&nbsp;&nbsp;{this.state.data.updateDate}</Col>
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

export default InReview

