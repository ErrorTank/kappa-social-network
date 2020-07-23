import {MediaDevice} from './MediaDevice';
import {Emitter} from './Emitter';
import {messengerIO} from "../../socket/sockets";
import {userInfo} from "../states/common";
import isFunction from "lodash/isFunction";

const PC_CONFIG = {
    'iceServers': [
        { 'urls': "stun:numb.viagenie.ca" },
        {
            'urls': "turn:numb.viagenie.ca",
            'credential': 'iloveha123',
            'username': 'ncq998@gmail.com'
        },
        // {
        //     'urls': 'stun:stun.l.google.com:19302'
        // },
        // {
        //     'urls': 'stun:stun.anyfirewall.com:3478'
        // },
        // {
        //     'urls': "turn:turn.bistri.com:80", credential: "homeo", username: 'homeo'
        // },
        // {
        //     'urls': "turn:turn.anyfirewall.com:443?transport=tcp", credential: "webrtc", username: 'webrtc'
        // },
    ]
};

export class PeerConnection extends Emitter {
    /**
     * Create a PeerConnection.
     * @param friendID
     * @param callType
     */
    constructor(friendID, callType) {
        super();
        this.socket = messengerIO.getIOInstance();
        this.pc = new RTCPeerConnection(PC_CONFIG);
        this.pc.onicecandidate = (event) => {

            return this.socket.emit('call', {
                candidate: event.candidate
            });
        };
        this.pc.ontrack = (event) => {
            console.log(event.track.kind)
            return this.emit('peerStream', event.streams[0]);
        }
        this.friendID = friendID;
        this.mediaDevice = new MediaDevice(callType);
        this.callType = callType;
    }

    /**
     * Starting the call
     * @param {Boolean} isCaller
     */
    start(isCaller) {
        this.mediaDevice
            .on('stream', (stream) => {
                stream.getTracks().forEach((track) => {
                    console.log("dududu")
                    this.pc.addTrack(track, stream);
                });
                this.emit('localStream', stream);

                if (isCaller) {
                    this.socket.emit('request', {
                        callType: this.callType,
                        friendID: this.friendID,
                    });
                } else this.createOffer();
            })
            .on('not-allowed', () => {
                this.emit("device-denied");
            })
            .on("allowed", () => {
                this.emit("device-granted");
            })
            .start();

        return this;
    }

    /**
     * Stop the call
     * @param {Boolean} isStarter
     */
    stop(isStarter) {
        if (isStarter) {
            this.socket.emit('end', {friendID: this.friendID});
        }
        if (isFunction(this.mediaDevice.off)) {
            this.mediaDevice
                .off('stream')
                .off('not-allowed')
                .off('allowed');
        }
        this.mediaDevice.stop();
        this.pc.close();
        this.pc = null;
        this.off();
        return this;
    }

    createOffer() {
        console.log("offer")
        this.pc.createOffer()
            .then(this.getDescription.bind(this))
            .catch((err) => console.log(err));
        return this;
    }

    createAnswer() {
        console.log("answer")
        this.pc.createAnswer()
            .then(this.getDescription.bind(this))
            .catch((err) => console.log(err));
        return this;
    }

    async getDescription(desc) {
        console.log("call")
        await this.pc.setLocalDescription(new RTCSessionDescription(desc))
        this.socket.emit('call', {sdp: desc, friendID: this.friendID});

        return this;
    }

    /**
     * @param {Object} sdp - Session description
     */
    async setRemoteDescription(sdp) {
        const rtcSdp = new RTCSessionDescription(sdp);
        await this.pc.setRemoteDescription(rtcSdp);
        return this;
    }

    /**
     * @param {Object} candidate - ICE Candidate
     */
    addIceCandidate(candidate) {
        if (candidate) {
            const iceCandidate = new RTCIceCandidate(candidate);
            this.pc.addIceCandidate(iceCandidate);
        }
        return this;
    }
}

