import React, {Component} from 'react';
import {getImageDimensions} from "../../../common/utils/file-upload-utils";
import classnames from "classnames"
import {TagBox} from "./tag-box";
import {TagSelect} from "./tag-select";
import {ClickOutside} from "../click-outside/click-outside";

export class ImageTagWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            centerPoint: null,
            ratio: null
        }
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

    handleClickOverlay = (e) => {
        let {threshHold = 68} = this.props;
        let {width, height, ratio} = this.state;
        let focusBoxHalfLength = (threshHold * ratio) / 2;
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
        let {width, height, centerPoint, ratio} = this.state;
        let {children, className, threshHold = 68, api, isTagged, onSelect, tagged, onRemove} = this.props;
        let focusBoxLength = threshHold * ratio;

        return (
            <ClickOutside onClickOut={() => this.setState({centerPoint: null})}>
                <div className={classnames("image-tag-wrapper", className)} style={{
                    width,
                    height
                }}>
                    {children({})}

                    <div className="tag-overlay">
                        <div className="tags-container" onClick={this.handleClickOverlay}>
                            {centerPoint && (
                                <TagSelect
                                    position={centerPoint}
                                    focusBoxLength={focusBoxLength}
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
                                         style={{"zIndex": index + 1, left: width / each.ratioX, top: height / each.ratioY}}
                                         onClick={e => e.stopPropagation()}
                                    >
                                        <div className="label-container">
                                            <div className="arrow" style={{top: focusBoxLength/2 + "px"}}/>
                                            <div className="label" style={{top: focusBoxLength/2 + 2 +  "px"}}>
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
                                    focusBoxLength={focusBoxLength}
                                    position={centerPoint}
                                />
                            )}
                        </div>

                    </div>
                </div>
            </ClickOutside>

        );
    }
}

