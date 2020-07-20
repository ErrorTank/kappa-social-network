import React, {Component} from 'react';
import {modals} from "../../modal/modals";
import {CALL_STATUS, MediaCallLayout} from "../media-call-layout/media-call-layout";
import {CALL_TYPES} from "../../../../common/call-services/call-services";
import classnames from "classnames"
import {Avatar} from "../../avatar/avatar";
import {userApi} from "../../../../api/common/user-api";
import {Tooltip} from "../../tooltip/tooltip";

export const voiceCallModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <VoiceCallModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
            disabledOverlayClose: true
        });
        return modal.result;
    }
}

const CALL_STATUS_MATCHER = {
    1: "Đang kêt nối...",
    2: "Đang rung chuông...",
    4: "Kết thúc.",
    5: "Không phản hồi.",
    6: "Không thể kết nối."
}

class VoiceCallWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            microphone: !props.disabledMicrophone,
            webcam: !props.disabledWebcam,
            shareScreen: !props.disabledShareScreen,
        }

    }

    render() {
        let {
            microphone,
            webcam,
            shareScreen
        } = this.state;
        let {user, onClose, type, onMinimize, callStatus, onReject, onRedial, disabledMicrophone, disabledWebcam, toggleVideo, toggleAudio, toggleShareScreen, disabledShareScreen} = this.props;

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
                toolTip: microphone ? "Tắt chia sẻ màn hình" : "Bật chia sẻ màn hình",
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
                    onReject();
                },
            }
        ]
        return (
            <div
                className={classnames("voice-call-modal", {active: callStatus === CALL_STATUS.CALLING && type === CALL_TYPES.VIDEO})}>

                <div className="voice-modal-body">
                    <div className="header-actions">
                        <div className="action" onClick={() => onMinimize()}>
                            <i className="fal fa-horizontal-rule"></i>
                        </div>
                        <div className="action close" onClick={() => onReject()}>
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
                        ) : type === CALL_TYPES.VIDEO ? (
                            <div>
                            </div>
                        ) : (
                            <div className="center-calling-info">
                                <div className="avatar-wrapper">
                                    <Avatar/>
                                </div>
                                <div className="call-info">

                                </div>
                            </div>
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

class VoiceCallModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        userApi.getUserBasicInfo(props.config.callTo).then(user => this.setState({user}))
    }


    render() {
        let {config, clientID, onClose, type, onMinimize} = this.props;
        return (
            <MediaCallLayout
                callType={CALL_TYPES.VOICE}
                {...config}
                clientID={clientID}
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



