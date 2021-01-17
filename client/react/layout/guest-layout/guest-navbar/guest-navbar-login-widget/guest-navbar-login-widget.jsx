import React from 'react';
import {Link} from "react-router-dom"
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup"
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {CommonInput} from "../../../../common/common-input/common-input";
import {userApi} from "../../../../../api/common/user-api";
import {initializeAuthenticateUser} from "../../../../../common/app-services";
import {customHistory} from "../../../../routes/routes";
import {appModal} from "../../../../common/modal/modals";
import {isPhone} from "../../../../../common/validator";
import {openConnectionModal} from "../../../../common/connection-modal/connection-modal";
import {guestApi} from "../../../../../api/common/guest-api";
import {Button} from "../../../../common/button/button";
import omit from "lodash/omit"
import {loginSessionCache} from "../../../../../common/cache/login-session-cache";

export class GuestNavbarLoginWidget extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            logging: false
        };
        const loginSchema = yup.object().shape({
            login_username: yup.string().required("Tên đăng nhập không được để trống"),
            password: yup.string().min(4, "Mật khẩu phải nhiều hơn 4 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt")
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                login_username: "",
                password: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => {
            if(this.form.isValid())
                this.handleLogin();
        }));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    getRegisterAccountConfirmationCredentials = (data) => {
        this.setState({logging: true});
        guestApi.resendAccountConfirmationToken(data)
            .then((data) => {
                customHistory.push(`/xac-thuc-tai-khoan?sessionID=${data._id}`);
            })
            .catch(err => {
                openConnectionModal();
                this.setState({logging: false});
            })
    };

    handleLogin = () => {
        this.setState({logging: true});
        let data = this.form.getData();
        userApi.login(data)
            .then(({token, user}) => {
                loginSessionCache.addNewSession({
                    _id: user._id,
                    login_at: new Date().getTime()
                });
                initializeAuthenticateUser({
                    userInfo: user,
                    authToken: token
                }).then(() => customHistory.push("/"));
            })
            .catch(err => {
                this.setState({logging: false})
                let matcher = {
                    "account_not_existed": () => appModal.alert({
                        title: "Không thể đăng nhập",
                        text: (
                            <p>
                                Tài khoản hoặc mật khẩu chưa chính xác. Vui lòng kiểm tra lại
                            </p>
                        ),
                        btnText: "Đóng",
                        className: "create-account-result-modal"
                    }),
                    "account_not_verified": () => appModal.confirm({
                        title: "Không thể đăng nhập",
                        text:  (
                            <div>
                                Tài khoản với {isPhone(data.login_username) ? `số điện thoại` : `địa chỉ email`} <span className="high-light">{data.login_username}</span> chưa được xác thực.
                                <p className="question">Bạn có muốn xác thực ngay?</p>
                            </div>
                        ),
                        btnText: "Đồng ý",
                        cancelText: "Hủy bỏ",
                        className: "create-account-result-modal"
                    }).then(result => {
                        if(result){
                            this.getRegisterAccountConfirmationCredentials(err.extra)
                        }
                    })

                };
                let modalAction = matcher[err?.message] || openConnectionModal;
                modalAction();
            });
    };

    render() {
        let {logging} = this.state;
        let disabledBtn = logging || this.form.getInvalidPaths().length;
        return (
            <div className="guest-navbar-login-widget">
                <div className="gnlw-input-wrapper">
                    {this.form.enhanceComponent("login_username", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"login_username"}
                            onKeyDown={onEnter}
                            type={"text"}
                            label={"Email/Số điện thoại"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="gnlw-input-wrapper">
                    <Link to="/quen-mat-khau" className={"forgot-password"} title={"Đổi lại mật khẩu"}>
                        Quên mật khẩu
                    </Link>
                    {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"password"}
                            onKeyDown={onEnter}
                            type={"password"}
                            label={"Mật khẩu"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <Button className="btn-common-primary login-btn" disabled={disabledBtn} loading={logging} onClick={this.handleLogin}>Đăng nhập</Button>
            </div>
        );
    }
}
