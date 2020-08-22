import React from 'react';
import classnames from "classnames";

export const BlurImgWrapper = ({className, imgSrc}) => {
    return (
        <div className={classnames("blur-img-panel", className)}>
            <div className="img-wrapper">
                <img src={imgSrc}/>
            </div>

        </div>
    );
};

