"use strict";
const common_vendor = require("./common/vendor.js");
const PROJECTID = common_vendor.reactive({
  globalProjectId: ""
});
const imgRequestHeader = common_vendor.reactive({
  URL: "http://192.168.10.233:8888"
});
const BASE_URL = "http://192.168.10.233:8888/stage-api";
exports.BASE_URL = BASE_URL;
exports.PROJECTID = PROJECTID;
exports.imgRequestHeader = imgRequestHeader;
