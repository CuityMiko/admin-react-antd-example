//  保证金管理
import React from 'react'
import { Tabs } from 'antd'
import CashDepositRent from './CashDeposit/CashDepositRent'
import CashDepositProperty from './CashDeposit/CashDepositProperty'
import CashDepositSong from './CashDeposit/CashDepositSong'
// 引入组件
const TabPane = Tabs.TabPane
// React component
class Margin extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            key: 0
        }
    }
    callback = (key) => {
        this.setState({
            key: key
        })
    }
    render () {
        return (<Tabs onChange={this.callback}>
            <TabPane tab="租赁保证金" key="1"><CashDepositRent key={this.state.key} pro={this.props} /></TabPane>
            <TabPane tab="能源管理押金" key="2"><CashDepositProperty key={this.state.key} pro={this.props} /></TabPane>
            <TabPane tab="欢乐颂管理押金" key="3"><CashDepositSong key={this.state.key} pro={this.props} /></TabPane>
        </Tabs>
        )
    }
}
export default Margin


