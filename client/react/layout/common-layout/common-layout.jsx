import React from 'react';
import classnames from 'classnames';
import { NotificationStateContext } from '../../routes/routes';

export const CommonLayout = (props) => {
  let {
    leftRender,
    mainRender,
    rightRender,
    haveRightRender = true,
    className,
  } = props;
  return (
    <NotificationStateContext.Consumer>
      {(showNotificationPrompt) => {
        return (
          <div
            className={classnames('common-layout', className, {
              'stay-down': showNotificationPrompt,
              'no-right': !haveRightRender,
            })}
          >
            <div className='left-widget'>{leftRender && leftRender()}</div>
            <div className='main-widget'>{mainRender && mainRender()}</div>
            {haveRightRender && (
              <div className='right-widget'>{rightRender && rightRender()}</div>
            )}
          </div>
        );
      }}
    </NotificationStateContext.Consumer>
  );
};
