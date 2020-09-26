import React from "react";
import {genders} from "../../../../../../const/genders";
import {relationships} from "../../../../../../const/relationships";


export const createAboutPanels = ({}) =>  [
    {
        label: "Thông tin cá nhân",
        icon: <i className="fad fa-user"></i>,
        fields: [
            {
                label: "Tên tài khoản",
                getValue: user => user.basic_info.username,
                isExisted: user => user.basic_info.username
            }, {
                label: "Giới tính",
                getValue: user => genders.find(each => each.id === user.basic_info.gender).label,
                isExisted: user => user.basic_info.gender
            }, {
                label: "Ngày sinh",
                getValue: user => {
                    let birthday = new Date(user.basic_info.dob);
                    return `${birthday.getDate()}/${birthday.getMonth() + 1}/${birthday.getFullYear()}`;
                },
                isExisted: user => user.basic_info.dob
            },{
                label: "Tình trạng",
                getValue: user => {
                    let relationshipConfig = relationships.find(each => each.id === user.relationship.status);
                    return `${relationshipConfig.label}${relationshipConfig.canWith && ` ${user.relationship.related_person.basic_info.username}`}`
                },
                isExisted: user => user.relationship
            },{
                label: "Đường dẫn",
                getValue: user => {

                    return `${window.location.origin}/user/${user.basic_info.profile_link || user._id}}`
                },
                isExisted: true
            },
        ]
    }, {
        label: "Thông tin liên hệ",
        icon: <i className="fad fa-phone-alt"></i>
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