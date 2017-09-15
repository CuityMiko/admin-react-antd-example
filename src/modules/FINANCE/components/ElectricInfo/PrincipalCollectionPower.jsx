import {Modal, Input, Form, notification, Icon, DatePicker, Select } from 'antd'
import React from 'react'
import { apiPost } from '../../../../api/index'
const FormItem = Form.Item
const Option = Select.Option

class PrincipalCollectionPower extends React.Component {
    state = {
        visible: false,
        isFirst: true,
        elecInfo: {}
    }
    async initialRemarks (nextProps) {
        if (this.state.isFirst && nextProps.visible) {
            this.props.form.resetFields()
            let elecInfo = await apiPost(
                '/ElectricityFees/ElectricityFeeInfo',
                {id: nextProps.id}
            )
            elecInfo = elecInfo.data.electricityFees
            this.setState({
                elecInfo: elecInfo,
                visible: nextProps.visible,
                isFirst: false
            })
            this.props.form.setFieldsValue({
                receivableMoney: parseFloat(elecInfo.actualReceivable).toFixed(1),
                principalReceived: parseFloat(elecInfo.principalReceived).toFixed(1),
                unprincipalReceived: parseFloat((elecInfo.actualReceivable ? elecInfo.actualReceivable : 0) - (elecInfo.principalReceived ? elecInfo.principalReceived : 0)).toFixed(1)
            })
        }
    }
    componentWillReceiveProps (nextProps) {
        this.initialRemarks(nextProps)
    }
    // 单击确定按钮提交表单
    handleSubmit = async () => {
        let adopt = false
        this.props.form.validateFields(
            (err) => {
                if (err) {
                    adopt = false
                } else {
                    adopt = true
                }
            },
        )
        if (adopt) {
            let json = this.props.form.getFieldsValue()
            json['id'] = this.props.id
            console.log(json)
            let data = await apiPost(
                '/ElectricityFees/updateReceivables',
                {principalCollectionDate: json.collectionDate.format('YYYY-MM-DD'),
                    principalMethod: json.method,
                    money: json.money,
                    id: json.id}
            )
            notification.open({
                message: data.data,
                icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
            })
            this.setState({
                visible: false,
                isFirst: true
            })
            this.props.refresh()
        }
    }
    handleCancel = (e) => {
        this.setState({ visible: false,
            isFirst: true})
    }
    onBlur = () => {
        let receivableMoney = this.props.form.getFieldValue('receivableMoney')
        let principalReceived = this.props.form.getFieldValue('principalReceived')
        let money = this.props.form.getFieldValue('money')
        if (typeof (receivableMoney) === 'undefined' || receivableMoney.length === 0) {
            receivableMoney = 0
        }
        if (typeof (principalReceived) === 'undefined' || principalReceived.length === 0) {
            principalReceived = 0
        }
        if (typeof (money) === 'undefined' || money.length === 0) {
            money = 0
        }
        // 未收金额
        let unprincipalReceivedMoney = parseFloat(receivableMoney) - parseFloat(principalReceived) - parseFloat(money)
        if (unprincipalReceivedMoney < 0) {
            this.props.form.setFieldsValue({
                unprincipalReceived: (parseFloat(receivableMoney) - parseFloat(principalReceived)).toFixed(1),
                money: ''
            })
            notification.open({
                message: '输入金额不能大于未收金额！',
                icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
            })
        } else {
            this.props.form.setFieldsValue({
                unprincipalReceived: unprincipalReceivedMoney.toFixed(1)
            })
        }
    }
    render () {
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Modal maskClosable={false}
                    title="确认收款"
                    style={{top: 20}}
                    width={380}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form layout="horizontal">
                        <FormItem label="交费日期" labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('collectionDate', {
                                rules: [ {
                                    required: true,
                                    message: '请选择客户交费日期!'
                                }]
                            })(
                                <DatePicker style={{width: '200px'}} />
                            )}
                        </FormItem>
                        <FormItem label="本期应收" labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('receivableMoney')(
                                <Input disabled type="text" style={{width: '200px'}} />
                            )}
                        </FormItem>
                        <FormItem label="已收金额" labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('principalReceived')(
                                <Input disabled type="text" style={{width: '200px'}} />
                            )}
                        </FormItem>
                        <FormItem label="本次实收" labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('money', {
                                rules: [ {
                                    required: true,
                                    message: '请输入本次实收!'
                                }]
                            })(
                                <Input onKeyUp={this.onBlur} type="text" style={{width: '200px'}} />
                            )}
                        </FormItem>
                        <FormItem label="未收金额" labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('unprincipalReceived')(
                                <Input disabled type="text" style={{width: '200px'}} />
                            )}
                        </FormItem>
                        <FormItem label="交费方式" labelCol={{ span: 7 }}
                            wrapperCol={{ span: 13 }}
                        >
                            {getFieldDecorator('method', {
                                rules: [ {
                                    required: true,
                                    message: '请选择客户交费方式!'
                                }]
                            })(
                                <Select
                                    showSearch
                                    style={{width: '200px'}}
                                    placeholder="请选择交费方式"
                                    optionFilterProp="children"
                                >
                                    <Option key="0">银行转账</Option>
                                    <Option key="1">支付宝</Option>
                                    <Option key="2">微信</Option>
                                    <Option key="3">支票</Option>
                                    <Option key="4">现金</Option>
                                    <Option key="5">其他</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

let PrincipalCollectionPowerCom = Form.create()(PrincipalCollectionPower)

export default PrincipalCollectionPowerCom
