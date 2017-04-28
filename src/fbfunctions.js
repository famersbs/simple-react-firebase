import firebase from "firebase"

import Aggregater from "./aggregater"

var database = null

export var defaultFBObject = {
    firebase: firebase,

    // Sign In
    // @return promise
    SignInWithEmailAndPassword: (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    // Sign In
    // @return promise
    SignInWithCustomToken: (token) => {
        return firebase.auth().signInWithCustomToken(token)
    },

    // Sign Out
    // @return promise
    SignOut: () => {
        return firebase.auth().signOut()
    },

    // Sign Up 
    // @return promise
    SignUp: (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
    },

    // Database Push
    // @return promise
    DatabasePush: (path, value) => {
        return database.ref(path).push(value)
    },

    // Database Set
    // @return promise
    DatabaseSet: (path, value) => {
        return database.ref(path).set(value)
    },

    // Database Remove
    // @return promise
    DatabaseRemove: (path) => {
        return database.ref(path).remove()
    },
}

/*
 *  It generate a group of the functions for using firebase
 */
export function getFBFunctions(component){
    
    if(null == database){
        database = firebase.database()
    }

    var fb = {...defaultFBObject}
    var authUnsubscribe = null
    var dblisteners = {}
    var isAuthChecked = false

    const releaseAuthListener = () =>{
        if( null != authUnsubscribe ){
            authUnsubscribe()
            authUnsubscribe = null
        }
    }

    const releaseDbListener = (path) => {
        if( null != dblisteners[path] ){
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

    // this Function return current Checked Auth or not
    fb.isAuthChecked = () => {
        return isAuthChecked
    }

    // Auth on
    fb.AuthOn = ( attachedStateName, modifyFunc = (v) => v ) => {
        releaseAuthListener()
        authUnsubscribe = firebase.auth().onAuthStateChanged( (user) => {
            let value = {}
            isAuthChecked = true
            value[attachedStateName] = modifyFunc(user)
            component.setState(value)
            
        })
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
    }

    // Database off
    // @return promise
    fb.DatabaseOff = ( path ) => {
        return releaseDbListener(path)
    }

    return fb

}
