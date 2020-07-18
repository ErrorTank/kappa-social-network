import set from 'lodash/set';
import {Emitter} from './Emitter';
import {appModal} from "../../react/common/modal/modals";
import {messengerIO} from "../../socket/sockets";
import {CALL_TYPES} from "./call-services";

/**
 * Manage all media devices
 */
export class MediaDevice extends Emitter {
    constructor(callType) {
        super();
        this.constraints = callType === CALL_TYPES.VOICE ? {
            audio: true,
            video: false
        } : {
            video: {
                facingMode: 'user',
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 }
            },
            audio: true
        };
    }

    /**
     * Start media devices and send stream
     */

    static checkMediaDevicesPermissionStatus = () =>  navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            return {
                audio: devices.some(val => val.kind === "audioinput" && val.label !== ""),
                video: devices.some(val => val.kind === "videoinput" && val.label !== "")
            }
        })

    start() {


        navigator.mediaDevices
            .getUserMedia(this.constraints)
            .then((stream) => {
                this.emit("allowed");
                this.stream = stream;
                this.emit('stream', stream);
            })
            .catch((err) => {
                if (err.message === "Permission denied") {
                    this.emit("not-allowed");
                } else {
                    console.log(err);
                }
            });

        return this;
    }

    /**
     * Turn on/off a device
     * @param {String} type - Type of the device
     * @param {Boolean} [on] - State of the device
     */
    toggle(type, on) {
        const len = arguments.length;
        if (this.stream) {
            this.stream[`get${type}Tracks`]().forEach((track) => {
                const state = len === 2 ? on : !track.enabled;
                set(track, 'enabled', state);
            });
        }
        return this;
    }

    /**
     * Stop all media track of devices
     */
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
        }
        return this;
    }
}

