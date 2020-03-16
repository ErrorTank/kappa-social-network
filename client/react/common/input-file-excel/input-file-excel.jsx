import React, {Fragment} from "react"

export class InputFileExcel extends React.Component {
  inputElem = null;
  handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && file.type.indexOf("officedocument.spreadsheetml.sheet") > -1) {
      this.props.onUploaded(file);
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps({image}) {
    if (!image && this.inputElem)
      this.inputElem.value = "";
  }

  render() {
    const {render} = this.props;

    return (
      <Fragment>
        {render && render({onClick: () => this.inputElem && this.inputElem.click()})}
        <input
          type="file"
          onChange={this.handleSubmit}
          style={{display: "none"}}
          ref={elem => this.inputElem = elem}
          accept={".xlsx"}
        />
      </Fragment>
    )
  }
}
