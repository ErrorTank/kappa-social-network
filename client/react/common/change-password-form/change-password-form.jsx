import React, {Component} from 'react';
import {CommonInput} from "../common-input/common-input";

export class ChangePasswordForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let {form} = this.props;
        return (
            <div className="change-password-form common-form">
                <div className="common-form-row">
                    {form.enhanceComponent("currentPassword", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 cpw-input"
                            error={error}
                            id={"currentPassword"}
                            type={"password"}
                            label={"Mật khẩu hiện tại"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="common-form-row">
                    {form.enhanceComponent("newPassword", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 cpw-input"
                            error={error}
                            id={"newPassword"}
                            type={"password"}
                            label={"Mật khẩu mới"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="common-form-row">
                    {form.enhanceComponent("rePassword", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0 cpw-input"
                            error={error}
                            id={"rePassword"}
                            type={"password"}
                            label={"Nhập lại mật khẩu mới"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
            </div>
        );
    }
}
