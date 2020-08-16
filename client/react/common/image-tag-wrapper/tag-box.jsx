import React, {Component} from 'react';


export const TagBox = (props) => {
    let {point} = props;
    return (
        <div className="tag-box" style={{
            left: point.x + "px",
            top: point.y + "px",
            width: point.boxWidth + "px",
            height: point.boxHeight + "px"
        }}>

        </div>
    );
};


