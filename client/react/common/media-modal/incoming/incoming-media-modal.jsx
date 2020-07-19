
import React, {Component} from 'react';
import {modals} from "../../modal/modals";
import {ThemeContext} from "../../../context/theme-context";
import {CommonModalLayout} from "../../modal/common-modal-layout";
import {NimblePicker} from "emoji-mart";
import {userApi} from "../../../../api/common/user-api";
import {CALL_TYPES} from "../../../../common/call-services/call-services";
import {Avatar} from "../../avatar/avatar";
import {LoadingInline} from "../../loading-inline/loading-inline";


export const incomingMediaModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <IncomingMediaModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
            disabledOverlayClose: true
        });
        return modal.result;
    }
}

class IncomingMediaModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
        userApi.getUserBasicInfo(props.callFrom)
            .then(user => this.setState({user}))

    }




    render() {
        let {onClose, callFrom, type} = this.props;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className="incoming-media-modal"
                        onClose={onClose}
                        title={type === CALL_TYPES.VOICE ? "Cuộc gọi đến" : "Cuộc gọi video đến"}
                        actions={[ {
                            className: "btn-decline",
                            onClick: onClose,
                            content: "Từ chối"
                        }, {
                            className: "btn-accept",
                            onClick: () => onClose(true),
                            content: (
                                <span>{type === CALL_TYPES.VOICE ? <i className="fas fa-phone-alt"></i> :
                                    <i className="fas fa-video"></i>}<span>Chấp nhận</span></span>
                            )
                        }]}
                    >
                        <div className="body-wrapper">
                            {this.state.user ? (
                                <>
                                    <Avatar
                                        user={this.state.user}
                                    />
                                    <div className="content">
                                        <div className="content-title">{this.state.user.basic_info.username} đang gọi cho bạn.</div>
                                        <div className="content-sub">Ấn chấp nhận để bắt đầu trò chuyện.</div>
                                    </div>
                                </>

                            ) : (
                                <LoadingInline/>
                            )}
                        </div>
                    </CommonModalLayout>
                )}
            </ThemeContext.Consumer>
        )
    }
}



