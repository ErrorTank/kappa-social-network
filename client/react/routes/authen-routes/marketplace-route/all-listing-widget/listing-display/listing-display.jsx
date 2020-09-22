import React, { Component } from 'react';
import classnames from 'classnames';
import { getBase64Image } from '../../../../../../common/utils/file-upload-utils';
import { numberToMoney } from '../../../../../../common/utils/listing-utils';
import { Tooltip } from './../../../../../common/tooltip/tooltip';

export class ListingDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
    };
  }
  buttonList = [
    {
      icon: <i className='fab fa-facebook-messenger'></i>,
      tooltipText: 'Nhắn tin',
    },
    {
      icon: <i className='fas fa-bookmark'></i>,
      tooltipText: 'Lưu',
    },
    {
      icon: <i className='fas fa-share'></i>,
      tooltipText: 'Chia sẻ',
    },
  ];
  handleMouseHover = () => {
    this.setState({ isHovering: !this.state.isHovering });
  };
  render() {
    const { listing } = this.props;
    console.log(listing);
    return (
      <div
        className='listing-display'
        onMouseEnter={this.handleMouseHover}
        onMouseLeave={this.handleMouseHover}
      >
        {this.state.isHovering && (
          <div className='hover-display'>
            <div className='addition-button-wrapper'>
              {this.buttonList.map((each) => (
                <Tooltip
                  key={each.tooltipText}
                  className={'addition-button-tooltip'}
                  text={() => each.tooltipText}
                  position={'top'}
                >
                  <div className='addition-button'>{each.icon}</div>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
        <div className='listing-picture'>
          <img src={listing.files[0].path} alt='' />
        </div>
        <div className='listing-main-info'>
          <div className='listing-price'>
            {numberToMoney(listing.price.toString())}
          </div>
          <div className='listing-title'>{listing.title}</div>
          <div className='listing-location'>{listing.location}</div>
        </div>
      </div>
    );
  }
}
