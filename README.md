# Init firebase

```
import {init as FirebaseInit} from "simple-react-firebase"

var FireBase_config = {
    apiKey: "",
    authDomain: ".firebaseapp.com",
    databaseURL: "https://.firebaseio.com",
    projectId: "",
    storageBucket: ".appspot.com",
    messagingSenderId: ""
  }

FirebaseInit(FireBase_config)
```

# Adding to component

```
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { connect as FirebaseConnect } from 'simple-react-firebase'

import { Link } from 'react-router'


@FirebaseConnect
@connect(({}) => ({}))
export default class Login extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      password: ""
    }
  }
  __testPush(){
    this.props.fb.DatabasePush("/test",{ haha:1 })
    .then( ()=>{
      console.log("Complete")
    })
    .catch( e=> {
      console.log("Error ",e)
    })
  }
  __testSet(){
    this.props.fb.DatabaseSet("/test",{ haha:1 })
    .then( ()=>{
      console.log("Complete")
    })
    .catch( e=> {
      console.log("Error ",e)
    })
  }
  __testRemove(){
    this.props.fb.DatabaseRemove("/test")
    .then( ()=>{
      console.log("Complete")
    })
    .catch( e=> {
      console.log("Error ",e)
    })
  }
  componentWillMount(){
    this.props.fb.AuthOn("user", (v) => ({ ...v, modified_email: v.email }) )
    this.props.fb.DatabaseOn("/v2/privilege",{/*aggregate query*/}, "privilege", (v) => ( Object.keys(v).map( e => e ) ) )
    this.props.fb.DatabaseOn("/test",{/*aggregate query*/}, "test")
    this.props.fb.DatabaseOnce("/test","tt")
    .then(value => {
      console.log("Once ", value.val())
    }) 
  }

  render() {
    if( null != this.props.user ){
      console.log("loggined", this.props.user.modified_email)
    }
    if( null != this.props.test ){
      console.log("Test ", this.props.test)
    }

    if( null != this.props.privilege ){
      console.log("Modified Privilege ", this.props.privilege)
    }

    return (
      <section className="hero is-fullheight is-dark is-bold">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-vcentered">
              <div className="column is-4 is-offset-4">
                <h1 className="title">
                  <Link to="/">Snap Compliance</Link>
                </h1>
                <div className="box">
                  <label className="label">Email</label>
                  <p className="control">
                    <input onChange={ (e) => this.setState({"email": e.target.value})} value={this.state.email} className="input" type="text" placeholder="example@example.org" />
                  </p>
                  <label className="label">Password</label>
                  <p className="control">
                    <input onChange={ (e) => this.setState({"password": e.target.value})} value={this.state.password} className="input" type="password" placeholder="●●●●●●●" />
                  </p>
                  <hr />
                  <p className="control">
                    <button className="button is-primary" onClick={ () => this.props.fb.SignInWithEmailAndPassword(this.state.email, this.state.password) }>Login</button>
                    <button className="button is-default" onClick={ () => this.props.fb.SignOut() }>Cancel</button>
                  </p>
                </div>
                <p className="has-text-centered">
                  <a href="register.html">Register an Account</a>
                  | 
                  <a href="#">Forgot password</a>
                  | 
                  <a href="#">Need help?</a>

                  <button onClick={()=>this.__testPush()}>Push</button>
                  <button onClick={()=>this.__testSet()}>Set</button>
                  <button onClick={()=>this.__testRemove()}>Remove</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
```
