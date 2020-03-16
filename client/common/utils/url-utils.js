

let buildParams = (obj) => {
    let params = Object.keys(obj);
    let val = Object.values(obj);
    let result = val.reduce((total, cur, i) => {
        if(cur !== undefined && cur !== null){
            return total+`${params[i]}=${cur}&`
        }
        return total;
    }, "?");
    if(result === "?"){
        return ""
    }
    return result.slice(0, result.length-1);
};

export const urlUtils = {
    buildParams
};