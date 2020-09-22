import React, {Component} from 'react';
import {ProfileFeedWidget} from "./profile-feed-widget/profile-feed-widget";


export default class ProfileFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {
        let {user} = this.props;
        return (
            <div className="profile-feed-route">
                <div className="pfr-left-panel">

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

