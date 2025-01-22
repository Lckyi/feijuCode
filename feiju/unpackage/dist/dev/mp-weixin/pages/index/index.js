"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const projectList = common_vendor.ref([]);
    const realTimeList = common_vendor.ref([]);
    let projectNames = common_vendor.ref([]);
    const projectMap = common_vendor.ref([]);
    const hiddenDangers = common_vendor.ref([]);
    let selectedText = common_vendor.ref("");
    let selectedIndex = common_vendor.ref(0);
    let sumRealTime = common_vendor.ref(0);
    common_vendor.ref([]);
    common_vendor.onShow(() => {
      if (config.PROJECTID.globalProjectId) {
        getRealTimeNum(config.PROJECTID.globalProjectId);
        getHiddenDanger(config.PROJECTID.globalProjectId);
      }
    });
    const getProject = async () => {
      try {
        let res = await api_apis.apiGetProject({
          userType: 1
        });
        projectList.value = res.data;
        projectList.value.forEach((item) => {
          projectNames.value.push(item.projectName);
        });
        projectList.value.forEach((person) => {
          projectMap[person.projectName] = person.projectId;
        });
        selectedText.value = projectNames.value[0];
        config.PROJECTID.globalProjectId = projectMap[selectedText.value];
        getRealTimeNum(config.PROJECTID.globalProjectId);
        getHiddenDanger(config.PROJECTID.globalProjectId);
      } catch (error) {
        console.error("捕获到错误:", error);
      }
    };
    function bindPickerChange(e) {
      let index = e.detail.value;
      selectedIndex.value = index;
      selectedText.value = projectNames.value[index];
      config.PROJECTID.globalProjectId = projectMap[selectedText.value];
      getRealTimeNum(config.PROJECTID.globalProjectId);
      getHiddenDanger(config.PROJECTID.globalProjectId);
    }
    const getRealTimeNum = async (projectId) => {
      let res = await api_apis.apiGetRealTimeNum({
        projectId
      });
      realTimeList.value = res.data;
      let sum = realTimeList.value.alarmNumber + realTimeList.value.warningNumber;
      sumRealTime.value = sum;
    };
    const getHiddenDanger = async (projectId) => {
      let now = /* @__PURE__ */ new Date();
      let lastWeek = new Date(now);
      lastWeek.setDate(lastWeek.getDate() - 7);
      let res = await api_apis.apiGetHiddenDanger({
        projectId,
        startDate: timeFormat(lastWeek),
        endDate: timeFormat(now)
      });
      hiddenDangers.value = res.data.records;
    };
    const timeFormat = (now) => {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const statusColors = {
      //状态到颜色的映射
      "0": "#F56C6C",
      "1": "#FFAF41",
      "2": "#61D19F",
      "3": "#9CABCB",
      "4": "#00ADB5"
    };
    const getItemColor = (status) => {
      return statusColors[status] || "black";
    };
    function toPhotographed() {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/photographed"
      });
    }
    function toAlarmPush() {
      common_vendor.index.navigateTo({
        url: "/pages/alarmPush/alarmPush"
      });
    }
    function toAlarmRecords() {
      common_vendor.index.navigateTo({
        url: "/pages/alarmRecords/alarmRecords"
      });
    }
    function toInspection() {
      common_vendor.index.navigateTo({
        url: "/pages/inspection/inspection"
      });
    }
    function toHiddenTrouble() {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/hiddenTrouble"
      });
    }
    function toSubHiddenTrouble(id) {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/subHiddenTrouble?id=" + id
      });
    }
    function toSceneMonitoring() {
      common_vendor.index.navigateTo({
        url: "/pages/sceneMonitoring/sceneMonitoring"
      });
    }
    function toVideoSurveillance() {
      common_vendor.index.navigateTo({
        url: "/pagesA/videoSurveillance/videoSurveillance"
      });
    }
    getProject();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: common_vendor.t(common_vendor.unref(selectedText)),
        c: common_assets._imports_1$1,
        d: common_vendor.unref(projectNames),
        e: common_vendor.o(bindPickerChange),
        f: common_assets._imports_2$2,
        g: common_vendor.o(toPhotographed),
        h: common_assets._imports_3$1,
        i: common_vendor.unref(sumRealTime) > 99
      }, common_vendor.unref(sumRealTime) > 99 ? {} : {}, {
        j: common_vendor.unref(sumRealTime) > 0 && common_vendor.unref(sumRealTime) < 100
      }, common_vendor.unref(sumRealTime) > 0 && common_vendor.unref(sumRealTime) < 100 ? {
        k: common_vendor.t(common_vendor.unref(sumRealTime))
      } : {}, {
        l: common_vendor.o(toAlarmPush),
        m: common_vendor.t(realTimeList.value.alarmNumber),
        n: common_vendor.t(realTimeList.value.warningNumber),
        o: common_vendor.t(realTimeList.value.dangerNumber),
        p: common_assets._imports_4$2,
        q: common_vendor.o(toAlarmRecords),
        r: common_assets._imports_5,
        s: common_vendor.o(toInspection),
        t: common_assets._imports_6,
        v: common_vendor.o(toHiddenTrouble),
        w: common_assets._imports_7,
        x: common_vendor.o(toSceneMonitoring),
        y: common_assets._imports_8,
        z: common_vendor.o(toVideoSurveillance),
        A: hiddenDangers.value.length > 0
      }, hiddenDangers.value.length > 0 ? {
        B: common_vendor.f(hiddenDangers.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.sceneName),
            b: common_vendor.t(item.dailyInspectionItemValue),
            c: item.state === "0"
          }, item.state === "0" ? {} : item.state === "1" ? {} : item.state === "2" ? {} : item.state === "3" ? {} : item.state === "4" ? {} : {}, {
            d: item.state === "1",
            e: item.state === "2",
            f: item.state === "3",
            g: item.state === "4",
            h: getItemColor(item.state),
            i: item.id,
            j: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        C: common_assets._imports_2$1
      } : {
        D: common_assets._imports_4$1
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
