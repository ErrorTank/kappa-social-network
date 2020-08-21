import React, { Component } from 'react';
import classnames from 'classnames';
import { LoadingInline } from './../../../../../../../../common/loading-inline/loading-inline';
import { getBase64Image } from '../../../../../../../../../common/utils/file-upload-utils';

export class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Image: null,
      loading: true,
    };

    getBase64Image(props.file.file).then((base64Image) => {
      this.setState({ loading: false, base64Image });
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.file !== this.props.file) {
      getBase64Image(this.props.file.file).then((base64Image) => {
        this.setState({ loading: false, base64Image });
      });
    }
  }
  render() {
    let { file, currentID } = this.props;
    let { base64Image, loading } = this.state;
    // console.log(currentID);
    return (
      <div
        className={classnames('img-display', {
          main: currentID === file.fileID,
        })}
      >
        <div className='img-info'>
          {loading && <LoadingInline />}
          {base64Image && (
            <div className='img-wrapper'>
              <img src={base64Image} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
