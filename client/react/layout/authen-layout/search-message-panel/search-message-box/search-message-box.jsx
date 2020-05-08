import React, {Component} from 'react';
import {CommonInput} from "../../../../common/common-input/common-input";

export class SearchMessageBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            results: [],
            loading: true,
            keyword: ""
        }
    }

    componentDidMount() {
        this.searchInput.focus();
    }

    render() {
        let {results, loading, keyword} = this.state;
        return (
            <div className="search-message-box">
                <div className="search-box">
                    <CommonInput
                        ref={searchInput => this.searchInput = searchInput}
                        value={keyword}
                        placeholder={"Tìm kiếm theo tên"}
                        onChange={e => this.setState({keyword: e.target.value})}
                    />
                </div>
                <div className="results-box">

                </div>
            </div>
        );
    }
}
