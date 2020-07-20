import {MediaDevice} from './MediaDevice';
import {Emitter} from './Emitter';
import {messengerIO} from "../../socket/sockets";
import {userInfo} from "../states/common";

const PC_CONFIG = {
    'iceServers': [
        {
            'urls': 'stun:stun.l.google.com:19302'
        },
        {
            'urls': 'turn:192.158.29.39:3478?transport=udp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        },
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
        this.pc = new RTCPeerConnection();
        this.pc.onicecandidate = (event) => {

            return this.socket.emit('call', {
                candidate: event.candidate
            });
        };
        this.pc.ontrack = (event) => {
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

    getDescription(desc) {
        this.pc.setLocalDescription(desc);
        this.socket.emit('call', {sdp: desc, friendID: this.friendID});
        return this;
    }

    /**
     * @param {Object} sdp - Session description
     */
    setRemoteDescription(sdp) {
        const rtcSdp = new RTCSessionDescription(sdp);
        this.pc.setRemoteDescription(rtcSdp);
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

