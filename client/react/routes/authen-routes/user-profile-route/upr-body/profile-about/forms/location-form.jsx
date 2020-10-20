import React from 'react';
import {KComponent} from "../../../../../../common/k-component";
import {createSimpleForm} from "../../../../../../common/form-validator/form-validator";
import * as yup from "yup";
import {Select} from "../../../../../../common/select/select";
import {PostPolicies} from "../../../../../../common/create-post-modal/create-post-modal";
import {Button} from "../../../../../../common/button/button";
import {addressApi} from "../../../../../../../api/common/address-api";

export class LocationForm extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            policy: PostPolicies.find(each => each.value === props.user.user_about_privacy.contact[props.type]),
            wards: [],
            districts: [],
            cities: []
        };


        this.form = createSimpleForm(yup.object().shape({
            ward: yup.object().nullable(),
            district: yup.object().nullable(),
            city: yup.object().nullable()
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
        let promises = [addressApi.getAddress({})];
        if(props.user.contact[props.type].city){
            promises.push(addressApi.getAddress({cityCode: props.user.contact[props.type].city.code}))
        }
        if(props.user.contact[props.type].district){
            promises.push(addressApi.getAddress({districtCode: props.user.contact[props.type].district.code}))
        }
        Promise.all(promises).then(([cities, districts, wards]) => {
            this.setState({cities, districts, wards})
        })

    }

    save = () => {
        this.setState({saving: true});
        let {city, district, ward} = this.form.getData();
        this.props.onSave({[`contact.${this.props.type}`]: {city: city?._id || null, district: district?._id || null, ward: ward?._id || null}, [`user_about_privacy.contact.${this.props.type}`]: this.state.policy.value})
            .then(() => this.props.onClose());
    };

    render() {
        let {saving, policy, cities, wards, districts} = this.state;
        let {onClose} = this.props;
        console.log(this.form.getData())
        return (
            <div className="about-field-form">
                <div className="form-body">
                    <div className="form-content">
                        <div className="location-pickers">
                            {this.form.enhanceComponent("city", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    className={"location-picker"}
                                    value={others.value}
                                    options={cities}
                                    onChange={value => {
                                        this.form.updateData({
                                            city:  value,
                                            ward: null,
                                            district: null
                                        })
                                        addressApi.getAddress({cityCode: value.code}).then(districts => this.setState({districts}))
                                    }}
                                    displayAs={each => each.name_with_type}
                                    placeholder={"Tỉnh/Thành phố"}
                                    clearable={true}
                                />
                            ), true)}
                            {this.form.getPathData("city") && this.form.enhanceComponent("district", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    className={"location-picker"}
                                    value={others.value}
                                    options={districts}
                                    onChange={value => {
                                        this.form.updateData({
                                            ward: null,
                                            district: value
                                        })
                                        addressApi.getAddress({districtCode: value.code}).then(wards => this.setState({wards}))
                                    }}

                                    displayAs={each => each.name_with_type}
                                    clearable={true}
                                    placeholder={"Quận/Huyện"}
                                />
                            ), true)}
                            {this.form.getPathData("district") && this.form.enhanceComponent("ward", ({error, onChange, onEnter, ...others}) => (
                                <Select
                                    className={"location-picker"}
                                    value={others.value}
                                    options={wards}
                                    onChange={value => {
                                        onChange(value);
                                    }}
                                    clearable={true}
                                    displayAs={each => each.name_with_type}
                                    placeholder={"Xã/Phường"}
                                />
                            ), true)}
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
                <div className="form-actions">
                    <Button className="btn btn-common-primary" onClick={this.save} loading={saving} disabled={!this.form.isValid()}>Lưu thay đổi</Button>
                    <Button className="btn btn-grey ml-2" onClick={onClose}>Hủy</Button>
                </div>
            </div>
        );
    }
}
