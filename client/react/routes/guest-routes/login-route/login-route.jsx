import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {RecentLogin} from "./recent-login/recent-login";
import {SignUpForm} from "./signup-form/signup-form";

class LoginRoute extends Component {
    render() {
        return (
            <PageTitle
                title={"Đăng nhập"}
            >
                <div className="login-route">
                    <div className="container">
                        <div className="panels">
                            <div className="panel">
                                <h1 className="panel-title">Phiên đăng nhập gần đây</h1>
                                <p className="panel-sub-title">Bấm vào avatar để đăng nhập</p>
                                <RecentLogin/>
                            </div>
                            <div className="panel">
                                <h1 className="panel-title">Tạo tài khoản mới</h1>
                                <p className="panel-sub-title">Rất nhanh và đơn giản</p>
                                <SignUpForm/>
                            </div>
                        </div>

                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default LoginRoute;