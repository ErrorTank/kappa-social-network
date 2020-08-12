import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {LoadingInline} from "../loading-inline/loading-inline";
import {CommonModalLayout} from "../modal/common-modal-layout";

import {ThemeContext} from "../../context/theme-context";


import {createEditorStateWithText} from 'draft-js-plugins-editor';
import {CreatePostMain} from "./create-post-main/create-post-main";
import {Tooltip} from "../tooltip/tooltip";
import classnames from "classnames";
import {InputFileWrapper} from "../file-input/file-input";
import {isImageFile} from "../../../common/utils/file-upload-utils";
import {FilesDisplay} from "./files-display/files-display";
import {FileConfig} from "./file-config/file-config";
import {TagFriends} from "./tag-friends/tag-friends";
import {transformEditorState} from "../../../common/utils/editor-utils";
import {convertToRaw} from "draft-js";


export const PostPolicies = [
    {
        label: "Công khai",
        icon: <i className="fas fa-globe-asia"></i>,
        value: "PUBLIC"
    }, {
        label: "Cá nhân",
        icon: <i className="fas fa-user-lock"></i>,
        value: "PERSONAL"
    }, {
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
            files: [],
            tagged: [],
            selected: null,
            stepIndex: 0
        }

    }

    submit = () => {

    }
    getInputRawContent = () => {
        return transformEditorState(convertToRaw(this.state.editorState.getCurrentContent())).content;
    }

    addFiles = (files) => {
        let newFiles = Array.from(files).map(file => {
            return isImageFile(file.name) ? {fileID: uuidv4(), file, type: "image"} : {
                fileID: uuidv4(),
                file,
                caption: "",
            };
        });

        this.setState({files: this.state.files.concat(newFiles)});
    };


    render() {
        let {onClose,} = this.props;
        let {loading} = this.state;
        console.log(this.state.files)

        let steps = [
            {
                title: "Tạo bài đăng",
                actions: [{
                    className: "btn-post btn-block",
                    onClick: this.submit,
                    content: "Đăng",
                    disabled: !this.getInputRawContent() && !this.state.files.length
                }],

                component: (
                    <CreatePostMain
                        {...this.state}
                        onChange={data => this.setState({...data})}
                    />
                )
            }, {
                title: "Ảnh và videos",
                onBack: () => this.setState({stepIndex: 0}),
                actions: [{
                    className: "btn-add-more",
                    onClick: () => this.upload.click(),
                    content: "Thêm ảnh/videos",
                }, {
                    className: "btn-done",
                    onClick: () => this.setState({stepIndex: 0}),
                    content: "Xong",

                }],
                component: (
                    <FilesDisplay
                        files={this.state.files}
                        onChangeFiles={files => this.setState({files})}
                        onSelect={(file) => this.setState({selected: file})}
                    />
                )
            }, {
                title: "Chi tiết ảnh",
                onBack: () => this.setState({stepIndex: 1}),
                actions: [{
                    className: "btn-done",
                    onClick: (file) => {
                        let newFiles = [...this.state.files];
                        newFiles.splice(newFiles.findIndex(each => each.fileID === file.fileID), 1, file);
                        this.setState({files: newFiles, stepIndex: 1})
                    },
                    content: "Lưu",


                }],
                component: (
                    <FileConfig
                        file={this.state.selected}
                    />
                )
            },{
                title: "Tag bạn bè",
                actions: [],
                onBack: () => this.setState({stepIndex: 0}),
                component: (
                    <TagFriends
                        tagged={this.state.tagged}
                        onTag={newTag => this.setState({tagged: this.state.tagged.concat(newTag)})}
                    />
                )
            }
        ]

        let {title, actions, component, onBack} = steps[this.state.stepIndex];

        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className="create-post-modal"
                        onClose={onClose}
                        title={(
                            <>
                                {onBack && (
                                    <div className="back-wrapper">
                                        <Tooltip
                                            position={"top"}
                                            text={() => "Trở lại"}
                                            className={"d-none"}
                                        >
                                            <button className="btn btn-back" onClick={onBack}>

                                            </button>

                                        </Tooltip>
                                    </div>
                                )}
                                <span style={{marginLeft: onBack ? "15px" : "0"}}>{title}</span>
                            </>
                        )

                        }
                        actions={actions}
                    >

                        <>

                            {component}
                            <InputFileWrapper
                                multiple={true}
                                accept={"image/*,image/heif,image/heic,video/*"}
                                onUploaded={this.addFiles}
                                limitSize={10 * 1024 * 1024}
                            >
                                {({onClick}) => (
                                    <Tooltip
                                        position={"top"}
                                        text={() => ""}
                                        className={"d-none"}
                                    >
                                        <div style={{display: "none"}} ref={upload => this.upload = upload} onClick={onClick}/>

                                    </Tooltip>
                                )}
                            </InputFileWrapper>
                        </>
                    </CommonModalLayout>
                )}
            </ThemeContext.Consumer>
        );
    }
}


