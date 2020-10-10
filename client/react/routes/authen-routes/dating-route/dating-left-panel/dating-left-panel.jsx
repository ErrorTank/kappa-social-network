import React, { Component } from 'react'
import { DatingTabPanel } from '../dating-tab-panel'
import { DatingMessage } from './dating-message/dating-message'

export  class DatingLeftPanel extends Component {
    constructor(props){
        super(props)
        this.state = {
            mode : "TABS",
            defaultTab: null
        }
    }
    onSwitch= (mode, defaultTab = null)=>{
        this.setState({
            mode,
            defaultTab
        })
    }
    
    render() {
        
        return this.state.mode === 'TABS' ? 
        <DatingTabPanel 
            defaultTab={this.state.defaultTab} 
            onSwitch={() => this.onSwitch("MESSAGE")}
        /> : 
        <DatingMessage 
            onSwitch={(defaultTab) => this.onSwitch("TABS", defaultTab)}
        />
    }
}
