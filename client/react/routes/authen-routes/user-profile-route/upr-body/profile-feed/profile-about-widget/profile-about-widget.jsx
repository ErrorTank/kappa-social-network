import React, {Component} from 'react';
import {userApi} from "../../../../../../../api/common/user-api";
import {LoadingInline} from "../../../../../../common/loading-inline/loading-inline";
import classnames from "classnames"
import {getAge} from "../../../../../../../common/utils/date-utils";
import {relationships} from "../../../../../../../const/relationships";
import {Link} from "react-router-dom";
import {userInfo} from "../../../../../../../common/states/common";
import {allFavorites} from "../../../../../../common/favorite/favorites";
import {Favorite} from "../../../../../../common/favorite/favorite";

export class ProfileAboutWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userAbout: null,
            loading: true
        }
        this.fetchUserBrief(props.user._id)
    }

    fetchUserBrief = (userID) => {

        return userApi.getUserAboutBrief(userID)
            .then(userAbout => this.setState({userAbout, loading: false}))

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user._id !== prevProps.user._id) {

            this.fetchUserBrief(this.props.user._id)
        }
    }

    render() {
        let {loading, userAbout} = this.state;
        let relationshipConfig = relationships.find(each => each.value === userAbout?.relationship?.status);
        return (
            <div className="profile-about-widget white-box">
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <>
                        <div className="intro-panel">
                            <div className="ip-label">
                                Giới thiệu
                            </div>
                            <div className="ip-info">
                                {userAbout.works.map((item, i) => (
                                    <div className="info-row" key={i}>
                                        <span className="icon"><i className="fas fa-briefcase"></i></span>
                                        <span>{item.currently_working ? item.position || "Làm việc" : `Từng làm ${item.position || "việc"}`} tại <span className="high-light">{item.company}</span></span>
                                    </div>
                                ))}
                                {userAbout.schools.map((item, i) => (
                                    <div className="info-row" key={i}>
                                        <span className="icon"><i className="fas fa-graduation-cap"></i></span>
                                        <span>{!item.graduated ? `Học` : `Tốt nghiệp`} {item.specialization || ""} tại <span className="high-light">{item.school}</span></span>
                                    </div>
                                ))}
                                {(userAbout.contact.address.city || userAbout.contact.address.district || userAbout.contact.address.ward) && (
                                    <div className="info-row">
                                        <span className="icon"><i className="fas fa-map-marker-alt"></i></span>
                                        <span>Sống tại <span className="high-light">{(userAbout.contact.address.ward ? `${userAbout.contact.address.ward.name}, ` : "")
                                        +  (userAbout.contact.address.district ? `${userAbout.contact.address.district.name}, ` : "")
                                        + (userAbout.contact.address.city ? `${userAbout.contact.address.city.name} ` : "")}</span></span>
                                    </div>
                                )}
                                {(userAbout.contact.home_town.city || userAbout.contact.home_town.district || userAbout.contact.home_town.ward) && (
                                    <div className="info-row">
                                        <span className="icon"><i className="fas fa-home-lg"></i></span>
                                        <span>Đến từ <span className="high-light">{(userAbout.contact.home_town.ward ? `${userAbout.contact.home_town.ward.name}, ` : "")
                                        +  (userAbout.contact.home_town.district ? `${userAbout.contact.home_town.district.name}, ` : "")
                                        + (userAbout.contact.home_town.city ? `${userAbout.contact.home_town.city.name} ` : "")}</span></span>
                                    </div>
                                )}
                                {userAbout.basic_info.dob && (
                                    <div className="info-row">
                                        <span className="icon"><i className="fas fa-birthday-cake"></i></span>
                                        <span><span className="high-light">{getAge(userAbout.basic_info.dob)}</span> Tuổi</span>
                                    </div>
                                )}

                                {userAbout.basic_info.gender && (
                                    <div className="info-row">
                                        <span className={classnames("icon", {male: userAbout.basic_info.gender === "MALE",
                                            female: userAbout.basic_info.gender === "FEMALE",
                                            others: userAbout.basic_info.gender === "OTHERS"})}>
                                            {userAbout.basic_info.gender === "MALE" ?
                                                <i className="fad fa-mars"></i> :
                                                userAbout.basic_info.gender === "FEMALE" ?
                                                    <i className="fad fa-venus"></i> :
                                                    <i className="fad fa-transgender-alt"></i>
                                            }
                                        </span>
                                        <span>
                                            {userAbout.basic_info.gender === "MALE" ?
                                                "Nam" :
                                                userAbout.basic_info.gender === "FEMALE" ?
                                                    "Nữ" :
                                                    "Không xác định"
                                            }
                                        </span>
                                    </div>
                                )}
                                {userAbout.relationship.status && (
                                    <div className="info-row">
                                        <span className="icon"><i className="fas fa-heart"></i></span>
                                        <span>{relationshipConfig.label} {(relationshipConfig.canRelated && userAbout.relationship.related) && <span>với <Link to={`/user/${userAbout.relationship.related.basic_info.profile_link || userAbout.relationship.related._id}`}>{userAbout.relationship.related._id === userInfo.getState()._id ? "Bạn" :userAbout.relationship.related.basic_info.username}</Link></span>}</span>
                                    </div>
                                )}

                            </div>
                        </div>
                        {userAbout.favorites.length > 0 && (
                            <>
                                <div className={"divider"}/>
                                <div className="intro-panel">
                                    <div className="ip-label">
                                        Sở thích
                                    </div>
                                    <div className="ip-info">
                                        <div className="info-row">
                                            {allFavorites.filter(each => userAbout.favorites.find(f => f === each.label)).map(each => (
                                                <Favorite
                                                    className={"mb-3 mr-3"}
                                                    key={each.label}
                                                    readOnly={true}
                                                    favorite={each}
                                                />
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </>
                        )}

                    </>
                )}
            </div>
        );
    }
}

;