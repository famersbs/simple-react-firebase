import firebase from "firebase"

import WrappedComponent from "./connect"
import Aggregater from "./aggregater"
import {defaultFBObject} from "./fbfunctions"

export function init(config){
    firebase.initializeApp(config)
}

export const connect = WrappedComponent
export const aggregater = Aggregater
export const fbObject = defaultFBObject