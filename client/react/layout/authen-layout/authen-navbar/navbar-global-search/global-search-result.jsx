import React from 'react';
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import Skeleton from 'react-loading-skeleton';
import classnames from "classnames";

export const GlobalSearchResult = ({config, keyword, maxItem, loading, onClickSearchAll}) => {

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
                        <div className="result-row">
                            <div className="row-box">
                                <div className={classnames("search-row-detail")}>
                                    <Skeleton count={1} height={35} width={35} duration={1} circle={true}/>
                                    <Skeleton count={1} height={35} width={250} duration={1}/>
                                </div>
                            </div>
                        </div>
                        <div className="result-row">
                            <div className="row-box">
                                <div className={classnames("search-row-detail")}>
                                    <Skeleton count={1} height={35} width={35} duration={1} circle={true}/>
                                    <Skeleton count={1} height={35} width={250} duration={1}/>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {config.renderSearchAllBtn && config.renderSearchAllBtn()}
            </div>
        </div>
    );
};

