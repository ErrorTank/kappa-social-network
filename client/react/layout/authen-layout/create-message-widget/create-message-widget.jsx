import React, {Component} from 'react';
import classnames from "classnames";
import {CreatePanel} from "./create-panel/create-panel";
import FloatBottomWidget from "../float-bottom-widget/float-bottom-widget";
import {MessageBoxLayout} from "../message-box-layout/message-box-layout";
import {Tooltip} from "../../../common/tooltip/tooltip";
import {searchMessageWidgetController} from "../search-message-panel/search-message-panel";
import {ChatRoomBubble} from "./chat-room-bubble/chat-room-bubble";
import {ChatBox} from "./chat-box/chat-box";

export let messageWidgetController = {};



export class CreateMessageWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCreatePanel: false,
            currentChatBox: null,
            bubbleList: []
        };
        messageWidgetController = {
            open: () => {
                searchMessageWidgetController.close();
                this.setState({showCreatePanel: true, currentChatBox: null});
            },
            close: () => {
                this.setState({showCreatePanel: false});
            },
            createNewChatBox: ({userID}) => {
                let {bubbleList} = this.state;
                this.setState({currentChatBox: userID, showCreatePanel: false});
                searchMessageWidgetController.close();
                if(bubbleList.indexOf(userID) === -1){
                    this.setState({bubbleList: bubbleList.concat(userID)});
                }

            },
        };
    }

    createNewChatRoom = () => {

    };

    closeChatBox = ({userID}) => {
        this.setState({currentChatBox: null, bubbleList: this.state.bubbleList.filter(each => each !== userID)});
    };

    handleClickBubbleBox = ({userID}) => {
        this.setState({currentChatBox: userID, showCreatePanel: false});
        searchMessageWidgetController.close();
    };

    render() {
        let {showCreatePanel, bubbleList, currentChatBox} = this.state;
        let {darkMode} = this.props;
        return (

            <FloatBottomWidget
                className={classnames("create-message-widget", {darkMode})}
                renderSide={() => (
                    <div className="cmw-side">
                        {bubbleList.reverse().map(each => (
                            <div className="cmw-round-stack bubble-chat-wrapper" key={each}>
                                <ChatRoomBubble
                                    userID={each}
                                    onClose={() => this.closeChatBox({userID: each})}
                                    onClick={() => this.handleClickBubbleBox({userID: each})}
                                />
                            </div>
                        ))}
                        <div className="cmw-round-stack">
                            <Tooltip
                                position={"left"}
                                text={() => "Tạo hội thoại"}
                            >
                                <div className="cmw-toggle round"
                                     onClick={e => {
                                         e.stopPropagation();
                                         searchMessageWidgetController.close();
                                         this.setState({showCreatePanel: !showCreatePanel});
                                     }}
                                >
                                    <i className="fas fa-comment-plus"></i>
                                </div>
                            </Tooltip>
                        </div>

                    </div>

                )}
                renderBox={() => {
                    return showCreatePanel ? (
                        <MessageBoxLayout
                            renderHeader={() => (
                                <div className="message-widget-header search-message-header">
                                    <div className="search-message-title left-panel">
                                        Tạo cuộc hội thoại
                                    </div>
                                    <div className="right-panel">
                                        <div className="actions">
                                            <div className="icon-wrapper" onClick={() => this.setState({showCreatePanel: false})}>
                                                <i className="fal fa-times"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            renderBody={() => (
                                <CreatePanel

                                />
                            )}
                        />
                    ) : bubbleList.map((each) => (
                        <ChatBox
                            key={each}
                            userID={each}
                            active={each === currentChatBox}
                            onClose={() => this.closeChatBox({userID: each})}
                            onMinimize={() => this.setState({currentChatBox: null})}

                        />
                    ))
                }}

            />
        );
    }
}
