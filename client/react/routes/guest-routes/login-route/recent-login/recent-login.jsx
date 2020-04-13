import React, {Component} from 'react';

export class RecentLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let recentLoginSessions = localStorage.getItem("recent-login-sessions");
        return (
            <div className="recent-login">
                {(recentLoginSessions && JSON.parse(recentLoginSessions).length) ? (
                    <div className="sessions">

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
