import React, {Component} from 'react';
import {createAboutPanels} from "./about-panels";
import {AboutPanel} from "./about-panel";
import {userApi} from "../../../../../../api/common/user-api";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import {userInfo} from "../../../../../../common/states/common";
import {topFloatNotifications} from "../../../../../common/float-top-notification/float-top-notification";
import {FavoritesPanel} from "./favorites-panel";

export default class ProfileAbout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userBrief: null,
            loading: true
        }

        this.fetchUserBrief(props.user._id)
    }

    fetchUserBrief = (userID) => {

        return userApi.getUserAboutBrief(userID)
            .then(userBrief => this.setState({userBrief, loading: false}))

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user._id !== prevProps.user._id) {

            this.fetchUserBrief(this.props.user._id)
        }
    }

    updateUser = (data) => {
        return userApi.updateUserAbout(this.props.user._id, data)
            .then(userBrief => {
                topFloatNotifications.actions.push({
                    content: (
                        <p className="common-noti-layout success">
                            <i className="fal fa-check"></i>
                            <span>Cập nhật thông tin thành công</span>
                        </p>
                    )
                });
                this.setState({userBrief});
            })
    };

    render() {
        let {userBrief, loading} = this.state;
        let isOwner = this.props.user._id === userInfo.getState()._id;
        let onSaveList = () => {
            return this.fetchUserBrief(this.props.user._id)
        };
        let aboutPanels = loading ? null : createAboutPanels({
            isOwner,
            user: userBrief,
            onSave: this.updateUser,
            onSaveList,
            friendStatus: this.props.friendStatus
        });
        return (
            <div className="profile-about-route">
                <div className="white-box">
                    <div className="box-widget">
                        <div className="box-widget-header">
                            <div className="bw-route-name">
                                Giới thiệu
                            </div>
                        </div>
                        {loading ? (
                            <div style={{height: "200px", position: "relative"}}>
                                <LoadingInline/>
                            </div>
                        ) : (
                            <>
                                {aboutPanels.map((each, i) => (
                                    <AboutPanel
                                        key={i}
                                        {...each}
                                    />
                                ))}
                                <FavoritesPanel
                                    list={userBrief.favorites}
                                    isOwner={isOwner}
                                    onSaveList={onSaveList}
                                />
                            </>
                        )}

                    </div>
                </div>
            </div>
        );
    }
}

