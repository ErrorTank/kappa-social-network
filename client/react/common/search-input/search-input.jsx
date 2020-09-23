import React from "react";
import classnames from "classnames"
import {CommonInput} from "../common-input/common-input";
import debounce from "lodash/debounce"

export class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ""
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.value !== this.props.value)
            this.setState({value: nextProps.value});
    }

    search = debounce((v) => {
        this.props.onSearch(v);
    }, this.props.debounceSearch.duration)

    render() {
        let {value} = this.state;
        let {onSearch, placeholder, className, debounceSearch} = this.props;
        return (
            <div className={classnames("search-input-box", className)}>
                <div className="wrapper">
                    <CommonInput
                        icon={<i className="far fa-search"></i>}
                        className="search-input pt-0 pb-0"
                        onKeyDown={(e) => {
                            if (e.keyCode === 13)
                                onSearch(value);
                        }}
                        value={value}
                        type={"text"}
                        placeholder={placeholder}
                        onChange={e => {
                            let v = e.target.value;
                            this.setState({value: v});
                            if (debounceSearch) {
                                this.search(v);
                            }
                        }}

                    />
                    {!debounceSearch && (
                        <button className="search-btn btn"
                                onClick={() => onSearch(value)}
                        >
                            <i className="far fa-search"></i>
                        </button>
                    )}

                </div>

            </div>
        );
    }
}