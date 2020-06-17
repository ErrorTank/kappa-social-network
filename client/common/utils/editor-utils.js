import React from "react";
import {getURLsFromText} from "./string-utils";
import { v4 as uuidv4 } from 'uuid';
import {Link} from "react-router-dom";

const transformEditorState = (rawEditorState) => {
    return {
        content: rawEditorState.blocks[0].text.trim(),
        mentions: Object.values(rawEditorState.entityMap).filter(each => each.type === "mention").map(each => ({related: each.data.mention._id, name: each.data.mention.name})),
        hyperlinks: getURLsFromText(rawEditorState.blocks[0].text.trim())
    }
};

const getRenderableContentFromMessage = (message) => {
    let {mentions, content} = message;
    let resultStr = content;
    let contentPaths = [];

    if(!mentions.length){
        return (<span>{content}</span>)
    }

    for(let mention of mentions){
        console.log(resultStr)
        console.log(mention)
        let index = resultStr.indexOf(`@${mention.name}`);
        console.log(index)
        if(index > 0){
            contentPaths = contentPaths.concat({
                path: resultStr.substring(0, index),
            });
        }

        contentPaths = contentPaths.concat({
            path: resultStr.substring(index, index + mention.name.length + 1),
            link: `/profile/${mention.related}`,
            context: mention
        })
        console.log(contentPaths)

        resultStr = resultStr.substring(index + mention.name.length + 1);
    }

    return (
        <span>
            {contentPaths.map((each => (
                <span key={uuidv4()}>{each.link ? (<Link className="message-link" to={each.link}>{each.path}</Link>) : each.path}</span>
            )))}
        </span>
    )
}

export {
    transformEditorState,
    getRenderableContentFromMessage
}