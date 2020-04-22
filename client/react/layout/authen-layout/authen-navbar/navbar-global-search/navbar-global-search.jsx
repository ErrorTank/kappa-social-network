import React, {Component} from 'react';
import {IconRoundBorderInput} from "../../../../common/icon-round-border-input/icon-round-border-input";
import {keyEvents} from "../../../../../common/events/events";
import {customHistory} from "../../../../routes/routes";
import {userInfo, userSearchHistory} from "../../../../../common/states/common";
import {GlobalSearchResult} from "./global-search-result";
import classnames from "classnames";
import debounce from "lodash/debounce";
import {utilityApi} from "../../../../../api/common/utilities-api";

const iconMatcher = {
    group: () => (
        <i className="fal fa-users"></i>
    ) ,
    page: (data) => (
        <div></div>
    ),
    person: data => (
        <div></div>
    ),
    history: () => (
        <i className="fal fa-clock"></i>
    )
};
const RowDetail = ({rowData}) => {

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
        </div>

    )
};

export class NavbarGlobalSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            showResult: false,
            results: [],
            loading: false,
            fetching: false
        }

    }

    handleSubmitSearch = () => {

    };

    debouncePreSearch = debounce(() => {
        this.setState({fetching: true});
        let {keyword} = this.state;
        if(keyword)
            utilityApi.preSearch(keyword)
                .then(results => this.setState({results, loading: false, fetching: false}))
    }, 500);

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
            emptyMessage: () => "Không có gợi ý nào"
        }, {
            title: "Tìm kiếm gần đây",
            getList: () => {
                return userSearchHistory.getState();
            },
            renderRow: rowData => (
                <RowDetail
                    rowData={rowData}
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
                    onBlur={() => this.setState({showResult: true})}
                    onChange={e => {
                        this.setState({loading: true});
                        this.debouncePreSearch();
                        this.setState({keyword: e.target.value.trim()});
                    }}
                    placeholder={"Tìm kiếm..."}
                    icon={!loading ? <i className="far fa-search"></i> : <i className={classnames("far fa-spinner-third spin-icon common-spin")}/>}
                />
                {showResult && (
                    <GlobalSearchResult
                        config={resultConfig}
                        isSearchHistoryMode={(keyword || loading)}
                        keyword={keyword}
                        maxItem={6}
                        loading={fetching}
                    />
                )}
            </div>
        );
    }
}
