
import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {LoadingInline} from "../loading-inline/loading-inline";
import {CommonModalLayout} from "../modal/common-modal-layout";
import {chatApi} from "../../../api/common/chat-api";
import {ThemeContext} from "../../context/theme-context";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {Avatar} from "../avatar/avatar";
import {CommonInput} from "../common-input/common-input";
import {Tooltip} from "../tooltip/tooltip";
import {Button} from "../button/button";

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

    saveNickname = (userID, newNickname) => {
        return chatApi.changeUserNickname(this.props.chatRoomID, userID, newNickname)
            .then((users) => {
                this.setState({users})

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
                        actions={[ {
                            className: "btn-cancel",
                            onClick: onClose,
                            content: "Đóng"
                        }]}
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
                                    <NicknameRow
                                        key={each.related._id}
                                        info={each}
                                        onChange={(value) => this.saveNickname(each.related._id, value)}
                                    />
                                ))}
                            </div>
                        )}


                    </CommonModalLayout>
                )}
            </ThemeContext.Consumer>
        );
    }
}



class NicknameRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.info.nickname || "",
            showInput: false,
            saving: false
        };
    };

    setNickname = () => {
        if(this.state.value.trim() === (this.props.info.nickname || "").trim()){

            this.setState({showInput: false});
            return;
        }
        this.setState({saving: true});
        this.props.onChange(this.state.value.trim()).then(() => {
            this.setState({showInput: false, saving: false, value: this.state.value.trim()})
        })
    }

    render() {
        let {info} = this.props;
        return (
            <div className="user-row" >
                <div className="left-panel">
                    <div className="user-info">
                        <Avatar
                            user={info.related}
                        />
                        <div className="names">
                            <div className="name">{info.related.basic_info.username}</div>
                            {info.nickname && (
                                <div className="nickname">{info.nickname}</div>
                            )}

                        </div>

                    </div>
                </div>
                <div className="right-panel">
                    {this.state.showInput ? (
                        <div className="nickname-input-wrapper">
                            <CommonInput
                                type={"text"}
                                className={"nickname-input"}
                                value={this.state.value || ""}
                                placeholder={info.related.basic_info.username}
                                onChange={e => this.setState({value: e.target.value})}
                            />
                            <Tooltip
                                text={() => "Hủy bỏ"}
                            >
                                <button className="btn action-btn cancel" onClick={() => this.setState({value: this.props.info.nickname || "", showInput: false})}><i className="far fa-times"></i></button>
                            </Tooltip>
                            <Tooltip
                                text={() => "Lưu biệt danh"}
                            >
                                <Button className="btn action-btn save"  disabled={this.state.saving} loading={this.state.saving} onClick={this.setNickname}><i className="far fa-check"></i></Button>
                            </Tooltip>


                        </div>
                    ) : (
                        <Button className="btn edit-nickname-btn" onClick={() => this.setState({showInput: true})}><i className="far fa-pen"></i> Đặt biệt danh</Button>
                    )}

                </div>
            </div>
        );
    }
}

