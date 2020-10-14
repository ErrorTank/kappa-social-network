import React, {Component} from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {CommonInput} from "../../../../../../common/common-input/common-input";
import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import {Button} from "../../../../../../common/button/button";

export class ProfileLinkForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false
        };


        this.form = createSimpleForm(yup.object().shape({
            profile_link: yup.string().noSpecialChar("Không được chứa kí tự đặc biệt").min(5, "Phải lớn hơn 5 kí tự").required("Không được để trống"),
        }), {
            initData: {
                profile_link: props.user.basic_info.profile_link || ""
            }
        });
        this.onUnmount(this.form.on("change", () => {
            if(this.state.serverError){
                this.setState({serverError: null})
            }
            this.forceUpdate();
        }));
        this.form.validateData();
    }

    save = () => {
        this.setState({saving: true});
        this.props.onSave({"basic_info.profile_link": this.form.getPathData("profile_link")})
            .then(() => this.props.onClose(this.form.getPathData("profile_link")))
            .catch(() => this.setState({serverError: {message: "Đường dẫn của bạn đã tồn tại"}}));
    };

    render() {
        let {saving, serverError} = this.state;
        let {onClose} = this.props;
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("profile_link", ({error, onChange, onEnter, ...others}) => (
                            <CommonInput
                                className="pt-0"
                                error={error || serverError}
                                id={"profile_link"}
                                onKeyDown={onEnter}
                                type={"text"}
                                placeholder={"Nhập đường dẫn"}
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
