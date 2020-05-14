import React from "react";
import classnames from "classnames";
import {ThemeContext} from "../../context/theme-context";


export function LoadingInline({className}) {
    return (
        <ThemeContext.Consumer>
            {(theme) => (
                <div className={classnames("loading-inline", {darkMode: theme?.darkMode})}
                     onClick={e => {
                         e.stopPropagation()
                     }}
                >
                    <div className="overlay row justify-content-center align-items-center">
                        <i className={classnames("far fa-spinner-third spin-icon spin", className)}/>
                    </div>

                </div>
            )}

        </ThemeContext.Consumer>
    );
}
