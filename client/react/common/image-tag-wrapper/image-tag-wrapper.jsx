import React, {Component} from 'react';
import {getImageDimensions} from "../../../common/utils/file-upload-utils";
import classnames from "classnames"

export class ImageTagWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            clickPoint: null
        }
        getImageDimensions(props.file).then(dimensions => this.setState({...dimensions}))
    }

    handleClickOverlay = (e) => {
        let {threshHold = 68} = this.props;
        let {width, height,} = this.state;
        let ratio = width / height;
        let focusBoxLength = threshHold * ratio;
        let bounds = e.target.getBoundingClientRect();
        let x = e.clientX - bounds.left;
        let y = e.clientY - bounds.top;
        // this.setState({
        //     checkPoint: {
        //         x:
        //     }
        // })
        console.log(x)
        console.log(y)
    }


    render() {
        let {width, height,} = this.state;
        let {maxWidth = 600, maxHeight = 400, className, children, } = this.props;
        let ratio = width / height;
        let baseWidth = (width <= maxWidth ? width : maxWidth);
        let baseHeight = (height <= maxHeight ? height : maxHeight);
        let realWidth = width >= height ? baseWidth : baseHeight * ratio;
        let realHeight = width >= height ? baseWidth / ratio : baseHeight;

        return (
            <div className={classnames("image-tag-wrapper", className)} style={{
                width: realWidth,
                height: realHeight
            }}>
                {children({})}
                <div className="tag-overlay">
                    <div className="tags-container" onClick={this.handleClickOverlay}>

                    </div>
                </div>
            </div>
        );
    }
}

