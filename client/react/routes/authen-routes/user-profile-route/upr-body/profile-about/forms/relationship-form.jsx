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

export const relationships = [
    {
        label: "Độc thân",
        value: "SINGLE"
    },  {
        label: "Đang hẹn hò",
        value: "DATING",
        canRelated: true
    }, {
        label: "Kết hôn",
        value: "MARRIED",
        canRelated: true

    }, {
        label: "Có mối quan hệ phức tạp",
        value: "COMPLICATED"
    },
]

export class RelationshipForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === props.user.user_about_privacy.relationship)
        };


        this.form = createSimpleForm(yup.object().shape({
            status: yup.string().oneOf(["SINGLE", "DATING", "COMPLICATED", "MARRIED"]),
            related: yup.mixed().nullable()
        }), {
            initData: {
                status: props.user.relationship.status,
                related: props.user.relationship.related
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        this.props.onSave({"relationship.status": this.form.getPathData("status")})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving, policy} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("status", ({error, onChange, onEnter, value}) => {
                            let currentRelation = relationships.find(each => each.value === value);
                            return (
                                <Select
                                    className={"mb-3"}
                                    placeholder={"Chọn tình trạng"}
                                    options={relationships}
                                    value={currentRelation}
                                    onChange={item => {
                                        onChange(item.value);
                                    }}
                                    displayAs={item => item.label}
                                    isSelected={option => option.value === value}
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
