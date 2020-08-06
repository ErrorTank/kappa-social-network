var alphabetical = function (arr) {
    return arr.sort(function (a,b) {
        return a < b ? 1 : a > b ? 3 : 2;

    })
};

console.log(alphabetical(["www","dasda","Dsadas"]))