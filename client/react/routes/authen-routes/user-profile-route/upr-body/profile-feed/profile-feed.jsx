import React, {Component} from 'react';
import {ProfileFeedWidget} from "./profile-feed-widget/profile-feed-widget";
import {ProfileAboutWidget} from "./profile-about-widget/profile-about-widget";


export default class ProfileFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {
        let {user, friendStatus} = this.props;
        return (
            <div className="profile-feed-route">
                <div className="pfr-left-panel">
                    <ProfileAboutWidget
                        user={user}
                        friendStatus={friendStatus}
                    />
                </div>
                <div className='pfr-right-panel'>
                    <ProfileFeedWidget
                        user={user}

                    />
                </div>
            </div>
        );
    }
}

