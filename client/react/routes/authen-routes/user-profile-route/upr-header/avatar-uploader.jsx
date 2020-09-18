import React, {Component} from 'react';
import {Avatar} from "../../../../common/avatar/avatar";
import {InputFileWrapper} from "../../../../common/file-input/file-input";
import {getBase64Image} from "../../../../../common/utils/file-upload-utils";
import {v4 as uuidv4} from 'uuid';
import {Button} from "../../../../common/button/button";
import {userApi} from "../../../../../api/common/user-api";
import {utilityApi} from "../../../../../api/common/utilities-api";
import {postApi} from "../../../../../api/common/post-api";
import {userInfo} from "../../../../../common/states/common";

export class AvatarUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: props.user.avatar,
            file: null,
            loading: false
        }
    }

    addAvatar = (file) => {
        getBase64Image(file).then(imgSrc => {
            this.setState({
                file: {fileID: uuidv4(), file},
                imgSrc
            })
        })

    }

    cancelUpload = () => {
        this.setState({
            imgSrc: this.props.user.avatar,
            file: null
        })
    }

    saveAvatar = () => {
        let {file} = this.state;
        this.setState({loading: true});
        postApi.preUploadMedia({file: file.file,  }, "file")
            .then((fileData) => {
                return userApi.updateUser({
                    avatar: fileData.path
                })

            })
            .then((user) => {
                this.setState({
                    imgSrc: user.avatar,
                    loading: false,
                })
                userInfo.setState(user)
            })

    }

    render() {
        let {file, imgSrc, loading} = this.state;
        let {user, isOwner} = this.props;
        return (
            <div className="avatar-uploader">
                <div className="au-container">
                    <div className="avatar-wrapper">
                        {imgSrc ? (
                            <img src={imgSrc}/>
                        ) : (
                            <Avatar
                                user={user}
                            />
                        )}

                    </div>
                    {!file && isOwner && (
                        <InputFileWrapper
                            multiple={false}
                            accept={"image/*,image/heif,image/heic"}
                            onUploaded={this.addAvatar}
                            limitSize={10 * 1024 * 1024}
                        >
                            {({onClick}) => (
                                <div className="upload-btn" onClick={onClick}>
                                    <i className="fas fa-camera"></i>
                                </div>
                            )}

                        </InputFileWrapper>
                    )}
                    {(file && isOwner) && (
                        <>
                        <InputFileWrapper
                            multiple={false}
                            accept={"image/*,image/heif,image/heic"}
                            onUploaded={this.addAvatar}
                            limitSize={10 * 1024 * 1024}
                        >
                            {({onClick}) => (
                                <div className="upload-overlay" onClick={onClick}>
                                    Tải lại
                                </div>
                            )}
                        </InputFileWrapper>
                            <div className="cancel-wrapper">
                                <i className="far fa-times" onClick={this.cancelUpload}></i>
                            </div>
                            <div className="upload-actions">
                                <Button className="btn-common-primary" onClick={this.saveAvatar} loading={loading}>
                                    <i className="fas fa-save"></i> Lưu
                                </Button>
                            </div>
                        </>

                    )}
                </div>

            </div>
        );
    }
}
