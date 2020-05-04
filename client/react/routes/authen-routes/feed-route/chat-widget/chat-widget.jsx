import React, {Component} from 'react';
import {BirthdaySection} from "./birthday-section/birthday-section";
import {ContactSection} from "./contact-section/contact-section";
import {GroupSection} from "./group-section/group-section";
import {ChatSettings} from "./chat-settings/chat-settings";
import {userChatSettings} from "../../../../../common/states/common";

export class ChatWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chatSettings: userChatSettings.getState() || {}
        }
    }

    chatSections = [
        {
            title: "Sinh nhật",
            render: () => {
                return (
                    <BirthdaySection
                        {...this.state}
                    />
                )
            }
        },{
            title: "Liên lạc",
            render: () => {
                return (
                    <ContactSection  {...this.state}/>
                )
            }
        },{
            title: "Nhóm",
            render: () => {
                return (
                    <GroupSection  {...this.state}/>
                )
            }
        },
    ];

    render() {
        return (
            <div className="chat-widget">
                <ChatSettings
                    {...this.state}
                />
            </div>
        );
    }
}
