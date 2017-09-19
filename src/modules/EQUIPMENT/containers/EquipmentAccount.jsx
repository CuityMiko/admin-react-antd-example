// 设备管理 - 设备台账
import React, {Component} from 'react'
import {Modal, Table, Button, Spin, Select, Input} from 'antd'
import {apiPost} from '../../../api'
// 引入组件
import EquipmentAddUpComponent from '../components/EquipmentAccount/EquipmentAddUp'
import EnabledStateComponent from '../components/EquipmentAccount/EnabledState'
const Option = Select.Option
// React component
class Account extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
            total: 0,
            current: 1,
            openAdd: false,
            openUpdate: false,
            previewVisible: false,
            equipmentNumber: '',
            imgUrl: '',
            openSS: false,
            columns: [],
            dataSource: [],
            id: 0
        }
    }

    // 弹出框设置
    openSS = (id) => {
        this.setState({
            openUpdate: false,
            openSS: true,
            openAdd: false,
            id: id
        })
    }
    handleUpdateEquipment = (id) => {
        this.setState({
            openAdd: false,
            openSS: false,
            openUpdate: true,
            id: id
        })
    }
    info = (url) => {
        this.props.history.push(url)
    }
    async initialRemarks () {
        this.setState({loading: true})
        let result = await apiPost(
            '/equipment/equipmentList'
        )
        let repairList = result.data.rows
        const handleUpdateEquipment = this.handleUpdateEquipment
        const openSS = this.openSS
        const info = this.info
        this.setState({
            loading: false,
            columns: [{
                title: '序号',
                width: 100,
                dataIndex: 'id',
                key: 'id',
                render: function (text, record, index) {
                    index++
                    return (
                        <span>{index}</span>
                    )
                }
            }, {
                title: '所属系统',
                width: 150,
                dataIndex: 'systemName',
                key: 'systemName'
            }, {
                title: '设备编号',
                width: 150,
                dataIndex: 'equipmentNumber',
                key: 'equipmentNumber'
            }, {
                title: '设备名称',
                width: 150,
                dataIndex: 'equipmentName',
                key: 'equipmentName'
            }, {
                title: '规格型号',
                width: 150,
                dataIndex: 'equipmentModel',
                key: 'equipmentModel'
            }, {
                title: '设备品牌',
                width: 150,
                dataIndex: 'equipmentBrand',
                key: 'equipmentBrand'
            }, {
                title: '使用年限',
                width: 150,
                dataIndex: 'serviceLife',
                key: 'serviceLife'
            }, {
                title: '设备状态',
                width: 100,
                dataIndex: 'equipmentStatus',
                key: 'equipmentStatus',
                render: function (text, record, index) {
                    let equipmentStatus = '使用'
                    if (text === 1) {
                        equipmentStatus = '报废'
                    } else if (text === 2) {
                        equipmentStatus = '闲置'
                    }
                    return (
                        <span>{equipmentStatus}</span>
                    )
                }
            }, {
                title: '维保责任人',
                width: 150,
                dataIndex: 'maintenanceName',
                key: 'maintenanceName'
            }, {
                title: '巡检责任人',
                dataIndex: 'patrolName',
                key: 'patrolName'
            }, {
                title: '操作',
                width: 250,
                dataIndex: 'opt',
                key: 'opt',
                fixed: 'right',
                render: function (text, record, index) {
                    let url = '/home/equipment/Details/equipmentledgerDetails/' + record.id
                    return (
                        <div>
                            <a onClick={() => info(url)}> 详情 &nbsp;</a>
                            <a onClick={() => handleUpdateEquipment(record.id)}>&nbsp; 修改 &nbsp;</a>
                            <a onClick={() => openSS(record.id)}>&nbsp; 启停设备 </a>
                        </div>
                    )
                }
            }],
            dataSource: repairList
        })
    }

    componentDidMount () {
        this.initialRemarks()
    }

    refresh = async (pagination, url, equipmentNumber) => {
        // 刷新表格
        if (typeof (url) !== 'undefined' && pagination === null) {
            this.info(url, equipmentNumber)
        }
        let filters = []
        filters['equipmentName'] = this.equipmentName
        filters['equipmentStatus'] = this.equipmentStatus
        if (pagination === null || typeof (pagination) === 'undefined') {
            filters['page'] = 1
            filters['rows'] = 30
        } else {
            filters['page'] = pagination.current
            filters['rows'] = pagination.pageSize
        }
        let result = await apiPost(
            '/equipment/equipmentList',
            filters
        )
        this.setState({
            total: result.data.total,
            current: pagination ? pagination.current : 1,
            openAdd: false,
            openUpdate: false,
            openSS: false,
            dataSource: result.data.rows,
            id: 0
        })
    }
    // 弹出框设置
    showModal = () => {
        this.setState({
            openUpdate: false,
            openSS: false,
            openAdd: true
        })
    }
    equipmentName = ''
    entryNameOnChange = (e) => {
        this.equipmentName = e.target.value
    }
    equipmentStatus = ''
    equipmentStatusOne = (value) => {
        this.equipmentStatus = value
    }
    query = () => {
        this.refresh()
    }

    info (url, equipmentNumber) {
        this.setState({
            previewVisible: true,
            loading: false,
            openAdd: false,
            openUpdate: false,
            equipmentNumber: equipmentNumber,
            imgUrl: url
        })
    }

    handleCancel = () => {
        this.setState({
            previewVisible: false,
            loading: false,
            openAdd: false,
            openUpdate: false,
            equipmentNumber: '',
            imgUrl: ''
        })
    }

    render () {
        return (
            <div>
                <EquipmentAddUpComponent
                    title="添加设备"
                    refreshTable={this.refresh}
                    visible={this.state.openAdd}
                />
                <EquipmentAddUpComponent
                    title="修改设备"
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openUpdate}
                />
                <EnabledStateComponent
                    title="启停设备"
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openSS}
                />
                <span style={{paddingBottom: '10px',
                    display: 'block'}}
                >
                    <span>设备名称&nbsp;：&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Input style={{width: 200}} onChange={this.entryNameOnChange} />
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;设备状态&nbsp;：&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Select
                        showSearch
                        style={{width: 200,
                            marginRight: '5px'}}
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.equipmentStatusOne}
                    >
                        <Option key="0">使用</Option>
                        <Option key="1">报废</Option>
                        <Option key="2">闲置</Option>
                    </Select>
                    <Button style={{marginRight: '5px'}} type="primary" onClick={this.query}>查询</Button>
                    <Button type="primary" onClick={this.showModal}>添加设备</Button>
                </span>

                <Spin spinning={this.state.loading}>
                    <Table
                        scroll={{x: 1550}}
                        pagination={{total: this.state.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            current: this.state.current,
                            pageSizeOptions: ['15', '30', '45'],
                            defaultPageSize: 15}}
                        onChange={this.refresh}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </Spin>
                <Modal maskClosable={false} visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={this.state.imgUrl} />
                    <span style={{
                        textAlign: 'center',
                        display: 'block'
                    }}
                    >设备编号：{this.state.equipmentNumber}</span>
                </Modal>
            </div>
        )
    }
}
export default Account

