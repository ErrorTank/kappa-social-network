import React, {Component} from 'react';
import {messengerIO} from "../../../../socket/sockets";
import {PeerConnection} from "../../../../common/call-services/PeerConnection";
import {CALL_TYPES} from "../../../../common/call-services/call-services";
import {MediaDevice} from "../../../../common/call-services/MediaDevice";

const CALL_STATUS = {
    "CALLING": 1,
    "ACTIVE": 2,
};

export class MediaCallLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localSrc: null,
            peerSrc: null,
            callStatus: null,
            microphone_granted: false,
            webcam_granted: false,
            init: true,
            error: false
        };

        this.pc = {};
        this.io = messengerIO.getIOInstance();
    }

    componentDidMount() {
        // this.io
        //     .on('call', (data) => {
        //         if (data.sdp) {
        //             this.pc.setRemoteDescription(data.sdp);
        //             if (data.sdp.type === 'offer') this.pc.createAnswer();
        //         } else this.pc.addIceCandidate(data.candidate);
        //     })
        //     .on('end', this.endCall.bind(this, false))
        let state = {
            microphone_granted: localStorage.getItem("microphone_granted"),
            webcam_granted:  localStorage.getItem("webcam_granted"),
            init: false
        }
        if(this.props.callType === CALL_TYPES.VOICE ? state.microphone_granted !== false : (state.microphone_granted !== false && state.webcam_granted !== false)){
            this.startCall(true);
        }else{
            state.error = true;
        }
        this.setState(state)

    }

    startCall = (isCaller) => {
        this.pc = new PeerConnection(this.props.callTo, this.props.chatRoomID, this.props.callType)
            .on('localStream', (src) => {
                const newState = {callStatus: isCaller ? CALL_STATUS.CALLING : CALL_STATUS.ACTIVE, localSrc: src};
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
