import React, {Component} from 'react';
import {AuthenNavbar} from "./authen-navbar/authen-navbar";
import {NotificationStateContext} from "../../routes/routes";
import classnames from "classnames"
import {CreateMessageWidget} from "./create-message-widget/create-message-widget";

export class AuthenLayout extends Component {
    render() {

        return (
            <NotificationStateContext.Consumer>
                {showNotificationPrompt => {
                    return (
                        <div className={classnames("authen-layout", {"stay-down": showNotificationPrompt, darkMode: this.props.darkMode})}>

                            <AuthenNavbar
                                {...this.props}
                                showNotificationPrompt={showNotificationPrompt}
                            />
                            <div className="children-wrapper">
                                {this.props.children(this.props)}
                            </div>
                            <CreateMessageWidget
                                {...this.props}
                            />
                        </div>
                    )
                }}

            </NotificationStateContext.Consumer>

        );
    }
}
