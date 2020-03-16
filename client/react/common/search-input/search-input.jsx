import React from "react";
import classnames from "classnames"
import {CommonInput} from "../common-input/common-input";

export class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.value !== this.props.value)
      this.setState({value: nextProps.value});
  }

  render() {
    let {value } = this.state;
    let {onSearch, placeholder, className} = this.props;
    return (
      <div className={classnames("search-input-box", className)}>
        <div className="wrapper">
          <CommonInput
            className="search-input pt-0 pb-0"
            onKeyDown={(e) => {
              if(e.keyCode === 13)
                onSearch(value);
            }}
            value={value}
            placeholder={placeholder}
            onChange={e => {
              this.setState({value: e.target.value});
            }}

          />
          <button className="search-btn btn"
                  onClick={() => onSearch(value)}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>

      </div>
    );
  }
}