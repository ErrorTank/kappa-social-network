
import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {LoadingInline} from "../loading-inline/loading-inline";
import {CommonModalLayout} from "../modal/common-modal-layout";
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import {ThemeContext} from "../../context/theme-context";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {Avatar} from "../avatar/avatar";
import {CommonInput} from "../common-input/common-input";
import {Tooltip} from "../tooltip/tooltip";
import {Button} from "../button/button";
import {userInfo} from "../../../common/states/common";
import {Select} from "../select/select";
import createMentionPlugin from "draft-js-mention-plugin";
import classnames from "classnames";
import {ClickOutside} from "../click-outside/click-outside";
import {emojiPlugin} from "../../layout/authen-layout/create-message-widget/chat-box/message-utilities/chat-input/chat-input";
import {transformEditorState} from "../../../common/utils/editor-utils";
import {convertToRaw} from "draft-js";
import isNil from "lodash/isNil";


// export const PostPolicy = {
//     PUBLIC: "PUBLIC",
//     PERSONAL: "PERSONAL",
//     FRIENDS: "FRIENDS"
// }
const {Picker} = emojiPlugin;

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
            policy: PostPolicies[0],
            editorState: createEditorStateWithText(""),
            suggestions: [],
            loadSuggestion: true,
            showEmojiPicker: false,
            filteredSuggestions: [],
        }
        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            supportWhitespace: true,
            positionSuggestions: () => ({}),
            mentionPrefix: "@",
            mentions: [],
            mentionComponent: (mentionProps) => {
                return (
                    <span className={classnames("create-post-mention", mentionProps.className)}>
          {mentionProps.children}
        </span>
                )
            },
        });
    }

    onChange = (editorState) => {


        let nextState = {
            editorState
        };
        if (this.state.showEmojiPicker) {
            nextState.showEmojiPicker = false;
        }


        this.setState(nextState);
    };

    onSearchChange = ({value}) => {
        this.setState({filteredSuggestions: this.filterSuggestions(this.state.suggestions, value)});
    }

    post = () => {

    }

    focus = () => {
        this.editor.focus();
    };

    uploadMedia = () => {

    }

    uploadFile = () => {

    }

    tagFriends = () => {

    }

    render() {
        let {onClose,} = this.props;
        let {loading, policy} = this.state;
        let user = userInfo.getState();
        const {MentionSuggestions} = this.mentionPlugin;

        let plugins = [emojiPlugin];
        plugins.push(this.mentionPlugin);
        let actions = [
            {
                icon: <i className="far fa-photo-video"></i>,
                label: "Ảnh/Video",
                onClick: this.uploadMedia,
                className: "media"
            },{
                icon: <i className="far fa-paperclip"></i>,
                label: "Đính kèm",
                onClick: this.uploadFile,
                className: "file"
            }, {
                icon: <i className="fas fa-user-tag"></i>,
                label: "Tag bạn bè",
                onClick: this.tagFriends,
                className: "tag"

            }
        ]
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className="create-post-modal"
                        onClose={onClose}
                        title={"Tạo bài đăng"}
                        actions={[ {
                            className: "btn-post btn-block",
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
                            <div className="cpm-body">
                                <div className="cpm-input-wrapper">
                                    <ClickOutside onClickOut={() => this.setState({showEmojiPicker: false})}>
                                        <div>
                                            <div className="cpm-input" onClick={this.focus}>
                                                <div>
                                                    <Editor
                                                        editorState={this.state.editorState}
                                                        onChange={this.onChange}
                                                        plugins={plugins}
                                                        ref={(element) => {
                                                            this.editor = element;
                                                        }}
                                                        placeholder={`Hôm nay bạn nghĩ gì, ${user.basic_info.username}?`}

                                                    />
                                                    <MentionSuggestions
                                                        onSearchChange={this.onSearchChange}
                                                        suggestions={this.state.filteredSuggestions}
                                                        popoverComponent={<MentionPopover/>}
                                                        entryComponent={MentionEntry}
                                                    />
                                                </div>



                                            </div>
                                            <div className={"emoji-select"} onClick={(e) => {
                                                e.stopPropagation();
                                                this.setState({showEmojiPicker: !this.state.showEmojiPicker})
                                            }}>
                                                <i className="fal fa-smile"></i>
                                            </div>
                                            {this.state.showEmojiPicker && (
                                                <div className={"emoji-picker"}>
                                                    <Picker
                                                        perLine={7}
                                                        showPreview={false}
                                                        autoFocus={true}
                                                    />
                                                </div>

                                            )}
                                        </div>
                                    </ClickOutside>
                                </div>
                                <div className="actions-bar">
                                    <div className="bar-title">
                                        Thêm vào bài đăng
                                    </div>
                                    <div className="actions">
                                        {actions.map(each => (
                                            <Tooltip
                                                key={each.label}
                                                position={"top"}
                                                text={() => each.label}
                                            >
                                                <div className={classnames("action", each.className)}>
                                                    {each.icon}
                                                </div>
                                            </Tooltip>
                                        ))}
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



class MentionPopover extends React.Component {
    render() {

        return (
            <div className={classnames("cpm-mention-popover")} id={this.props.id} role={"list-box"}>
                {this.props.children}
            </div>
        )
    }
}

const MentionEntry = props => {

    const {
        mention,
        theme,
        searchValue,
        isFocused,
        className,
        ...parentProps
    } = props;

    return (

        <div className={classnames("cpm-entry")} {...parentProps} >
            <div className="content-wrapper">
                <Avatar user={mention}/>
                <div className="user-info">
                    <div className="username">
                        {mention.basic_info.username}
                    </div>
                    {mention.nickname && (
                        <div className="nickname">
                            {mention.nickname}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}