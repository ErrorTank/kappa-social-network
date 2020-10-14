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

export class GenderForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === props.user.user_about_privacy.basic_info.gender)
        };


        this.form = createSimpleForm(yup.object().shape({
            gender: yup.string().oneOf(["MALE", "FEMALE", "OTHERS"]),
        }), {
            initData: {
                gender: props.user.basic_info.gender
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        this.props.onSave({"basic_info.gender": this.form.getPathData("gender"), "user_about_privacy.basic_info.gender": this.state.policy.value})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving, policy} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("gender", ({error, onChange, onEnter, value}) => {
                            let currentGender = genders.find(each => each.value === value);
                            return (
                                <RadioGroup
                                    className="pt-0 mb-3"
                                    error={error}
                                    onChange={val => {
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
