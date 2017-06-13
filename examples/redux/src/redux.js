import { createStore, applyMiddleware, compose, combineReducers } from 'redux'

import {fbRedux} from 'simple-react-firebase'

// Reducer
function normal(state={msg:"test"}, action){
    return state
}

const fb = fbRedux()

var store = createStore(
    combineReducers({
        normal,
        fb: fb.reducer
    }),
    {}
)

fb.setStore(store)

export default store