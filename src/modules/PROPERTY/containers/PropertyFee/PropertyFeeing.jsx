// 收费管理 - 待收费
import React, {Component} from 'react'
import {Table, Spin, Popconfirm, Icon, notification} from 'antd'
import { apiPost } from '../../../../api'
import PropertyAddComponent from '../../components/PropertyFee/PropertyFeeAdd'
import PropertyFeeHeadComponent from '../../components/PropertyFee/PropertyFeeHead'
import PropertyFeeingComponent from '../details/PropertyFee/PropertyDetail'
// 引入组件
// React component
class PropertyFeeing extends Component {
    constructor (props) {
        super(props)
        this.state = {
            loading: false,
            openAdd: false,
            openTableAddUp: false,
            openUpdate: false,
            AccountList: [],
            columns: [],
            RowKeys: [],
            total: 0,
            page: 1,
            rows: 15,
            sort: 'a.id',
            order: 'desc',
            dataSource: [],
            ListBuildingInfo: [],
            id: null
        }
    }
    handleUpdate = (id) => {
        this.setState({
            openAdd: true,
            openTableAddUp: false,
            openUpdate: false,
            id: id
        })
    }
    handleUpdate2 = (id) => {
        this.setState({
            openAdd: false,
            openTableAddUp: false,
            openUpdate: true,
            id: id
        })
    }
    handleDelete = async (id) => {
        await apiPost(
            '/propertyFee/updatePropertyFee',
            {id: id,
                delFlag: 1,
                order: this.state.order,
                sort: this.state.sort}
        )
        notification.open({
            message: '删除成功',
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.refresh()
    }
    handleCommit = async (id) => {
        await apiPost(
            '/propertyFee/updatePropertyFee',
            {id: id,
                auditStatus: 1}
        )
        notification.open({
            message: '提交成功',
            icon: <Icon type="smile-circle" style={{color: '#108ee9'}} />
        })
        this.refresh()
    }
    close = async () => {
        this.setState({
            openAdd: false,
            openTableAddUp: false,
            openUpdate: false,
            id: null
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({
            RowKeys: selectedRowKeys
        })
    }
    async initialRemarks () {
        this.setState({loading: true})
        let result = await apiPost(
            '/propertyFee/propertyFeeList',
            {auditStatus: 0,
                page: this.state.page,
                contractStatus: 0}
        )
        let ListBuildingInfo = await apiPost(
            '/collectRent/ListBuildingInfo'
        )
        const handleUpdate = this.handleUpdate
        const handleUpdate2 = this.handleUpdate2
        const handleDelete = this.handleDelete
        this.setState({loading: false,
            ListBuildingInfo: ListBuildingInfo.data,
            columns: [{
                title: '序号',
                width: 100,
                dataIndex: 'id',
                render: function (text, record, index) {
                    index++
                    return (
                        <span>{index}</span>
                    )
                }
            }, {
                title: '所属楼宇',
                dataIndex: 'buildName'
            }, {
                title: '房间编号',
                dataIndex: 'roomNum'
            }, {
                title: '客户名称',
                dataIndex: 'clientName',
                render: function (text, record, index) {
                    if (record.tenant !== null && record.tenant !== '') {
                        return (
                            <span>{record.tenant}</span>
                        )
                    } else {
                        return (
                            <span>{record.clientName}</span>
                        )
                    }
                }
            }, {
                title: '本期物业费周期',
                dataIndex: 'periodPropertyFee'
            }, {
                title: '应收金额',
                dataIndex: 'actualPaidMoney'
            }, {
                title: '交费期限',
                dataIndex: 'payDeadline'
            }, {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate'
            }, {
                title: '创建人',
                dataIndex: 'createName',
                key: 'createName'
            }, {
                title: '操作',
                width: 200,
                dataIndex: 'opt',
                fixed: 'right',
                render: function (text, record, index) {
                    return (
                        <div>
                            <a type="primary" onClick={() => handleUpdate2(record.id)} > 明细 &nbsp;&nbsp;</a>
                            <a type="primary" onClick={() => handleUpdate(record.id)} > 重新收费 &nbsp;&nbsp;</a>
                            <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
                                <a> 删除 </a>
                            </Popconfirm>
                        </div>
                    )
                }
            }],
            dataSource: result.data.rows,
            total: result.data.total
        })
    }
    componentDidMount () {
        this.initialRemarks()
    }
    json={}
    refresh = async (pagination, filters, sorter) => {
        if (typeof (filters) === 'undefined') {
            filters = []
        }
        if (pagination === null) {
            this.json = filters
        }
        for (let p in this.json) {
            filters[p] = this.json[p]
        }
        filters['auditStatus'] = 0
        filters['contractStatus'] = 0
        filters['sort'] = this.state.sort
        filters['order'] = this.state.order
        if (pagination !== null && typeof (pagination) !== 'undefined') {
            filters['rows'] = pagination.pageSize
            filters['page'] = pagination.current
            this.setState({
                page: pagination.current
            })
        } else {
            this.setState({
                page: 1
            })
        }
        // 刷新表格
        let result = await apiPost(
            '/propertyFee/propertyFeeList',
            filters
        )
        this.setState({
            openAdd: false,
            openTableAddUp: false,
            openUpdate: false,
            dataSource: result.data.rows
        })
    }
    query = () => {
        this.refresh()
    }
    render () {
        return (
            <div>
                <PropertyFeeHeadComponent
                    RowKeys={this.state.RowKeys}
                    refresh={this.refresh}
                    type={0}
                    ListBuildingInfo={this.state.ListBuildingInfo}
                />
                <PropertyFeeingComponent
                    close={this.close}
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openUpdate}
                />
                <PropertyAddComponent
                    close={this.close}
                    id={this.state.id}
                    refreshTable={this.refresh}
                    visible={this.state.openAdd}
                />

                <Spin spinning={this.state.loading}>
                    <Table
                        onChange={this.refresh}
                        rowSelection={{
                            onChange: this.onSelectChange
                        }}
                        pagination={{total: this.state.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: ['15', '30', '45'],
                            current: this.state.page,
                            defaultPageSize: this.state.rows}}
                        scroll={{ x: 2300 }}
                        bordered
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                    />
                </Spin>
            </div>
        )
    }
}
export default PropertyFeeing


