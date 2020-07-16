import React, {Component} from 'react';
import {messengerIO} from "../../../../socket/sockets";

export class MediaCallLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            localSrc: null,
            peerSrc: null
        }
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
            .on('end', this.endCall.bind(this, false))

    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}
