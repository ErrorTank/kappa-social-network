import React, {Component} from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {messengerApi} from "../../../../../api/common/messenger-api";
import {messengerIO} from "../../../../../socket/sockets";
import {ThemeContext} from "../../../../context/theme-context";

export class ChatRoomBubble extends Component {
    constructor(props){
        super(props);
        this.state = {
            user: null,
            showCloseIcon: false
        };
        messengerApi.getUserBubbleBriefInfo(props.userID).then(user => this.setState({user}));
        this.io = messengerIO.getIOInstance();
        this.io.on("change-contact-status", ({active, userID, last_active_at}) => {
            if(userID === props.userID){
                this.setState({user: this.state.user ? {...this.state.user, active, last_active_at} : null});
            }
        });
    };

    componentWillUnmount() {
        this.io.off("change-contact-status");
    }

    render() {
        let {user, showCloseIcon, } = this.state;
        let {onClick} = this.props;
        return (
          <ThemeContext.Consumer>
              {({darkMode}) => (
                  <div className="chat-room-bubble"
                       onMouseEnter={() => this.setState({showCloseIcon: true})}
                       onMouseLeave={() => this.setState({showCloseIcon: false})}
                       onClick={onClick}
                  >
                      {showCloseIcon && (
                          <div className="chat-box-toggle"
                               onClick={(e) => {
                                   e.stopPropagation();
                                   this.props.onClose();
                               }}
                          >
                              <div>
                                  <i className="fal fa-times"></i>
                              </div>

                          </div>
                      )}
                      {!user ? (
                          <SkeletonTheme color={darkMode ? "#242526" : "#e3e3e3"} highlightColor={darkMode ? "#333436" : "#ebebeb"}>
                              <Skeleton count={1} height={50} width={50} duration={1} circle={true}/>
                          </SkeletonTheme>
                      ) : (
                          <StatusAvatar
                              active={user.active}
                              user={user}
                          />
                      )}
                  </div>
              )}
          </ThemeContext.Consumer>
        );
    }
}
