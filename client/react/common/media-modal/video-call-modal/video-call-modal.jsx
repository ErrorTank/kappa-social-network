
import React, {Component} from 'react';
import {modals} from "../../modal/modals";


export const videoCallModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <VideoCallModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
            disabledOverlayClose: true
        });
        return modal.result;
    }
}

class VideoCallModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }




    render() {
        return (
            <>
            </>
        )
    }
}



