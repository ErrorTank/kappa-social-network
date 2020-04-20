import React, {Component} from 'react';
import {IconRoundBorderInput} from "../../../../common/icon-round-border-input/icon-round-border-input";
import {keyEvents} from "../../../../../common/events/events";
import {customHistory} from "../../../../routes/routes";
import {userSearchHistory} from "../../../../../common/states/common";

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
                    <div>

                    </div>
                )
            },
            getRowKey: (rowData) => rowData._id
        }, {
            title: "Tìm kiếm gần đây",
            getList: () => {
                return userSearchHistory.getState();
            },
            renderRow: rowData => {
                return (
                    <div>

                    </div>
                )
            },
            getRowKey: (rowData) => rowData._id
        },
    ];

    render() {
        let {keyword, showResult, results, loading} = this.props;

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
                    onFocus={() => this.setState({showResult: true})}
                    onBlur={() => this.setState({showResult: false})}
                    onChange={e => this.setState({keyword: e.target.value.trim()})}
                    placeholder={"Tìm kiếm..."}
                    icon={<i className="far fa-search"></i>}
                />
                {showResult && (
                    <div className="global-search-result">
                        <div className="result-title">
                            {resultConfig.title}
                        </div>
                        <div className="result-list">
                            {resultConfig.getList().map((each) => {
                                return (
                                    <div className="result-row" key={resultConfig.getRowKey(each)}>
                                        {resultConfig.renderRow(each)}
                                    </div>
                                )
                            })}
                            {(keyword || loading) && (
                                <div className="suggestion">
                                    Xem kết quả cho <span className="high-light">{keyword}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
