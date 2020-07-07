
import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {LoadingInline} from "../loading-inline/loading-inline";
import {CommonModalLayout} from "../modal/common-modal-layout";
import {chatApi} from "../../../api/common/chat-api";
import {ThemeContext} from "../../context/theme-context";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {Avatar} from "../avatar/avatar";

export const nicknameEditModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <NicknameEditModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
}

class NicknameEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            users: []
        }
        chatApi.getChatRoomUserNicknames(props.chatRoomID)
            .then((users) => {
                this.setState({users, loading: false})
            })
    }



    render() {
        let {onClose,} = this.props;
        let {users, loading} = this.state;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className="nickname-edit-modal"
                        onClose={onClose}
                        title={"Cài đặt biệt danh"}

                    >

                        {loading ? (
                            <div className="loading-panel">
                                {[1,2].map((each) => (
                                    <div className="loading-holder" key={each}>
                                        <div >
                                            <SkeletonTheme color={darkMode ? "#242526" : "#e3e3e3"} highlightColor={darkMode ? "#333436" : "#ebebeb"}>
                                                <Skeleton count={1} height={40} width={40} duration={1} circle={true}/>
                                            </SkeletonTheme>
                                        </div>
                                        <div className="ml-3">
                                            <SkeletonTheme color={darkMode ? "#242526" : "#e3e3e3"} highlightColor={darkMode ? "#333436" : "#ebebeb"}>
                                                <Skeleton count={1} height={20} width={200} duration={1}/>
                                            </SkeletonTheme>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="user-nickname-list">
                                {users.map((each) => (
                                    <div className="user-row" key={each.related._id}>
                                        <div className="left-panel">
                                            <div className="user-info">
                                                <Avatar
                                                    user={each.related}
                                                />
                                                <div className="names">
                                                    <div className="name">{each.related.basic_info.username}</div>
                                                    {each.nickname && (
                                                        <div className="nickname">{each.nickname}</div>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                        <div className="right-panel">
                                            <button className="btn btn-cancel edit-nickname-btn"></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}


                    </CommonModalLayout>
                )}
            </ThemeContext.Consumer>
        );
    }
}
