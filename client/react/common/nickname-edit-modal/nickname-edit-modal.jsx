
import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {LoadingInline} from "../loading-inline/loading-inline";
import {CommonModalLayout} from "../modal/common-modal-layout";
import {chatApi} from "../../../api/common/chat-api";

export const nicknameEditModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <NicknameEditModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
}

class NicknameEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            users: []
        }
        chatApi.getChatRoomUserNicknames(props.chatRoomID)
            .then((users) => {
                this.setState({users, loading: false})
            })
    }



    render() {
        let {onClose,} = this.props;
        return (
            <CommonModalLayout
                className="resend-confirm-token-modal"
                onClose={onClose}
                title={"Cài đặt biệt danh"}

            >
                {this.state.loading ? (
                    <div className="loading-panel">

                    </div>
                ) : (
                    <div>

                    </div>
                )}
            </CommonModalLayout>
        );
    }
}
