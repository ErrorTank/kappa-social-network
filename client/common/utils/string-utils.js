const parseQueryString = (str) => {
  const splitStr = str.substring(str.indexOf('?') + 1).split('&');
  let params = {};

  for (var i = splitStr.length - 1; i >= 0; i--) {
    const index = splitStr[i].indexOf('=');
    params[splitStr[i].substring(0, index)] = decodeURIComponent(splitStr[i].substring(index + 1) || '');
  }

  return params;
};

export {
  parseQueryString
};