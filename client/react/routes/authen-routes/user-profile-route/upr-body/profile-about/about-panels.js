import React from "react";
import {genders} from "../../../../../../const/genders";
import {relationships} from "../../../../../../const/relationships";
import {NameForm} from "./forms/name-form";
import {GenderForm} from "./forms/gender-form";
import {DOBForm} from "./forms/dob-form";
import {RelationshipForm} from "./forms/relationship-form";
import {ProfileLinkForm} from "./forms/profile-link";
import {customHistory} from "../../../../routes";
import {EmailForm} from "./forms/email-form";
import {PhoneForm} from "./forms/phone-form";
import {Link} from "react-router-dom";
import {userInfo} from "../../../../../../common/states/common";
import {LocationForm} from "./forms/location-form";
import {WorkForm} from "./forms/work-form";


export const createAboutPanels = ({isOwner, user, onSave, onSaveList}) =>  [
    {
        label: "Thông tin cá nhân",
        icon: <i className="fad fa-user"></i>,
        fields: [
            {
                label: "Tên tài khoản",
                getValue: () => user.basic_info.username,
                editable: isOwner,
                isExisted: () => user.basic_info.username,
                renderForm:({onClose}) => (
                    <NameForm
                        user={user}
                        onSave={onSave}
                        onClose={onClose}
                    />
                )
            }, {
                label: "Giới tính",
                getValue: () => genders.find(each => each.id === user.basic_info.gender).label,
                editable: isOwner,
                isExisted: () => user.basic_info.gender,
                renderForm:({onClose}) => (
                    <GenderForm
                        user={user}
                        onSave={onSave}
                        onClose={onClose}
                    />
                )
            }, {
                label: "Ngày sinh",
                getValue: () => {
                    let birthday = new Date(user.basic_info.dob);
                    return `${birthday.getDate()} / ${birthday.getMonth() + 1} / ${birthday.getFullYear()}`;
                },
                editable: isOwner,
                isExisted: () => user.basic_info.dob,
                renderForm:({onClose}) => (
                    <DOBForm
                        user={user}
                        onSave={onSave}
                        onClose={onClose}
                    />
                )
            },{
                label: "Tình trạng",
                getValue: () => {
                    let relationshipConfig = relationships.find(each => each.value === user.relationship.status);
                    return (
                        <span>{relationshipConfig.label} {(relationshipConfig.canRelated && user.relationship.related) && <span> với <Link to={`/user/${user.relationship.related.basic_info.profile_link || user.relationship.related._id}`}>{user.relationship.related._id === userInfo.getState()._id ? "Bạn" :user.relationship.related.basic_info.username}</Link></span>}</span>
                    )
                    // return `${relationshipConfig.label}`
                },
                editable: isOwner,
                isExisted: () => user.relationship.status,
                renderForm:({onClose}) => (
                    <RelationshipForm
                        user={user}
                        onSave={onSave}
                        onClose={onClose}
                    />
                )
            },{
                label: "Đường dẫn",
                getValue: () => {

                    return `${window.location.origin}/user/${user.basic_info.profile_link || user._id}`
                },
                editable: isOwner,
                isExisted: () => true,
                renderForm:({onClose}) => (
                    <ProfileLinkForm
                        user={user}
                        onSave={(data) => {
                            customHistory.push(`/user/${data["basic_info.profile_link"]}/about`);
                            return onSave(data);

                        }}
                        onClose={() => {
                            onClose();
                        }}
                    />
                )
            },
        ]
    }, {
        label: "Thông tin liên hệ",
        icon: <i className="fad fa-phone-alt"></i>,
        fields: [
            {
                label: "Email",
                getValue: () => user.contact.login_username.email,
                editable: isOwner,
                isExisted: () => user.contact.login_username.email,
                renderForm:({onClose}) => (
                    <EmailForm
                        user={user}
                        onSave={(data) => {

                            return onSave(data);

                        }}
                        onClose={() => {
                            onClose();
                        }}
                    />
                )
            }, {
                label: "Số điện thoại",
                getValue: () => user.contact.login_username.phone,
                editable: isOwner,
                isExisted: () => user.contact.login_username.phone,
                renderForm:({onClose}) => (
                    <PhoneForm
                        user={user}
                        onSave={(data) => {

                            return onSave(data);

                        }}
                        onClose={() => {
                            onClose();
                        }}
                    />
                )
            }, {
                label: "Quê quán",
                getValue: () => {
                    return  (user.contact.home_town.ward ? `${user.contact.home_town.ward.name}, ` : "")
                        +  (user.contact.home_town.district ? `${user.contact.home_town.district.name}, ` : "")
                        + (user.contact.home_town.city ? `${user.contact.home_town.city.name} ` : "");
                },
                editable: isOwner,
                isExisted: () => user.contact.home_town.city || user.contact.home_town.district || user.contact.home_town.ward,
                renderForm: ({onClose}) => (
                    <LocationForm
                        user={user}
                        type={"home_town"}
                        onSave={(data) => {

                            return onSave(data);

                        }}
                        onClose={() => {
                            onClose();
                        }}
                    />
                )
            },{
                label: "Tỉnh/Thành phố hiện tại",
                getValue: () => {
                    return  (user.contact.address.ward ? `${user.contact.address.ward.name}, ` : "")
                        +  (user.contact.address.district ? `${user.contact.address.district.name}, ` : "")
                        + (user.contact.address.city ? `${user.contact.address.city.name} ` : "");
                },
                editable: isOwner,
                isExisted: () => user.contact.address.city || user.contact.address.district || user.contact.address.ward,
                renderForm: ({onClose}) => (
                    <LocationForm
                        user={user}
                        type={"address"}
                        onSave={(data) => {

                            return onSave(data);

                        }}
                        onClose={() => {
                            onClose();
                        }}
                    />
                )
            },
        ]
    },{
        label: "Công việc",
        icon: <i className="fad fa-briefcase"></i>,
        createConfig: {
            creatable: isOwner,
            createBtn: "Thêm công việc",
            list: user.works,
            renderForm: ({onClose, work = {}, isCreate = true}) => (
                <WorkForm
                    user={user}
                    work={work}
                    isCreate={isCreate}
                    onSave={() => {

                        return onSaveList();

                    }}
                    onClose={() => {
                        onClose();
                    }}
                />
            )
        }
    },{
        label: "Trường học",
        icon: <i className="fad fa-graduation-cap"></i>,
        createConfig: {
            creatable: isOwner,
            createBtn: "Thêm trường học",
            list: user.schools
        }
    },{
        label: "Sở thích",
        icon: <i className="fad fa-star"></i>,
        createConfig: {
            creatable: isOwner,
            createBtn: "Thêm/sửa sở thích",
            list: user.favorites
        }
    },
];