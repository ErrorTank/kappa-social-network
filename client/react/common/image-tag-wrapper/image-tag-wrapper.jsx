import React, {Component} from 'react';
import {getImageDimensions} from "../../../common/utils/file-upload-utils";
import classnames from "classnames"
import {TagBox} from "./tag-box";
import {TagSelect} from "./tag-select";
import {ClickOutside} from "../click-outside/click-outside";
import {utilityApi} from "../../../api/common/utilities-api";
import {LoadingInline} from "../loading-inline/loading-inline";


export class ImageTagWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            centerPoint: null,
            ratio: null,
            detections: [],
            loadDetections: true
        }
        utilityApi.detectImageFaces(props.file).then(data => {
            console.log(data)
            this.setState({
                detections: data,
                loadDetections: false
            })
        })
        getImageDimensions(props.file).then(({width, height}) => {
            let {maxWidth = 600, maxHeight = 400} = props;
            let ratio = width / height;
            let baseWidth = (width <= maxWidth ? width : maxWidth);
            let baseHeight = (height <= maxHeight ? height : maxHeight);
            let realWidth = width >= height ? baseWidth : baseHeight * ratio;
            let realHeight = width >= height ? baseWidth / ratio : baseHeight;
            this.setState({width: realWidth, height: realHeight, ratio})
        })
    }

    // async componentDidMount() {
    //
    //     const detections = await faceapi.detectAllFaces(this.img).withFaceLandmarks()
    //
    //     this.setState({
    //         detections: faceapi.resizeResults(detections, { width: this.img.width, height: this.img.height }).map(detect => {
    //             return detect.detection.box
    //         })
    //     })
    //
    // }

    handleClickOverlay = (e) => {
        let {defaultBoxLength = 70} = this.props;
        let {width, height} = this.state;
        let focusBoxHalfLength = defaultBoxLength / 2;
        let bounds = e.target.getBoundingClientRect();
        let x = e.clientX - bounds.left;
        let y = e.clientY - bounds.top;
        this.setState({
            centerPoint: {
                x: x < focusBoxHalfLength ? focusBoxHalfLength : x > (width - focusBoxHalfLength) ? (width - focusBoxHalfLength) : x,
                y: y < focusBoxHalfLength ? focusBoxHalfLength : y > (height - focusBoxHalfLength) ? (height - focusBoxHalfLength) : y
            }
        })

    }


    render() {
        let {width, height, centerPoint, ratio, detections, loadDetections} = this.state;
        let {className, defaultBoxLength = 70, api, isTagged, onSelect, tagged, onRemove, imgSrc} = this.props;


        return (
            <ClickOutside onClickOut={() => this.setState({centerPoint: null})}>
                <div className={classnames("image-tag-wrapper", className)} style={{
                    width,
                    height
                }}>
                    <img ref={img => this.img = img} src={imgSrc}/>
                    <div className="tag-overlay">
                        <div className="tags-container" onClick={this.handleClickOverlay}>
                            {centerPoint && (
                                <TagSelect
                                    position={centerPoint}
                                    focusBoxLength={defaultBoxLength}
                                    api={api}
                                    isTagged={isTagged}
                                    onSelect={user => {
                                        onSelect(user, width / centerPoint.x, height / centerPoint.y);
                                        this.setState({centerPoint: null})
                                    }}
                                />
                            )}
                            {tagged.map((each, index) => {
                                return (
                                    <div className="tag-label" key={each.related._id}
                                         style={{
                                             "zIndex": index + 1,
                                             left: width / each.ratioX,
                                             top: height / each.ratioY
                                         }}
                                         onClick={e => e.stopPropagation()}
                                    >
                                        <div className="label-container">
                                            <div className="arrow" style={{top: defaultBoxLength / 2 + "px"}}/>
                                            <div className="label"
                                                 style={{top: defaultBoxLength / 2 + 2 + "px"}}>
                                                {each.related.basic_info.username}
                                                <i className="fal fa-times" onClick={() => onRemove(each)}></i>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}

                        </div>
                    </div>
                    <div className="tag-box-overlay">
                        <div className="tag-box-container">
                            {detections.map((each, i) => (
                                <div className="detection" key={i}
                                     style={{
                                         width: each.width,
                                         height: each.height,
                                         left: each.left,
                                         top: each.top
                                     }}>

                                </div>
                            ))}
                            {centerPoint && (
                                <TagBox
                                    focusBoxLength={defaultBoxLength}
                                    position={centerPoint}
                                />
                            )}
                        </div>

                    </div>
                    {loadDetections && (
                        <>
                            <LoadingInline className="detection-loader"/>
                            <p className="dl-text">Đang nhận diện...</p>
                        </>
                    )}


                </div>
            </ClickOutside>

        );
    }
}

