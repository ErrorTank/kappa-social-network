import {appConfigCache} from "../cache/api-cache/common-cache";

const wait1 = (fn, amount = 2000) => new Promise((res, rej) => {
    setTimeout(() => {
        fn();
        res();
    }, amount)
});
const getBase64=(file)=>new Promise((resolve)=>{
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        resolve({file, src:reader.result, fileID: file.lastModified});
    };
});
const parseYear = yearStr => {
  let [from, to] = yearStr.split("-");
  return {
      from,
      to
  }
};
const mergeYear = year => {
    return `${year.from}-${year.to}`
};
const wait2 = delay => new Promise((resolve) => {
    setTimeout(() =>  resolve() ,delay)
}) ;

const delayLoad = fn => () => new Promise(resolve => {
    setTimeout(() => resolve(fn()), 300)
});

const convertTextMoneyToNumber = (value, fixed = 0) => Number(Number(value.replace(/,/g, "")).toFixed(fixed))

const getMoneyValueAsText = (value) => {
    let returned = value.trim();
    if(returned === ".")
        return "";
    let lastChar = returned[returned.length - 1];
    if(isNaN(Number(lastChar)) && (lastChar !== ".")){
        returned = returned.slice(0, returned.length - 1);
    }
    if(lastChar === "." && returned.match(/(\.)/g).length > 1)
        returned = returned.slice(0, returned.length - 1);
    return returned ? returned[returned.length - 1] === "." ? returned : formatMoney(Number(returned.replace(/,/g, ""))) : ""

};
const formatMoney = (money, fix = 0) => {
    let fixPath = money.toString().split(".")[1];
    let tempFix = fix ? fix : fixPath !== undefined ? fixPath.length : 0;
    let str = Number(money).toFixed(tempFix).toString();

    let [relative, fixed] = str.includes('.') ? str.split(".") : [str, null];
    let spliceStrPaths = (total, str) => {
        if(str.length>3){
            return spliceStrPaths([str.slice(str.length - 3),...total], str.slice(0, str.length - 3))
        }
        return [str.slice(0, str.length), ...total]
    };
    let paths = spliceStrPaths([],relative);
    return paths.join(",")+ (fixed ? ("."+ fixed) : "");
};

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

let pronounce = (word, count, tail) => {
  return word + (count > 1 ? tail : "");
};

const getStudentGroup = (schoolYear, department, latestSchoolYear) => {
    if(schoolYear === latestSchoolYear){
        return 3;
    }
    if(schoolYear < latestSchoolYear - 1 && department === "KT_QL"){
        return 1;
    }
    return 2;
};

export {
    wait1,
    wait2,
    delayLoad,
    getBase64,
    buildParams,
    pronounce,
    formatMoney,
    getMoneyValueAsText,
    parseYear,
    convertTextMoneyToNumber,
    mergeYear,
    getStudentGroup

}