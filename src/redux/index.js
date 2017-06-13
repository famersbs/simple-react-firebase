import firebase from "firebase"

import Aggregater from "../aggregater"

//var database = null

const FB_ACTION_DATABASE_UPDATED = "FB_ACTION_DATABASE_UPDATED"

export function fbRedux(database = null){

    // Set default databsae
    if(null == database){
        database = firebase.database()
    }

    var store = null
    var func = {}
    var dblisteners = {}

    func.watchFB = (path, query, attachedReducerName, modifyFunc = (v) => v) => {
        releaseDbListener(path)
        var req = Aggregater(path, query)

        req.setListener( val => {
            var snap = {}
            snap[attachedReducerName] = modifyFunc(val)
            store.dispatch({
                type: FB_ACTION_DATABASE_UPDATED,
                data :{...snap}
            })
        })

        dblisteners[path] = req

        return req.on()
    }
    func.unWatchFB = (path) => {
        return releaseDbListener(path)
    }

    const releaseDbListener = (path) => {
        if( null != dblisteners[path] ){
            dblisteners[path].off()
            dblisteners[path] = null
            delete dblisteners[path]
        }
    }

    return {
        setStore : _store => {
            store = _store
        },
        reducer : (state = { func }, action) => {
            switch(action.type){
                case FB_ACTION_DATABASE_UPDATED:
                    return {...state, ...action.data}
            }
            return state
        },
    }
    
}