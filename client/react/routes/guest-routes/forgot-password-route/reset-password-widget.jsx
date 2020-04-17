import React, {Component} from 'react';
import {KComponent} from "../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../common/form-validator/form-validator";
import debounce from "lodash/debounce";
import {CenterInput} from "../../../common/center-input/center-input";
import {Button} from "../../../common/button/button";

export class ResetPasswordWidget extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        const tokenSchema = yup.object().shape({
            token: yup.string().noSpecialChar("Không được chứa kí tự đặc biệt").min(6, "").required("Không được để trống"),
        });


        this.form = createSimpleForm(tokenSchema, {
            initData: {
                token: ""
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }
    onConfirm = debounce(() => {
        let token = this.form.getData().token;
        if (token.length < 6) {
            return;
        }
        if (!this.state.loading) {
            this.setState({loading: true});
            this.props.onConfirm(token)
                .catch(() => {
                    this.form.resetData()
                        .then(() => this.setState({loading: false}));

                });
        }

    }, 700);

    render() {
        // userBrief.contact.login_username.phone
        // userBrief.contact.login_username.email
        let {session} = this.props;
        return (
            <div className="confirm-account-widget">
                <div className="confirm-account-widget-title">
                    Hay điền mã xác thực đổi mật khẩu(gồm 6 kí tự) được gửi qua {session.register_type === "PHONE" ? (
                    <>số điện thoại<span className="high-light"> {session.user.contact.login_username.phone}</span></>
                ) : (
                    <>địa chỉ email<span className="high-light"> {session.user.contact.login_username.email}</span></>
                )} vào ô dưới đây:
                </div>
                {this.form.enhanceComponent("token", ({error, onChange, onEnter, ...others}) => (
                    <CenterInput
                        className="pt-0"
                        error={error}
                        type={"text"}
                        placeholder={"Nhập Mã xác thực"}
                        onChange={e => {
                            let value = e.target.value.trim();
                            if (value.length <= 6) {
                                onChange(e.target.value.toUpperCase());
                            }
                            this.onConfirm();

                        }}
                        {...others}
                    />
                ), true)}
                <Button className="btn-common-primary next-btn btn-block" loading={this.state.loading}
                        disabled={this.state.loading || this.form.getInvalidPaths().length}>Xác thực</Button>
            </div>
        );
    }
}
