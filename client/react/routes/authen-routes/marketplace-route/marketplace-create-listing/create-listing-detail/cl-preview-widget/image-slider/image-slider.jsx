import React, { Component } from 'react';
import { LoadingInline } from './../../../../../../../common/loading-inline/loading-inline';
import { getBase64Image } from '../../../../../../../../common/utils/file-upload-utils';
import { ImageDisplay } from './image-display/image-display';

export class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
    };
  }
  getImageSrc = (file) => {
    getBase64Image(file.file).then((base64Image) => {
      return base64Image;
    });
  };
  render() {
    const { files } = this.props;
    const { currentSlide } = this.state;
    console.log(this.props.files);
    return (
      <div className='image-slider'>
        <div className='slider-background'></div>
        <div className='current-slide'>
          <ImageDisplay
            key={files[currentSlide].file.fileID}
            file={files[currentSlide].filefile}
          />
        </div>
        <div className='image-arr'>
          {!!files.length &&
            files.map((file) => <ImageDisplay key={file.fileID} file={file} />)}
        </div>
        <div className='next-button'></div>
        <div className='previous-button'></div>
      </div>
    );
  }
}
