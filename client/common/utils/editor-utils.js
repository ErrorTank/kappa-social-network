import {getURLsFromText} from "./string-utils";

const transformEditorState = (rawEditorState) => {
    return {
        content: rawEditorState.blocks[0].text.trim(),
        mentions: Object.values(rawEditorState.entityMap).filter(each => each.type === "mention"),
        hyperlinks: getURLsFromText(rawEditorState.blocks[0].text.trim())
    }
};

export {
    transformEditorState
}