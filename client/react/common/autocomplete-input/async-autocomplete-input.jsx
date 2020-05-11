import React, {Component} from 'react';
import {ThemeContext} from "../../context/theme-context";
import classnames from "classnames"
import {CommonInput} from "../common-input/common-input";
import debounce from "lodash/debounce"

export class AsyncAutocompleteInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            show: props.focus === true,
            loading: props.focus === true
        }
    }

    callFetchApi = () => {

    };

    asyncHandleInputChange = () => {

    };

    render() {
        let {keyword, show, loading} = this.state;
        let {className, placeholder = "", api, list} = this.props;
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className={classnames("autocomplete-input autocomplete", {darkMode}, className)}>
                        <div className="autocomplete-wrapper">
                            <div className="autocomplete-input">
                                <CommonInput
                                    ref={searchInput => this.searchInput = searchInput}
                                    value={keyword}
                                    placeholder={placeholder}
                                    onChange={this.asyncHandleInputChange}
                                />
                            </div>
                            {show && (
                                <div className="autocomplete-dropdown">
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </ThemeContext.Consumer>

        );
    }
}
