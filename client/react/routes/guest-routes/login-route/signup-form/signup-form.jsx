import React, {Component} from 'react';
import {KComponent} from "../../../../common/k-component";
import * as yup from "yup";
import {createSimpleForm} from "../../../../common/form-validator/form-validator";

export class SignUpForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            creating: false
        };
        const signUpSchema = yup.object().shape({
            user_name: yup.string().min(6, "Tên người dùng phải lớn hơn 4 kí tự").max(50, "Tên người dùng phải nhỏ hơn 50 kí tự").required("Tên người dùng không được để trống"),
            login_user_name: yup.string().required("Email hoặc số điện thoại không được để trống"),
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
                user_name: "",
                login_user_name: "",
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

            </div>
        );
    }
}
