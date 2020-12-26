import React, {Component} from 'react';
import {modals} from "../../modal/modals";
import {CALL_STATUS, MediaCallLayout} from "../media-call-layout/media-call-layout";
import {CALL_TYPES} from "../../../../common/call-services/call-services";
import classnames from "classnames"
import {Avatar} from "../../avatar/avatar";
import {userApi} from "../../../../api/common/user-api";
import {Tooltip} from "../../tooltip/tooltip";
import {v4 as uuidv4} from 'uuid';
import {transformSecondsToTime} from "../../../../common/utils/time-utils";

const CALL_STATUS_MATCHER = {
    1: "Đang kêt nối...",
    2: "Đang rung chuông...",
    4: "Kết thúc.",
    5: "Không phản hồi.",
    6: "Không thể kết nối."
}

export class VoiceCallWidget extends Component {
    constructor(props) {
        super(props);
        console.log(props.disabledWebcam);
        this.state = {
            microphone: !props.disabledMicrophone,
            webcam: !props.disabledWebcam,
            shareScreen: !props.disabledShareScreen,
        }

    }

    componentWillReceiveProps(nextProps, nextContext) {
        let newState = {};
        if(nextProps.disabledWebcam !== this.props.disabledWebcam){
            newState.webcam = !nextProps.disabledWebcam;
        }
        if(nextProps.disabledMicrophone !== this.props.disabledMicrophone){
            newState.microphone = !nextProps.disabledMicrophone;
        }
        if(nextProps.disabledShareScreen !== this.props.disabledShareScreen){
            newState.shareScreen = !nextProps.disabledShareScreen;
        }
        this.setState({...newState})
    }

    componentDidMount() {
        this.props.toggleVideo(this.state.webcam);
        this.props.toggleAudio(this.state.microphone);
        this.updateVideoSrc();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateVideoSrc();
    }

    updateVideoSrc = () => {

        // console.log(this.props.localSrc)
        if (this.localVideo && this.props.localSrc) {
            // console.log(this.props.localSrc)
            // console.log(this.props.localSrc.getAudioTracks())
            this.localVideo.srcObject = this.props.localSrc;
        }
        if (this.peerVideo && this.props.peerSrc) {
            // console.log(this.props.peerSrc)
            // console.log(this.props.peerSrc.getAudioTracks())
            this.peerVideo.srcObject = this.props.peerSrc;
        }


    }

    render() {
        let {
            microphone,
            webcam,
            shareScreen
        } = this.state;

        let {duration, minimize, user, onClose, type, callStatus, onEndCall, onRedial, disabledMicrophone, disabledWebcam, toggleVideo, toggleAudio, toggleShareScreen, disabledShareScreen} = this.props;

        let actions = [CALL_STATUS.END, CALL_STATUS.NO_ANSWER, CALL_STATUS.CANNOT_CONNECTED].includes(callStatus) ? [
            {
                icon: <i className="fas fa-phone-alt"></i>,
                toolTip: "Gọi lại",
                onClick: () => {
                    onRedial();
                }
            }, {
                icon: <i className="fal fa-times"></i>,
                className: "close",
                toolTip: "Đóng",
                onClick: () => {
                    onClose();
                }
            }
        ] : [
            {
                icon: webcam ? <i className="fas fa-video"></i> : <i className="fas fa-video-slash"></i>,
                isActive: webcam,
                toolTip: webcam ? "Tắt webcam" : "Bật webcam",
                onClick: () => {
                    this.setState({webcam: !webcam})
                    toggleVideo();
                },
                disabled: disabledWebcam
            }, {
                icon: microphone ? <i className="fas fa-microphone"></i> :
                    <i className="fas fa-microphone-slash"></i>,
                isActive: microphone,
                toolTip: microphone ? "Tắt microphone" : "Bật microphone",
                onClick: () => {
                    this.setState({microphone: !microphone})
                    toggleAudio();
                },
                disabled: disabledMicrophone
            }, {
                icon: <i className="fal fa-desktop"></i>,
                isActive: shareScreen,
                toolTip: shareScreen ? "Tắt chia sẻ màn hình" : "Bật chia sẻ màn hình",
                onClick: () => {
                    this.setState({shareScreen: !shareScreen})
                    toggleShareScreen();
                },
                disabled: disabledShareScreen
            }, {
                icon: <i className="fas fa-phone-slash"></i>,
                className: "cancel",
                toolTip: "Kêt thúc",
                onClick: () => {
                    onEndCall();
                },
            }
        ]
        let {hours, minutes, seconds} = duration;

        return (
            <div
                className={classnames("voice-call-modal", {active: callStatus === CALL_STATUS.CALLING && type === CALL_TYPES.VIDEO})}>

                <div className="voice-modal-body">
                    <div className="header-actions">
                        <div className="action" onClick={() => minimize()}>
                            <i className="fal fa-horizontal-rule"></i>
                        </div>
                        <div className="action close" onClick={() => {
                            onEndCall().then(() => onClose())
                        }}>
                            <i className="fal fa-times"></i>
                        </div>
                    </div>
                    <div className="voice-modal-content">
                        {callStatus !== CALL_STATUS.CALLING ? (
                            <div className="center-calling-info">
                                {user && (
                                    <>
                                        <div className="avatar-wrapper">
                                            <Avatar
                                                user={user}
                                            />
                                        </div>
                                        <div className="username">{user.basic_info.username}</div>
                                    </>
                                )}
                                <div className="call-info">
                                    {CALL_STATUS_MATCHER[callStatus]}
                                </div>
                            </div>
                        ) : (
                            <>
                                {user && type === CALL_TYPES.VOICE && (
                                    <div className="center-calling-info">
                                        <div className="avatar-wrapper">
                                            <Avatar
                                                user={user}
                                            />
                                        </div>
                                        <div className="call-info">
                                            {hours > 0 && (
                                                <span>{hours < 10 && "0"}{hours}:</span>
                                            )}
                                            <span>{minutes < 10 && "0"}{minutes}</span>
                                            :<span>{seconds < 10 && "0"}{seconds}</span>
                                        </div>
                                    </div>
                                )}
                                <video className={classnames("peerVideo", {hide: type === CALL_TYPES.VOICE })} ref={peerVideo => this.peerVideo = peerVideo} autoPlay />
                                <video className={classnames("localVideo", {hide: type === CALL_TYPES.VOICE })} ref={localVideo => this.localVideo = localVideo} autoPlay muted/>
                            </>
                        )}
                    </div>
                    <div className="footer-actions">
                        {actions.map(({className, isActive = true, icon, onClick = () => null, disabled = false, toolTip = ""}, i) => (
                            <Tooltip
                                text={() => toolTip}
                                position={"top"}
                                key={i}
                            >
                                <div className={classnames("footer-action", className, {active: isActive, disabled})}
                                     onClick={onClick}>
                                    {icon}
                                </div>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export class VoiceCallModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            duration: 0
        }
        userApi.getUserBasicInfo(props.config.callTo).then(user => this.setState({user}))

    }

    startDurationCount = () => {
        this.interval = setInterval(() => {
            this.setState({duration: this.state.duration + 1})
        }, 1000);
    };

    stopDurationCount = () => {
        if(this.interval){
            clearInterval(this.interval)
        }
        this.setState({duration: 0})
    }

    componentWillMount() {
        if(this.interval){
            clearInterval(this.interval)
        }
    }


    render() {
        let {config, clientID, onClose, type, mKey} = this.props;

        return (
            <MediaCallLayout
                callType={type}
                {...config}
                clientID={clientID}
                onCalling={this.startDurationCount}
                onFinish={(callStatus) => {

                    config.onFinish?.({callStatus: callStatus ? "MISSED" : "FINISH", duration: this.state.duration});
                    this.stopDurationCount();
                }}
                mKey={mKey}
                onClose={onClose}
            >
                {(layoutProps) => {

                    return (
                        <VoiceCallWidget
                            {...this.props}
                            {...layoutProps}
                            user={this.state.user}
                            duration={transformSecondsToTime(this.state.duration)}
                        />
                    )
                }}
            </MediaCallLayout>
        )

    }
}



