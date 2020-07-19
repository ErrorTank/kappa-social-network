import React, {Component} from 'react';
import {messengerIO} from "../../../../socket/sockets";
import {PeerConnection} from "../../../../common/call-services/PeerConnection";
import {CALL_TYPES} from "../../../../common/call-services/call-services";
import {MediaDevice} from "../../../../common/call-services/MediaDevice";
import isFunction from "lodash/isFunction"

const CALL_STATUS = {
    "CONNECTING": 1,
    "RINGING": 2,
    "CALLING": 3,
    "END": 4
};

export class MediaCallLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localSrc: null,
            peerSrc: null,
            callStatus: props.isCaller ? CALL_STATUS.CONNECTING : CALL_STATUS.CALLING,
            microphone_granted: false,
            webcam_granted: false,
            init: true,
            error: false
        };

        this.pc = {};
        this.io = messengerIO.getIOInstance();
    }

    componentDidMount() {
        this.io
            .on('call', (data) => {
                if (data.sdp) {
                    this.pc.setRemoteDescription(data.sdp);
                    if (data.sdp.type === 'offer') this.pc.createAnswer();
                } else this.pc.addIceCandidate(data.candidate);
            })
            .on('reject', () => this.endCall(false))
        let state = {
            microphone_granted: localStorage.getItem("microphone_granted"),
            webcam_granted:  localStorage.getItem("webcam_granted"),
            init: false
        }
        if(this.props.callType === CALL_TYPES.VOICE ? state.microphone_granted !== false : (state.microphone_granted !== false && state.webcam_granted !== false)){
            this.startCall(this.props.isCaller);
        }else{
            state.error = true;
        }
        this.setState(state)

    }

    startCall = (isCaller) => {
        this.pc = new PeerConnection(this.props.callTo, this.props.callType)
            .on('localStream', (src) => {
                const newState = {localSrc: src};
                this.setState(newState);
            })
            .on('peerStream', (src) => this.setState({peerSrc: src}))
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

    endCall(isStarter) {
        if (isFunction(this.pc.stop)) {
            this.pc.stop(isStarter);
        }
        this.props.onClose();
    }

    render() {
        console.log(this.state)
        return this.state.error ? (
            <div className="media-call-error">

            </div>
        ) :this.props.children({
            startCall: this.startCall,
            ...this.state,
            pc: this.pc
        })
    }
}
