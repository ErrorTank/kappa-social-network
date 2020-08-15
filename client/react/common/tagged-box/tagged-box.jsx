import React from 'react';

export const TaggedBox = (props) => {
    let {label, list, displayAs, onRemove, getKey, deleteCondition} = props;
    return (
        <div className="tagged-box">
            <div className="tb-label">
                {label}
            </div>
            <div className={"tag-list"}>
                {list.map(each =>(
                    <div className={"tag"} key={getKey(each)} onClick={() => onRemove(list.filter(item => deleteCondition(item, each)))}>
                         {displayAs(each)}
                        <i className="fal fa-times"></i>
                    </div>
                ))}
            </div>
        </div>
    );
};
