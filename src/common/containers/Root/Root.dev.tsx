/**
 * @author yanxiaodi
 * @email 929213769@qq.com
 * @create date 2017-10-09 02:23:10
 * @modify date 2017-10-09 02:23:10
 * @desc 开发环境 - <Root />组件 配置
 */
import * as React from 'react'
import { Provider } from 'react-redux'
import rootRoutes from '../../../router'

const PropTypes = require('PropTypes')
const { ConnectedRouter } = require('react-router-redux')
const { renderRoutes } = require('react-router-config')

interface Props {
  store: {},
  history: {}
}

// react-router-redux: Now you can dispatch navigation actions from anywhere!
// react-router-redux: store.dispatch(push('/foo'))
class Root extends React.Component<Props, {}> {
  render () {
    const {store} = this.props
    const {history} = this.props

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div style={{ height: '100%' }}>
            {renderRoutes(rootRoutes)}
            {/* <DevTools /> */}
          </div>
        </ConnectedRouter>
      </Provider>
    )
  }
}

Root.PropTypes = {
  store: PropTypes.object.isRequired
}

export default Root
