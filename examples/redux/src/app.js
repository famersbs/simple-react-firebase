import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect, Provider } from 'react-redux'

@connect(
    (state)=>({
        watchFB: state.fb.func.watchFB,
        unWatchFB: state.fb.func.unWatchFB,
        msg: state.normal.msg,
        val: state.fb.val,
    })
)
export default class App extends React.Component {
  constructor(props){
      super(props)

      this.state = {
          val : {}
      }
  }
  componentWillMount(){
    this.props.watchFB("/test/users", {
           "$lookup" : {
                localField: json => Object.keys(json),
                targetUrl : key => `/test/details/${key}`,
                attachTo : (json, key, value) => json[key] = value
            }
    }, "val")
  }
  componentWillUnMount(){
      this.props.unWatchFB("/test/users")
  }

  render() {
    var {val} = this.props
    if(val == null) val = []
    return (
        <div>
            App test
            <br/>
            {this.props.msg}`
            <ul>
                {Object.keys(val).map(k => {
                    const v = val[k]
                    try{
                        return <li>{`${v.company} : ${v.name}`}</li>
                    }catch(ex){
                        return null
                    }
                })}
            </ul>
        </div>
    );
  }
}
