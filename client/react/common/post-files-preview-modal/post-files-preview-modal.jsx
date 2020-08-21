import React, {Component} from 'react';
import {modals} from "../modal/modals";

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
            focusFileID: props.focusFileID
        }
    }

    render() {
        let {files, focusFileID} = this.props;
        let currentFile = files.find(each => each._id === focusFileID);
        return (
            <div className="post-files-preview-modal">
                <div className="file-panel">
                    <div className="file-container">
                         <div className="file-wrapper">

                         </div>
                    </div>
                </div>
                <div className="describe-panel">

                </div>
            </div>
        );
    }
}
