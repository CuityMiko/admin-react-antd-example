// 楼宇添加
import {Modal, Input, Form, Row, Col, Icon, notification} from 'antd'
import React from 'react'
import { apiPost } from '../../../api/index'
import '../style/test.less'
const FormItem = Form.Item
class BuildAdd extends React.Component {
    state = {
        visible: false,
        isFirst: true,
        view: true,
        title: '',
        data: {}
    }

    async initialRemarks (nextProps) {
        this.setState({
            view: false,
            title: nextProps.title
        })
        if (nextProps.id !== null) {
            if (this.state.isFirst && nextProps.visible) {
                let build = await apiPost(
                    '/build/getBuildById',
                    {id: nextProps.id}
                )
                this.props.form.setFieldsValue({
                    buildName: build.data.buildName,
                    passengerElevatorNum: build.data.passengerElevatorNum,
                    goodsElevatorNum: build.data.goodsElevatorNum,
                    floorNum: build.data.floorNum
                })
                this.setState({
                    visible: nextProps.visible,
                    isFirst: false,
                    view: true,
                    fileList: []
                })
            }
        } else {
            if (this.state.isFirst && nextProps.visible) {
                this.props.form.resetFields()
                this.setState({
                    visible: nextProps.visible,
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
            if (this.props.id > 0) {
                json['id'] = this.props.id
                await apiPost(
                    'build/updateBuild',
                    json
                )
                notification.open({
                    message: '修改成功',
                    icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
                })
                this.props.close()
                this.props.refreshTable()
                this.setState({
                    visible: false,
                    isFirst: true
                })
            } else {
                await apiPost(
                    'build/saveBuild',
                    json
                )
                notification.open({
                    message: '添加成功',
                    icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
                })
                this.props.close()
                this.props.refreshTable()
                this.setState({
                    visible: false,
                    isFirst: true
                })
            }
        }
    }
    handleCancel = (e) => {
        this.props.close()
        this.isFirst = true
        this.setState({ visible: false,
            isFirst: true})
    }
    render () {
        const { getFieldDecorator } = this.props.form
        return (
            <Modal maskClosable={false}
                title={this.state.title}
                style={{top: 20}}
                width={300}
                visible={this.state.visible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
            >
                <Form layout="horizontal">
                    <Row>
                        <Col span={20}>
                            <FormItem label="楼宇名称" labelCol={{ span: 8 }}
                                wrapperCol={{ span: 15 }}
                            >
                                {getFieldDecorator('buildName', {
                                    rules: [ {
                                        required: true,
                                        message: '楼宇名称不能为空'
                                    }]
                                })(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label="客梯数量" labelCol={{ span: 8 }}
                                wrapperCol={{ span: 15 }}
                            >
                                {getFieldDecorator('passengerElevatorNum')(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label="货梯数量" labelCol={{ span: 8 }}
                                wrapperCol={{ span: 15 }}
                            >
                                {getFieldDecorator('goodsElevatorNum')(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label="楼层数量" labelCol={{ span: 8 }}
                                wrapperCol={{ span: 15 }}
                            >
                                {getFieldDecorator('floorNum')(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

let BuildAddComponent = Form.create()(BuildAdd)

export default BuildAddComponent
