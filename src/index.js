import firebase from "firebase"

import WrappedComponent from "./connect"
import Aggregater from "./aggregater"
import {defaultFBObject} from "./fbfunctions"
import {fbRedux as _fbRedux} from './redux'

export function init(config){
    firebase.initializeApp(config)
}

export const connect = WrappedComponent
export const aggregater = Aggregater
export const fbObject = defaultFBObject
export const fbRedux = _fbRedux