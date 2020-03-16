import {createApiCache} from "./api-cache";
import {specialityApi} from "../../../api/common/speciality-api";
import {commonApi} from "../../../api/common/common-api";
import {schoolScheduleApi} from "../../../api/common/school-schedule-api";


export const specialitiesCache = createApiCache(() => specialityApi.getAll().then((specialities) => {
  return specialities;
}));

export const appConfigCache = createApiCache(() => commonApi.getAppConfigInfo().then((config) => {
  return config;
}));

export const shiftsCache = createApiCache(() => schoolScheduleApi.getShiftsOverview().then((shifts) => {
  return shifts;
}));

export const divisionsCache = createApiCache(() => commonApi.getDivisions().then((shifts) => {
  return shifts;
}));

