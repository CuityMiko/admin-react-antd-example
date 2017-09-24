// panes - reducers - Tabs 标签内容 管理
import { combineReducers } from 'redux'

import { ADD_PANE, REMOVE_PANE, ACTIVE_PANE } from '../constants/ActionTypes'

const initialState = {
    // activeKey: '1', // panes[0].key
    activePane: { // 展示的 pane标签
        closable: false,
        key: '/home/index',
        path: '/home/index',
        title: '首页'
    },
    panes: [{
        closable: false,
        key: '/home/index',
        path: '/home/index',
        title: '首页'
    }]
}

const setPanes = (state = initialState, action) => {
    switch (action.type) {
        case ADD_PANE:
            let addState = Object.assign({}, state, {
                activePane: action.addObj.activePane,
                panes: action.addObj.panes
            })
            return addState

        case ACTIVE_PANE:
            let activeState = Object.assign({}, state, {
                activePane: action.activeObj.objActive
            })
            return activeState

        case REMOVE_PANE:
            let removeState = Object.assign({}, state, {
                activePane: action.activePane.activePane,
                panes: action.activePane.panes
            })

            return removeState
        default:
            return state
    }
}

export default combineReducers({ setPanes })

export const getPanes = (state) =>
    state.setPanes
