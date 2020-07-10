import React from 'react';
import classnames from "classnames";
import {Emoji} from "emoji-mart";

export const REACTIONS = {
    love: 1,
    laugh: 2,
    wow: 3,
    cry: 4,
    angry: 5,
    thump_up: 6,
    thump_down: 7
};


export const REVERSE_REACTIONS = {
    1: "love",
    2: "laugh",
    3: "wow",
    4: "cry",
    5: "angry",
    6: "thump_up",
    7: "thump_down"
};

export const REACTION_EMOJI_MAP = {
    1: {
        id: "heart"
    },
    2: {
        id: "laughing"
    },
    3: {
        id: "open_mouth"
    },
    4: {
        id: "cry"
    },
    5: {
        id: "angry"
    },
    6: {
        id: "+1"
    },
    7: {
        id: "-1"
    },
}

export const ReactionsWidget = ({onSelect, active = null}) => {
    return (
        <div className="reactions-widget">
            {Object.values(REACTIONS).map(each => {
                return (
                    <div key={each} className={classnames("reaction", {active: each === active})} onClick={() => {
                        if(each === active){
                            onSelect({off: each})
                        }else{
                            onSelect({on: each, off: active});
                        }
                    }}>
                        <Emoji
                            set={'facebook'}
                            emoji={REACTION_EMOJI_MAP[each]}
                            size={32}
                        />
                    </div>
                )
            })}
        </div>
    );
};
