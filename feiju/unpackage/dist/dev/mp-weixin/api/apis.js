"use strict";
const utils_request = require("../utils/request.js");
const header = { "Content-Type": "application/json" };
function apiGetProject(data = {}) {
  return utils_request.request({
    url: "/inspection/project/allProjectList",
    data,
    header
  });
}
function apiGetRealTimeNum(data = {}) {
  return utils_request.request({
    url: "/inspection/alarm/getAlarmStatistics",
    data,
    header
  });
}
function apiGetContactList(data = {}) {
  return utils_request.request({
    url: "/inspection/contact/listAll",
    data,
    header
  });
}
function apiGetContactById(uurl) {
  let url = "/inspection/contact/" + uurl;
  return utils_request.request({
    url,
    header
  });
}
function apiUpdateContact(data = {}) {
  return utils_request.request({
    url: "/inspection/contact",
    data,
    method: "PUT",
    header
  });
}
function apiAddContact(data = {}) {
  return utils_request.request({
    url: "/inspection/contact",
    data,
    method: "POST",
    header
  });
}
function apiDeleteContact(ids) {
  let url = "/inspection/contact/" + ids;
  return utils_request.request({
    url,
    method: "DELETE",
    header
  });
}
function apiGetUserInfo() {
  return utils_request.request({
    url: "/getInfo",
    header
  });
}
function apiUpdatePssword(data = {}) {
  return utils_request.request({
    url: "/system/user/profile/updatePwd",
    data,
    method: "PUT",
    header: { "Content-Type": "application/x-www-form-urlencoded" }
  });
}
function apiGetAlarmRecords(data = {}) {
  return utils_request.request({
    url: "/inspection/alarm/list",
    data,
    header
  });
}
function apiGetChart(data = {}) {
  return utils_request.request({
    url: "/inspection/mongodb/getCurveDataOfTypeList",
    data,
    header
  });
}
function apiGetRealTimeAlarm(data = {}) {
  return utils_request.request({
    url: "/inspection/alarm/listGroupByLevel?alarmLevelTemp=1,2",
    data,
    header
  });
}
function apiGetInspection(data = {}) {
  return utils_request.request({
    url: "/dailyInspectionRecord/page",
    data,
    header
  });
}
function apiGetSceneName(data = {}) {
  return utils_request.request({
    url: "/inspection/project",
    data,
    header
  });
}
function apiGetInspectionById(id) {
  let url = "/dailyInspectionRecord/" + id;
  return utils_request.request({
    url,
    header
  });
}
function apiUpdateInspection(data = {}) {
  return utils_request.request({
    url: "/dailyInspectionRecord",
    data,
    method: "PUT",
    header
  });
}
function apiAddHiddenDanger(data = {}) {
  return utils_request.request({
    url: "/hiddenDanger",
    data,
    method: "POST",
    header
  });
}
function apiGetHiddenDanger(data = {}) {
  return utils_request.request({
    url: "/hiddenDanger/page",
    data,
    header
  });
}
function apiGetHiddenDangerById(id) {
  let url = "/hiddenDanger/" + id;
  return utils_request.request({
    url,
    header
  });
}
function apiGetPersonnelList(data = {}) {
  return utils_request.request({
    url: "/system/user/list",
    data,
    header
  });
}
function apiPutHiddenDanger(data = {}) {
  return utils_request.request({
    url: "/hiddenDanger/assign",
    data,
    method: "PUT",
    header
  });
}
function apiPutDisposal(data = {}) {
  return utils_request.request({
    url: "/hiddenDanger/disposal",
    data,
    method: "PUT",
    header
  });
}
function apiPutDisposalAudit(data = {}) {
  return utils_request.request({
    url: "/hiddenDanger/review",
    data,
    method: "PUT",
    header
  });
}
function apiGetHiddenDangerLog(data = {}) {
  return utils_request.request({
    url: "/hiddenDangerLog/page",
    data,
    header
  });
}
function apiGetEquipmentInfo(data = {}) {
  return utils_request.request({
    url: "/system/scada/getInfoBySceneId",
    data,
    header
  });
}
function apiGetEquipmentData(data = {}) {
  return utils_request.request({
    url: "/system/scada/deviceData",
    data,
    header
  });
}
function apiGetAccessToken(data = {}) {
  return utils_request.request({
    url: "/inspection/util/getAccessToken",
    data,
    header: { "Content-Type": "application/x-www-form-urlencoded" }
  });
}
function apiGetTreeVideo(data = {}) {
  return utils_request.request({
    url: "/inspection/project/treeVideo",
    data,
    header: { "Content-Type": "application/x-www-form-urlencoded" }
  });
}
exports.apiAddContact = apiAddContact;
exports.apiAddHiddenDanger = apiAddHiddenDanger;
exports.apiDeleteContact = apiDeleteContact;
exports.apiGetAccessToken = apiGetAccessToken;
exports.apiGetAlarmRecords = apiGetAlarmRecords;
exports.apiGetChart = apiGetChart;
exports.apiGetContactById = apiGetContactById;
exports.apiGetContactList = apiGetContactList;
exports.apiGetEquipmentData = apiGetEquipmentData;
exports.apiGetEquipmentInfo = apiGetEquipmentInfo;
exports.apiGetHiddenDanger = apiGetHiddenDanger;
exports.apiGetHiddenDangerById = apiGetHiddenDangerById;
exports.apiGetHiddenDangerLog = apiGetHiddenDangerLog;
exports.apiGetInspection = apiGetInspection;
exports.apiGetInspectionById = apiGetInspectionById;
exports.apiGetPersonnelList = apiGetPersonnelList;
exports.apiGetProject = apiGetProject;
exports.apiGetRealTimeAlarm = apiGetRealTimeAlarm;
exports.apiGetRealTimeNum = apiGetRealTimeNum;
exports.apiGetSceneName = apiGetSceneName;
exports.apiGetTreeVideo = apiGetTreeVideo;
exports.apiGetUserInfo = apiGetUserInfo;
exports.apiPutDisposal = apiPutDisposal;
exports.apiPutDisposalAudit = apiPutDisposalAudit;
exports.apiPutHiddenDanger = apiPutHiddenDanger;
exports.apiUpdateContact = apiUpdateContact;
exports.apiUpdateInspection = apiUpdateInspection;
exports.apiUpdatePssword = apiUpdatePssword;
