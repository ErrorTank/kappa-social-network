import React, {Component} from 'react';
import {IconRoundBorderInput} from "../../../../common/icon-round-border-input/icon-round-border-input";
import {keyEvents} from "../../../../../common/events/events";
import {customHistory} from "../../../../routes/routes";
import {userInfo, userSearchHistory} from "../../../../../common/states/common";
import {GlobalSearchResult} from "./global-search-result";
import classnames from "classnames";
import debounce from "lodash/debounce";
import {utilityApi} from "../../../../../api/common/utilities-api";
import {userSearchHistoryApi} from "../../../../../api/common/user-search-history";
import {getNamePrefix} from "../../../../../common/utils/common";
import {KComponent} from "../../../../common/k-component";

const iconMatcher = {
    group: () => (
        <i className="fal fa-users"></i>
    ) ,
    page: (data) => (
        <span className="name-holder">{getNamePrefix(data.related_page.basic_info.name)}</span>
    ),
    person: data => (
        <span className="name-holder">{getNamePrefix(data.related_person.basic_info.username)}</span>
    ),
    history: () => (
        <i className="fal fa-clock"></i>
    )
};
const RowDetail = ({rowData, renderAction}) => {

    let imgUrl = rowData?.related_person?.avatar || rowData?.related_page?.avatar;
    let content = rowData?.related_person?.basic_info.username || rowData?.related_page?.basic_info.name || rowData?.related_group?.basic_info.name || rowData.content;
    let icon = iconMatcher[rowData.related_person ? "person" : rowData.related_page ? "page" : rowData.related_group ? "group" : "history"];
    return (
        <div className={classnames("search-row-detail search-history-row")}>
            <div className="round-wrapper">
                {imgUrl ? (
                    <img
                        src={imgUrl}
                    />
                ) : icon(rowData)}
            </div>
            <div className="content">
                {content}
            </div>
            {renderAction && renderAction()}
        </div>

    )
};

export class NavbarGlobalSearch extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            showResult: false,
            results: [],
            loading: false,
            fetching: false
        };
        this.onUnmount(userSearchHistory.onChange(() => {
          this.forceUpdate();
        }));

    }

    handleSubmitSearch = () => {
        userSearchHistoryApi.addNewHistory({content: this.state.keyword})
            .then(({search_history}) => {
                userSearchHistory.setState(search_history);
            });
        customHistory.push("/tim-kiem?keyword=" + encodeURIComponent(this.state.keyword));
    };

    debouncePreSearch = debounce((keyword) => {

        if(keyword){
            this.setState({fetching: true});
            utilityApi.preSearch(keyword)
                .then(results => this.setState({results, loading: false, fetching: false}))
        }else{
            this.setState({fetching: false, loading: false});
        }


    }, 500);

    deleteHistory = (historyID) => {
        userSearchHistoryApi.deleteHistory(historyID);
        userSearchHistory.setState(userSearchHistory.getState().filter(each => each._id !== historyID));
    };

    resultConfigs = [
        {
            title: "Kết quả gợi ý",
            getList: () => this.state.results,
            renderRow: rowData => (
                <RowDetail
                    rowData={rowData}
                />
            ),
            getRowKey: (rowData) => rowData._id,
            emptyMessage: () => "Không có gợi ý nào",
            renderSearchAllBtn: () => (
                <div className="suggestion result-row"
                     onClick={this.handleSubmitSearch}
                >
                    <div className="row-box">
                        <div className={classnames("search-row-detail search-history-row")}>
                            <div className="round-wrapper">
                                <i className="far fa-search"></i>
                            </div>
                            <div className="content">
                                Xem kết quả cho <span className="high-light">{this.state.keyword}</span>
                            </div>
                        </div>

                    </div>

                </div>
            )
        }, {
            title: "Tìm kiếm gần đây",
            getList: () => {
                return userSearchHistory.getState();
            },
            renderRow: rowData => (
                <RowDetail
                    rowData={rowData}
                    renderAction={() =>
                        <div className="delete-history"
                             onClick={() => this.deleteHistory(rowData._id)}
                        >
                            <i className="fal fa-times"></i>
                        </div>
                    }
                />
            ),
            getRowKey: (rowData) => rowData._id,
            emptyMessage: () => "Không có lịch sử tìm kiếm"
        },
    ];

    render() {
        let {keyword, showResult, results, loading, fetching} = this.state;

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
                    onChange={e => {
                        let value = e.target.value.trim();
                        this.setState({loading: true});
                        this.debouncePreSearch(value);
                        this.setState({keyword: value});
                    }}
                    placeholder={"Tìm kiếm..."}
                    icon={!loading ? <i className="far fa-search"></i> : <i className={classnames("far fa-spinner-third spin-icon common-spin")}/>}
                />
                {showResult && (
                    <GlobalSearchResult
                        config={resultConfig}
                        keyword={keyword}
                        maxItem={6}
                        loading={fetching}
                    />
                )}
            </div>
        );
    }
}
