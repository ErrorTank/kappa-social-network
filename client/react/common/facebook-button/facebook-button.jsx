import React from 'react';
import { LoadingInline } from '../loading-inline/loading-inline';
import classnames from 'classnames';

export const FacebookButton = ({
  className,
  loading,
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
      className={classnames('facebook-button', { loading }, className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      {/* {loading && <LoadingInline />} */}
    </button>
  );
};
