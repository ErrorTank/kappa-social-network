import {incomingMediaModal} from "../../react/common/media-modal/incoming/incoming-media-modal";
import {VoiceCallModal} from "../../react/common/media-modal/voice-call-modal/voice-call-modal";
import isFunction from "lodash/isFunction"
import {createStateHolder} from "../states/state-holder";
import {modals} from "../../react/common/modal/modals";
import React from "react";
import {v4 as uuidv4} from 'uuid';
import {callController} from "../../react/common/media-modal/media-call-layout/media-call-layout";

export const CALL_TYPES = {
    "VOICE": 1,
    "VIDEO": 2
};


const createCallServices = () => {
    let clientID = null;
    let callingState = createStateHolder({callTo: null, status: false});
    let modal = null;
    return {
        ...callingState,
        initClientID: _clientID => clientID = _clientID,
        createIncomingModal: (type) => {
            console.log(type);
            return ({callFrom}) => incomingMediaModal.open({
                type,
                callFrom,
                clientID
            })
        },
        isCallTo: id => callingState.getState().callTo === id,
        getCallTo: () => callingState.getState().callTo,
        createCallModal: type => {

            return (config) => {



                return Promise.all([
                    callingState.setState({status: true, callTo: config.callTo}),
                    (() => {
                        return modal ? modal.closePromise(false)
                            .then(() => {
                                modal = null;
                            }) : Promise.resolve();
                    })()
                ])
                    .then(() => {
                        let modalKey = uuidv4();
                        modal = modals.openModal({
                            key: modalKey,
                            content: (
                                <VoiceCallModal
                                    mKey={modalKey}
                                    config={config}
                                    clientID={clientID}
                                    type={type}
                                    onClose={(r) => {
                                        modal.close(r);
                                        modal = null;
                                        return callingState.setState({status: false, callTo: null})
                                    }}
                                    minimize={() => {
                                        modal.toggleMinimize();
                                    }}
                                />
                            ),
                            disabledOverlayClose: true,

                        });

                        return modal.result;

                    })


            }
        },
        isCalling: () => callingState.getState().status === true,
        setCallStatus: (status) => {
            return callingState.setState({status, callTo: callingState.getState().callTo})
        },
        toggleMinimize: () => {
            if (modal) {
                modal.toggleMinimize();
            }
        },
        finishCall: () => {
            return callingState.setState({status: false, callTo: callingState.getState().callTo})
        },
        endCall: () => {
            if (modal) {
                modal.toggleMinimize();
            }
            callController.endCall();
            return callingState.setState({status: false, callTo: callingState.getState().callTo})
        }

    }
}

export const callServices = createCallServices();