import React from 'react';
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import classnames from "classnames";

export const GlobalSearchResult = ({config, isSearchHistoryMode, keyword, maxItem, loading}) => {
    console.log(config.getList())
    let list = config.getList().slice(0, maxItem);
    console.log(list);
    return (
        <div className="global-search-result">
            <div className="result-title">
                {config.title}
            </div>
            <div className="result-list">
                {!loading ? (
                    <>
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
                    </>
                ) : (
                    <div className="result-loading">
                        <LoadingInline/>
                    </div>
                )}

                {isSearchHistoryMode && (
                    <div className="suggestion result-row">
                        <div className="row-box">
                            <div className={classnames("search-row-detail search-history-row")}>
                                <div className="round-wrapper">
                                    <i className="far fa-search"></i>
                                </div>
                                <div className="content">
                                    Xem kết quả cho <span className="high-light">{keyword}</span>
                                </div>
                            </div>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

