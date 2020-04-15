import React from "react";
import {LoadingInline} from "../loading-inline/loading-inline";
import classnames from "classnames"

export const Button = ({className, loading, onClick, children}) => {
  return (
      <button className={classnames("btn register-btn", {loading}, className)} onClick={onClick}>{children}{loading && <LoadingInline/>}</button>
  )
};