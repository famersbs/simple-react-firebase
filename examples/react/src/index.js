import React from 'react'
import { render } from 'react-dom'

import {init as FirebaseInit} from "simple-react-firebase"

FirebaseInit({
    apiKey: "AIzaSyCLmOtsuv2cblXyldFnH2mfOhVF0j_DiNY",
    authDomain: "rsemanager-a7b12.firebaseapp.com",
    databaseURL: "https://rsemanager-a7b12.firebaseio.com",
    projectId: "rsemanager-a7b12",
    storageBucket: "rsemanager-a7b12.appspot.com",
    messagingSenderId: "529212468052"
})

import App from './app'

// Render
render(
  <App/>,
  document.getElementById('app')
)
