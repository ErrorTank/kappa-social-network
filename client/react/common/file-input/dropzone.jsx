import {KComponent} from "../k-component";
import React from "react";
import {LoadingInline} from "../loading-inline/loading-inline";
import {InputFileWrapper} from "./file-input";
import classnames from "classnames"
import ReactDOM from "react-dom"

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
        const $dropAreaOverlay = $elem.find(".drop-area-overlay");

        $window.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {

            e.preventDefault();
            e.stopPropagation();

        });
        $elem.addClass("window-on-drag");
        let counter2 = 0;
        // $window
        //     .on('dragenter', (e) => {
        //         counter1 ++;
        //         $elem.addClass("window-on-drag");
        //     })
        //     .on('dragover', (e) => {
        //         $elem.addClass("window-on-drag");
        //     })
        //     .on('dragleave dragend', (e) => {
        //         counter1 --;
        //
        //         if(counter1 === 0)
        //             $elem.removeClass("window-on-drag");
        //
        //     })
        //     .on('drop', (e) => {
        //         counter1 --;
        //
        //         $elem.removeClass("window-on-drag");
        //     })


        $dropAreaOverlay
            .on('dragenter dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("enter")
                $elem.addClass("active-drag");
            })

            .on('dragleave dragend', (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("leave")
                $elem.removeClass("active-drag");


            })
            .on('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();


                $elem.removeClass("active-drag");

                const dataTransfer = e.originalEvent.dataTransfer;
                this.handleChangeFile(dataTransfer.files);
            })

    }

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
            className, dropPlaceHolder, accept = "*", multiple = false
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

                    <InputFileWrapper
                        multiple={multiple}
                        accept={accept}
                        className="select-file"
                        onUploaded={this.handleChangeFile}
                    />
                </div>
            </div>
        );
    }
}


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}