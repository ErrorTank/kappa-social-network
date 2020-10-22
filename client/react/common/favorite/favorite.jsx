import React from 'react';
import classnames from "classnames";

export const Favorite = ({className, active, onClick = () => null, favorite, readOnly = false}) => {
    let {icon, label} = favorite;
    return (
        <div className={classnames("favorite", className, {active, readOnly})} onClick={() => onClick(active)}>
            {icon}
            <span>{label}</span>
        </div>
    );
};

