import * as yup from "yup";
import {appConfigCache} from "../../../../common/cache/api-cache/common-cache";

const schemas = {
    "account": {
        schema: yup.object().shape({
            username: yup.string().required("Tên đăng nhập không được để trống"),
            password: yup.string().min(4, "Mật khẩu phải nhiều hơn 3 kí tự").noSpecialChar("Mật khẩu không được chứa kí tự đặc biệt"),
            role: yup.string().oneOf(["admin", "pdt", "bm", "gv", "sv"]),
            name: yup
                .string()
                .min(4, "Họ và tên phải lớn hơn 3 kí tự")
                .max(50, "Họ và tên phải nhỏ hơn 50 kí tự")
                .onlyWord("Họ và tên không được có kí tự đặc biệt")
                .notHaveNumber("Họ và tên không được có chữ số")
                .required("Họ tên không được để trống"),
            phone: yup.string().required("SĐT không được để trống").isPhone("SĐT không hợp lệ"),
            email: yup.string().email("Email không hợp lệ").required("Email không được để trống"),
            identityID: yup.string().required("Mã định danh không được để trống"),
            dob: yup.date().required("Ngày sinh không được để trống")
        }),
        getInitData: () => {
            return {
                username: "",
                password: "",
                role: "admin",
                name: "",
                phone: "",
                email: "",
                identityID: "",
                dob: new Date().toISOString()
            }

        }
    },
    "pdt": null,
    "admin": null,
    "gv": {
        schema: yup.object().shape({
            division: yup.string().required("Bộ môn là trường bắt buộc"),
            canEditSchedule: yup.bool(),

        }),
        getInitData: () => {
            return {
                division: "",
                canEditSchedule: false
            }

        }
    },
    "sv": {
        schema: yup.object().shape({
            englishLevel: yup.string().oneOf(["a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2", "e1", "e2", "g1", "g2"]),
            active: yup.bool(),
            speciality: yup.string().required("Chuyên ngành là trường bắt buộc"),
            schoolYear: yup.number().min(1, "Niên khóa phải lớn hơn 1").required("Niên khóa là trường bắt buộc")

        }),
        getInitData: () => {
            return {
                englishLevel: "a1",
                active: true,
                speciality: "",
                schoolYear: Number(appConfigCache.syncGet().latestSchoolYear)
            }

        }
    }
};


export const getAccountFormStructure = (type) => {
    return schemas[type]
};