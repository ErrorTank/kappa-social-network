import React, {PureComponent} from 'react';
import {BirthdaySection} from "./birthday-section/birthday-section";
import {ContactSection} from "./contact-section/contact-section";
import {GroupSection} from "./group-section/group-section";
import {ChatSettings} from "./chat-settings/chat-settings";
import {userChatSettings} from "../../../../../common/states/common";
import {ThemeContext} from "../../../../context/theme-context";
import classnames from "classnames"

export class ChatWidget extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            chatSettings: userChatSettings.getState() || {}
        }
    }



    chatSections = [
        {
            title: "Sinh nhật",
            render: ({darkMode}) => {
                return (
                    <BirthdaySection
                        {...this.state}
                        darkMode={darkMode}
                    />
                )
            }
        },{
            title: "Liên lạc",
            render: ({darkMode}) => {
                return (
                    <ContactSection  {...this.state}   darkMode={darkMode}/>
                )
            }
        },{
            title: "Nhóm Chat",
            render: ({darkMode}) => {
                return (
                    <GroupSection  {...this.state}   darkMode={darkMode}/>
                )
            }
        },
    ];

    render() {
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className={classnames("chat-widget", {darkMode})}>
                        <ChatSettings
                            {...this.state}
                            darkMode={darkMode}
                        />
                        {this.chatSections.map((each, i) => (
                            <div className="chat-widget-section" key={i}>
                                <p className="cws-title">{each.title}</p>
                                <div className="cws-body">
                                    {each.render({darkMode})}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </ThemeContext.Consumer>

        );
    }
}
