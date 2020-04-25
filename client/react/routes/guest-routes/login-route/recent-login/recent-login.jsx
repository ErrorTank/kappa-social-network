import React, {Component} from 'react';
import {loginSessionCache} from "../../../../../common/cache/login-session-cache";
import {getNamePrefix} from "../../../../../common/utils/common";
import {utilityApi} from "../../../../../api/common/utilities-api";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";

export class RecentLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessions: [],
            loading: true
        };
        let sessions = loginSessionCache.getAllSessions();
        if(sessions && sessions.length){
            this.setState({loading: true});
            utilityApi.getLoginSessionBrief(sessions).then(sessions => this.setState({sessions, loading: false}))
        }

    }
    render() {

        return (
            <div className="recent-login">
                {this.state.loading ? <LoadingInline className="recent-login-loading"/> :(this.state.sessions.length) ? (
                    <div className="sessions">
                        {this.state.sessions.map(each => {
                            return (
                                <div className="session" key={each._id}>
                                    <div className="avatar-wrapper">
                                        <i className="fas fa-times-circle"></i>
                                        {each.avatar ? (
                                            <img src={each.avatar}/>
                                        ) : (
                                            <div className="avatar-holder">
                                                <span>{getNamePrefix(each.basic_info.username)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="username">
                                        {each.basic_info.username}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="empty-sessions-notify">
                        <i className="far fa-user-alt-slash"></i>
                        <p>Không có phiên đăng nhập nào!</p>
                    </div>
                )}
            </div>
        );
    }
}
