import {MediaDevice} from './MediaDevice';
import {Emitter} from './Emitter';
import {messengerIO} from "../../socket/sockets";

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

export class PeerConnection extends Emitter {
  /**
   * Create a PeerConnection.
   * @param chatRoomID
   */
  constructor(chatRoomID) {
    super();
    this.socket = messengerIO.getIOInstance();
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event) => this.socket.emit('call', {
      candidate: event.candidate
    });
    this.pc.ontrack = (event) => this.emit('peerStream', event.streams[0]);
    this.chatRoomID = chatRoomID;
    this.mediaDevice = new MediaDevice();
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
   * @param callType
   * @param chatRoomID
   */
  start(isCaller, config, callType, chatRoomID) {
    this.mediaDevice
      .on('stream', (stream) => {
        stream.getTracks().forEach((track) => {
          this.pc.addTrack(track, stream);
        });
        this.emit('localStream', stream);
        if (isCaller) this.socket.emit('request', { callType, chatRoomID});
        else this.createOffer();
      })
      .start(config);

    return this;
  }

  /**
   * Stop the call
   * @param {Boolean} isStarter
   */
  stop(isStarter) {
    if (isStarter) {
      this.socket.emit('end', { chatRoomID });
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
    this.socket.emit('call', { to: this.friendID, sdp: desc });
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

