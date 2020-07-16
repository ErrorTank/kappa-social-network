
import React, {Component} from 'react';
import {modals} from "../../modal/modals";


export const incomingMediaModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <IncomingMediaModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
}

class IncomingMediaModal extends Component {
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



