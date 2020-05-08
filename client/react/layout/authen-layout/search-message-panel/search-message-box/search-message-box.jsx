import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {utilityApi} from "../../../../../api/common/utilities-api";
import debounce from "lodash/debounce";

export class SearchMessageBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            results: null,
            loading: true,
            keyword: ""
        }
    }

    searchByKeyword = debounce((keyword) => {
        this.setState({loading: true});
        return utilityApi.searchForDialogsByKeyword(keyword)
            .then(data => {
                this.setState({results: data, loading: false, touching: false})
            })
    }, 700);

    componentDidMount() {
        this.searchInput.focus();
        this.searchByKeyword(this.state.keyword);
    }

    render() {
        let {results, loading, keyword, touching} = this.state;
        return (
            <div className="search-message-box">
                <div className="search-box">
                    <CommonInput
                        ref={searchInput => this.searchInput = searchInput}
                        value={keyword}
                        placeholder={"Tìm kiếm theo tên"}
                        onChange={e => {
                            this.setState({touching: true});
                            let value = e.target.value;
                            this.setState({keyword: value});
                            this.searchByKeyword(value);
                        }}
                    />
                </div>
                <div className="results-box">
                    {loading ? (
                        <LoadingInline/>
                    ) : (
                        <div className="results">
                            {(Array.isArray(results) ? results.length : results) ? (
                                <>
                                    {Array.isArray(results) ? (
                                        <div className="result-list">

                                            <div className="list">

                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {results.contacts && (
                                                <div className="result-list">
                                                    <div className="list-title">
                                                        Liên lạc
                                                    </div>
                                                    <div className="list">

                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : touching ? null : (
                                <div className="empty-panel">
                                    Không có kết quả nào phù hợp {keyword ? (
                                        <>
                                            với từ khóa <br/> <span className="high-light">{keyword}</span>
                                        </>
                                ) : ""}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
