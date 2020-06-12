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
        const $window = $(document);
        const $dropAreaOverlay = $elem.find(".drop-area-overlay");
        console.log($dropAreaOverlay)
        $window.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {

            e.preventDefault();
            e.stopPropagation();

        });
        $window
            .on('dragenter dragover', (e) => {

                $elem.addClass("window-on-drag");
            })
            .on('dragleave', (e) => {
                console.log($elem.has($(e.target)))
                // if(!$elem.is($(e.target)) && !$elem.has($(e.target))){
                //     console.log("Sasa")
                // }
                // console.log("Dasdasdas")
                // $elem.removeClass("window-on-drag");

            })
            .on('drop', (e) => {
                $elem.removeClass("window-on-drag");

            })


        $dropAreaOverlay
            .on('dragenter dragover', (e) => {


                $elem.addClass("active-drag");
            })
            .on('dragleave dragend', (e) => {

                $elem.removeClass("active-drag");
            })
            .on('drop', (e) => {

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