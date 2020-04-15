import React, {Component} from 'react';
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {CommonInput} from "../../../../common/common-input/common-input";
import {BirthdayPicker} from "../../../../common/birthday-picker/birthday-picker";
import {RadioGroup} from "../../../../common/radio-group/radio-group";
import {genders} from "../../../../../const/genders";
import {isEmail, isPhone} from "../../../../../common/validator";
import {guestApi} from "../../../../../api/common/guest-api";
import {customHistory} from "../../../routes";
import {appModal} from "../../../../common/modal/modals";
import {openConnectionModal} from "../../../../common/connection-modal/connection-modal";
import {Button} from "../../../../common/button/button";

export class SignUpForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            creating: false
        };

        const signUpSchema = yup.object().shape({
            username: yup.string().min(6, "Tên người dùng phải lớn hơn 4 kí tự").max(50, "Tên người dùng phải nhỏ hơn 50 kí tự").required("Tên người dùng không được để trống"),
            login_username: yup.string().isPhoneOrEmail("Số điện thoại hoặc email không hợp lệ").required("Email hoặc số điện thoại không được để trống"),
            password: yup.string().min(6, "Mật khẩu bắt buộc từ 4 ký tự trở lên").noSpecialChar("Mật khẩu không được có kí tự đặc biệt").required("Mật khẩu không được để trống"),
            gender: yup.string().oneOf(["MALE", "FEMALE", "OTHERS"]),
            dob: yup.object().shape({
                day: yup.number().moreThan(0,"Ngày không được để trống"),
                month: yup.number().moreThan(0,"Tháng không được để trống"),
                year: yup.number().moreThan(0, "Năm không được để trống")
            })
        });
        this.form = createSimpleForm(signUpSchema, {
            initData: {
                username: "",
                login_username: "",
                password: "",
                gender: "MALE",
                dob: {
                    day: 12,
                    month: 1,
                    year: 1998
                }
            }
        });
        this.onUnmount(this.form.on("enter", () => this.handleSignUp()));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate()
        }));
        this.form.validateData();
    }

    getRegisterAccountConfirmationCredentials = (data) => {
        guestApi.resendAccountConfirmationToken(data)
            .then(({registerType, sessionID}) => {
                customHistory.push(`/xac-thuc-tai-khoan?sessionID=${sessionID}`);
            })
            .catch(err => {
                openConnectionModal();
            })
    };

    handleSignUp = () => {
        if(!this.form.isValid()){
            this.form.touchPaths([
                "username", "login_username", "password", "gender", "dob"
            ]);
            return;
        }
        this.setState({creating: true});
        let {username, login_username, password, gender, dob} = this.form.getData();
        let phone = isPhone(login_username) ? login_username : "";
        let email = isEmail(login_username) ? login_username : "";
        let finalData = {
            basic_info: {
                username: username.trim(),
                gender,
                dob: new Date(`${dob.month}/${dob.day}/${dob.year}`)
            },
            private_info: {
                password: password.trim(),
            },
            contact: {
                login_username: {
                    phone: phone.trim(),
                    email: email.trim()
                }
            }
        };
        guestApi.register(finalData)
            .then(({registerType, sessionID}) => {
                customHistory.push(`/xac-thuc-tai-khoan?sessionID=${sessionID}&registerType=${registerType}`);
            })
            .catch(err => {
                this.setState({creating: false});
                // this.form.resetData();
                let matcher = {
                    "account_existed": () => appModal.alert({
                        title: "Không thể tạo mới tài khoản",
                        text: (
                            <p>
                                Tài khoản với {phone ? `số điện thoại` : `địa chỉ email`} <span className="high-light">{phone || email}</span> đã tồn tại!
                            </p>
                        ),
                        btnText: "Đóng",
                        className: "create-account-result-modal"
                    }),
                    "account_not_verified": () => appModal.confirm({
                        title: "Không thể tạo mới tài khoản",
                        text:  (
                            <div>
                                Tài khoản với {phone ? `số điện thoại` : `địa chỉ email`} <span className="high-light">{phone || email}</span> chưa được xác nhận.
                                <p className="question">Bạn có muốn xác nhận ngay?</p>
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
            })
    };

    render() {
        return (
            <div className="sign-up-form">
                <div className="sign-up-form-row">
                    {this.form.enhanceComponent("username", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"username"}
                            onKeyDown={onEnter}
                            type={"text"}
                            placeholder={"Tên hiển thị"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="sign-up-form-row">
                    {this.form.enhanceComponent("login_username", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"login_username"}
                            onKeyDown={onEnter}
                            type={"text"}
                            placeholder={"Email hoặc Số điện thoại"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="sign-up-form-row">

                    {this.form.enhanceComponent("password", ({error, onChange, onEnter, ...others}) => (
                        <CommonInput
                            className="pt-0"
                            error={error}
                            id={"password"}
                            onKeyDown={onEnter}
                            type={"password"}
                            placeholder={"Mật khẩu"}
                            onChange={e => {
                                onChange(e);
                            }}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="sign-up-form-row">

                    {this.form.enhanceComponent("dob", ({error, onChange, onEnter, ...others}) => (
                        <BirthdayPicker
                            className="pt-0"
                            error={error}
                            onChange={onChange}
                            {...others}
                        />
                    ), true)}
                </div>
                <div className="sign-up-form-row">

                    {this.form.enhanceComponent("gender", ({error, onChange, onEnter, value}) => {
                        let currentGender = genders.find(each => each.value === value);
                        return (
                            <RadioGroup
                                label={"Giới tính"}
                                className="pt-0"
                                error={error}
                                onChange={val => {
                                    console.log(val)
                                    onChange(val.value);
                                }}
                                value={currentGender}
                                displayAs={each => each.label}
                                isChecked={each => each.value === currentGender.value}
                                options={genders}
                            />
                        )
                    }, true)}
                </div>
                <Button className="btn-common-primary register-btn" onClick={this.handleSignUp} loading={this.state.creating}>Đăng ký</Button>
            </div>
        );
    }
}
