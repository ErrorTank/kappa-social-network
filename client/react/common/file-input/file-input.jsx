
import React from "react";
import {appModal} from "../modal/modals";
import {checkFileSizeExceed} from "../../../common/utils/file-upload-utils";
import {formatBytes} from "../../../common/utils/file-upload-utils";

export class InputFileWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    inputElem = null;

    handleSubmit = (e) => {
        const {multiple, onUploaded} = this.props;

        e.preventDefault();
        if (multiple) {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                if (!this.checkFileSize(file)) {
                    return;
                }
            }

            onUploaded(e.target.files)
        } else {
            const file = e.target.files[0];
            if (file) {
                if(this.checkFileSize(file)) {
                    onUploaded(file);
                }
            }
        }
    };

    checkFileSize = (file) => {
        const {limitSize, limitSizeMessage} = this.props;
        if (limitSize && checkFileSizeExceed(file.size, limitSize)) {

            appModal.alert({
                title: "Thông báo",
                text: limitSizeMessage || <span>Dung lượng file của bạn đã vượt quá <span className="high-light">{formatBytes(limitSize)}</span>. Vui lòng tải lên file có dung lương thấp hơn <span className="high-light">{formatBytes(limitSize)}</span></span>,
                btnText: "Đồng ý",
            });
            return false;
        }

        return true;
    };

    componentWillReceiveProps({file, multiple = false}) {
        if (!file && !multiple) this.inputElem && this.inputElem.val('');
    }

    renderChildren = () => {
        const {children, multiple = false, disabled = false, accept = ""} = this.props;
        return (
            <>
                {children && children({onClick: () => (this.inputElem && !disabled) && this.inputElem.click()})}
                <input
                    type="file"
                    multiple={multiple}
                    onChange={this.handleSubmit}
                    accept={accept}
                    style={{display: "none"}}
                    ref={elem => this.inputElem = $(elem)}
                />
            </>
        )
    };

    render() {
        const {className, noElemWrap = false} = this.props;

        return noElemWrap ? (
            this.renderChildren()
        ) : (
            <div className={className}>
                {this.renderChildren()}
            </div>
        )
    }
}
