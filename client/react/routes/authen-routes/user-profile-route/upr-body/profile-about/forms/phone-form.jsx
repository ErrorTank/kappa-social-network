import React, {Component} from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../../../../../common/common-input/common-input";
import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import {Button} from "../../../../../../common/button/button";
import {genders} from "../../../../../../../const/genders";
import {RadioGroup} from "../../../../../../common/radio-group/radio-group";

export class PhoneForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === props.user.user_about_privacy.contact.login_username.phone)
        };


        this.form = createSimpleForm(yup.object().shape({
            phone: yup.string().required("SĐT không được để trống").isPhone("SĐT không hợp lệ")
        }), {
            initData: {
                phone: props.user.contact.login_username.phone || ""
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        this.props.onSave({"contact.login_username.phone": this.form.getPathData("phone"), "user_about_privacy.contact.login_username.phone": this.state.policy.value})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving, policy} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("phone", ({error, onChange, onEnter, value}) => {
                            return (
                                <CommonInput
                                    className="pt-0"
                                    error={error}
                                    id={"phone"}
                                    onKeyDown={onEnter}
                                    type={"text"}
                                    placeholder={"Nhập Số điện thoại"}
                                    onChange={e => {
                                        onChange(e);
                                    }}
                                    value={value}
                                />
                            )
                        }, true)}
                    </div>
                    <div className="form-share">

                        <span className="share-select">
                                 <Select
                                     className={"policy-picker"}
                                     options={PostPolicies}
                                     value={policy}
                                     onChange={policy => {
                                         this.setState({policy});
                                     }}
                                     displayAs={value => (
                                         <div className="post-policy">
                                             <span>{value.icon}</span>
                                             <span>{value.label}</span>
                                         </div>
                                     )}
                                     isSelected={option => option.value === policy.value}
                                 />
                            </span>
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
