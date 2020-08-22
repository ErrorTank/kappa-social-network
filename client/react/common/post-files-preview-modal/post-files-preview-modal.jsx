import React, {Component, Fragment} from 'react';
import {modals} from "../modal/modals";
import {BlurImgWrapper} from "../blur-img-wrapper/blur-img-wrapper";
import classnames from "classnames"
import {ImgTaggedMap} from "../img-tagged-map/img-tagged-map";
import {Avatar} from "../avatar/avatar";
import {PostPolicies} from "../create-post-modal/create-post-modal";
import moment from "moment";
import {Button} from "../button/button";

export const postFilesPreviewModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <PostFilesPreviewModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),

        })
        return modal.result;
    }
}

class PostFilesPreviewModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusFileID: props.focusFileID,
            editMode: false,
            highLightTag: null,
            updating: false
        }
    }

    submit = () => {
        this.setState({updating: true})
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(this.state.focusFileID !== prevState.focusFileID){
    //
    //     }
    // }

    render() {
        let {focusFileID, editMode, highLightTag, updating} = this.state;
        let {post} = this.props;
        let {files} = post;
        let currentFile = files.find(each => each._id === focusFileID);
        // console.log(currentFile)
        let currentFileIndex = files.findIndex(each => each._id === focusFileID)
        return (
            <div className="post-files-preview-modal">
                <div className="file-panel">
                    {files.length > 1 && (
                        <>
                            <div className="img-slider-action left" onClick={() => this.setState({focusFileID: currentFileIndex === 0 ? files[files.length - 1]._id : files[currentFileIndex - 1]._id})}>
                                <i className="far fa-chevron-left"></i>
                            </div>
                            <div className="img-slider-action right" onClick={() => this.setState({focusFileID: currentFileIndex === files.length - 1 ? files[0]._id : files[currentFileIndex + 1]._id})}>
                                <i className="far fa-chevron-right"></i>
                            </div>
                        </>
                    )}
                    <BlurImgWrapper
                        imgSrc={currentFile.path}
                        className={"blur-container"}
                    />
                    <div className="file-container">
                        {!editMode ? (
                            <ImgTaggedMap
                                isHighLight={each => {
                                    // console.log(each._id === highLightTag)
                                    return each._id === highLightTag
                                }}
                                tagged={currentFile.tagged}
                                imgSrc={currentFile.path}
                                renderTag={each => each.related.basic_info.username}
                            />
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                    {!editMode && (
                        <div className="img-picker">
                            {files.map(each => (
                                <div className={classnames("img-wrapper", {active: each._id === focusFileID})} key={each._id} onClick={() => this.setState({focusFileID: each._id})}>
                                    <img src={each.path}/>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
                <div className="describe-panel">
                    <div className="dp-header">
                        <div className="avatar-wrapper">
                            <Avatar
                                user={post.belonged_person}
                            />
                        </div>
                        <div className="post-meta-data">
                            <div className="upper">
                                {post.belonged_person.basic_info.username}
                            </div>

                            <div className="timer">
                                <span className="policy">{PostPolicies.find(each => each.value === post.policy).icon}</span> - <span className="last-active">{moment(post.created_at).fromNow()}</span>
                            </div>
                        </div>

                    </div>
                    <div className="dp-body">
                        <div className="post-caption">
                            {currentFile.caption}
                        </div>
                        <div className="dp-tagged">
                            {!!currentFile.tagged.length && (
                                <span>- Cùng với {currentFile.tagged.map((each, i) => <Fragment key={each._id}><a className="link" onMouseLeave={() => this.setState({highLightTag: null})} onMouseEnter={() => this.setState({highLightTag: each._id})}>{each.related.basic_info.username}</a>{i === currentFile.tagged.length - 2 && " và "}{i < currentFile.tagged.length - 2 && ", "}</Fragment>)}</span>
                            )}
                        </div>
                    </div>
                    <div className="dp-footer">
                        <div className="edit-action">
                            {editMode ? (
                                <>
                                    <Button className="btn btn-save btn-common-primary" loading={updating} onClick={this.submit}><i className="fas fa-save"></i> Lưu</Button>
                                    <Button className="btn btn-cancel" onClick={() => this.setState({editMode: false})}>Hủy</Button>
                                </>
                            ) : (
                                <Button className="btn btn-block btn-common-primary" onClick={() => this.setState({editMode: true})}><i className="far fa-edit"></i> Chỉnh sửa</Button>
                            )}

                        </div>

                    </div>

                </div>
            </div>
        );
    }
}
