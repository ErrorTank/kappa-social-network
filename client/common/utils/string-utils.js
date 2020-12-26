const parseQueryString = (str) => {
  const splitStr = str.substring(str.indexOf('?') + 1).split('&');
  let params = {};

  for (var i = splitStr.length - 1; i >= 0; i--) {
    const index = splitStr[i].indexOf('=');
    params[splitStr[i].substring(0, index)] = decodeURIComponent(
      splitStr[i].substring(index + 1) || ''
    );
  }

  return params;
};

const getURLsFromText = (text) => {
  let matches = text.matchAll(/(https?:\/\/[^\s]+)/gi);
  let results = [];
  for (const match of matches) {
    results.push(match[0]);
  }
  return results;
};

// const getListingIDFromText = (text) => {
//   let matched = text.match();
// };
function parseHtmlEnteties(str, type = 'HEX') {
  let options = {
    HEX: {
      value: 16,
      regex: /&#x([a-fA-F0-9]+);/gi,
    },
  };
  let option = options[type];
  return str.replace(option.regex, function (match, numStr) {
    var num = parseInt(numStr, option.value);

    return String.fromCharCode(num);
  });
}
function setEndOfContenteditable(contentEditableElement) {
  var range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    console.log(range);
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    console.log(selection);
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
  } else if (document.selection) {
    //IE 8 and lower
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
}

export {
  parseQueryString,
  getURLsFromText,
  parseHtmlEnteties,
  setEndOfContenteditable,
};
