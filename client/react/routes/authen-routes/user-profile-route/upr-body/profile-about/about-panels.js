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


export const createAboutPanels = ({isOwner, user, onSave, }) =>  [
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
                    // return `${relationshipConfig.label}${relationshipConfig.canWith ? ` ${user.relationship.related_person.basic_info.username}` : ""}`
                    return `${relationshipConfig.label}`
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
                    return user.contact.home_town.ward.path_with_type
                },
                editable: isOwner,
                isExisted: () => Object.keys(user.contact.home_town).length
            },{
                label: "Tỉnh/Thành phố hiện tại",
                getValue: () => {
                    return user.contact.address.ward.path_with_type
                },
                editable: isOwner,
                isExisted: () => Object.keys(user.contact.address).length
            },
        ]
    },{
        label: "Công việc",
        icon: <i className="fad fa-briefcase"></i>,
        createConfig: {
            createBtn: "Thêm công việc",
        }
    },{
        label: "Trường học",
        icon: <i className="fad fa-graduation-cap"></i>,
        createConfig: {
            createBtn: "Thêm trường học",
        }
    },{
        label: "Sở thích",
        icon: <i className="fad fa-star"></i>,
        createConfig: {
            createBtn: "Thêm/sửa sở thích",
        }
    },
];