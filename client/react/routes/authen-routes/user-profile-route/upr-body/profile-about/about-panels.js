import React from "react";
import {genders} from "../../../../../../const/genders";
import {relationships} from "../../../../../../const/relationships";


export const createAboutPanels = ({isOwner, user}) =>  [
    {
        label: "Thông tin cá nhân",
        icon: <i className="fad fa-user"></i>,
        fields: [
            {
                label: "Tên tài khoản",
                getValue: () => user.basic_info.username,
                editable: isOwner,
                isExisted: () => user.basic_info.username
            }, {
                label: "Giới tính",
                getValue: () => genders.find(each => each.id === user.basic_info.gender).label,
                editable: isOwner,
                isExisted: () => user.basic_info.gender
            }, {
                label: "Ngày sinh",
                getValue: () => {
                    let birthday = new Date(user.basic_info.dob);
                    return `${birthday.getDate()} / ${birthday.getMonth() + 1} / ${birthday.getFullYear()}`;
                },
                editable: isOwner,
                isExisted: () => user.basic_info.dob
            },{
                label: "Tình trạng",
                getValue: () => {
                    let relationshipConfig = relationships.find(each => each.value === user.relationship.status);
                    return `${relationshipConfig.label}${relationshipConfig.canWith ? ` ${user.relationship.related_person.basic_info.username}` : ""}`
                },
                editable: isOwner,
                isExisted: () => user.relationship.status
            },{
                label: "Đường dẫn",
                getValue: () => {

                    return `${window.location.origin}/user/${user.basic_info.profile_link || user._id}`
                },
                editable: isOwner,
                isExisted: () => true
            },
        ]
    }, {
        label: "Thông tin liên hệ",
        icon: <i className="fad fa-phone-alt"></i>,
        fields: [
            {
                label: "Email",
                getValue: () => user.contact.email + "*",
                editable: isOwner,
                isExisted: () => user.contact.email,
            }, {
                label: "Số điện thoại",
                getValue: () => user.contact.phone + "*",
                editable: isOwner,
                isExisted: () => user.contact.phone,
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