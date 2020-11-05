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
  previous = () => {
    const { currentSlide } = this.state;
    const { files } = this.props;
    if (currentSlide > 0) {
      this.setState({ currentSlide: currentSlide - 1 });
    } else {
      this.setState({ currentSlide: files.length - 1 });
    }
  };

  next = () => {
    const { currentSlide } = this.state;
    const { files } = this.props;

    // console.log(currentSlide);
    if (currentSlide === files.length - 1) {
      this.setState({ currentSlide: 0 });
    } else {
      this.setState({ currentSlide: currentSlide + 1 });
    }
  };
  render() {
    const { files } = this.props;
    const { currentSlide } = this.state;
    console.log(this.props.files);
    // console.log(currentSlide);

    return (
      <div className='image-slider'>
        <div className='slider-background'>
          {!!files.length &&
            (files[currentSlide].path ? (
              <div className='img-display'>
                <div className='img-wrapper'>
                  <img src={files[currentSlide].path} alt='' />
                </div>
              </div>
            ) : (
              <ImageDisplay
                key={files[currentSlide].file.fileID}
                file={files[currentSlide]}
              />
            ))}
        </div>
        <div className='current-slide'>
          {!!files.length &&
            (files[currentSlide].path ? (
              <div className='img-display'>
                <div className='img-wrapper'>
                  <img src={files[currentSlide].path} alt='' />
                </div>
              </div>
            ) : (
              <ImageDisplay
                key={files[currentSlide].fileID}
                file={files[currentSlide]}
              />
            ))}
        </div>
        {files.length > 1 && (
          <>
            <div className='image-arr'>
              {!!files.length &&
                files.map((file) =>
                  file.path ? (
                    <div className='img-display'>
                      <div className='img-wrapper'>
                        <img src={file.path} alt='' />
                      </div>
                    </div>
                  ) : (
                    <ImageDisplay
                      key={file.fileID}
                      file={file}
                      currentID={files[currentSlide].fileID}
                    />
                  )
                )}
            </div>
            <div className='next-button' onClick={() => this.next()}>
              <i className='fas fa-angle-right'></i>
            </div>
            <div className='previous-button' onClick={() => this.previous()}>
              <i className='fas fa-angle-left'></i>
            </div>
          </>
        )}
      </div>
    );
  }
}
