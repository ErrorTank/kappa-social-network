import React, {Component} from 'react';
import classnames from "classnames";
import {postFilesPreviewModal} from "../post-files-preview-modal/post-files-preview-modal";




export class PbFilesPreview extends Component {

    openPostFilesPreviewModal = (focus) => {
        let {files} = this.props;
        postFilesPreviewModal.open({
            focusFileID: focus._id,
            files
        })
    };

    render() {
        let {files} = this.props;
        return (
            <div className="pb-files-preview">
                <div className={classnames("pb-list", `list-${files.length < 6 ? files.length : 5 }`)}>
                    {files.slice(0, 5).map((each, i) => (
                        <div className={classnames("file-preview", `pic-${i + 1}`)} key={each._id} onClick={() => this.openPostFilesPreviewModal(each)}>
                            {files.length > 5 && i === 4 && (
                                <div className="count-overlay">
                                    <span>{files.length - 5} +</span>
                                </div>
                            )}
                            <img src={each.path}/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}