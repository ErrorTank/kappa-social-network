import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";
import {utilityApi} from "../../../../../api/common/utilities-api";
import debounce from "lodash/debounce";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {GroupChatAvatar} from "../../../../common/group-chat-avatar/group-chat-avatar";
import {generateGroupChatName} from "../../../../../common/utils/common";
import classnames from "classnames"
import {ThemeContext} from "../../../../context/theme-context";

export class SearchMessageBox extends Component {
    constructor(props) {
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
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className={classnames("search-message-box", {darkMode})}>
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
                                                                {results.contacts.map(each => (
                                                                    <div className="list-row" key={each._id}>
                                                                        <div className="user-avatar">
                                                                            <StatusAvatar
                                                                                user={each}
                                                                            />
                                                                        </div>
                                                                        <p className="username">{each.basic_info.username}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {results.chat_groups && (
                                                        <div className="result-list">
                                                            <div className="list-title">
                                                                Nhóm chat
                                                            </div>
                                                            <div className="list">
                                                                {results.chat_groups.map(each => (
                                                                    <div className="list-row" key={each._id}>
                                                                        <div className="user-avatar">
                                                                            <GroupChatAvatar
                                                                                active={each.active}
                                                                                users={each.users}
                                                                            />
                                                                        </div>
                                                                        <p className="username">{generateGroupChatName(each)}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {results.pages && (
                                                        <div className="result-list">
                                                            <div className="list-title">
                                                                Trang
                                                            </div>
                                                            <div className="list">
                                                                {results.pages.map(each => (
                                                                    <div className="list-row" key={each._id}>
                                                                        <div className="user-avatar">
                                                                            <StatusAvatar
                                                                                user={each}
                                                                                getName={item => item.basic_info.name}
                                                                            />
                                                                        </div>
                                                                        <p className="username">{each.basic_info.name}</p>
                                                                    </div>
                                                                ))}
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
                )}
            </ThemeContext.Consumer>
        );
    }
}
