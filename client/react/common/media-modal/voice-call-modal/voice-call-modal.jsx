
import React, {Component} from 'react';
import {modals} from "../../modal/modals";


export const voiceCallModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <VoiceCallModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
}

class VoiceCallModal extends Component {
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



