import XLSX from "xlsx";
import omit from "lodash/omit";
import {wait2} from "./common";

let readAsBinaryString = (fileObject) => {
    return new Promise((resolve, reject) => {
        let fr = new FileReader;

        fr.onload = function () {
            resolve({
                result: fr.result,
                name: fileObject.name
            });
        };

        fr.onerror = function () {
            reject();
        };

        fr.readAsBinaryString(fileObject);
    })
};

let getExcelDataAsJson = (src, options) => {
    let wb = XLSX.read(src, {type: 'binary'});
    let first_sheet_name = wb.SheetNames[0];
    let worksheet = wb.Sheets[first_sheet_name];
    return XLSX.utils.sheet_to_json(worksheet, options);
};

let removeEmptyHeaderCols = (list) => {
    return list.map(each => omit(each, '__EMPTY'));
};

let uploadCommonFile = async (file) => {
    let options = {
        raw: true,
        defval: "",
    };
    let fileObj = await readAsBinaryString(file);

    let list = removeEmptyHeaderCols(getExcelDataAsJson(fileObj.result, options));


    return ({
        list: list.map(each => {
            let keys = Object.keys(each);
            return keys.reduce((obj, cur) => {
                let newKey = `${cur}`;
                return {...obj, ...{[newKey]: each[cur]}}
            }, {})
        }),
        fileName:fileObj.name
    });
};

export {
    readAsBinaryString,
    getExcelDataAsJson,
    removeEmptyHeaderCols,
    uploadCommonFile
}
