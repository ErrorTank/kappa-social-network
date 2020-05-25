import React, {Component} from 'react';
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";
import {formatMomentTimeRange} from "../../../../../../common/utils/common";
import moment from "moment";
import {messengerIO} from "../../../../../../socket/sockets";

export class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.user.active,
            last_active_at: props.user.last_active_at,
        };
        this.io = messengerIO.getIOInstance();
        this.io.on("change-contact-status", ({active, userID, last_active_at}) => {
            if(userID === props.user._id){
                this.setState({last_active_at, active});
            }
        });

    }

    componentWillUnmount() {
        this.io.off("change-contact-status");
    }

    render() {
        let {user} = this.props;
        return (
            <div className="contact">
                <div className="user-avatar">
                    <StatusAvatar
                        active={this.state.active}
                        user={user}
                    />
                </div>
                <p className="username">{user.basic_info.username}</p>
                {!this.state.active &&
                <span className="last-active">{formatMomentTimeRange(moment(this.state.last_active_at).fromNow())}</span>}

            </div>
        );
    }
}
