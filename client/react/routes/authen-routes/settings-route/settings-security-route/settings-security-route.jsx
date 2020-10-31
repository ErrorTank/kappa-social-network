import React, {Component} from 'react';
import {PageTitle} from "../../../../common/page-title/page-title";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../../../common/common-input/common-input";
import {KComponent} from "../../../../common/k-component";
import {Button} from "../../../../common/button/button";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";
import {topFloatNotifications} from "../../../../common/float-top-notification/float-top-notification";

class SettingsSecurityRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            error: null
        }
        this.form = createSimpleForm(yup.object().shape({
            currentPassword: yup.string().min(6, "Mật khẩu bắt buộc từ 6 ký tự trở lên").noSpecialChar("Mật khẩu không được có kí tự đặc biệt"),
            newPassword: yup.string().min(6, "Mật khẩu bắt buộc từ 6 ký tự trở lên").noSpecialChar("Mật khẩu không được có kí tự đặc biệt"),
            rePassword: yup.string().equalTo(yup.ref("newPassword"), "Mật khẩu nhập lại không trùng với mật khẩu mới")
        }), {
            initData: {
                currentPassword: "",
                newPassword: "",
                rePassword: ""
            }
        });


        this.onUnmount(this.form.on("change", (state) => {
            if(state.error){
                this.setState({error: null});
            }
            this.forceUpdate();

        }));
        this.form.validateData();
    }

    submit = () => {
        this.setState({saving: true});
        let {newPassword, currentPassword} = this.form.getData();
        userApi.changeUserPassword(userInfo.getState()._id, {newPassword, currentPassword})
            .then(() => {
                topFloatNotifications.actions.push({
                    content: (
                        <p className="common-noti-layout success">
                            <i className="fal fa-check"></i>
                            <span>Đổi mật khẩu thành công</span>
                        </p>
                    )
                })
                this.setState({saving: false, error: null});
                this.form.resetData();

            })
            .catch((error) => this.setState({saving: false, error}))
    }

    render() {
        return (
            <PageTitle
                title={`Cài đặt bảo mật`}
            >
                <div className="settings-security-route settings-route white-box">
                    <div className="sr-title">
                        Đổi mật khẩu
                    </div>
                    <div className="ssr-sub">
                        Mật khẩu tối thiểu 8 ký tự, bao gồm cả chữ và số
                    </div>
                    <div className="sr-body">
                        {this.state.error && (
                            <div className="sr-form-row">
                                <div className="alert alert-danger">
                                    Mật khẩu hiện tại không đúng! Xin thử lại.
                                </div>
                            </div>
                        )}
                        <div className="sr-form-row">
                            {this.form.enhanceComponent("currentPassword", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    className="pt-0 cpw-input"
                                    error={error}
                                    id={"currentPassword"}
                                    onKeyDown={onEnter}
                                    type={"password"}
                                    label={"Mật khẩu hiện tại"}
                                    placeholder={"Nhập mật khẩu hiện tại"}
                                    onChange={e => {
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}
                        </div>
                        <div className="sr-form-row">
                            {this.form.enhanceComponent("newPassword", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    className="pt-0 cpw-input"
                                    error={error}
                                    id={"newPassword"}
                                    onKeyDown={onEnter}
                                    type={"password"}
                                    label={"Mật khẩu mới"}
                                    placeholder={"Nhập mật mới"}
                                    onChange={e => {
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}
                        </div>
                        <div className="sr-form-row">
                            {this.form.enhanceComponent("rePassword", ({error, onChange, onEnter, ...others}) => (
                                <CommonInput
                                    className="pt-0 cpw-input"
                                    error={error}
                                    id={"rePassword"}
                                    onKeyDown={onEnter}
                                    type={"password"}
                                    label={"Nhập lại mật khẩu mới"}
                                    placeholder={"Nhập lại mật khẩu mới"}
                                    onChange={e => {
                                        onChange(e);
                                    }}
                                    {...others}
                                />
                            ), true)}
                        </div>
                    </div>
                    <div className="ssr-actions">
                        <Button className="btn btn-common-primary btn-block" loading={this.state.saving}
                                disabled={!this.form.isValid()} onClick={this.submit}>
                            Lưu mật khẩu
                        </Button>
                    </div>
                </div>
            </PageTitle>
        );
    }
}

export default SettingsSecurityRoute;