import React, {Component, Fragment} from 'react';
import {modals} from "../modal/modals";
import {BlurImgWrapper} from "../blur-img-wrapper/blur-img-wrapper";
import classnames from "classnames"
import {ImgTaggedMap} from "../img-tagged-map/img-tagged-map";
import {Avatar} from "../avatar/avatar";
import {PostPolicies} from "../create-post-modal/create-post-modal";
import moment from "moment";
import {Button} from "../button/button";
import {utilityApi} from "../../../api/common/utilities-api";
import {ImageTagWrapper} from "../image-tag-wrapper/image-tag-wrapper";
import {getBase64ImageFromUrl, getFileBlobFromUrl} from "../../../common/utils/file-upload-utils";
import {postApi} from "../../../api/common/post-api";
import {mergeArray} from "../../../common/utils/array-utils";
import {CommonInput} from "../common-input/common-input";
import {postFilesDetectionsCache} from "../../../common/cache/files-cache";
import {Link} from "react-router-dom";


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
            updating: false,
            updatedFile: null,
            detections: [],
            post: {...props.post}
        }
    }

    submit = () => {
        let {onChangePost} = this.props;
        this.setState({updating: true})
        let {updatedFile, post} = this.state;
        let {files} = post;
        let newFiles = [...files];
        let index = newFiles.findIndex(each => each._id === updatedFile._id);
        let newTagged = mergeArray(post.tagged, updatedFile.tagged.map(each => each.related), (item1, item2) => item1._id === item2._id);
        newFiles.splice(index, 1, updatedFile);

        postApi.updatePost(post._id, {tagged: newTagged.map(each => each._id) ,files: newFiles.map(each => ({...each, tagged: each.tagged.map(t => ({...t, related: t.related._id}))}))})
            .then(updated => {

                this.setState({post: updated , editMode: false, updatedFile: null, detections: [], updating: false}, () => {
                    onChangePost(updated);
                })
            })
        // postApi.updatePostFiles({postID: post._id, fileID: updatedFile._id, file: {...updatedFile, tagged: updatedFile.tagged.map(each => ({...each, related: each.related._id}))}})

    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if(this.state.focusFileID !== prevState.focusFileID){
    //
    //     }
    // }

    render() {
        let {focusFileID, editMode, highLightTag, updating, updatedFile, detections, post} = this.state;

        let {files} = post;
        let currentFile = files.find(each => each._id === focusFileID);
        console.log(currentFile)
        let currentFileIndex = files.findIndex(each => each._id === focusFileID)
        return (
            <div className="post-files-preview-modal">
                <div className="file-panel">
                    <div className="img-slider-action close-btn" onClick={() => this.props.onClose()}>
                        <i className="fal fa-times"></i>
                    </div>
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
                            <ImageTagWrapper
                                maxWidth={700}
                                maxHeight={500}
                                file={updatedFile.path}
                                imgSrc={updatedFile.path}
                                tagged={updatedFile.tagged}
                                className={"image-wrapper"}
                                api={({keyword}) => utilityApi.searchFriends(keyword)}
                                isTagged={user => updatedFile.tagged.find(item => item.related._id === user._id)}
                                onSelect={(data) => {
                                    this.setState({updatedFile: {...updatedFile, tagged: updatedFile.tagged.concat(data)}})
                                }}
                                detections={detections}
                                onRemove={tag => this.setState({updatedFile: {...updatedFile, tagged: updatedFile.tagged.filter(each => each.related._id !== tag.related._id)}})}
                                neededLoadDetection={true}
                                detectApi={({width, height}) => {
                                    return getFileBlobFromUrl(updatedFile.path).then(blob => {
                                        return postFilesDetectionsCache.getDetections({file: blob, _id: updatedFile._id}, {width, height}, true).then(data => {
                                            // console.log(data)
                                            this.setState({
                                                detections: data.map(each => {
                                                    let {detection} = each;
                                                    let {_box, _imageDims} = detection;
                                                    let {_height, _width, _x, _y} = _box;
                                                    let {_height: imgHeight, _width: imgWidth} = _imageDims
                                                    return {
                                                        ratioX: imgWidth / _x,
                                                        ratioY: imgHeight / _y,
                                                        boxWidthRatio: imgWidth / _width,
                                                        boxHeightRatio: imgHeight / _height
                                                    }
                                                }),

                                            })
                                        })
                                    })
                                }}
                            />
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
                                <Link className="link" to={`/user/${post.belonged_person.basic_info.profile_link || post.belonged_person._id}`}>{post.belonged_person.basic_info.username}</Link>
                                {post.belonged_wall && (
                                    <>
                                        <i className="fas fa-caret-right ml-2 mr-2"></i>
                                        <Link className="link" to={`/user/${post.belonged_wall.basic_info.profile_link || post.belonged_wall._id}`}>{post.belonged_wall.basic_info.username}</Link>
                                    </>
                                )}
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
                        {editMode && (
                            <CommonInput
                                className={"dp-cation"}
                                value={updatedFile.caption || ""}
                                label={"Chú thích ảnh"}
                                type={"text"}
                                textArea={true}
                                placeholder={"Nhập chú thích"}
                                onChange={e => this.setState({updatedFile: {...updatedFile, caption: e.target.value}})}
                            />
                        )}
                    </div>
                    <div className="dp-footer">
                        <div className="edit-action">
                            {editMode ? (
                                <>
                                    <Button className="btn btn-save btn-common-primary" loading={updating} onClick={this.submit}><i className="fas fa-save"></i> Lưu</Button>
                                    <Button className="btn btn-cancel" disabled={updating} onClick={() => this.setState({editMode: false, updatedFile: null, detections: []})}>Hủy</Button>
                                </>
                            ) : (
                                <Button className="btn btn-block btn-common-primary" onClick={() => this.setState({editMode: true, updatedFile: {...currentFile}})}><i className="far fa-edit"></i> Chỉnh sửa</Button>
                            )}

                        </div>

                    </div>

                </div>
            </div>
        );
    }
}
