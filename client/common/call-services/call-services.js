import {incomingMediaModal} from "../../react/common/media-modal/incoming/incoming-media-modal";
import {voiceCallModal} from "../../react/common/media-modal/voice-call-modal/voice-call-modal";
import {videoCallModal} from "../../react/common/media-modal/video-call-modal/video-call-modal";

export const CALL_TYPES = {
    "VOICE": 1,
    "VIDEO": 2
};



const createCallServices = () => {
    let clientID = null;
    return {
        initClientID: _clientID => clientID = _clientID,
        createIncomingModal: (type) => {
            return ({callFrom}) => incomingMediaModal.open({
                type,
                callFrom,
                clientID
            })
        },
        createCallModal: type => {
            return (config) => {
                let modal = type === CALL_TYPES.VOICE ? voiceCallModal : videoCallModal;
                return modal.open({
                    config,
                    clientID
                })
            }
        }
    }
}

export const callServices = createCallServices();