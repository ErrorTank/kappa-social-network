
import React, {Component} from 'react';
import {modals} from "../modal/modals";
import {CommonModalLayout} from "../modal/common-modal-layout";
import {ThemeContext} from "../../context/theme-context";
import data from 'emoji-mart/data/facebook.json'
import { NimblePicker } from 'emoji-mart'

export const emojiEditModal = {
    open(config) {
        const modal = modals.openModal({
            content: (
                <EmojiEditModal
                    {...config}
                    onClose={(r) => modal.close(r)}
                />
            ),
        });
        return modal.result;
    }
};

class EmojiEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    selectDefaultEmoji = (emoji) => {

        this.props.onClose({
            id: emoji.id,
            skin: emoji.skin
        });
    };


    render() {
        let {onClose} = this.props;

        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <CommonModalLayout
                        className="edit-emoji-modal"
                        onClose={onClose}
                        title={"Biểu cảm mặc định"}
                        actions={[ {
                            className: "btn-cancel",
                            onClick: onClose,
                            content: "Đóng"
                        }]}
                    >
                        <div className="emoji-picker-wrapper">
                            <NimblePicker set={'facebook'} data={data} autoFocus={true} onSelect={this.selectDefaultEmoji}/>
                        </div>
                    </CommonModalLayout>
                )}
            </ThemeContext.Consumer>
        );
    }
}



