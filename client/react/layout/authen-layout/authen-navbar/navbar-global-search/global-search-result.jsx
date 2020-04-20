import React from 'react';

export const GlobalSearchResult = ({config, isSearchHistoryMode, keyword, maxItem}) => {
    let list = config.getList().slice(0, maxItem);
    console.log(list);
    return (
        <div className="global-search-result">
            <div className="result-title">
                {config.title}
            </div>
            <div className="result-list">
                {list.map((each) => {
                    return (
                        <div className="result-row" key={config.getRowKey(each)}>
                            <div className="row-box">
                                {config.renderRow(each)}
                            </div>
                        </div>
                    )
                })}
                {!list.length && (
                    <div className="search-empty">
                        {config.emptyMessage()}
                    </div>
                )}
                {isSearchHistoryMode && (
                    <div className="suggestion">
                        Xem kết quả cho <span className="high-light">{keyword}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

