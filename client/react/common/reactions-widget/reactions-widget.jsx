import React from 'react';

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

export const ReactionsWidget = ({onSelect, active}) => {
    return (
        <div className="reactions-widget">

        </div>
    );
};
