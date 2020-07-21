import {incomingMediaModal} from "../../react/common/media-modal/incoming/incoming-media-modal";
import {VoiceCallModal, voiceCallModal} from "../../react/common/media-modal/voice-call-modal/voice-call-modal";
import isFunction from "lodash/isFunction"
import {createStateHolder} from "../states/state-holder";
import {modals} from "../../react/common/modal/modals";
import React from "react";
import {v4 as uuidv4} from 'uuid';

export const CALL_TYPES = {
    "VOICE": 1,
    "VIDEO": 2
};


const createCallServices = () => {
    let clientID = null;
    let callingState = createStateHolder(false);
    let modal = null;
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
                if (modal) {

                    modal.close();
                    modal = null;
                }
                return callingState.setState(true)
                    .then(() => {
                        let modalKey = uuidv4();

                        modal = {
                            ...modals.openModal({
                                key: modalKey,
                                content: (
                                    <VoiceCallModal
                                        config={config}
                                        clientID={clientID}
                                        type={type}
                                        onClose={(r) => modal.close(r)}
                                        minimize={() => {
                                            modal.toggleMinimize();
                                        }}
                                    />
                                ),
                                disabledOverlayClose: true,

                            })
                        };

                        return modal.result;

                    })
                    .then(result => {
                        modal = null;
                        return callingState.setState(false)
                            .then(() => result);
                    });

            }
        },
        isCalling: () => callingState.getState(),
        toggleMinimize: () => {
            if (modal) {
                modal.toggleMinimize();
            }
        },
        finishCall: () => {
            return callingState.setState(false)
        }

    }
}

export const callServices = createCallServices();