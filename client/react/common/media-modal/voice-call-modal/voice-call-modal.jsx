import React, {Component} from 'react';
import {modals} from "../../modal/modals";
import {CALL_STATUS, MediaCallLayout} from "../media-call-layout/media-call-layout";
import {CALL_TYPES} from "../../../../common/call-services/call-services";
import classnames from "classnames"
import {Avatar} from "../../avatar/avatar";
import {userApi} from "../../../../api/common/user-api";
import {Tooltip} from "../../tooltip/tooltip";
import {v4 as uuidv4} from 'uuid';

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
        this.state = {
            microphone: !props.disabledMicrophone,
            webcam: !props.disabledWebcam,
            shareScreen: !props.disabledShareScreen,
        }

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

        if (this.peerVideo && this.props.peerSrc) this.peerVideo.srcObject = this.props.peerSrc;
        if (this.localVideo && this.props.localSrc) this.localVideo.srcObject = this.props.localSrc;
        console.log(this.peerVideo && this.peerVideo.srcObject)
    }

    render() {
        let {
            microphone,
            webcam,
            shareScreen
        } = this.state;
        let {minimize, user, onClose, type, callStatus, onEndCall, onRedial, disabledMicrophone, disabledWebcam, toggleVideo, toggleAudio, toggleShareScreen, disabledShareScreen} = this.props;

        let actions = [CALL_STATUS.END, CALL_STATUS.NO_ANSWER].includes(callStatus) ? [
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
        return (
            <div
                className={classnames("voice-call-modal", {active: callStatus === CALL_STATUS.CALLING && type === CALL_TYPES.VIDEO})}>

                <div className="voice-modal-body">
                    <div className="header-actions">
                        <div className="action" onClick={() => minimize()}>
                            <i className="fal fa-horizontal-rule"></i>
                        </div>
                        <div className="action close" onClick={() => onEndCall()}>
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
            user: null
        }
        userApi.getUserBasicInfo(props.config.callTo).then(user => this.setState({user}))
        console.log("dech mo")
    }

    componentWillUnmount() {
        console.log("what")
    }

    render() {
        let {config, clientID, onClose, type, mKey} = this.props;
        return (
            <MediaCallLayout
                callType={CALL_TYPES.VOICE}
                {...config}
                clientID={clientID}
                mKey={mKey}
                onClose={onClose}
            >
                {(layoutProps) => {

                    return (
                        <VoiceCallWidget
                            {...this.props}
                            {...layoutProps}
                            user={this.state.user}
                        />
                    )
                }}
            </MediaCallLayout>
        )

    }
}



