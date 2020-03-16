import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";
import {Select} from "../../../../common/select/select";
import {accountTypes} from "../../../../../const/account-types";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {divisionsCache, specialitiesCache} from "../../../../../common/cache/api-cache/common-cache";
import {SwitchBtn} from "../../../../common/switch/switch-btn";
import {englishLevels} from "../../../../../const/english-level";

export class StudentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialities: [],
            loading: true
        };
        props.form.validateData();
        specialitiesCache.get().then((specialities) => {
            let newSpecialities = [
                {
                    label: "Chọn chuyên ngành",
                    value: ""
                }
            ];
            newSpecialities = newSpecialities.concat(specialities.map(each => ({label: each.name, value: each._id})));
            this.setState({
                loading: false, specialities: newSpecialities
            });

        });
    }

    render() {
        let {form, isEdit} = this.props;
        let {specialities, loading} = this.state;
        console.log(specialities)
        return (
            <div className="admin-pdt-form common-form">
                <div className="form-title">
                    Thông Tin Sinh Viên Chi Tiết
                </div>
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <>
                        <div className="form-row">

                            {form.enhanceComponent("credits", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <div className="info-cell">
                                        <span className="label">Tín chỉ tích lũy:</span>
                                        <span className="value">{others.value}</span>
                                    </div>

                                )
                            }, true)}
                        </div>
                        <div className="form-row">
                            {form.enhanceComponent("speciality", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <Select
                                        className="pt-0 account-basic-input"
                                        label={"Chuyên ngành"}
                                        error={error}
                                        options={specialities}
                                        value={specialities.find(each => each.value === others.value)}
                                        displayAs={(each) => each.label}
                                        getValue={each => each.value}
                                        onChange={e => {
                                            let newValue = specialities.find(sp => sp.value === e.target.value).value;
                                            onChange(newValue);
                                        }}
                                    />

                                )
                            }, true)}
                            {form.enhanceComponent("englishLevel", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <Select
                                        className="pt-0 account-basic-input"
                                        label={"Cấp tiếng anh"}
                                        error={error}
                                        options={englishLevels.filter(each => each.value !== "")}
                                        value={englishLevels.find(each => each.value === others.value)}
                                        displayAs={(each) => each.label}
                                        getValue={each => each.value}
                                        onChange={e => {
                                            let newValue = englishLevels.find(sp => sp.value === e.target.value).value;
                                            onChange(newValue);

                                        }}
                                    />

                                )
                            }, true)}

                        </div>
                        <div className="form-row">
                            {form.enhanceComponent("schoolYear", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <CommonInput
                                        className="pt-0 account-basic-input"
                                        error={error}
                                        id={"schoolYear"}
                                        onKeyDown={onEnter}
                                        type={"number"}
                                        label={"Niên khóa"}
                                        placeholder={"Nhập niên khóa"}
                                        onChange={e => {
                                            onChange(Number(e.target.value));
                                        }}
                                        {...others}
                                    />

                                )
                            }, true)}
                            {form.enhanceComponent("active", ({error, onChange, onEnter, ...others}) => {
                                return (
                                    <SwitchBtn
                                        className="pt-0 account-basic-input"
                                        label={"Active"}
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
