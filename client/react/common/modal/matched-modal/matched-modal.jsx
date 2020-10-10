import React, {Component} from "react";
import { CommonModalLayout } from "../common-modal-layout";
import { modals } from './../modals';

export const matchedModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <MatchedModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
            disabledOverlayClose: config.disabledClose
        });
        return modal.result;
    }
};

class MatchedModal extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let {onClose, profile} = this.props
        return (
            <div>
                <CommonModalLayout
                className = "matched-model" 
                onClose={() => {
                    onClose()
                }}
                title ={"title"}
                actions={[
                    {
                        className: "btn-common-primary",
                        onClick: () => {
                            onClose()
                        },
                        content: `Trò truyện với ${profile.name}`
                    }
                ]}
                >
                    <div>
                        Bạn đã kết đôi thành công với {profile.name} 
                    </div>
                </CommonModalLayout>
            </div>
        )
    }
}
