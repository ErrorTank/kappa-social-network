import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";

class LoginRoute extends Component {
    render() {
        return (
            <PageTitle
                title={"Đăng nhập"}
            >
                <div className="login-route">
                    Login Route
                </div>
            </PageTitle>
        );
    }
}

export default LoginRoute;