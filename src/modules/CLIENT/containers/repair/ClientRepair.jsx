// 客户管理 - 客户报修
import React, {Component} from 'react'
import {Table, Button, Spin, Popconfirm, Input, DatePicker } from 'antd'
import { apiPost, verification } from '../../../../api'
// 引入组件
import CancelRepairComponent from '../../components/repair/ClientRepair/CancelRepair'
import DistributeLeafletsComponent from '../../components/repair/ClientRepair/DistributeLeaflets'
import TableAddUpComponent from '../../components/repair/ClientRepair/TableAddUp'
import App from '../../components/repair/ClientRepair/MaintenanceProject'
const { RangePicker } = DatePicker
// React component
class ClientRepair extends Component {
    constructor (props) {
        super(props)
        this.state = {
            total: 0,
            current: 1,
            loading: false,
            openinvalid: false,
            opendispatch: false,
            openTableAddUp: false,
            openUpdate: false,
            openMaintenanceProject: false,
            columns: [],
            dataSource: [],
            id: 0
        }
    }
    distributeLeaflets = (id) => {
        this.setState({
            opendispatch: true,
            openinvalid: false,
            openTableAddUp: false,
            openMaintenanceProject: false,
            openUpdate: false,
            id: id
        })
    }
    handleUpdate = (id) => {
        this.setState({
            openinvalid: true,
            opendispatch: false,
            openMaintenanceProject: false,
            openTableAddUp: false,
            openUpdate: false,
            id: id
        })
    }
    handleUpdateRepair = (id) => {
        this.setState({
            openinvalid: false,
            opendispatch: false,
            openTableAddUp: false,
            openMaintenanceProject: false,
            openUpdate: true,
            id: id
        })
    }
    maintenanceProject = (id) => {
        this.setState({
            openinvalid: false,
            opendispatch: false,
            openTableAddUp: false,
            openUpdate: false,
            openMaintenanceProject: true,
            id: id
        })
    }
    info = (url) => {
        this.props.history.push(url)
    }
    async initialRemarks () {
        this.setState({loading: true})
        let result = await apiPost(
            'upkeep/repairList',
            {repairStatus: 0,
                sort: 'id',
                order: 'desc'
            }
        )
        let repairList = result.data.rows
        const distributeLeaflets = this.distributeLeaflets
        const handleUpdate = this.handleUpdate
        const handleUpdateRepair = this.handleUpdateRepair
        const maintenanceProject = this.maintenanceProject
        const info = this.info
        this.setState({loading: false,
            total: result.data.total,
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
                title: '报修日期',
                width: 200,
                dataIndex: 'repairDate',
                key: 'repairDate',
                sorter: true
            }, {
                title: '公司名称',
                width: 200,
                dataIndex: 'clientName',
                key: 'clientName'
            }, {
                title: '报修内容',
                width: 200,
                dataIndex: 'repairContent',
                key: 'repairContent',
                render: function (text, record, index) {
                    text = text.substring(0, 30)
                    let url = '/home/client/repair/repairDetail/' + record.id
                    return (
                        <a onClick={() => info(url)}>{text}</a>
                    )
                }
            }, {
                title: '派工状态',
                width: 200,
                dataIndex: 'pieStatus',
                key: 'pieStatus',
                render: function (text, record, index) {
                    let pieStatus = '未派单'
                    if (record.pieStatus === 1) {
                        pieStatus = '已派单'
                    }
                    return (
                        <span>{pieStatus}</span>
                    )
                }
            }, {
                title: '维修人',
                width: 200,
                dataIndex: 'repairedMan',
                key: 'repairedMan'
            }, {
                title: '维修状态',
                width: 200,
                dataIndex: 'repairStatus',
                key: 'repairStatus',
                render: function (text, record, index) {
                    let repairStatus = '未完成'
                    if (record.isCancel === 1) {
                        repairStatus = '已取消'
                    } else if (record.repairStatus === 1) {
                        repairStatus = '已完成'
                    }
                    return (
                        <span>{repairStatus}</span>
                    )
                }
            }, {
                title: '维修项目',
                width: 200,
                dataIndex: 'maintenanceProject',
                key: 'maintenanceProject',
                render: function (text, record, index) {
                    if (record.startDate !== null) {
                        return (<a onClick={() => maintenanceProject(record.id)}>查看明细</a>)
                    }
                }
            }, {
                title: '维修明细',
                width: 200,
                dataIndex: 'MaintenanceDetails',
                key: 'MaintenanceDetails',
                render: function (text, record, index) {
                    let url = '/home/client/repair/MaintenanceDetail/' + record.id
                    return (
                        <a onClick={() => info(url)}>查看明细</a>
                    )
                }
            }, {
                title: '操作',
                width: 200,
                dataIndex: 'opt',
                key: 'opt',
                fixed: 'right',
                render: function (text, record, index) {
                    let arr = []
                    if (record.pieStatus === 0 || record.isCancel === 1) {
                        if (verification('dispatchOrder')) {
                            arr.push(
                                <Popconfirm key="1" title="确定派单吗?" onConfirm={() => distributeLeaflets(record.id)}>
                                    <a> 派单 &nbsp;</a>
                                </Popconfirm>
                            )
                        }
                        arr.push(
                            <Popconfirm key="2" title="确定修改吗?" onConfirm={() => handleUpdateRepair(record.id)}>
                                <a>&nbsp; 修改&nbsp; </a>
                            </Popconfirm>)
                    }
                    if (record.pieStatus === 0) {
                        if (verification('cancelledOrder')) {
                            arr.push(
                                <Popconfirm key="3" title="确定作废吗?" onConfirm={() => handleUpdate(record.id)}>
                                    <a> &nbsp;作废 </a>
                                </Popconfirm>
                            )
                        }
                    }
                    return arr
                }
            }],
            dataSource: repairList
        })
    }
    componentWillMount () {
        this.initialRemarks()
    }
    refresh = async (pagination, filters, sorter) => {
        // 刷新表格
        let order = ''
        if (typeof (sorter) !== 'undefined' && typeof (sorter.order) !== 'undefined') {
            order = sorter.columnKey + ' ' + sorter.order.substring(0, sorter.order.length - 3)
        }
        if (filters === null || typeof (filters) === 'undefined') {
            filters = []
        }
        filters['startDate'] = this.startDate
        filters['endDate'] = this.endDate
        filters['clientName'] = this.clientName
        filters['repairStatus'] = 0
        filters['order'] = order
        if (pagination === null || typeof (pagination) === 'undefined') {
            filters['page'] = 1
            filters['rows'] = 30
        } else {
            filters['page'] = pagination.current
            filters['rows'] = pagination.pageSize
        }
        filters['sort'] = 'id'
        filters['order'] = 'desc'

        let result = await apiPost(
            'upkeep/repairList',
            filters
        )
        this.setState({
            total: result.data.total,
            current: pagination ? pagination.current : 1,
            openinvalid: false,
            opendispatch: false,
            openTableAddUp: false,
            openUpdate: false,
            openMaintenanceProject: false,
            dataSource: result.data.rows,
            id: 0
        })
    }
    // 弹出框设置
    showModal = () => {
        this.setState({
            opendispatch: false,
            openinvalid: false,
            openUpdate: false,
            openMaintenanceProject: false,
            openTableAddUp: true
        })
    }
    clientName = ''
    entryNameOnChange = (e) => {
        this.clientName = e.target.value
    }
    query = () => {
        this.refresh()
    }
    startDate = ''
    endDate = ''
    getDate = (date, dateString) => {
        this.startDate = dateString[0]
        if (dateString[1] > 0) {
            this.endDate = dateString[1] + ' 23:59:59'
        } else {
            this.endDate = dateString[1]
        }
    }
    render () {
        return (
            <div>

                <CancelRepairComponent
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openinvalid}
                />
                <DistributeLeafletsComponent
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.opendispatch}
                />
                <TableAddUpComponent
                    title="添加报单"
                    refreshTable={this.refresh}
                    visible={this.state.openTableAddUp}
                />
                <TableAddUpComponent
                    title="修改报单"
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openUpdate}
                />
                <App
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openMaintenanceProject}
                />
                <span style={{paddingBottom: '10px',
                    display: 'block'}}
                >
                    <span>报修日期&nbsp;：&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <RangePicker onChange={this.getDate} />
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;公司名称&nbsp;：&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Input style={{width: 200,
                        marginRight: '5px'}} onChange={this.entryNameOnChange}
                    />
                    <Button style={{marginRight: '5px'}} type="primary" onClick={this.query}>查询</Button>
                    <Button type="primary" onClick={this.showModal}>添加报单</Button>
                </span>

                <Spin spinning={this.state.loading}>
                    <Table
                        onChange={this.refresh}
                        pagination={{total: this.state.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            current: this.state.current,
                            pageSizeOptions: ['15', '30', '45'],
                            defaultPageSize: 15}}
                        scroll={{ x: 1850 }}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </Spin>
            </div>
        )
    }
}
export default ClientRepair

