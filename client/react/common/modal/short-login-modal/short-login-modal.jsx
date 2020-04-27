import React, {Component} from "react";
import {LoadingInline} from "../../loading-inline/loading-inline";
import {modals} from "../modals";

import {CommonModalLayout} from "../common-modal-layout";
import {guestApi} from "../../../../api/common/guest-api";
import {KComponent} from "../../k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../form-validator/form-validator";
import {getNamePrefix} from "../../../../common/utils/common";
import {CommonInput} from "../../common-input/common-input";
import {Button} from "../../button/button";
import {Link} from "react-router-dom";
import {userApi} from "../../../../api/common/user-api";
import {loginSessionCache} from "../../../../common/cache/login-session-cache";
import {initializeAuthenticateUser} from "../../../../common/app-services";
import omit from "lodash/omit";
import {customHistory} from "../../../routes/routes";


export const shortLoginModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <ShortLoginModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
};

class ShortLoginModal extends KComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: {
                message: "wrong_password"
            }
        };
        const loginSchema = yup.object().shape({
            password: yup.string().min(4, "Mật khẩu phải nhiều hơn 4 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt")
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                password: ""
            }
        });
        this.onUnmount(this.form.on("enter", () => {
            if (this.form.isValid())
                this.login();
        }));
        this.onUnmount(this.form.on("change", () => {
            if(this.state.error){
                this.setState({error: null})
            }else{
                this.forceUpdate();
            }

        }));
        this.form.validateData();

    };

    login = () => {
        let {user, onClose} = this.props;
        this.setState({loading: true});
        userApi.shortLogin({_id: user._id, password: this.form.getPathData("password")})
            .then(({token, user}) => {
                loginSessionCache.removeSession(user._id);
                loginSessionCache.addNewSession({
                    _id: user._id,
                    login_at: new Date().getTime()
                });
                initializeAuthenticateUser({
                    userInfo:user,
                    authToken: token
                }).then(() => {
                    onClose();
                    customHistory.push("/")
                });
            })
            .catch((err) => {
                this.setState({loading: false, error: err});
            })
    };

    render() {
        let {loading, error} = this.state;
        let {user, onClose} = this.props;
        const getErrorMessage = {
            "wrong_password": "Sai mật khẩu",
            "account_not_verified": "Tài khoản chưa được xác thực"
        };
        return (
            <div className="short-login-modal">
                <i className="fas fa-times-circle modal-close" onClick={() => onClose()}></i>
                <p className='modal-title'>Đăng nhập nhanh</p>
                <div className="login-form">
                    <div className="avatar-wrapper">
                        {user.avatar ? (
                            <img src={user.avatar}/>

                        ) : (
                            <div className="avatar-holder">
                                <span>{getNamePrefix(user.basic_info.username)}</span>
                            </div>
                        )}
                    </div>
                    <p className="username">{user.basic_info.username}</p>
                    {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"password"}
                            onKeyDown={onEnter}
                            type={"password"}
                            placeholder={"Nhập mật khẩu"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                    {error && (
                        <div className="invalid-feedback">{getErrorMessage[error.message]}</div>
                    )}
                </div>

                <Button className="btn-common-primary next-btn btn-block" loading={this.state.loading}
                        disabled={this.state.loading || this.form.getInvalidPaths().length} onClick={this.login}>Đăng nhập</Button>
                <div className="forgot-password">
                    <Link to="/quen-mat-khau"  title={"Đổi lại mật khẩu"} onClick={onClose}>
                        Quên mật khẩu
                    </Link>
                </div>
            </div>

        );
    }
}