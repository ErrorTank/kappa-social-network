import React, {Component} from 'react';
import {Tooltip} from "../../../common/tooltip/tooltip";
import {searchMessageWidgetController} from "../search-message-panel/search-message-panel";
import {Avatar} from "../../../common/avatar/avatar";

export class CollapseBubbles extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        let {list, onClick, onClose} = this.props;
        return (
            <Tooltip
                position={"left"}
                className={"collapse-bubbles-tooltip"}
                text={() => (
                    <div >
                        {list.map(each => (
                            <div className="item" key={each._id} onClick={() => onClick(each._id)}>
                                {each.basic_info.username}
                                <span className="icon-wrapper" onClick={(e) => {
                                    e.stopPropagation();
                                    onClose(each._id);
                                }}>
                                    <i className="fal fa-times"></i>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            >
                <div className="chat-room-bubble collapse-bubble"
                >
                    <div className="collapse-count">
                        <span>+{list.length}</span>
                    </div>
                    <Avatar
                        user={list[0]}
                    />
                </div>
            </Tooltip>
        );
    }
}
