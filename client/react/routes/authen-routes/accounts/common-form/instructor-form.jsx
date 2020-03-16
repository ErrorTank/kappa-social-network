import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";
import {Select} from "../../../../common/select/select";
import {accountTypes} from "../../../../../const/account-types";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {divisionsCache} from "../../../../../common/cache/api-cache/common-cache";
import {SwitchBtn} from "../../../../common/switch/switch-btn";

export class InstructorForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            divisions: [],
            loading: true
        };
        props.form.validateData();
        divisionsCache.get().then((divisions) => {
            let newDivisions = [
                {
                    label: "Chọn bộ môn",
                    value: ""
                }
            ];
            newDivisions = newDivisions.concat(divisions.map(each => ({label: each.name, value: each._id})));
            this.setState({
                loading: false, divisions: newDivisions
            });

        });
    }

    render() {
        let {form, isEdit} = this.props;
        let {divisions, loading} = this.state;
        console.log(divisions)
        return (
            <div className="admin-pdt-form common-form">
                <div className="form-title">
                    Thông Tin Giáo Viên Chi Tiết
                </div>
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <>
                        <div className="form-row">
                            {form.enhanceComponent("division", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <Select
                                        className="pt-0 account-basic-input"
                                        label={"Bộ môn"}
                                        error={error}
                                        options={divisions}
                                        value={divisions.find(each => each.value === others.value)}
                                        displayAs={(each) => each.label}
                                        getValue={each => each.value}
                                        onChange={e => {
                                            let newValue = divisions.find(sp => sp.value === e.target.value).value;
                                            onChange(newValue);
                                        }}
                                    />

                                )
                            }, true)}
                            {form.enhanceComponent("canEditSchedule", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <SwitchBtn
                                        className="pt-0 account-basic-input"
                                        label={"Đại diện bộ môn"}
                                        value={others.value}
                                        onToggle={value => {
                                            onChange(value);
                                        }}
                                    />

                                )
                            }, true)}
                        </div>
                    </>
                )}
            </div>
        );
    }
}
