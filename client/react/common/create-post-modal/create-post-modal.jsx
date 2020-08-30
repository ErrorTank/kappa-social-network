import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {LoadingInline} from "../loading-inline/loading-inline";
import {CommonModalLayout} from "../modal/common-modal-layout";

import {ThemeContext} from "../../context/theme-context";

import {v4 as uuidv4} from 'uuid';
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
import {mergeArray} from "../../../common/utils/array-utils";
import {postApi} from "../../../api/common/post-api";


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

export const PostPoliciesMAP = {
    PUBLIC: "PUBLIC",
    PERSONAL: "PERSONAL",
    FRIENDS: "FRIENDS"

}

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
            loading: false,
            content: "",
            policy: props.data?.policy || PostPolicies[0],
            editorState: props.data?.editorState || createEditorStateWithText(""),
            files: props.data?.files || [],
            tagged: props.data?.tagged || [],
            selected: null,
            stepIndex: 0,
            comment_disabled: props.data?.comment_disabled || false,
            block_share: props.data?.block_share || false
        }

    }

    uploadSingleFile = (file) => {
        return postApi.preUploadMedia({file: file.file}, "file")
            .then(fileData => ({
                caption: file.caption || "",
                tagged: file.tagged ? file.tagged.map(each => ({...each, related: each.related._id})) : [],
                ...fileData
            }))
    }

    submit = () => {
        let {policy, editorState, files, tagged, comment_disabled, block_share} =  this.state;
        this.setState({loading: true});
        Promise.all(files.map(each => this.uploadSingleFile(each)))
            .then(newFiles => {
                let submittedData = {
                    comment_disabled,
                    block_share,
                    policy: policy.value,
                    files: newFiles,
                    tagged: tagged.map(each => each._id),
                    ...transformEditorState(convertToRaw(editorState.getCurrentContent()))
                };

                // console.log(submittedData)
                postApi.createNewPost(submittedData)
                    .then(data => this.props.onClose(data))
            })

    };
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
        let {onClose, isEdit} = this.props;
        let {loading} = this.state;

        let steps = [
            {
                title: isEdit ? "Cập nhật bài đăng" :"Tạo bài đăng",
                actions: [{
                    className: "btn-post btn-block",
                    onClick: this.submit,
                    content: isEdit ? "Cập nhật" :"Đăng",
                    disabled: !this.getInputRawContent() && !this.state.files.length,
                    loading
                }],

                component: (
                    <CreatePostMain
                        {...this.state}
                        onChange={data => this.setState({...data})}
                        openTagFriendTab={() => this.setState({stepIndex: 3})}
                        toFilesTab={() => {
                            this.state.files.length === 1 ? this.setState({stepIndex: 2, selected: this.state.files[0]}) :this.setState({stepIndex: 1})
                        }}
                    />
                )
            }, {
                title: "Ảnh và videos",
                onBack: () => this.setState({stepIndex: 0}),
                actions: [{
                    className: "btn-outline-primary",
                    onClick: () => this.upload.click(),
                    content: "Thêm ảnh/videos",
                }, {
                    className: "btn-post",
                    onClick: () => this.setState({stepIndex: 0}),
                    content: "Xong",

                }],
                component: (
                    <FilesDisplay
                        files={this.state.files}
                        onChangeFiles={files => this.setState({files})}
                        onSelect={(file) => this.setState({selected: file, stepIndex: 2})}
                        onRemove={file => {
                            let newFiles = this.state.files.filter(each => each.fileID !== file.fileID);
                            this.setState({files: newFiles, stepIndex: newFiles.length ? 1 : 0})
                        }}
                    />
                )
            }, {
                title: "Chi tiết ảnh",
                onBack: () => this.setState({stepIndex: this.state.files.length === 1 ? 0 : 1}),
                actions: [{
                    className: "btn-post",
                    onClick: () => {
                        this.fileConf.save();
                    },
                    content: "Lưu",


                }],
                component: (
                    <FileConfig
                        ref={fileConf => this.fileConf = fileConf}
                        file={this.state.selected}
                        onChange={file => {
                            let newFiles = [...this.state.files];
                            newFiles.splice(newFiles.findIndex(each => each.fileID === file.fileID), 1, file);
                            this.setState({files: newFiles, stepIndex: newFiles.length === 1 ? 0 : 1})
                            let newTagged = mergeArray(this.state.tagged, file.tagged.map(each => each.related), (item1, item2) => item1._id === item2._id);
                            this.setState({tagged: newTagged})
                        }}
                    />
                )
            },{
                title: "Tag bạn bè",
                actions: [{
                    className: "btn-post",
                    onClick: () => {

                        this.setState({stepIndex: 0})
                    },
                    content: "Xong",


                }],
                onBack: () => this.setState({stepIndex: 0}),
                component: (
                    <TagFriends
                        tagged={this.state.tagged}
                        onTag={tagged => this.setState({tagged})}
                    />
                )
            }
        ]

        let {title, actions, component, onBack} = steps[this.state.stepIndex];

        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className={classnames("create-post-modal", {expand: this.state.stepIndex === 2, "no-padding": this.state.stepIndex === 1})}
                        onClose={onClose}
                        title={(
                            <>
                                {onBack && (
                                    <div className="back-wrapper" onClick={onBack}>
                                        <i className="far fa-long-arrow-alt-left"></i>
                                    </div>
                                )}
                                <span style={{marginLeft: onBack ? "10px" : "0"}}>{title}</span>
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


