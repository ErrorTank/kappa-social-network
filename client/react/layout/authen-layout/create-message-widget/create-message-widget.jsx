import React, { Component } from 'react';
import classnames from 'classnames';
import { CreatePanel } from './create-panel/create-panel';
import FloatBottomWidget from '../float-bottom-widget/float-bottom-widget';
import { MessageBoxLayout } from '../message-box-layout/message-box-layout';
import { Tooltip } from '../../../common/tooltip/tooltip';
import { searchMessageWidgetController } from '../search-message-panel/search-message-panel';
import { ChatRoomBubble } from './chat-room-bubble/chat-room-bubble';
import { ChatBox } from './chat-box/chat-box';
import omit from 'lodash/omit';
import { CollapseBubbles } from '../collapse-bubble/collapse-bubbles';
import { messengerApi } from '../../../../api/common/messenger-api';
import { chatApi } from './../../../../api/common/chat-api';

export let messageWidgetController = {};

export class CreateMessageWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreatePanel: false,
      currentChatBox: null,
      bubbleList: [],
      userMap: {},
    };
    messageWidgetController = {
      open: () => {
        searchMessageWidgetController.close();
        this.setState({ showCreatePanel: true, currentChatBox: null });
      },
      close: () => {
        this.setState({ showCreatePanel: false, currentChatBox: null });
      },
      createNewChatBox: ({ userID, message }) => {
        let { bubbleList } = this.state;

        this.setState({ currentChatBox: userID, showCreatePanel: false });
        searchMessageWidgetController.close();

        if (bubbleList.indexOf(userID) === -1) {
          this.setState({ bubbleList: bubbleList.concat(userID) });
        }
      },
      focusOnChatBox: ({ userID }) => {
        let { bubbleList } = this.state;
        if (bubbleList.indexOf(userID) === -1) {
          this.setState({
            currentChatBox: userID,
            showCreatePanel: false,
            bubbleList: bubbleList.concat(userID),
          });
        } else {
          if (this.state.currentChatBox !== userID) {
            messengerApi
              .getUserBubbleBriefInfo(userID)
              .then((data) => this.handleUserBriefFetch(userID, data));
          }
        }
      },
    };
  }

  createNewChatRoom = () => {};

  closeChatBox = ({ userID }) => {
    this.setState({
      currentChatBox: null,
      bubbleList: this.state.bubbleList.filter((each) => each !== userID),
      userMap: omit(this.state.userMap, userID),
    });
  };

  handleClickBubbleBox = ({ userID }) => {
    this.setState({ currentChatBox: userID, showCreatePanel: false });
    searchMessageWidgetController.close();
  };

  handleUserBriefFetch = (userID, data) => {
    let { userMap } = this.state;
    let newUserMap = { ...userMap, [userID]: data };
    this.setState({ userMap: newUserMap });
  };

  seenMessages = (userID, messages) => {
    if (messages.length) {
      let { userMap } = this.state;
      let newUserMap = {
        ...userMap,
        [userID]: {
          ...userMap[userID],
          unseen_messages: userMap[userID].unseen_messages.filter(
            (each) => !messages.find((msg) => msg._id === each)
          ),
        },
      };
      this.setState({ userMap: newUserMap });
    }
  };

  render() {
    let { showCreatePanel, bubbleList, currentChatBox, userMap } = this.state;
    let { darkMode } = this.props;
    let reverseList = bubbleList.reverse();
    let showBubbles = reverseList.slice(0, 4);
    let collapseBubbles = reverseList.slice(4);
    return (
      <FloatBottomWidget
        className={classnames('create-message-widget', { darkMode })}
        renderSide={() => (
          <div className='cmw-side'>
            {showBubbles.map((each) => (
              <div className='cmw-round-stack bubble-chat-wrapper' key={each}>
                <ChatRoomBubble
                  userID={each}
                  userInfo={userMap[each]}
                  onFetch={(data) => this.handleUserBriefFetch(each, data)}
                  onClose={() => this.closeChatBox({ userID: each })}
                  onClick={() => this.handleClickBubbleBox({ userID: each })}
                  showUnseenCount={this.state.currentChatBox !== each}
                />
              </div>
            ))}
            {!!collapseBubbles.length && (
              <div className='cmw-round-stack bubble-chat-wrapper'>
                <CollapseBubbles
                  list={collapseBubbles.map((each) => userMap[each])}
                  onClick={(userID) => this.handleClickBubbleBox({ userID })}
                  onClose={(userID) => this.closeChatBox({ userID })}
                />
              </div>
            )}
            <div className='cmw-round-stack'>
              <Tooltip position={'left'} text={() => 'Tạo hội thoại'}>
                <div
                  className='cmw-toggle round'
                  onClick={(e) => {
                    e.stopPropagation();
                    searchMessageWidgetController.close();
                    this.setState({ showCreatePanel: !showCreatePanel });
                  }}
                >
                  <i className='fas fa-comment-plus'></i>
                </div>
              </Tooltip>
            </div>
          </div>
        )}
        renderBox={() => {
          return showCreatePanel ? (
            <MessageBoxLayout
              renderHeader={() => (
                <div className='message-widget-header search-message-header'>
                  <div className='search-message-title left-panel'>
                    Tạo cuộc hội thoại
                  </div>
                  <div className='right-panel'>
                    <div className='actions'>
                      <div
                        className='icon-wrapper'
                        onClick={() =>
                          this.setState({ showCreatePanel: false })
                        }
                      >
                        <i className='fal fa-times'></i>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              renderBody={() => (
                <CreatePanel
                  onCreate={(userID) =>
                    messageWidgetController.createNewChatBox({ userID })
                  }
                />
              )}
            />
          ) : (
            <>
              {bubbleList.map((each) => (
                <ChatBox
                  chatRoomID={this.props.chatRoomID}
                  key={each}
                  userID={each}
                  userInfo={userMap[each]}
                  active={each === currentChatBox}
                  onClose={() => this.closeChatBox({ userID: each })}
                  onMinimize={() => this.setState({ currentChatBox: null })}
                  onSeenMessages={(messages) =>
                    this.seenMessages(each, messages)
                  }
                />
              ))}
            </>
          );
        }}
      />
    );
  }
}
