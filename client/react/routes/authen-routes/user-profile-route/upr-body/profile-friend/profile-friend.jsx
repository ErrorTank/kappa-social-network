import React, {Component} from 'react';
import {Friends} from "./friends";
import {FriendInvitations} from "./friend-invitations";
import {userInfo} from "../../../../../../common/states/common";


export default class ProfileFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "FRIENDS"
        }
    }

    tabs = [
        {
            key: "FRIENDS",
            component: Friends
        }, {
            key: "INVITATIONS",
            component: FriendInvitations
        }
    ]

    render() {
        let {user} = this.props;
        let {mode} = this.state;
        let {component: Comp} = this.tabs.find(each => each.key === mode);
        let isOwner = user._id === userInfo.getState()._id;
        return (
            <div className="profile-friends-route">
               <div className="white-box">
                    <Comp
                        isOwner={isOwner}
                        user={user}
                        onToggleMode={() => this.setState({mode: mode === "FRIENDS" ? "INVITATIONS" : "FRIENDS"})}
                    />
               </div>
            </div>
        );
    }
}

