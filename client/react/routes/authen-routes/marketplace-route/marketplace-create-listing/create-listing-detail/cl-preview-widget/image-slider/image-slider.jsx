import React, { Component } from 'react';
import { LoadingInline } from './../../../../../../../common/loading-inline/loading-inline';
import { getBase64Image } from '../../../../../../../../common/utils/file-upload-utils';

export class ImageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgs: [],
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.files !== this.props.files) {
      const { files } = this.props;
      let imgs = [];
      files.forEach((file) => {
        getBase64Image(file.file).then((base64Image) => {
          imgs.push(base64Image);
        });
      });
      console.log(imgs);
      this.setState({ imgs });
    }
  };
  render() {
    const { files } = this.props;
    const { imgs } = this.state;
    // console.log(files[0]);
    return (
      <div className='image-slider'>
        {!!imgs.length && imgs.map((each) => <img src={each} alt='' />)}
      </div>
    );
  }
}
