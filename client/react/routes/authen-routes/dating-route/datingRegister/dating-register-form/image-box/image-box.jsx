const { getConnections } = require("../../../../../../../../server/config/db");

import React, { Component } from "react";
import { getBase64Image } from "../../../../../../../common/utils/file-upload-utils";
import { LoadingInline } from "./../../../../../../common/loading-inline/loading-inline";

export class ImageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base64: null,
      loading: true,
    };
    !props.file.path &&
      getBase64Image(props.file.file).then((base64) => {
        this.setState({
          loading: false,
          base64,
        });
      });
  }
  render() {
    let { base64, loading } = this.state;
    return (
      <div className="img-box">
        {loading ? (
          <LoadingInline />
        ) : (
          <>
            <img src={this.props.file.path || base64}></img>
            <i class="fas fa-times remove" onClick={this.props.onRemove}></i>
          </>
        )}
      </div>
    );
  }
}
