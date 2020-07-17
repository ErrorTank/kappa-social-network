import React, {Component} from 'react';
import {messengerIO} from "../../../../socket/sockets";
import {PeerConnection} from "../../../../common/call-services/PeerConnection";

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
            callStatus: null
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
        if(this.props.isCaller){
            this.startCall(true);
        }
    }

    startCall = (isCaller) => {
        this.pc = new PeerConnection(this.props.callTo)
            .on('localStream', (src) => {
                const newState = { callStatus: isCaller ? CALL_STATUS.CALLING : CALL_STATUS.ACTIVE, localSrc: src };
                this.setState(newState);
            })
            .on('peerStream', (src) => this.setState({ peerSrc: src }))
            .start(isCaller, this.props.callType);

    };

    render() {
        return this.props.children({
            startCall: this.startCall,
            ...this.state,
            pc: this.pc
        })
    }
}
