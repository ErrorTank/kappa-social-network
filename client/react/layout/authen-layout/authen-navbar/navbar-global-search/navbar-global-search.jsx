import React, {Component} from 'react';
import {IconRoundBorderInput} from "../../../../common/icon-round-border-input/icon-round-border-input";
import {keyEvents} from "../../../../../common/events/events";
import {customHistory} from "../../../../routes/routes";
import {userSearchHistory} from "../../../../../common/states/common";
import {GlobalSearchResult} from "./global-search-result";
import classnames from "classnames";


export class NavbarGlobalSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            showResult: false,
            results: [],
            loading: false
        }
    }

    handleSubmitSearch = () => {

    };

    resultConfigs = [
        {
            title: "Kết quả gợi ý",
            getList: () => this.state.result,
            renderRow: rowData => {
                return (
                    <div className={"search-row-detail"}>

                    </div>
                )
            },
            getRowKey: (rowData) => rowData._id,
            emptyMessage: () => "Không có gợi ý nào"
        }, {
            title: "Tìm kiếm gần đây",
            getList: () => {
                return userSearchHistory.getState();
            },
            renderRow: rowData => {
                return (
                    <div className={classnames("search-row-detail search-history-row")}>
                        <div className="left-widget">
                            <div className="round-wrapper">

                            </div>
                        </div>
                        <div className="right-widget">
                            <p></p>
                        </div>
                    </div>

                )
            },
            getRowKey: (rowData) => rowData._id,
            emptyMessage: () => "Không có lịch sử tìm kiếm"
        },
    ];

    render() {
        let {keyword, showResult, results, loading} = this.state;

        let resultConfig = (keyword || loading) ? this.resultConfigs[0] : this.resultConfigs[1];

        return (
            <div className="navbar-global-search">
                <IconRoundBorderInput
                    id={"global-search"}
                    value={keyword}
                    onKeyDown={(e) => {
                        if(keyEvents.isEnter(e)){
                            this.handleSubmitSearch();
                        }
                    }}
                    onFocus={() => {
                        this.setState({showResult: true});
                    }}
                    onBlur={() => this.setState({showResult: false})}
                    onChange={e => this.setState({keyword: e.target.value.trim()})}
                    placeholder={"Tìm kiếm..."}
                    icon={<i className="far fa-search"></i>}
                />
                {showResult && (
                    <GlobalSearchResult
                        config={resultConfig}
                        isSearchHistoryMode={(keyword || loading)}
                        keyword={keyword}
                        maxItem={6}
                    />
                )}
            </div>
        );
    }
}
