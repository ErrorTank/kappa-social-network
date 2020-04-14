import React, {Component} from 'react';
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";
import {CommonInput} from "../../../../common/common-input/common-input";
import {BirthdayPicker} from "../../../../common/birthday-picker/birthday-picker";

export class SignUpForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            creating: false
        };
        const signUpSchema = yup.object().shape({
            username: yup.string().min(6, "Tên người dùng phải lớn hơn 4 kí tự").max(50, "Tên người dùng phải nhỏ hơn 50 kí tự").required("Tên người dùng không được để trống"),
            login_username: yup.string().required("Email hoặc số điện thoại không được để trống"),
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
        this.onUnmount(this.form.on("enter", () => {
            if(this.form.isValid())
                this.handleSignUp();
        }));
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate()
        }));
        this.form.validateData();
    }

    handleSignUp = () => {

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
            </div>
        );
    }
}
