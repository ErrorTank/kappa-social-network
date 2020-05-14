import React, {Component} from 'react';
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";
import {formatMomentTimeRange} from "../../../../../../common/utils/common";
import moment from "moment";

export class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let {user} = this.props;
        return (
            <div className="contact" >
                <div className="user-avatar">
                    <StatusAvatar
                        active={user.active}
                        user={user}
                    />
                </div>
                <p className="username">{user.basic_info.username}</p>
                <span className="last-active">{formatMomentTimeRange(moment(user.last_active_at).fromNow())}</span>
            </div>
        );
    }
}
