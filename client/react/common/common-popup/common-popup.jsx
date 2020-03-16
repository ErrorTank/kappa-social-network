import React from "react"

import {CSSTransition, TransitionGroup} from "react-transition-group";
import {createNotificationPopup} from "../app-notification-popup/app-notification-popup";

export const commonPopup = createNotificationPopup({
    timeout: 5000
});


export const CommonPopupRegistry = props => {
    return (
        <CSSTransition in={props.show}  timeout={500} classNames={"slide-down"} onExited={() => props.deleteContent()}>
            {props.content ? (
                <div className="common-popup">
                    {props.content}
                </div>
            ) : <span style={{display: "none"}}></span>}

        </CSSTransition>

    );


};

