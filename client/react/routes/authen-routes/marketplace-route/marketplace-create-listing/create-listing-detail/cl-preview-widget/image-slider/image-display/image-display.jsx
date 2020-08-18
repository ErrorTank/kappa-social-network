import React, { Component } from 'react';
import classnames from 'classnames';
import { LoadingInline } from './../../../../../../../../common/loading-inline/loading-inline';
import { getBase64Image } from '../../../../../../../../../common/utils/file-upload-utils';

export class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Image: null,
      loading: props.file.type === 'image',
    };

    getBase64Image(props.file.file).then((base64Image) => {
      this.setState({ loading: false, base64Image });
    });
  }
  render() {
    let { file } = this.props;
    let { base64Image, loading } = this.state;
    return (
      <div className={classnames('img-display')}>
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
