import React from "react";
import classnames from "classnames"

export const Avatar = props => {
  let {url, className, name, round, size} = props;
  return (
    <div className={classnames("avatar", className, {round, [size]: size})}>
      {url ? <img src={url}/> : <FakeAvatar name={name}/>}

    </div>
  )
};

const getNamePrefix = (name) => {

  if(!name) return "";
  let wordArr = name.split(" ").filter(each => each !== " ");
  let arrLength = wordArr.length;
  return (arrLength >= 2 ? `${wordArr[arrLength - 2][0]}${wordArr[arrLength - 1][0]}` : `${wordArr[0].slice(0, 2)}`).toUpperCase();
};

const FakeAvatar = props => {

  return (
    <div className="fake-ava">
      {getNamePrefix(props.name)}
    </div>
  )
};