import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {PageTitle} from "../../../common/page-title/page-title";
import {KComponent} from "../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {CenterInput} from "../../../common/center-input/center-input";
import classnames from "classnames"

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
            if (this.form.isValid())
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
                <button className="btn btn-common-primary next-btn" disabled={loading || this.form.getInvalidPaths().length} onClick={this.handleClickNext}>Tiếp tục</button>
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
            if (this.form.isValid())
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
                <button className="btn btn-common-primary next-btn" disabled={loading || this.form.getInvalidPaths().length} onClick={this.handleClickNext}>Tiếp tục</button>
            </div>
        );
    }

}


class ForgotPasswordRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "EMAIL",
            step: 0
        };


    }

    next = () => {

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

                            </div>
                        )}
                    </div>

                </div>
            </PageTitle>
        );
    }
}

export default ForgotPasswordRoute;
