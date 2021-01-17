import React, { PureComponent } from 'react';
import { userInfo } from '../../../../../common/states/common';
import { Avatar } from '../../../../common/avatar/avatar';
import { ThemeContext } from '../../../../context/theme-context';
import classnames from 'classnames';
import { ContentCollapse } from './content-collapse';
import { customHistory } from '../../../routes';

export class NavigationWidget extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  routesNavigator = [
    {
      url: () => {
        let { _id } = userInfo.getState();
        return `/profile/${_id}`;
      },
      className: 'profile',
      left: () => {
        let user = userInfo.getState();
        return <Avatar user={user} />;
      },
      right: () => {
        return userInfo.getState().basic_info.username;
      },
    },
    {
      url: () => {
        return `/marketplace`;
      },
      className: 'shop',
      left: () => {
        return <i className='fad fa-store'></i>;
      },
      right: () => {
        return `Chợ mua bán`;
      },
    },

    {
      url: () => {
        return `/dating`;
      },
      className: 'dating',
      left: () => {
        return <i className='fad fa-heart'></i>;
      },
      right: () => {
        return `Hẹn hò`;
      },
    },
    {
      url: () => {
        return `/pages`;
      },
      className: 'page',
      left: () => {
        return <i className='fad fa-flag'></i>;
      },
      right: () => {
        return `Trang`;
      },
    },
    {
      url: () => {
        return `/groups`;
      },
      className: 'group',
      left: () => {
        return <i className='fad fa-users'></i>;
      },
      right: () => {
        return `Nhóm`;
      },
    },
    {
      url: () => {
        return `/watch`;
      },
      className: 'watch',
      left: () => {
        return <i className='fad fa-video'></i>;
      },
      right: () => {
        return `Videos`;
      },
    },
  ];

  render() {
    // console.log("dmmmm")
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className={classnames('navigation-widget', { darkMode })}>
            <ContentCollapse
              darkMode={darkMode}
              list={this.routesNavigator}
              render={({ url, className, left, right }) => {
                return (
                  <div
                    className={classnames('navigation-widget-row', className)}
                    onClick={() => customHistory.push(url())}
                  >
                    <div className='left-side'>{left()}</div>
                    <div className='right-side'>{right()}</div>
                  </div>
                );
              }}
            />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
