import React, {Component} from 'react';
import {messengerIO} from "../../../../socket/sockets";
import {PeerConnection} from "../../../../common/call-services/PeerConnection";
import {CALL_TYPES, callServices} from "../../../../common/call-services/call-services";
import {MediaDevice} from "../../../../common/call-services/MediaDevice";
import isFunction from "lodash/isFunction"
import {appModal} from "../../modal/modals";

export const CALL_STATUS = {
    "CONNECTING": 1,
    "RINGING": 2,
    "CALLING": 3,
    "END": 4,
    "NO_ANSWER": 5,
    "CANNOT_CONNECTED": 6
};
export let callController = {};

export class MediaCallLayout extends Component {
    constructor(props) {
        super(props);
        this.initState = {
            localSrc: null,
            peerSrc: null,
            callStatus: props.isCaller ? CALL_STATUS.CONNECTING : CALL_STATUS.CALLING,
            microphone_granted: true,
            webcam_granted: true,
            init: true,
            error: false,
        };
        this.state = {...this.initState}

        this.pc = {};
        this.io = messengerIO.getIOInstance();
        this.ackTimeout = null;
        callController = {
            endCall: () => this.endCall(true)
        }
    }

    initSocketListeners = () => {
        this.io.on('call', (data) => {

            if (data.sdp) {
                this.setState({callStatus: CALL_STATUS.CALLING})
                this.pc.setRemoteDescription(data.sdp);
                if (data.sdp.type === 'offer') this.pc.createAnswer();
            } else this.pc.addIceCandidate(data.candidate);
        })
        this.io.on('ack', (data) => {

            if (data.from === this.props.callTo) {
                clearTimeout(this.ackTimeout);
                this.ackTimeout = null;
                this.setState({callStatus: CALL_STATUS.RINGING})
            }
        })
        this.io.on('reject', () => {

            callServices.finishCall();
            this.rejectCall(false)
        })
        this.io.on('end', () => {

            callServices.finishCall();
            return this.endCall(false)
        })
    };

    componentDidMount() {


        let state = {
            microphone_granted: localStorage.getItem("microphone_granted") !== "false",
            webcam_granted: localStorage.getItem("webcam_granted") !== "false",
            init: false
        }

        if (this.props.callType === CALL_TYPES.VOICE ? state.microphone_granted !== false : (state.microphone_granted !== false && state.webcam_granted !== false)) {
            this.startCall(this.props.isCaller);
        } else {
            state.error = true;
        }
        this.setState(state)

    }

    removeListeners = () => {
        if (this.io) {
            this.io.off("call");
            this.io.off("ack");
            this.io.off("reject");
            this.io.off("end");
        }
        if(isFunction(this.pc.off)){
            this.pc.off('localStream');
            this.pc.off('peerStream');
            this.pc.off('device-denied');
            this.pc.off('device-granted');
        }

    }


    componentWillUnmount() {
        if (this.ackTimeout)
            clearTimeout(this.ackTimeout)
        this.removeListeners();
    }

    startCall = (isCaller) => {
        this.initSocketListeners();
        if (isCaller) {
            this.ackTimeout = setTimeout(() => {

                this.ackTimeout = null;
                this.setState({...this.initState, callStatus: CALL_STATUS.CANNOT_CONNECTED})

            }, 6000);
        }

        this.pc = new PeerConnection(this.props.callTo, this.props.callType)
            .on('localStream', (src) => {

                this.setState({localSrc: src});
            })
            .on('peerStream', (src) => {

                this.setState({peerSrc: src})
            })
            .on("device-denied", () => {

                MediaDevice.checkMediaDevicesPermissionStatus()
                    .then(({video, audio}) => {
                        localStorage.setItem("microphone_granted", audio);
                        localStorage.setItem("webcam_granted", video);
                        this.setState({
                            microphone_granted: audio,
                            webcam_granted: video,
                            error: true
                        })
                    })
            })
            .on("device-granted", () => {

                MediaDevice.checkMediaDevicesPermissionStatus()
                    .then(({video, audio}) => {
                        localStorage.setItem("microphone_granted", audio);
                        localStorage.setItem("webcam_granted", video);
                        this.setState({
                            microphone_granted: audio,
                            webcam_granted: video,
                        })
                    })
            })
            .start(isCaller);

    };

    rejectCall(isStarter) {
        this.removeListeners();
        if (this.ackTimeout)
            clearTimeout(this.ackTimeout)
        if (isFunction(this.pc.stop)) {
            this.pc.stop(isStarter);
        }
        this.pc = {};
        this.setState({...this.initState, callStatus: CALL_STATUS.NO_ANSWER})
    }

    endCall(isStarter) {
        return new Promise(resolve => {
            this.removeListeners();
            if (this.ackTimeout)
                clearTimeout(this.ackTimeout)
            if (isFunction(this.pc.stop)) {
                this.pc.stop(isStarter);
            }
            this.pc = {};
            this.setState({...this.initState, callStatus: CALL_STATUS.END}, () => resolve())
        })

    }

    render() {
        return this.state.error ? (
            <div className="media-call-error">

            </div>
        ) : this.props.children({
            startCall: this.startCall,
            ...this.state,
            pc: this.pc,
            onEndCall: () => {
                return callServices.isCalling() ? Promise.all([
                    callServices.finishCall(),
                    this.endCall(true)
                ]) : Promise.resolve();

            },
            onRedial: () => {
                if (!callServices.isCalling()) {
                    this.setState({callStatus: CALL_STATUS.CONNECTING});
                    callServices.setCallStatus(true);
                    this.startCall(true)
                } else {
                    appModal.alert({
                        title: "Thông báo",
                        text: "Bạn đang tham gia một cuộc gọi khác.",
                        btnText: "Đóng",
                    })
                }
            },
            disabledMicrophone: this.state.microphone_granted === false,
            disabledWebcam: this.state.webcam_granted === false,
            disabledShareScreen: true,
            toggleVideo: (on) => {
                if (this.pc.mediaDevice) {
                    this.pc.mediaDevice.toggle("Video", on)
                }
            },
            toggleAudio: (on) => {
                if (this.pc.mediaDevice) {
                    this.pc.mediaDevice.toggle("Audio", on)
                }
            },
            toggleShareScreen: () => null
        })
    }
}
