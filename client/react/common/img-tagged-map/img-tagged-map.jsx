import React, {Component} from 'react';
import {getImageDimensions} from "../../../common/utils/file-upload-utils";
import classnames from "classnames"

export class ImgTaggedMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            ratio: null,
            focusTag: null
        }
        this.loadState();

    }

    loadState = () => {
        getImageDimensions(this.props.imgSrc).then(({width, height}) => {
            let {maxWidth = 700, maxHeight = 500} = this.props;
            let ratio = width / height;
            let baseWidth = (width <= maxWidth ? width : maxWidth);
            let baseHeight = (height <= maxHeight ? height : maxHeight);

            let realWidth = width >= height ? baseWidth : baseHeight * ratio;
            let realHeight = width >= height ? baseWidth / ratio : baseHeight;
            this.setState({width: realWidth, height: realHeight, ratio})
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.imgSrc !== this.props.imgSrc){
            this.loadState();
        }
    }

    renderTag = (each) => {
        let {width, height} = this.state;
        let {ratioX, ratioY, boxWidthRatio, boxHeightRatio} = each;
        let boxWidth = width / boxWidthRatio;
        let boxHeight = height / boxHeightRatio;
        return (
            <div className="tag-label"
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
                    </div>
                </div>

            </div>
        )
    }

    render() {
        let {isHighLight, tagged, imgSrc, renderTag} = this.props;
        let {width, height, ratio, focusTag} = this.state;

        return (
            <div className="img-tagged-map" style={{
                width,
                height
            }}>
                <img src={imgSrc} ref={img => this.img = img}/>
                <div className="tags-overlay">
                    <div className="tags-container" onClick={this.handleClickOverlay}>
                        {tagged.map((each, i) => (
                            <div className={classnames("tag-box", {active: isHighLight(each)})} key={i}
                                 onMouseEnter={() => this.setState({focusTag: each})}
                                 onMouseLeave={() => this.setState({focusTag: null})}
                                 style={{
                                     width: width / each.boxWidthRatio,
                                     height: height / each.boxHeightRatio,
                                     left: width / each.ratioX,
                                     top: height / each.ratioY,

                                 }}

                            >
                            </div>

                        ))}
                        {/*{centerPoint && (*/}
                        {/*    <TagSelect*/}
                        {/*        point={centerPoint}*/}
                        {/*        api={api}*/}
                        {/*        isTagged={isTagged}*/}
                        {/*        onSelect={user => {*/}
                        {/*            onSelect({*/}
                        {/*                related: user,*/}
                        {/*                ratioX: width / centerPoint.x,*/}
                        {/*                ratioY: height / centerPoint.y,*/}
                        {/*                boxWidthRatio: width / centerPoint.boxWidth,*/}
                        {/*                boxHeightRatio: height / centerPoint.boxHeight*/}

                        {/*            });*/}
                        {/*            this.setState({centerPoint: null})*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*)}*/}
                        {focusTag ? (
                            this.renderTag(focusTag)
                        ) : null}

                    </div>
                </div>
            </div>
        );
    }
}

