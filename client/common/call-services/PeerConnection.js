import {MediaDevice} from './MediaDevice';
import {Emitter} from './Emitter';
import {messengerIO} from "../../socket/sockets";

const PC_CONFIG = {iceServers: [{urls: ['stun:stun.l.google.com:19302']}]};

export class PeerConnection extends Emitter {
    /**
     * Create a PeerConnection.
     * @param friendID
     * @param chatRoomID
     * @param callType
     */
    constructor(friendID, chatRoomID, callType) {
        super();
        this.socket = messengerIO.getIOInstance();
        this.pc = new RTCPeerConnection(PC_CONFIG);
        this.pc.onicecandidate = (event) => this.socket.emit('call', {
            candidate: event.candidate
        });
        this.pc.ontrack = (event) => this.emit('peerStream', event.streams[0]);
        this.friendID = friendID;
        this.chatRoomID = chatRoomID;
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
                if (isCaller) this.socket.emit('request', {
                    callType: this.callType,
                    friendID: this.friendID,
                    chatRoomID: this.chatRoomID
                });
                else this.createOffer();
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
            this.socket.emit('end', {chatRoomID: this.chatRoomID, friendID: this.friendID});
        }
        this.mediaDevice.stop();
        this.pc.close();
        this.pc = null;
        this.off();
        return this;
    }

    createOffer() {
        this.pc.createOffer()
            .then(this.getDescription.bind(this))
            .catch((err) => console.log(err));
        return this;
    }

    createAnswer() {
        this.pc.createAnswer()
            .then(this.getDescription.bind(this))
            .catch((err) => console.log(err));
        return this;
    }

    getDescription(desc) {
        this.pc.setLocalDescription(desc);
        this.socket.emit('call', {chatRoomID: this.chatRoomID, sdp: desc, friendID: this.friendID});
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

