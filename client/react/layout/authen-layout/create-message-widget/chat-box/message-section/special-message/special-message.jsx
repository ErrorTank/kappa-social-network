import React from 'react';
import {MESSAGE_TYPES} from "../message";
import {userInfo} from "../../../../../../../common/states/common";
import {Emoji} from "emoji-mart";

let genderMatcher = {
    "MALE": "anh ấy",
    "FEMALE": "cô ấy"
}

const renderMessage = (message) => {
    let userID = userInfo.getState()._id;
    let senderID = message.sentBy._id;
    let toID = message.special_data.to?._id;
    switch (message.special) {
        case MESSAGE_TYPES.NICKNAME:
            return (
                <>
                    {senderID === userID ? "Bạn " : <span className="high-light"> {message.sentBy.basic_info.username} </span>}
                    {message.special_data.value ? "đổi " : "xóa "}biệt danh của
                    {toID === userID ? senderID === userID ? " mình " : " bạn " : senderID === toID ? <span> {genderMatcher[message.special_data.to.basic_info.gender]} </span> : <span className="high-light"> {message.special_data.to.basic_info.username} </span>}
                    {message.special_data.value && (
                        <span>thành<span className="high-light"> {message.special_data.value}</span></span>
                    )}
                </>
            )
        case MESSAGE_TYPES.EMOJI:
            return (
                <>
                    {senderID === userID ? "Bạn " : <span className="high-light">{message.sentBy.basic_info.username} </span>}
                    <span> đổi biểu cảm </span>
                    <span> thành </span>
                    <Emoji
                        set={'facebook'}
                        emoji={message.special_data.value}
                        size={15}
                    />
                </>
            )
    }
};

export const SpecialMessage = ({message}) => {
    return (
        <div className={"special-message"}>
            {renderMessage(message)}
        </div>
    );
};

