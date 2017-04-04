import React, { PropTypes, Component } from 'react'

import {getFBFunctions} from "./fbfunctions"

const TARGET_DB  = 0
const TARGET_AUTH     = 1

export default WrappedComponent => {
    class Connect extends Component {

        constructor(props, context){
            super(props, context)
            this.firebase = getFBFunctions(this)
        }

        componentWillMount(){
            this.firebase = getFBFunctions(this)
        }

        componentWillUnmount(){
            this.firebase.ReleaseAll()
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    fb={this.firebase}
                    />
            )
        }

    }
    return Connect
}