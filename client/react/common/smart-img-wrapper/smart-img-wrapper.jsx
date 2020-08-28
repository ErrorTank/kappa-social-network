import React, {Component} from 'react';
import classnames from "classnames"
import {getBase64Image, getImageDimensions} from "../../../common/utils/file-upload-utils";
import {LoadingInline} from "../loading-inline/loading-inline";

export class SmartImgWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: props.imgSrc,
            loading: true,
            width: 0,
            height: 0,
            ratio: null,
        };

        (props.base64 ? getBase64Image(props.imgSrc).then((base64Image) => {

            this.setState({imgSrc: base64Image})
        }) : Promise.resolve(props.imgSrc)).then(src => {
            getImageDimensions(src).then(({width, height}) => {
                let {maxWidth = 700, maxHeight = 500} = this.props;
                let ratio = width / height;
                let baseWidth = (width <= maxWidth ? width : maxWidth);
                let baseHeight = (height <= maxHeight ? height : maxHeight);

                let realWidth = width >= height ? baseWidth : baseHeight * ratio;
                let realHeight = width >= height ? baseWidth / ratio : baseHeight;
                this.setState({width: realWidth, height: realHeight, ratio, loading: false})
            })
        })
    }

    render() {
        let {width, height, imgSrc, loading} = this.state;
        let {className} = this.props;
        return (
            <div className={classnames("smart-img-wrapper", className)} style={{
                width,
                height
            }}>
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <img src={imgSrc} ref={img => this.img = img}/>
                )
                }

            </div>
        );
    }
}
