import React, { Component } from "react";
import { IconRoundBorderInput } from "../../../../../../common/icon-round-border-input/icon-round-border-input";

export class MarketplaceSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: "",
      loading: false,
    };
  }
  render() {
    let { keyword, loading } = this.state;
    return (
      <div className='market-search-container'>
        <div className='market-search-wrapper'>
          <IconRoundBorderInput
            id={"market-search"}
            value={keyword}
            placeholder={"Tìm kiếm trên marketplace"}
            icon={!loading ? <i className='far fa-search'></i> : <div></div>}
          />
        </div>
      </div>
    );
  }
}
