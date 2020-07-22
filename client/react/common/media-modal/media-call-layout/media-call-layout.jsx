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

export class MediaCallLayout extends Component {
    constructor(props) {
        super(props);
        this.initState = {
            localSrc: null,
            peerSrc: null,
            callStatus: props.isCaller ? CALL_STATUS.CONNECTING : CALL_STATUS.CALLING,
            microphone_granted: false,
            webcam_granted: false,
            init: true,
            error: false,
        };
        this.state = {...this.initState}

        this.pc = {};
        this.io = messengerIO.getIOInstance();
        this.ackTimeout = null;
    }

    componentDidMount() {
        console.log(this.props.mKey)
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
            console.log("????????????????")
            callServices.finishCall();
            return this.endCall(false)
        })
        let state = {
            microphone_granted: localStorage.getItem("microphone_granted") !== "false",
            webcam_granted: localStorage.getItem("webcam_granted") !== "false",
            init: false
        }
        // console.log(this.props.callType)
        // console.log(state)
        if (this.props.callType === CALL_TYPES.VOICE ? state.microphone_granted !== false : (state.microphone_granted !== false && state.webcam_granted !== false)) {
            console.log("la")
            this.startCall(this.props.isCaller);
        } else {
            state.error = true;
        }
        this.setState(state)

    }


    componentWillUnmount() {
        if (this.ackTimeout)
            clearTimeout(this.ackTimeout)
        if (this.io) {
            console.log("unregister")
            this.io.off("call");
            this.io.off("ack");
            this.io.off("reject");
        }
    }

    startCall = (isCaller) => {

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
                console.log(src)
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
        if (isFunction(this.pc.stop)) {
            this.pc.stop(isStarter);
        }
        this.pc = {};
        this.setState({...this.initState, callStatus: CALL_STATUS.NO_ANSWER})
    }

    endCall(isStarter) {

        if (isFunction(this.pc.stop)) {
            this.pc.stop(isStarter);
        }
        this.pc = {};
        this.setState({...this.initState, callStatus: CALL_STATUS.END})
    }

    render() {
        console.log(this.state.callStatus)
        return this.state.error ? (
            <div className="media-call-error">

            </div>
        ) : this.props.children({
            startCall: this.startCall,
            ...this.state,
            pc: this.pc,
            onEndCall: () => {
                callServices.finishCall();
                return this.endCall(true);
            },
            onRedial: () => {
                if (!callServices.isCalling()) {
                    this.setState({callStatus: CALL_STATUS.CONNECTING});
                    this.startCall(true)
                } else {
                    appModal.alert({
                        title: "Thông báo",
                        text: "Bạn đang tham gia một cuộc gọi khác.",
                        btnText: "Đóng",
                    })
                }
            },
            disabledMicrophone: localStorage.getItem("microphone_granted") !== "true",
            disabledWebcam: localStorage.getItem("webcam_granted") !== "true",
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
