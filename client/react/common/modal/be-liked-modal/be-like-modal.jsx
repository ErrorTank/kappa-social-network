import React, {Component} from "react";
import { CommonModalLayout } from "../common-modal-layout";
import { modals } from './../modals';

export const beLikedModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <BeLikedModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
            disabledOverlayClose: config.disabledClose
        });
        return modal.result;
    }
};

class BeLikedModal extends Component {
    constructor(props){
        super(props);
        this.state={
            loading: true,
            errorCode: null,
        };
    }
    render() {
        let {onClose, profile} = this.props
        return (
            <div>
                <CommonModalLayout
                className = "be-liked-model" 
                onClose={() => {
                    if(!loading){
                        onClose();
                    }
                }}
                title ={"title"}
                actions={[
                    {
                        className: "btn-common-primary",
                        onClick: () => {
                            onClose()
                        },
                        content: `Xem hồ sơ ${profile.name}`
                    }
                ]}
                >
                    <div>
                         {profile.name} đã thích bạn
                    </div>
                </CommonModalLayout>
            </div>
        )
    }
}
