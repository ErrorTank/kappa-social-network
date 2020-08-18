import React, { Component } from 'react';
import { LoadingInline } from './../../../../../../../common/loading-inline/loading-inline';
import { getBase64Image } from '../../../../../../../../common/utils/file-upload-utils';
import { ImageDisplay } from './image-display/image-display';

export class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getImageSrc = (file) => {
    getBase64Image(file.file).then((base64Image) => {
      return base64Image;
    });
  };
  render() {
    const { files } = this.props;
    console.log(this.state);
    return (
      <div className='image-slider'>
        {!!files.length &&
          files.map((file) => <ImageDisplay key={file.fileID} file={file} />)}
      </div>
    );
  }
}
