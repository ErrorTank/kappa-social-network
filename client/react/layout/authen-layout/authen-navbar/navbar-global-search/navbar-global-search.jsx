import React, {Component} from 'react';
import {IconRoundBorderInput} from "../../../../common/icon-round-border-input/icon-round-border-input";
import {keyEvents} from "../../../../../common/events/events";
import {customHistory} from "../../../../routes/routes";

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

    render() {
        let {keyword, showResult, results, loading} = this.props;
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

                    </div>
                )}
            </div>
        );
    }
}
