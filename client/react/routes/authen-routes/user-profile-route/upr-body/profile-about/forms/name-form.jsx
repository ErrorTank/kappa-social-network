import React, {Component} from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../../../../../common/common-input/common-input";
import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import {Button} from "../../../../../../common/button/button";

export class NameForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false
        };


        this.form = createSimpleForm(yup.object().shape({
            username: yup.string().noSpecialChar("Không được chứa kí tự đặc biệt").min(5, "Phải lớn hơn 5 kí tự").required("Không được để trống"),
        }), {
            initData: {
                username: props.user.basic_info.username
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        this.props.onSave({"basic_info.username": this.form.getPathData("username")})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("username", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0"
                                error={error}
                                id={"username"}
                                onKeyDown={onEnter}
                                type={"text"}
                                placeholder={"Nhập tên tài khoản"}
                                onChange={e => {
                                    onChange(e);
                                }}
                                {...others}
                            />
                        ), true)}
                    </div>

                </div>
                <div className="form-actions">
                    <Button className="btn btn-common-primary" onClick={this.save} loading={saving} disabled={!this.form.isValid()}>Lưu thay đổi</Button>
                    <Button className="btn btn-grey ml-2" onClick={onClose}>Hủy</Button>
                </div>
            </div>
        );
    }
}
