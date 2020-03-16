import React from "react";
import {PageTitle} from "../../../common/page-title/page-title";
import {Container} from "@material-ui/core"
import * as yup from "yup"
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import {KComponent} from "../../../common/k-component";
import {CommonInput} from "../../../common/common-input/common-input";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {customHistory} from "../../routes";
import {userApi} from "../../../../api/common/user-api";
import {userInfo} from "../../../../common/states/common";
import {authenCache} from "../../../../common/cache/authen-cache";
import {LoadingInline} from "../../../common/loading-inline/loading-inline";
import {appConfigCache, specialitiesCache} from "../../../../common/cache/api-cache/common-cache";
import {GetLocation} from "../../../common/location-tracker";
import {mapRoleToDefaultPath} from "../../route-types/role-filter-route";


class LoginForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null
        };
        const loginSchema = yup.object().shape({
            username: yup.string().required("Tên đăng nhập không được để trống"),
            password: yup.string().min(4, "Mật khẩu phải nhiều hơn 3 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt")
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                username: "",
                password: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => {
            if(this.form.isValid())
                this.handleLogin()
        }));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    handleLogin = () => {
        let {username, password} = this.form.getData();
        this.setState({loading: true});
        let prevLocation = GetLocation();
        userApi.login({username, password}).then(data => {
            let {user, token} = data;
            authenCache.setAuthen(token, {expires: 1});
            return Promise.all([
                specialitiesCache.get(),
                userInfo.setState({...user}),
                appConfigCache.get()
            ]).then(() => customHistory.push(prevLocation ? prevLocation : mapRoleToDefaultPath[userInfo.getState().role]));
        }).catch(err => this.setState({loading: false, error: err.message}));
    };

    renderServerError = () => {
        let {error} = this.state;
        let {username} = this.form.getData();
        let errMatcher = {
            "not_existed": `Tài khoản ${username} không tồn tại`,
            "password_wrong": `Sai mật khẩu`,
        };
        return errMatcher.hasOwnProperty(error) ? errMatcher[error] : "Đã có lỗi xảy ra"
    };

    render() {
        const canLogin = !this.form.getInvalidPaths().length && !this.state.error && !this.state.loading;
        return (
            <div className="login-form">
                {this.state.error && (
                    <div className="server-error">
                        {this.renderServerError()}
                    </div>
                )}
                {this.form.enhanceComponent("username", ({error, onChange, onEnter, ...others}) => (
                    <CommonInput
                        className="pt-0"
                        error={error}
                        id={"username"}
                        onKeyDown={onEnter}
                        type={"text"}
                        label={"Tên đăng nhập"}
                        placeholder={"Nhập tên đăng nhập"}
                        onChange={e => {

                            this.setState({error: ""});
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                    <CommonInput
                        className="pt-0"
                        error={error}
                        id={"password"}
                        onKeyDown={onEnter}
                        type={"password"}
                        label={"Mật khẩu"}
                        placeholder={"Nhập mật khẩu"}
                        onChange={e => {

                            this.setState({error: ""});
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                <div className="navigate-btn">
                    {this.props.renderNavigate()}
                </div>
                <div className="form-actions">
                    <button className="btn btn-block btn-info"
                            disabled={!canLogin}
                            onClick={this.handleLogin}
                    >
                        Đăng nhập
                        {this.state.loading && (
                            <LoadingInline
                                className={"login-loading"}
                            />
                        )}
                    </button>

                </div>
            </div>
        )
    }
}

class ForgotPasswordForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: null,
            success: false
        };
        const loginSchema = yup.object().shape({
            recover: yup.string().required("Trường không được để trống"),
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                recover: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => this.sendConfirmationEmail()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
            this.state.error && this.setState({error: ""});
        }));
        this.form.validateData();
    };

    sendConfirmationEmail = () => {
        let {recover} = this.form.getData();
        userApi.sendForgotPasswordEmail({recoveryID: recover}).then(() => {

        })
    };

    render() {
        const canChange = !this.form.getInvalidPaths().length && !this.state.error && !this.state.loading;
        return (
            <div className="login-form">
                {this.state.error && (
                    <div className="server-error">
                        error
                    </div>
                )}
                {this.form.enhanceComponent("recover", ({error, onChange, onEnter, ...others}) => (
                    <CommonInput
                        className="pt-0 login-input"
                        error={error}
                        id={"recover"}
                        onKeyDown={onEnter}
                        type={"text"}
                        label={"Email, SĐT hoặc Mã định danh"}
                        placeholder={"Nhập thông tin"}
                        onChange={e => {

                            this.setState({error: ""});
                            onChange(e);
                        }}
                        {...others}
                    />
                ), true)}
                <div className="navigate-btn">
                    {this.props.renderNavigate()}
                </div>
                <div className="form-actions">
                    <button className="btn btn-block btn-info"
                            disabled={!canChange}
                    >
                        Xác thực
                    </button>
                </div>
            </div>
        )
    }
}


export default class LoginRoute extends React.Component {
    constructor(props) {
        super(props);


    };


    forms = {
        "login": {
            title: "Đăng nhập",
            form: () => {
                return (
                    <LoginForm
                        renderNavigate={() => (
                            <span onClick={() => customHistory.push("/login#forgot-password")}>
                    Quên mật khẩu?
                </span>
                        )}
                    />
                )
            },


        },
        "forgotPassword": {
            title: "Quên mật khẩu",
            form: () => {
                return (
                    <ForgotPasswordForm
                        renderNavigate={() => (
                            <span onClick={() => customHistory.push("/login")}>
                    <KeyboardBackspaceIcon

                    />
                    <span style={{marginLeft: "3px"}}>Quay về đăng nhập</span>

                </span>
                        )}
                    />
                )
            },

        }
    };


    render() {

        let form = this.props.location.hash !== "#forgot-password" ? this.forms["login"] : this.forms["forgotPassword"];

        return (
            <PageTitle
                title={"Đăng nhập"}
            >
                <div className="login-route">
                    <Container maxWidth="lg">
                        <div className="login-form-wrapper">
                            <div className="login-form-inner">
                                <div className="login-form__header">
                                    <div className="wrapper">
                                        <div className="header-logo">
                                            <div className="header-logo__image">
                                                <img src={"/assets/images/logotlu.jpg"}/>
                                            </div>
                                            <div className="header-logo__title">
                                                <p>Hệ thống đăng ký học</p>
                                                <p>Trường Đại học Thăng Long</p>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                                <div className="login-form__body">
                                    <div className="main-title">
                                        {form.title}
                                    </div>
                                    <div className="form-wrapper">
                                        {form.form()}
                                    </div>

                                </div>
                            </div>
                        </div>

                    </Container>
                </div>
            </PageTitle>
        );
    }
}