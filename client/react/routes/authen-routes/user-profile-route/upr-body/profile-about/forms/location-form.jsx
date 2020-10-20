import React, {Component} from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../../../../../common/common-input/common-input";
import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import {Button} from "../../../../../../common/button/button";
import {BirthdayPicker} from "../../../../../../common/birthday-picker/birthday-picker";

export class LocationForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === props.user.user_about_privacy.contact[props.type])
        };


        this.form = createSimpleForm(yup.object().shape({
            ward: yup.string().nullable(),
            district: yup.string().nullable(),
            city: yup.string().nullable()
        }), {
            initData: {
                ward: props.user.contact[props.type].ward || null,
                district: props.user.contact[props.type].district || null,
                city: props.user.contact[props.type].city || null,
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        let data = this.form.getPathData("dob");
        this.props.onSave({"basic_info.dob": new Date(data.year, data.month - 1, data.day), "user_about_privacy.basic_info.dob": this.state.policy.value})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving, policy} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("dob", ({error, onChange, onEnter, ...others}) => (
                            <BirthdayPicker
                                label={null}
                                className="pt-0"
                                error={error}
                                onChange={onChange}
                                {...others}
                            />
                        ), true)}
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
