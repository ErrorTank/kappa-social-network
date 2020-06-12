
import React from "react";

export class InputFileWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    inputElem = null;

    handleSubmit = (e) => {
        const {multiple, onUploaded} = this.props;
        console.log(e.target)
        console.log(multiple)
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
        if (limitSize && file.size > limitSize) {
            // dialogs.alert({
            //     headerText: `This file is greater than ${formatBytes(limitSize)}`,
            //     text: limitSizeMessage || "The file must be no larger than " + formatBytes(limitSize) + "."
            // });
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
