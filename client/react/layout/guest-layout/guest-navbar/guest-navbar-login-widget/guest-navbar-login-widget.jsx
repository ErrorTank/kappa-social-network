import React from 'react';
import {Link} from "react-router-dom"
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup"
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {CommonInput} from "../../../../common/common-input/common-input";

export class GuestNavbarLoginWidget extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            logging: false
        };
        const loginSchema = yup.object().shape({
            username: yup.string().required("Tên đăng nhập không được để trống"),
            password: yup.string().min(4, "Mật khẩu phải nhiều hơn 4 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt")
        });
        this.form = createSimpleForm(loginSchema, {
            initData: {
                username: "",
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

    handleLogin = () => {

    };

    render() {
        let {logging} = this.state;
        let disabledBtn = logging || this.form.getInvalidPaths().length;
        return (
            <div className="guest-navbar-login-widget">
                <div className="gnlw-input-wrapper">
                    {this.form.enhanceComponent("username", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"username"}
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
                <button className="btn btn-common-primary login-btn" disabled={disabledBtn} onClick={this.handleLogin}>Đăng nhập</button>
            </div>
        );
    }
}
