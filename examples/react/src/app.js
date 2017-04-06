import React, { PropTypes } from 'react'
import { connect as FirebaseConnect } from 'simple-react-firebase'

import {aggregater} from 'simple-react-firebase'

@FirebaseConnect
export default class App extends React.Component {
  constructor(props){
      super(props)

      this.state = {
          val : {}
      }
  }
  componentWillMount(){
    this.props.fb.DatabaseOn("/test/users", {
           "$lookup" : {
                localField: json => Object.keys(json),
                targetUrl : key => `/test/details/${key}`,
                attachTo : (json, key, value) => json[key] = value
            }
      }, "val")


      this.props.fb.DatabaseOn("/test/details", {}, "val2")
  }

  render() {

    const val = (this.props.val ? this.props.val : {})
    const val2 = (this.props.val2 ? this.props.val2 : {})

    console.log("val2 :", val2)
    return (
        <div>
            App test
            <br/>
            <a onClick={ () => this.req.off()} > off </a>
            <br/>
            <a onClick={ () => this.req.on()} > on </a>
            <ul>
                {Object.keys(val).map( k => {
                    return (<li>{`${val[k].company} - ${val[k].name}`}</li>)
                })}
            </ul>

            <ul>
                {Object.keys(val).map( k => {
                    return (<li>{`${val[k].company} - ${val[k].name}`}</li>)
                })}
            </ul>
        </div>
    );
  }
}
