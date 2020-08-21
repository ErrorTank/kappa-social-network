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

    render() {
        let {files, focusFileID} = this.props;
        return (
            <div className="post-files-preview-modal">

            </div>
        );
    }
}
