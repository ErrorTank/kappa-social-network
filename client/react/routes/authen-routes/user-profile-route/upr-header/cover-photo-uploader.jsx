import React, {Component} from 'react';
import {InputFileWrapper} from "../../../../common/file-input/file-input";
import {getBase64Image} from "../../../../../common/utils/file-upload-utils";
import {v4 as uuidv4} from 'uuid';
import {Button} from "../../../../common/button/button";
import {postApi} from "../../../../../api/common/post-api";
import {userApi} from "../../../../../api/common/user-api";
import {userInfo} from "../../../../../common/states/common";

export class CoverPhotoUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: props.user.cover_photo,
            file: null,
            loading: false,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user._id !== this.props.user._id){
            this.setState({
                file: null,
                loading: false,
                imgSrc: this.props.user.cover_photo
            })
        }
    }

    addCoverPhoto = (file) => {
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

    saveCoverPhoto = () => {
        let {file} = this.state;
        this.setState({loading: true});
        postApi.preUploadMedia({file: file.file,  }, "file")
            .then((fileData) => {
                return userApi.updateUser(this.props.user._id, {
                    cover_photo: fileData.path
                })

            })
            .then((user) => {
                this.setState({
                    imgSrc: user.cover_photo,
                    loading: false,
                    file: null
                })

            })
    }

    render() {
        let {file, imgSrc, loading} = this.state;
        let {isOwner} = this.props;
        return (
            <div className="cover-photo-uploader">
                <div className="cpu-container">
                    {imgSrc && (
                        <img src={imgSrc}/>
                    )}

                    {file && (
                        <>
                            <div className="cancel-wrapper" onClick={this.cancelUpload}>
                                <i className="far fa-times" ></i>
                            </div>
                            <div className="upload-actions">
                                <InputFileWrapper
                                    multiple={false}
                                    accept={"image/*,image/heif,image/heic"}
                                    onUploaded={this.addCoverPhoto}
                                    limitSize={10 * 1024 * 1024}
                                >
                                    {({onClick}) => (
                                        <Button className="btn-grey" onClick={onClick}>
                                            <i className="fas fa-arrow-alt-up"></i> Tải lại
                                        </Button>
                                    )}

                                </InputFileWrapper>
                                <Button className="btn-common-primary ml-3" onClick={this.saveCoverPhoto} loading={loading}>
                                    <i className="fas fa-save"></i>Cập nhật
                                </Button>
                            </div>
                        </>
                    )}
                    {(!file && isOwner) && (
                        <InputFileWrapper
                            multiple={false}
                            accept={"image/*,image/heif,image/heic"}
                            onUploaded={this.addCoverPhoto}
                            limitSize={10 * 1024 * 1024}
                        >
                            {({onClick}) => (
                                <div className="upload-btn" onClick={onClick}>
                                    <i className="fas fa-camera"></i> Cập nhật ảnh nền
                                </div>
                            )}

                        </InputFileWrapper>
                    )}
                </div>
            </div>
        );
    }
}

