import React, {Component} from 'react';
import {getImageDimensions} from "../../../common/utils/file-upload-utils";
import classnames from "classnames"
import {TagBox} from "./tag-box";
import {TagSelect} from "./tag-select";
import {ClickOutside} from "../click-outside/click-outside";
import {utilityApi} from "../../../api/common/utilities-api";
import {LoadingInline} from "../loading-inline/loading-inline";
import {Tooltip} from "../tooltip/tooltip";

const createDetectionsCache = () => {
    let detectionsMap = {};
    return {
        setDetections: (file, detections) => detectionsMap[file.fileID] = detections,
        getDetections: async (file, displaySize) => {
            if(detectionsMap[file.fileID]){
                return detectionsMap[file.fileID]
            }
            return utilityApi.detectImageFaces(file.file, displaySize, "file")
                .then(data => {
                    detectionsMap[file.fileID] = [...data];
                    return data;
                })
        }
    }
}

export const detectionsCache = createDetectionsCache();

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

        getImageDimensions(props.file.file).then(({width, height}) => {
            let {maxWidth = 600, maxHeight = 400} = props;
            let ratio = width / height;
            let baseWidth = (width <= maxWidth ? width : maxWidth);
            let baseHeight = (height <= maxHeight ? height : maxHeight);
            let realWidth = width >= height ? baseWidth : baseHeight * ratio;
            let realHeight = width >= height ? baseWidth / ratio : baseHeight;
            detectionsCache.getDetections(props.file, {width: realWidth, height: realHeight}).then(data => {
                // console.log(data)
                this.setState({
                    detections: data.map(each => {
                        let {detection} = each;
                        let {_box, _imageDims} = detection;
                        let {_height, _width, _x, _y} = _box;
                        let {_height: imgHeight, _width: imgWidth} = _imageDims
                        return {
                            ratioX: imgWidth / _x,
                            ratioY: imgHeight / _y,
                            boxWidthRatio: imgWidth / _width,
                            boxHeightRatio: imgHeight / _height
                        }
                    }),
                    loadDetections: false
                })
            })
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
                x: x < focusBoxHalfLength ? 0 : x > (width - focusBoxHalfLength) ? width - defaultBoxLength : x - focusBoxHalfLength,
                y: y < focusBoxHalfLength ? 0 : y > (height - focusBoxHalfLength) ? height  - defaultBoxLength : y - focusBoxHalfLength,
                boxWidth: defaultBoxLength,
                boxHeight: defaultBoxLength
            }
        })

    }

    onSelectDetection = detection => {
        let {width, height} = this.state;
        this.setState({
            centerPoint: {
                x: width / detection.ratioX,
                y: height / detection.ratioY,
                boxWidth: width / detection.boxWidthRatio,
                boxHeight: height / detection.boxHeightRatio
            }
        })
    }


    render() {
        let {width, height, centerPoint, ratio, detections, loadDetections} = this.state;
        let {className, defaultBoxLength = 70, api, isTagged, onSelect, tagged, onRemove, imgSrc} = this.props;

        // console.log(detections)
        return (
            <ClickOutside onClickOut={() => this.setState({centerPoint: null})}>
                <div className={classnames("image-tag-wrapper", className)} style={{
                    width,
                    height
                }}>
                    <img ref={img => this.img = img} src={imgSrc}/>
                    <div className="tag-overlay">
                        <div className="tags-container" onClick={this.handleClickOverlay}>
                            {detections.map((each, i) => (
                                <div className="detection" key={i}
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         this.onSelectDetection(each);
                                     }}
                                     style={{
                                         width: width / each.boxWidthRatio,
                                         height: height / each.boxHeightRatio,
                                         left: width / each.ratioX,
                                         top: height / each.ratioY,

                                     }}

                                >
                                    <Tooltip
                                        text={() => "Bấm để gắn thẻ"}
                                        position={"bottom"}
                                    >
                                        <div style={{
                                            width: width / each.boxWidthRatio,
                                            height: height / each.boxHeightRatio,
                                        }}/>
                                    </Tooltip>
                                </div>

                            ))}
                            {centerPoint && (
                                <TagSelect
                                    point={centerPoint}
                                    api={api}
                                    isTagged={isTagged}
                                    onSelect={user => {
                                        onSelect({
                                            related: user,
                                            ratioX: width / centerPoint.x,
                                            ratioY: height / centerPoint.y,
                                            boxWidthRatio: width / centerPoint.boxWidth,
                                            boxHeightRatio: height / centerPoint.boxHeight

                                        });
                                        this.setState({centerPoint: null})
                                    }}
                                />
                            )}
                            {tagged.map((each, index) => {
                                let {ratioX, ratioY, boxWidthRatio, boxHeightRatio} = each;
                                let boxWidth = width / boxWidthRatio;
                                let boxHeight = height / boxHeightRatio;
                                return (
                                    <div className="tag-label" key={each.related._id}
                                         style={{
                                             left: width / ratioX + boxWidth / 2,
                                             top: height / ratioY + boxHeight / 2
                                         }}
                                         onClick={e => e.stopPropagation()}
                                    >
                                        <div className="label-container">
                                            <div className="arrow" style={{top: boxHeight / 2 + "px"}}/>
                                            <div className="label"
                                                 style={{top: boxHeight / 2 + 2 + "px"}}>
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

                            {centerPoint && (
                                <TagBox
                                    point={centerPoint}
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

