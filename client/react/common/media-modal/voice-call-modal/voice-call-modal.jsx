
import React, {Component} from 'react';
import {modals} from "../../modal/modals";
import {MediaCallLayout} from "../media-call-layout/media-call-layout";
import {CALL_TYPES} from "../../../../common/call-services/call-services";


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
        let {config, clientID} = this.props;
        return (
           <MediaCallLayout
               callType={CALL_TYPES.VOICE}
               {...config}
               clientID={clientID}
           >
               {({}) => {
                   return (
                       <div className="call-modal voice-call-modal">

                       </div>
                   )
               }}
           </MediaCallLayout>
        )
    }
}



