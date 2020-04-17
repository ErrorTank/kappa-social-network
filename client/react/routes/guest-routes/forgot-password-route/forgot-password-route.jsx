import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {PageTitle} from "../../../common/page-title/page-title";
import {KComponent} from "../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {CenterInput} from "../../../common/center-input/center-input";
import classnames from "classnames"
import {userApi} from "../../../../api/common/user-api";
import {customHistory} from "../../routes";
import {openConnectionModal} from "../../../common/connection-modal/connection-modal";
import {ResetPasswordWidget} from "./reset-password-widget";
import {appModal} from "../../../common/modal/modals";
import {Button} from "../../../common/button/button";
import {parseQueryString} from "../../../../common/utils/string-utils";
import {guestApi} from "../../../../api/common/guest-api";
import {initializeAuthenticateUser} from "../../../../common/app-services";
import {resendConfirmTokenModal} from "../../../common/modal/resend-confirm-token/resend-confirm-token";

class ChangePasswordByEmail extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        const emailSchema = yup.object().shape({
            email: yup.string().email("Email không hợp lệ").required("Email không được để trống")
        });

        this.form = createSimpleForm(emailSchema, {
            initData: {
                email: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => {
            if (this.form.isValid() && !this.state.loading)
                this.handleClickNext();

        }));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();


    }

    handleClickNext = () => {
        this.setState({loading: true});
        this.props.onNext(this.form.getData())
            .catch(err => {
                console.log(err);
                if(err.message === "account_not_existed"){
                    appModal.alert({
                        title: "Thông báo",
                        text: (
                            <>
                                Tài khoản với địa chỉ email <span className="high-light">{this.form.getData().email}</span> không tồn tại
                            </>
                        ),
                        btnText: "Đóng",
                    });
                }else{
                    appModal.alert({
                        title: "Thông báo",
                        text: (
                            <>
                                Không thể gửi mã xác thực đến địa chỉ emai <span className="high-light">{this.form.getData().email}</span>
                            </>
                        ),
                        btnText: "Đóng",
                    });
                }

                this.setState({
                    loading: false
                });
            })
        ;
    };

    render() {
        let {loading} = this.state;
        return (
            <div className="change-password-by-email change-password-tab">
                <div className="change-password-tab-title">
                    Chúng tôi sẽ gửi cho bạn một mã xác thực qua địa chỉ Email bạn điền dưới đây.
                </div>
                {this.form.enhanceComponent("email", ({error, onChange, onEnter, ...others}) => (
                    <CenterInput
                        className="pt-0"
                        error={error}
                        onKeyDown={onEnter}
                        type={"text"}
                        placeholder={"Nhập Email"}
                        onChange={e => {
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                <Button className="btn-common-primary next-btn" loading={loading} disabled={loading || this.form.getInvalidPaths().length} onClick={this.handleClickNext}>Tiếp tục</Button>
            </div>
        );
    }
}

class ChangePasswordBySms extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        const phoneSchema = yup.object().shape({
            phone: yup.string().required("SĐT không được để trống").isPhone("SĐT không hợp lệ"),
        });


        this.form = createSimpleForm(phoneSchema, {
            initData: {
                phone: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => {
            if (this.form.isValid() && !this.state.loading)
                this.handleClickNext();
        }));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();


    }

    handleClickNext = () => {
        this.setState({loading: true});
        this.props.onNext(this.form.getData())
            .catch(err => {
                console.log(err);
                if(err.message === "account_not_existed"){
                    appModal.alert({
                        title: "Thông báo",
                        text: (
                            <>
                                Tài khoản với số điện thoại <span className="high-light">{this.form.getData().phone}</span> không tồn tại
                             </>
                        ),
                        btnText: "Đóng",
                    });
                }else{
                    appModal.alert({
                        title: "Thông báo",
                        text: (
                            <>
                                Không thể gửi mã xác thực đến số điện thoại <span className="high-light">{this.form.getData().phone}</span>
                            </>
                        ),
                        btnText: "Đóng",
                    });
                }

                this.setState({
                    loading: false
                });
            })
        ;
    };

    render() {
        let {loading} = this.state;
        return (
            <div className="change-password-by-sms change-password-tab">
                <div className="change-password-tab-title">
                    Chúng tôi sẽ gửi cho bạn một mã xác thực qua số điện thoại bạn điền dưới đây.
                </div>
                {this.form.enhanceComponent("phone", ({error, onChange, onEnter, ...others}) => (
                    <CenterInput
                        className="pt-0"
                        error={error}
                        onKeyDown={onEnter}
                        type={"text"}
                        placeholder={"Nhập Số điện thoại"}
                        onChange={e => {
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                <Button className="btn-common-primary next-btn" loading={loading} disabled={loading || this.form.getInvalidPaths().length} onClick={this.handleClickNext}>Tiếp tục</Button>
            </div>
        );
    }

}


class ForgotPasswordRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "EMAIL",
            step: 0,
            session: null
        };


    }

    handleResendConfirmToken = () => {
        resendConfirmTokenModal.open({
            onRequestEnd: (session) => {
                if(session){
                    this.setState({session});
                }
            },
            session: this.state.session,
            disabledClose: true
        })
    };

    next = (data) => {
        return userApi.sendChangePasswordToken(data)
            .then((session) => {

                this.setState({session, step: 1});
            })
            .catch(err => {
                if(err.message === "account_not_existed"){
                    return Promise.reject(err)
                }

                return openConnectionModal();
            })

    };

    handleConfirmToken = (token) => {
        let {session} = this.state;
        return userApi.verifyChangePasswordToken({token, sessionID: session.sessionID})
            .then(() => {
                customHistory.push("/")
            })
            .catch((err) => {
                if(err.message === "wrong_token"){
                    appModal.alert({
                        title: "Thông báo",
                        text: "Mã xác thực sai hoặc đã hết hạn.",
                        btnText: "Đóng",
                    });
                }else{
                    openConnectionModal();
                }
                return Promise.reject();
            })
    };

    render() {
        let {mode, step} = this.state;
        let Component = mode === "EMAIL" ? ChangePasswordByEmail : ChangePasswordBySms;
        return (
            <PageTitle
                title={"Quên mật khẩu"}
            >
                <div className="forgot-password-route">
                    <div className="forgot-password-widget">
                        <h1 className="forgot-password-title">Lấy lại mật khẩu bằng <span className={classnames({email: mode === "EMAIL", phone: mode === "PHONE"})}>{mode === "EMAIL" ? (
                            <>
                                <i className="fad fa-envelope-square"></i> Email
                            </>
                        ) : (
                            <>
                                <i className="fad fa-sms"></i> SMS
                            </>
                        )}</span></h1>
                        {step === 0 ? (
                            <div className="forgot-password-step-0">
                                <div className={classnames("toggle-mode", {email: mode === "PHONE", phone: mode === "EMAIL"})}
                                     onClick={() => this.setState({mode: mode === "EMAIL" ? "PHONE" : "EMAIL"})}
                                >
                                    Sử dụng {mode === 'EMAIL' ? "SMS" : "Email"} <i className="fas fa-repeat-alt"></i>
                                </div>
                                <Component
                                    onNext={this.next}
                                />
                                <div className="to-sign-up">
                                    Chưa có tài khoản?
                                    <Link className={"navigate"} to={"/"}>
                                        Đăng ký
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="forgot-password-step-1">
                                <ResetPasswordWidget
                                    session={this.state.session || {}}
                                    onConfirm={this.handleConfirmToken}
                                />
                                <div className="resend-token">Chưa nhận được mã? <span className="high-light" onClick={this.handleResendConfirmToken}>Gửi lại</span></div>
                            </div>
                        )}
                    </div>

                </div>
            </PageTitle>
        );
    }
}

export default ForgotPasswordRoute;
