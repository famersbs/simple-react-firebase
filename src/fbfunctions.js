import firebase from "firebase"

import Aggregater from "./aggregater"

/*
 *  It generate a group of the functions for using firebase
 */
export function getFBFunctions(component){

    var fb = {
        firebase: firebase
    }
    var authUnsubscribe = null
    var dblisteners = {}
    var database = firebase.database();

    const releaseAuthListener = () =>{
        if( null != authUnsubscribe ){
            authUnsubscribe()
            authUnsubscribe = null
        }
    }

    const releaseDbListener = (path) => {
        if( null != dblisteners[path] ){
            //database.ref(path).off(dblisteners[path].type, dblisteners[path].cb)
            dblisteners[path].off()
            dblisteners[path] = null
            delete dblisteners[path]
        }
    }

    // releaseAll
    fb.ReleaseAll = () => {
        releaseAuthListener()
        Object.keys(dblisteners).forEach(e => {
            releaseDbListener(e)
        })
    }


    // Auth on
    fb.AuthOn = ( attachedStateName, modifyFunc = (v) => v  ) => {
        releaseAuthListener()
        authUnsubscribe = firebase.auth().onAuthStateChanged( (user) => {
            let value = {}
            value[attachedStateName] = modifyFunc(user)
            component.setState(value)
        })
    }

    // Sign In
    // @return promise
    fb.SignInWithEmailAndPassword = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    // Sign Out
    // @return promise
    fb.SignOut = () => {
        return firebase.auth().signOut()
    }

    // Auth off
    // @return promise
    fb.AuthOff = () => {
        return releaseAuthListener()
    }

    // DatabaseOnce
    fb.DatabaseOnce = (path, attachedStateName = null, modifyFunc = (v) => v ) => {
        return database.ref(path).once("value")
        .then( (snapshot) => {
          if(null != attachedStateName){
            var snap = {}
            snap[attachedStateName] = modifyFunc(snapshot.val())
            component.setState(snap)
          }
          return snapshot
        })
    }

    // Database on
    // @return promise
    fb.DatabaseOn = ( path, query, attachedStateName, modifyFunc = (v) => v ) => {
        releaseDbListener(path)
        var req = Aggregater(path, query)

        req.setListener( val => {
            var snap = {}
            snap[attachedStateName] = modifyFunc(val)
            component.setState(snap)
        })

        dblisteners[path] = req

        return req.on()

        /* 
        dblisteners[path] = {
            type: "value",
            cb : (snapshot) => {
                    var snap = {}
                    snap[attachedStateName] = modifyFunc(snapshot.val())
                    component.setState(snap)
                }
        }

        return database.ref(path).on(dblisteners[path].type, dblisteners[path].cb)
        */
    }

    // Database off
    // @return promise
    fb.DatabaseOff = ( path ) => {
        return releaseDbListener(path)
    }

    // Database Push
    // @return promise
    fb.DatabasePush = (path, value) => {
        return database.ref(path).push(value)
    }
    // Database Set
    // @return promise
    fb.DatabaseSet = (path, value) => {
        return database.ref(path).set(value)
    }
    // Database Remove
    // @return promise
    fb.DatabaseRemove = (path) => {
        return database.ref(path).remove()
    }

    return fb

}
