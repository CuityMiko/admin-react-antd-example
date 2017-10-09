/**
 * @author yanxiaodi
 * @email 929213769@qq.com
 * @create date 2017-10-09 01:42:33
 * @modify date 2017-10-09 01:42:33
 * @desc 根文件
 */
import * as React from 'react'
import { render } from 'react-dom'
import Root from './common/containers/Root/index'
import registerServiceWorker from './registerServiceWorker'
import { configureStore, history } from './store/configureStore'

const store = configureStore()

render(
  <Root
    store={store}
    history={history}
  />,
  document.getElementById('root') as HTMLElement
)
registerServiceWorker()
