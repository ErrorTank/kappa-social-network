import React, {Component} from 'react';
import {customHistory} from "../../../routes";
import classnames from "classnames"
import {NavLink} from "react-router-dom";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {v4 as uuidv4} from 'uuid';
import {Dropdownable} from "../../../../common/dropdownable/dropdownable";

export const USER_FRIEND_RELATION = {
    FRIEND: "FRIEND",
    NOT_FRIEND: "NOT_FRIEND",
    PENDING: "PENDING"
}

export class ProfileNavigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendsCount: 0,

        }

        this.getFriendsCount(props.user._id);

    }

    sendFriendRequest = (userID) => {
        return userApi.sendFriendRequest(userInfo.getState()._id, userID)
            .then(() => {
                this.props.onSentFriendRequest();
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user._id !== this.props.user._id) {
            this.getFriendsCount(this.props.user._id);

        }
    }


    getFriendsCount = (userID) => {
        userApi.getUserFriendsCount(userID).then(({count}) => this.setState({friendsCount: count}));
    };

    handleUnfriend = () => {
        userApi.unfriend(userInfo.getState()._id, this.props.user._id)
            .then(() => {
                this.props.onUnfriend();
            })
    }

    cancelFriendRequest = () => {

        userApi.cancelFriendRequest(userInfo.getState()._id, this.props.user._id)
            .then(() =>  this.props.onCancelRequest())
    }

    render() {
        let {friendsCount,} = this.state;
        let {isOwner, friendStatus} = this.props;
        let navigators = [
            {
                label: "Dòng thời gian",
                url: `/user/${this.props.user._id}`,

            }, {
                label: "Giới thiệu",
                url: `/user/${this.props.user._id}/about`,
            }, {
                label: <span>Bạn bè <span className="sub">{friendsCount}</span></span>,
                url: `/user/${this.props.user._id}/friends`,
            }, {
                label: "Ảnh",
                url: `/user/${this.props.user._id}/photos`,

            }, {
                label: "Videos",
                url: `/user/${this.props.user._id}/videos`,
            },
        ];

        let actions = [{
            label: (
                <span>
                    <i className="fas fa-user-cog"></i> Cài đặt
                </span>
            ),
            condition: isOwner
        }, {
            label: (
                <span>
                        <i className={"fas fa-comment"}></i> Nhắn tin
                    </span>
            ),
            condition: !isOwner && friendStatus === USER_FRIEND_RELATION.FRIEND
        }, {
            label: (
                <span>
                        <i className="fas fa-user-check"></i>
                    </span>
            ),
            condition: !isOwner && friendStatus === USER_FRIEND_RELATION.FRIEND,
            dropdownItems: [
                {
                    label: "Hủy kết bạn",
                    icon: <i className="fas fa-user-times"></i>,
                    onClick: this.handleUnfriend
                },

            ]
        }, {
            label: (
                <span>
                        <i className="fas fa-user-plus"></i> Kết bạn
                    </span>
            ),
            condition: !isOwner && friendStatus === USER_FRIEND_RELATION.NOT_FRIEND,
            onClick: () => this.sendFriendRequest(this.props.user._id)
        }, {
            label: (
                <span>
                        <i className="fas fa-user-check"></i> Đã gửi lời mời
                    </span>
            ),
            condition: !isOwner && friendStatus === USER_FRIEND_RELATION.PENDING,
            dropdownItems: [
                {
                    label: "Hủy yêu cầu",
                    icon: <i className="fas fa-user-times"></i>,
                    onClick: this.cancelFriendRequest
                }
            ]
        }, {
            label: (
                <span>
                        <i className="fas fa-user-lock"></i> Chặn
                    </span>
            ),
            condition: !isOwner
        }
        ]

        return (
            <div className="profile-navigators">
                <div className="navigators">
                    {navigators.map(each => (
                        <NavLink exact={true} key={each.url} to={each.url} activeClassName={"active"}>
                            <div className="navigator">
                                {each.label}
                            </div>
                        </NavLink>

                    ))}
                </div>
                <div className="profile-actions">
                    {actions.map(each => each.condition ? each.dropdownItems ? (
                        <Dropdownable
                            position={"center"}
                            className={"pa-dropdown"}
                            key={uuidv4()}
                            toggle={() => (
                                <div className="action btn btn-grey">
                                    {each.label}
                                </div>

                            )}
                            content={() => (
                                <div className={"pa-dropdown-content common-dropdown-content"}>
                                    {each.dropdownItems.map((each, i) => (
                                        <div className="content" onClick={each.onClick} key={i}>
                                            <div className="icon-wrapper">
                                                {each.icon}
                                            </div>
                                            <div className="label">{each.label}</div>

                                        </div>
                                    ))}
                                </div>

                            )}
                        />
                    ) : (
                        <div className="action btn btn-grey" key={uuidv4()} onClick={each.onClick}>
                            {each.label}
                        </div>
                    ) : null)}

                </div>


            </div>
        );
    }
}
