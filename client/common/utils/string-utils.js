const parseQueryString = (str) => {
    const splitStr = str.substring(str.indexOf('?') + 1).split('&');
    let params = {};

    for (var i = splitStr.length - 1; i >= 0; i--) {
        const index = splitStr[i].indexOf('=');
        params[splitStr[i].substring(0, index)] = decodeURIComponent(splitStr[i].substring(index + 1) || '');
    }

    return params;
};

const getURLsFromText = text => {
    let matches = text.matchAll(/(https?:\/\/[^\s]+)/gi)
    let results = [];
    for (const match of matches) {
        results.push(match[0]);
    }
    return results;
}

function parseHtmlEnteties(str, type = "HEX") {
    let options = {
        "HEX": {
            value: 16,
            regex: /&#x([a-fA-F0-9]+);/gi
        }
    }
    let option = options[type];
    return str.replace(option.regex, function (match, numStr) {
        var num = parseInt(numStr, option.value);

        return String.fromCharCode(num);
    });
}


export {
    parseQueryString,
    getURLsFromText,
    parseHtmlEnteties
};