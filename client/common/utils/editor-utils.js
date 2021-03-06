import React, {Fragment} from "react";
import {getURLsFromText} from "./string-utils";
import {v4 as uuidv4} from 'uuid';
import {Link} from "react-router-dom";
import {unicodeEmojiRegexp} from 'draft-js-emoji-mart-plugin/lib/constants';
import data from 'emoji-mart/data/facebook.json';
import createEmojiMartPlugin from "draft-js-emoji-mart-plugin";

const emojiPlugin = createEmojiMartPlugin({
    data,
    set: 'facebook',
    emojiSize: 16
});
import {checkText} from 'smile2emoji'
import {createPipelines} from "./pipelines";

const {Emoji} = emojiPlugin;

const transformEditorState = (rawEditorState) => {
    // console.log(Object.values(rawEditorState.entityMap))
    return {
        content: rawEditorState.blocks[0].text.trim(),
        mentions: Object.values(rawEditorState.entityMap).filter(each => each.type === "mention").map(each => ({
            related: each.data.mention._id,
            name: each.data.mention.name.trim()
        })),
        hyperlinks: getURLsFromText(rawEditorState.blocks[0].text.trim())
    }
};

const removeBadCharacters = text => [...text].filter(v => {

    return v.charCodeAt(0) <= 127 || (v.charCodeAt(0) >= 160 && v.charCodeAt(0) <= 255);
}).join("");

const removeUFFDCharacters = text => [...text].filter(v => {
    return v.charCodeAt(0) <= 50000 ;
}).join("");

const formatUTF8EmojiText = text => {
    let paths = [];
    // console.log(text)
    // console.log(text.replace(/\uFFFD/g, ''))
    let result = (text);

    let matches = text.matchAll(unicodeEmojiRegexp);

    let index = 0;
    for (let match of matches) {

        if (match.index > index) {

            paths = paths.concat({
                path: removeUFFDCharacters(result.substring(index, match.index))
            })
        }
        paths = paths.concat({
            path: <Emoji decoratedText={match[0]}/>
        })
        index = match.index + 1;

    }

    if (index < result.length) {
        paths.push({
            path: removeUFFDCharacters(result.substring(index))
        })
    }
    return paths;

}

const transformMessageContentToPaths = ({content, mentions}, {disabledLink = false}) => {

    let resultStr = content;
    let contentPaths = [];

    if (!mentions.length) {
        contentPaths = formatUTF8EmojiText(content)
    } else {

        for (let mention of mentions) {

            let index = resultStr.indexOf(`@${mention.name}`);

            if (index > 0) {
                contentPaths = contentPaths.concat(formatUTF8EmojiText(resultStr.substring(0, index)));
            }

            contentPaths = contentPaths.concat({
                path: resultStr.substring(index, index + mention.name.length + 1),
                link: `/profile/${mention.related}`,
                context: mention
            })


            resultStr = resultStr.substring(index + mention.name.length + 1);
        }
        if (resultStr) {

            contentPaths = contentPaths.concat(formatUTF8EmojiText(resultStr));
        }
    }
    // console.log(contentPaths)

    return contentPaths.map((each => (
        <Fragment key={uuidv4()}>{(each.link && !disabledLink) ? (
            <Link className="message-link" to={each.link}>{each.path}</Link>) : each.path}</Fragment>
    )))
}

const getRenderableContentFromMessage = (message, options = {}) => {

    let pipelines = createPipelines([
        (message) => ({
            content: checkText(message.content),
            mentions: message.mentions || []
        }),
        (data) => transformMessageContentToPaths({...data}, options)
    ])
    return pipelines(message)

}

export {
    transformEditorState,
    getRenderableContentFromMessage
}