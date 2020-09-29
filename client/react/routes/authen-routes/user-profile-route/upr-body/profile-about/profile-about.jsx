import React, {Component} from 'react';
import {createAboutPanels} from "./about-panels";
import {AboutPanel} from "./about-panel";
import {userApi} from "../../../../../../api/common/user-api";
import {LoadingInline} from "../../../../../common/loading-inline/loading-inline";
import {userInfo} from "../../../../../../common/states/common";

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
        userApi.getUserAboutBrief(userID)
            .then(userBrief => this.setState({userBrief, loading: false}))

    };

    render() {
        let {userBrief, loading} = this.state;
        let aboutPanels = loading ? null: createAboutPanels({
            isOwner: this.props.user._id === userInfo.getState()._id,
            user: userBrief
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
                        ) : aboutPanels.map((each, i) => (
                            <AboutPanel
                                key={i}
                                {...each}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

