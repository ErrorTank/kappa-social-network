import React, {Component} from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";

import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import ReactSelect from "react-select";
import {userApi} from "../../../../../../../api/common/user-api";
import debounce from "lodash/debounce"
import {Button} from "../../../../../../common/button/button";
import {relationships} from "../../../../../../../const/relationships";



export class RelationshipForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === props.user.user_about_privacy.relationship),
            suggestions: [],
            loading: false
        };

        this.fetchFriends(props.user._id, "")


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

    fetchFriends = (userID, keyword) => {
        userApi.getUserFriends(userID, {keyword}).then(({list: suggestions}) => {
            this.setState({suggestions, loading: false})
        })
    }

    debounceFetch = debounce(this.fetchFriends, 300)

    save = () => {
        this.setState({saving: true});
        this.props.onSave({"relationship.status": this.form.getPathData("status"), "relationship.related": this.form.getPathData("related")?._id || null})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving, policy, suggestions, loading} = this.state;
        let {onClose} = this.props;
        let currentRelation = relationships.find(each => each.value === this.form.getPathData("status"));

        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        {this.form.enhanceComponent("status", ({error, onChange, onEnter, value}) => {

                            return (
                                <Select
                                    className={"mb-3"}
                                    placeholder={"Chọn tình trạng"}
                                    options={relationships}
                                    value={currentRelation}
                                    onChange={item => {
                                        onChange(item.value);
                                        this.form.updatePathData("related", null)
                                    }}
                                    displayAs={item => item.label}
                                    isSelected={option => option.value === value}
                                />
                            )
                        }, true)}
                        {currentRelation?.canRelated &&
                            this.form.enhanceComponent("related", ({error, onChange, onEnter, value}) => {

                                    return (
                                        <ReactSelect
                                            className={"mb-2 relation-relate"}
                                            options={suggestions}
                                            onInputChange={keyword => {
                                                this.debounceFetch(this.props.user._id, keyword)
                                            }}
                                            isLoading={loading}
                                            placeholder={"Chọn người liên quan"}
                                            value={value}
                                            getOptionValue={item => item._id}
                                            onChange={(item, {action}) => {
                                                if(action === "clear"){
                                                    onChange(null)
                                                }else{
                                                    onChange(item)
                                                }

                                            }}
                                            loadingMessage={"Đang tìm kiếm..."}
                                            noOptionsMessage={() => "Không tìm thấy"}
                                            getOptionLabel={item => item.basic_info.username}
                                            isClearable={true}
                                        />
                                    )
                                }, true)

                        }
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
