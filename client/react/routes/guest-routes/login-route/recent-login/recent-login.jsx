import React, {Component} from 'react';
import {loginSessionCache} from "../../../../../common/cache/login-session-cache";
import {getNamePrefix} from "../../../../../common/utils/common";
import {utilityApi} from "../../../../../api/common/utilities-api";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {shortLoginModal} from "../../../../common/modal/short-login-modal/short-login-modal";

export class RecentLogin extends Component {
    constructor(props) {
        super(props);
        let sessionsCached = loginSessionCache.getAllSessions();
        this.state = {
            sessions: [],
            loading: sessionsCached && sessionsCached.length
        };

        if(sessionsCached && sessionsCached.length){

            utilityApi.getLoginSessionBrief(sessionsCached)
                .then(sessions => this.setState({sessions: sessionsCached.sort((a,b) => b.login_at - a.login_at).map(each => sessions.find(s => s._id === each._id)), loading: false}))
                .catch(err => {
                    readAllData("login-sessions").then(sessions => this.setState({loading: false, sessions: sessionsCached.sort((a,b) => b.login_at - a.login_at).map(each => sessions.find(s => s._id === each._id))}));
                })
        }

    }

    deleteSession = userID => {
        loginSessionCache.removeSession(userID);
        this.setState({sessions: this.state.sessions.filter(each => each._id !== userID)});
    };

    render() {

        return (
            <div className="recent-login">
                {this.state.loading ? <LoadingInline className="recent-login-loading"/> :(this.state.sessions.length) ? (
                    <div className="sessions">
                        {this.state.sessions.map(each => {
                            return (
                                <div className="session" key={each._id} onClick={() => shortLoginModal.open({
                                    user: each
                                })}>
                                    <div className="avatar-wrapper">
                                        <i className="fas fa-times-circle" onClick={(e) => {
                                            e.stopPropagation();
                                            this.deleteSession(each._id);
                                        }}></i>
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
