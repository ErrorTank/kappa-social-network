import {REACTION_EMOJI_MAP, REACTIONS} from "../../react/common/reactions-widget/reactions-widget";


const sortReactions = (reactions, limit = 3) => {
    let {angry, cry, laugh, love, wow, thump_up, thump_down} = reactions;

    let results = [{angry}, {cry}, {laugh}, {love}, {wow}, {thump_up}, {thump_down}]
        .filter(each => {

            return Object.values(each)[0].length > 0;
        })
        .sort((b,a) => Object.values(b)[0].length - Object.values(a)[0].length)
        .slice(0, limit);
    return {
        countReactions: () => Object.values(reactions).reduce((total, cur) => [...total, ...cur], []).length,
        getRaw: () => results,
        toEmojiMap: () =>
            results
                .map(each => ({key: Object.keys(each)[0], reverse_key: REACTIONS[Object.keys(each)[0]]}))
                .map(each => ({key: each.key, icon_config: REACTION_EMOJI_MAP[each.reverse_key]}))
    }
};

export {
    sortReactions
}