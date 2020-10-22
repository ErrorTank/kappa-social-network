import React, {Component} from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../../../../../common/common-input/common-input";
import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import {Button} from "../../../../../../common/button/button";
import {Checkbox} from "../../../../../../common/checkbox/checkbox";
import {userApi} from "../../../../../../../api/common/user-api";

export class SchoolForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === (props.school?.privacy || "PUBLIC")),
            deleting: false
        };


        this.form = createSimpleForm(yup.object().shape({
            school: yup.string().required("Tên trường học không được để trống"),
            specialization: yup.string(),
            graduated: yup.boolean()

        }), {
            initData: {
                school: props.school?.school || "",
                specialization: props.school?.specialization || "",
                graduated: !!props.school?.graduated,
            }
        });
        this.onUnmount(this.form.on("change", () => {
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        let {user, onSave, onClose} = this.props;

        let school = {...this.form.getData(), privacy: this.state.policy.value};
        let payload = {
            school,
            schoolID: this.props.school?._id,

        }

        userApi.upsertUserSchool(user._id, payload)
            .then(() => {
                onSave()
                    .then(() => onClose())
            })

    };

    delete = () => {
        this.setState({deleting: true});
        let {user, onSave, onClose} = this.props;
        userApi.deleteSchool(user._id, this.props.school?._id)
            .then(() => {
                onSave()
                    .then(() => onClose())
            })
    }

    render() {
        let {saving, policy, deleting} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        <div className="aff-form-row">
                            <div className="form-label">
                                Tên trường học
                            </div>
                            <div className="form-input">
                                {this.form.enhanceComponent("school", ({error, onChange, onEnter, value}) => {
                                    return (
                                        <CommonInput
                                            className="pt-0"
                                            error={error}
                                            id={"school"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            placeholder={"Nhập tên trường học"}
                                            onChange={e => {
                                                onChange(e);
                                            }}
                                            value={value}
                                        />
                                    )
                                }, true)}
                            </div>
                        </div>
                        <div className="aff-form-row">
                            <div className="form-label">
                                Chuyên ngành
                            </div>
                            <div className="form-input">
                                {this.form.enhanceComponent("specialization", ({error, onChange, onEnter, value}) => {
                                    return (
                                        <CommonInput
                                            className="pt-0"
                                            error={error}
                                            id={"specialization"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            placeholder={"Nhập chuyên ngành"}
                                            onChange={e => {
                                                onChange(e);
                                            }}
                                            value={value}
                                        />
                                    )
                                }, true)}
                            </div>
                        </div>
                        <div className="aff-form-row">
                            <div className="form-label">
                                Trạng thái
                            </div>
                            <div className="form-input">
                                {this.form.enhanceComponent("graduated", ({error, onChange, onEnter, value}) => {
                                    return (
                                        <Checkbox
                                            label={"Đã tốt nghiệp"}
                                            value={value}
                                            onChange={v => onChange(v)}
                                        />
                                    )
                                }, true)}
                            </div>
                        </div>
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
                <div className="form-actions aff-form-actions">
                    <div style={{flex: "0 0 280px"}}/>
                    <div className={"actions mt-4"}>
                        <Button className="btn btn-common-primary" onClick={this.save} loading={saving}
                                disabled={!this.form.isValid()}>Lưu thay đổi</Button>
                        <Button className="btn btn-grey ml-2" onClick={onClose}>Hủy</Button>
                        {!this.props.isCreate && (
                            <Button className="btn btn-cancel ml-2" loading={deleting} onClick={this.delete}>
                                <i className="fas fa-trash"></i> Xóa trường học</Button>
                        )}

                    </div>
                </div>
            </div>
        );
    }
}
