import React, {Component} from 'react';


export const TagBox = (props) => {
    let {focusBoxLength, position} = props;
    return (
        <div className="tag-box" style={{left: position.x - focusBoxLength / 2 + "px", top: position.y - focusBoxLength / 2 + "px", width: focusBoxLength + "px", height: focusBoxLength + "px"}}>

        </div>
    );
};


