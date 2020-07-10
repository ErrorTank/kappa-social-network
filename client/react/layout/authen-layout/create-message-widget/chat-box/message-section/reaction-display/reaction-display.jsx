import React from 'react';
import {transformReactionsObject, transformReactionObjectToSortedArray, removeNonReaction} from "../../../../../../../common/utils/messenger-utils";
import {createPipelines} from "../../../../../../../common/utils/pipelines";
import {Emoji} from "emoji-mart";
import {REACTION_EMOJI_MAP} from "../../../../../../common/reactions-widget/reactions-widget";

export const ReactionDisplay = ({reactions}) => {
    let pipelines = createPipelines([transformReactionsObject, transformReactionObjectToSortedArray, removeNonReaction])
    return (
        <div className="reaction-display">
            {pipelines(reactions).map(each => (
                <div key={each.key} className="reaction">
                    <Emoji
                        set={"facebook"}
                        size={16}
                        emoji={REACTION_EMOJI_MAP[each.key]}
                    />
                    <span className="count">
                        {each.count}
                    </span>
                </div>
            ))}
        </div>
    );
};

