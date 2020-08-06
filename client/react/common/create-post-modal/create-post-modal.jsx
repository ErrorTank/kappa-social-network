
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
import {userInfo} from "../../../common/states/common";
import {Select} from "../select/select";

// export const PostPolicy = {
//     PUBLIC: "PUBLIC",
//     PERSONAL: "PERSONAL",
//     FRIENDS: "FRIENDS"
// }

export const PostPolicies = [
    {
        label: "Công khai",
        icon: <i className="fas fa-globe-asia"></i>,
        value: "PUBLIC"
    },{
        label: "Cá nhân",
        icon: <i className="fas fa-user-lock"></i>,
        value: "PERSONAL"
    },{
        label: "Bạn bè",
        icon: <i className="fas fa-user-friends"></i>,
        value: "FRIENDS"
    },
]

export const createPostModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <CreatePostModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
}

class CreatePostModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            content: "",
            policy: PostPolicies[0]
        }

    }

    post = () => {

    }

    render() {
        let {onClose,} = this.props;
        let {loading, policy} = this.state;
        let user = userInfo.getState();
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className="create-post-modal"
                        onClose={onClose}
                        title={"Tạo bài đăng"}
                        actions={[ {
                            className: "btn-cancel btn-block",
                            onClick: this.post,
                            content: "Đăng",
                        }]}
                    >

                        <div className="cpm-wrapper">
                            <div className="cpm-header">
                                <div className="avatar-wrapper">
                                    <Avatar
                                        user={user}
                                    />
                                </div>
                                <div className="right-panel">
                                    <div className="username">{user.basic_info.username}</div>
                                    <div className="action">
                                        <Select
                                            className={"policy-picker"}
                                            options={PostPolicies}
                                            value={policy}
                                            onChange={policy => {
                                                this.setState({policy});
                                            }}
                                            displayAs={value => (
                                                <div className="post-policy">
                                                    <span>{value.icon}</span>
                                                    <span>{value.label}</span>
                                                </div>
                                            )}
                                            isSelected={option => option.value === policy.value}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


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

