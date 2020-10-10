import React, { Component } from 'react'
import { Avatar } from '../../../../../common/avatar/avatar'
import { TAB_PANEL_TABS } from '../../dating-tab-panel'

export class DatingMessage extends Component {
    constructor(props){
        super(props)
    }
    
    render() {
        const {onSwitch} = this.props
        return (
            <div className="dating-chat-box-container">
                <div className="dating-chat-header">
                    <i className="fal fa-long-arrow-left" onClick={() => onSwitch(TAB_PANEL_TABS.MESSAGE)}></i>
                    <Avatar className ="dating-chat-avatar" user = {{avatar :"https://localhost:2000/assets/images/MinhThu/minhthu1.jpg"}}/>
                    <p>Minh Thu</p>
                </div>
            </div>
        )
    }
}
