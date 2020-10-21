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

export class WorkForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === (props.work?.privacy || "PUBLIC"))
        };


        this.form = createSimpleForm(yup.object().shape({
            company: yup.string().required("Tên công ty không được để trống"),
            position: yup.string(),
            currently_working: yup.boolean()

        }), {
            initData: {
                company: props.work?.company || "",
                position: props.work?.position || "",
                currently_working: props.work?.currently_working || true,
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
        let work = {...this.form.getData(), privacy: this.state.privacy.value};
        let payload = {
            work,
            workID: this.props.work?._id,

        }
        userApi.upsertUserWork(user._id, payload)
            .then(() => {
                onSave()
                    .then(() => onClose())
            })

    };

    render() {
        let {saving, policy} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        <div className="aff-form-row">
                            <div className="form-label">
                                Tên công ty
                            </div>
                            <div className="form-input">
                                {this.form.enhanceComponent("company", ({error, onChange, onEnter, value}) => {
                                    return (
                                        <CommonInput
                                            className="pt-0"
                                            error={error}
                                            id={"company"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            placeholder={"Nhập tên công ty"}
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
                                Chức danh
                            </div>
                            <div className="form-input">
                                {this.form.enhanceComponent("position", ({error, onChange, onEnter, value}) => {
                                    return (
                                        <CommonInput
                                            className="pt-0"
                                            error={error}
                                            id={"position"}
                                            onKeyDown={onEnter}
                                            type={"text"}
                                            placeholder={"Nhập chức danh"}
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
                                {this.form.enhanceComponent("currently_working", ({error, onChange, onEnter, value}) => {
                                    return (
                                        <Checkbox
                                            label={"Hiện đang làm việc ở đây"}
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
                    <div style={{flex: "0 0 28%"}}/>
                    <div className={"actions mt-4"}>
                        <Button className="btn btn-common-primary" onClick={this.save} loading={saving} disabled={!this.form.isValid()}>Lưu thay đổi</Button>
                        <Button className="btn btn-grey ml-2" onClick={onClose}>Hủy</Button>
                    </div>
                </div>
            </div>
        );
    }
}
