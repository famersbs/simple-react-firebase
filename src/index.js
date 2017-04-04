import firebase from "firebase"

import WrappedComponent from "./connect"

export function init(config){
    firebase.initializeApp(config)
}

export const connect = WrappedComponent