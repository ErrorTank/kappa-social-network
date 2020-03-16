import React from "react";
import classnames from "classnames";

export function LoadingInline({className}) {
    return (
        <div className="loading-inline"
             onClick={e => {
                 e.stopPropagation()
             }}
        >
            <div className="overlay row justify-content-center align-items-center">
                <i className={classnames("far fa-spinner-third spin-icon spin", className)}/>
            </div>

        </div>

    );
}
