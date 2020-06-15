import {KComponent} from "../k-component";
import React from "react";
import {LoadingInline} from "../loading-inline/loading-inline";
import {InputFileWrapper} from "./file-input";
import classnames from "classnames"
import ReactDOM from "react-dom"
import {checkFileSizeExceed} from "../../../common/utils/file-upload-utils";
import {appModal} from "../modal/modals";
import {formatBytes} from "../../../common/utils/file-upload-utils";

export class DropZone extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDropArea: false,
            uploading: false
        };
    }


    componentDidMount() {
        const $elem = $(ReactDOM.findDOMNode(this));
        const $window = $(window);
        // const $dropAreaOverlay = $elem.find(".drop-area-overlay");

        $window.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {

            e.preventDefault();
            e.stopPropagation();

        });
        // $elem.addClass("window-on-drag");
        let counter = 0;
        $window
            .on('dragenter', (e) => {
                counter++;
                $elem.addClass("window-on-drag");
            })
            .on('dragover', (e) => {
                $elem.addClass("window-on-drag");
            })
            .on('dragleave dragend', (e) => {
                counter--;
                console.log(counter)
                if(counter === 0)
                    $elem.removeClass("window-on-drag");

            })
            .on('drop', (e) => {
                counter--;
                $elem.removeClass("window-on-drag");

                const dataTransfer = e.originalEvent.dataTransfer;
                this.handleDropFile(dataTransfer.files);
            })





    }

    handleDropFile = (files) => {
        const {multiple} = this.props;

        if (multiple) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!this.checkFileSize(file)) {
                    return;
                }
            }
            this.handleChangeFile(files)
        } else {
            const file = files[0];
            if (file) {
                if(this.checkFileSize(file)) {
                    this.handleChangeFile(file);
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

    handleChangeFile = (file) => {

        this.setState({uploading: true});
        this.props.onChange(file)
            .then(
                () => this.setState({uploading: false}),
                () => this.setState({uploading: false})
            )
    };

    render() {
        const {
            className, dropPlaceHolder, accept = "*", multiple = false, limitSize, limitSizeMessage, renderInput = false
        } = this.props;
        const {showDropArea, uploading} = this.state;
        const dropZoneWrapperClassName = classnames(
            "drop-zone-wrapper",
            className,
            showDropArea && "active-drag",

        );

        return (
            <div className={dropZoneWrapperClassName}>

                {uploading && (
                    <LoadingInline/>

                )}

                <div className="drop-area-overlay">
                    {dropPlaceHolder}
                    {renderInput && (
                        <>

                            <InputFileWrapper
                                multiple={multiple}
                                accept={accept}
                                className="select-file"
                                onUploaded={this.handleChangeFile}
                                limitSize={limitSize}
                                limitSizeMessage={limitSizeMessage}
                            >
                                {renderInput}
                            </InputFileWrapper>
                        </>
                    )}

                </div>
            </div>
        );
    }
}


