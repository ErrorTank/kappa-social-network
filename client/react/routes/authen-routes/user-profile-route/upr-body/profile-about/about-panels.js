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
import {SchoolForm} from "./forms/school-form";
import {PostPoliciesMAP} from "../../../../../common/create-post-modal/create-post-modal";
import {USER_FRIEND_RELATION} from "../../upr-header/profile-navigator";


export const createAboutPanels = ({isOwner, user, onSave, onSaveList, friendStatus}) => {
    let canRender = (privacy) => {
        return isOwner || privacy === PostPoliciesMAP.PUBLIC || (privacy === PostPoliciesMAP.FRIENDS && friendStatus === USER_FRIEND_RELATION.FRIEND)
    }
    return [
        {
            label: "Thông tin cá nhân",
            icon: <i className="fad fa-user"></i>,
            fields: [
                {
                    label: "Tên tài khoản",
                    getValue: () => user.basic_info.username,
                    editable: isOwner,
                    isExisted: () => user.basic_info.username,
                    renderForm: ({onClose}) => (
                        <NameForm
                            user={user}
                            onSave={data => {
                                return onSave(data)
                            }}
                            onClose={onClose}
                        />
                    )
                }, {
                    label: "Giới tính",
                    getValue: () => genders.find(each => each.id === user.basic_info.gender).label,
                    editable: isOwner,
                    isVisible: () => canRender(user.user_about_privacy.basic_info.gender),
                    isExisted: () => user.basic_info.gender,
                    renderForm: ({onClose}) => (
                        <GenderForm
                            user={user}
                            onSave={onSave}
                            onClose={onClose}
                        />
                    )
                }, {
                    label: "Ngày sinh",
                    isVisible: () => canRender(user.user_about_privacy.basic_info.dob),
                    getValue: () => {
                        let birthday = new Date(user.basic_info.dob);
                        return `${birthday.getDate()} / ${birthday.getMonth() + 1} / ${birthday.getFullYear()}`;
                    },
                    editable: isOwner,
                    isExisted: () => user.basic_info.dob,
                    renderForm: ({onClose}) => (
                        <DOBForm
                            user={user}
                            onSave={onSave}
                            onClose={onClose}
                        />
                    )
                }, {
                    label: "Tình trạng",
                    isVisible: () => canRender(user.user_about_privacy.relationship),
                    getValue: () => {
                        let relationshipConfig = relationships.find(each => each.value === user.relationship.status);
                        return (
                            <span>{relationshipConfig.label} {(relationshipConfig.canRelated && user.relationship.related) &&
                            <span> với <Link
                                to={`/user/${user.relationship.related.basic_info.profile_link || user.relationship.related._id}`}>{user.relationship.related._id === userInfo.getState()._id ? "Bạn" : user.relationship.related.basic_info.username}</Link></span>}</span>
                        )
                        // return `${relationshipConfig.label}`
                    },
                    editable: isOwner,
                    isExisted: () => user.relationship.status,
                    renderForm: ({onClose}) => (
                        <RelationshipForm
                            user={user}
                            onSave={onSave}
                            onClose={onClose}
                        />
                    )
                }, {
                    label: "Đường dẫn",
                    getValue: () => {

                        return `${window.location.origin}/user/${user.basic_info.profile_link || user._id}`
                    },
                    editable: isOwner,
                    isVisible: () => isOwner,
                    isExisted: () => true,
                    renderForm: ({onClose}) => (
                        <ProfileLinkForm
                            user={user}
                            onSave={(data) => {
                                
                                return onSave(data)
                                .then(() => {
                                    customHistory.push(`/user/${data["basic_info.profile_link"]}/about`);   
                                });

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
                    isVisible: () => canRender(user.user_about_privacy.contact.email),
                    getValue: () => user.contact.login_username.email,
                    editable: isOwner,
                    isExisted: () => user.contact.login_username.email,
                    renderForm: ({onClose}) => (
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
                    isVisible: () => canRender(user.user_about_privacy.contact.phone),
                    getValue: () => user.contact.login_username.phone,
                    editable: isOwner,
                    isExisted: () => user.contact.login_username.phone,
                    renderForm: ({onClose}) => (
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
                    isVisible: () => canRender(user.user_about_privacy.contact.home_town),
                    getValue: () => {
                        return (user.contact.home_town.ward ? `${user.contact.home_town.ward.name_with_type}, ` : "")
                            + (user.contact.home_town.district ? `${user.contact.home_town.district.name_with_type}, ` : "")
                            + (user.contact.home_town.city ? `${user.contact.home_town.city.name_with_type} ` : "");
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
                }, {
                    label: "Tỉnh/Thành phố hiện tại",
                    isVisible: () => canRender(user.user_about_privacy.contact.address),
                    getValue: () => {
                        return (user.contact.address.ward ? `${user.contact.address.ward.name_with_type}, ` : "")
                            + (user.contact.address.district ? `${user.contact.address.district.name_with_type}, ` : "")
                            + (user.contact.address.city ? `${user.contact.address.city.name_with_type} ` : "");
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
        }, {
            label: "Công việc",
            icon: <i className="fad fa-briefcase"></i>,
            createConfig: {
                creatable: isOwner,
                createBtn: "Thêm công việc",
                list: user.works,
                itemConfig: {
                    isVisible: (item) => canRender(item.privacy),
                    renderForm: ({onClose, item = {}, isCreate = true}) => (
                        <WorkForm
                            user={user}
                            work={item}
                            isCreate={isCreate}
                            onSave={() => {

                                return onSaveList();

                            }}
                            onClose={() => {
                                onClose();
                            }}
                        />
                    ),
                    label: "Công ty",
                    getValue: (item) => `${item.currently_working ? item.position || "Làm việc" : `Từng làm ${item.position || "việc"}`} tại ${item.company}`,
                    editable: isOwner,
                    isExisted: () => true,
                }
            }
        }, {
            label: "Trường học",
            icon: <i className="fad fa-graduation-cap"></i>,
            createConfig: {
                creatable: isOwner,
                createBtn: "Thêm trường học",
                list: user.schools,
                itemConfig: {
                    renderForm: ({onClose, item = {}, isCreate = true}) => (
                        <SchoolForm
                            user={user}
                            school={item}
                            isCreate={isCreate}
                            onSave={() => {

                                return onSaveList();

                            }}
                            onClose={() => {
                                onClose();
                            }}
                        />
                    ),
                    label: "Trường học",
                    isVisible: (item) => canRender(item.privacy),
                    getValue: (item) => `${!item.graduated ? `Học` : `Tốt nghiệp`} ${item.specialization || ""} tại ${item.school}`,
                    editable: isOwner,
                    isExisted: () => true,
                }
            }
        },
    ];
}