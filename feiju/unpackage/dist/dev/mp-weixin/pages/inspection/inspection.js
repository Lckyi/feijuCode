"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "inspection",
  setup(__props) {
    const current = common_vendor.ref("unfinish");
    const selected = common_vendor.ref("view1");
    const popup = common_vendor.ref(null);
    const popupBottom = common_vendor.ref(null);
    const scanCodePopup = common_vendor.ref(null);
    const scanCodeData = common_vendor.ref("");
    const noData = common_vendor.ref(false);
    const finishDataList = common_vendor.ref([]);
    const unFinishDataList = common_vendor.ref([]);
    let finishPageNum = 1;
    let unfinishPageNum = 1;
    const dataSelected = common_vendor.ref("All");
    let selectedText = common_vendor.ref("全部");
    let sceneName = common_vendor.ref(0);
    const showSceneName = common_vendor.ref([]);
    const sceneId = common_vendor.ref([]);
    const selectedSceneId = common_vendor.ref(null);
    const requestSceneId = common_vendor.ref("");
    const requestStartDate = common_vendor.ref("");
    const requestendDate = common_vendor.ref("");
    const selectedDateRange = common_vendor.reactive({
      startDate: "",
      endDate: ""
    });
    common_vendor.onShow(() => {
      if (current.value === "unfinish") {
        noData.value = false;
        unfinishPageNum = 1;
        unFinishDataList.value = "";
        getInspection();
      }
    });
    const bottomRefresh = async () => {
      if (noData.value)
        return;
      if (current.value === "finish") {
        finishPageNum++;
      } else {
        unfinishPageNum++;
      }
      getInspection();
    };
    const getInspection = async () => {
      const params = {
        projectId: config.PROJECTID.globalProjectId,
        pageSize: 10
      };
      let res;
      if (requestSceneId.value) {
        params.sceneId = requestSceneId.value;
      }
      if (requestendDate.value && requestStartDate.value) {
        params.startDate = requestStartDate.value;
        params.endDate = requestendDate.value;
      }
      if (current.value === "finish") {
        params.state = 1;
        params.pageNum = finishPageNum;
        res = await api_apis.apiGetInspection(params);
        finishDataList.value = [...finishDataList.value, ...res.data.records];
        if (params.pageSize > res.data.records.length)
          noData.value = true;
        common_vendor.index.setStorageSync("finishDataList", finishDataList.value);
      } else {
        params.pageNum = unfinishPageNum;
        params.state = 0;
        res = await api_apis.apiGetInspection(params);
        unFinishDataList.value = [...unFinishDataList.value, ...res.data.records];
        if (params.pageSize > res.data.records.length)
          noData.value = true;
        common_vendor.index.setStorageSync("unFinishDataList", unFinishDataList.value);
      }
    };
    const submitSift = async () => {
      noData.value = false;
      requestSceneId.value = selectedSceneId.value;
      requestStartDate.value = selectedDateRange.startDate;
      requestendDate.value = selectedDateRange.endDate;
      if (current.value === "finish") {
        finishDataList.value = "";
        finishPageNum = 1;
      } else {
        unFinishDataList.value = "";
        unfinishPageNum = 1;
      }
      getInspection();
      popupBottom.value.close();
    };
    const getSceneName = async () => {
      let res = await api_apis.apiGetSceneName({
        projectId: config.PROJECTID.globalProjectId
      });
      sceneName.value = res.data.children;
      sceneName.value.forEach((item) => {
        if (item.children.length > 0) {
          item.children.forEach((childItem) => {
            if (childItem.sceneName && childItem.sceneId) {
              showSceneName.value.push(childItem.sceneName);
              sceneId.value.push(childItem.sceneId);
            }
          });
        }
      });
    };
    function bindPickerChange(e) {
      let index = e.detail.value;
      selectedText.value = showSceneName.value[index];
      selectedSceneId.value = sceneId.value[index];
    }
    const timeFormat = (now) => {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      String(now.getHours()).padStart(2, "0");
      String(now.getMinutes()).padStart(2, "0");
      String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const handleTimeRange = (range) => {
      let startDate, endDate;
      dataSelected.value = range;
      const today = /* @__PURE__ */ new Date();
      switch (range) {
        case "lastDay":
          const lastDay = new Date(today.getTime() - 24 * 60 * 60 * 1e3);
          startDate = timeFormat(lastDay);
          endDate = timeFormat(today);
          break;
        case "lastMonths":
          const lastMonths = /* @__PURE__ */ new Date();
          lastMonths.setMonth(today.getMonth() - 1);
          startDate = timeFormat(lastMonths);
          endDate = timeFormat(today);
          break;
        case "All":
          startDate = endDate = null;
        default:
          startDate = endDate = null;
      }
      selectedDateRange.startDate = startDate;
      selectedDateRange.endDate = endDate;
    };
    let rstartDate = "";
    let rendDate = "";
    const selectedStartDate = (event) => {
      rstartDate = event.detail.value;
      let dateTime1 = new Date(rstartDate);
      let dateTime2 = new Date(rendDate);
      if (dateTime1 >= dateTime2 && dateTime2) {
        common_vendor.index.showToast({
          title: "起始日期需小于结束日期",
          icon: "none",
          duration: 2e3
        });
        selectedDateRange.startDate = "";
        rstartDate = "";
      } else {
        selectedDateRange.startDate = rstartDate;
      }
    };
    const selectedEndDate = (event) => {
      rendDate = event.detail.value;
      let dateTime1 = new Date(rstartDate);
      let dateTime2 = new Date(rendDate);
      if (dateTime1 >= dateTime2 && dateTime1) {
        common_vendor.index.showToast({
          title: "起始日期需小于结束日期",
          icon: "none",
          duration: 2e3
        });
        selectedDateRange.endDate = "";
        rendDate = "";
      } else {
        selectedDateRange.endDate = rendDate;
      }
    };
    const reSet = () => {
      selectedDateRange.startDate = "";
      selectedDateRange.endDate = "";
      rstartDate = "";
      rendDate = "";
      dataSelected.value = "All";
      selectedText.value = "全部";
      selectedSceneId.value = "";
    };
    function onClickItem(content, view) {
      noData.value = false;
      current.value = content;
      selected.value = view;
      if (current.value === "finish") {
        finishDataList.value = "";
        finishPageNum = 1;
      } else {
        unFinishDataList.value = "";
        unfinishPageNum = 1;
      }
      getInspection();
    }
    function popupOpen() {
      popup.value.open();
    }
    function popupBottomOpen() {
      popup.value.close();
      popupBottom.value.open();
    }
    function scanCode() {
      popup.value.close();
      common_vendor.index.scanCode({
        success: function(res) {
          scanCodeData.value = res.result;
          scanCodePopup.value.open();
        }
      });
    }
    const toIndex = () => {
      common_vendor.index.navigateBack();
    };
    function toDailyInspection(id) {
      common_vendor.index.navigateTo({
        url: "/pages/inspection/dailyInspection?id=" + id
      });
    }
    function toInspectionCheck(id) {
      common_vendor.index.navigateTo({
        url: "/pages/inspection/inspectionCheck?id=" + id
      });
    }
    getSceneName();
    common_vendor.onUnload(() => {
      common_vendor.index.removeStorageSync("unFinishDataList");
      common_vendor.index.removeStorageSync("finishDataList");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toIndex),
        c: common_assets._imports_1$6,
        d: common_vendor.o(popupOpen),
        e: common_assets._imports_2$7,
        f: common_vendor.o(scanCode),
        g: common_assets._imports_3$4,
        h: common_vendor.o(popupBottomOpen),
        i: common_vendor.sr(popup, "cfade3ed-0", {
          "k": "popup"
        }),
        j: common_vendor.p({
          type: "top",
          ["border-radius"]: "0 0 20rpx 20rpx",
          ["mask-background-color"]: "rgba(0,0,0,0)"
        }),
        k: common_vendor.t(scanCodeData.value),
        l: common_vendor.sr(scanCodePopup, "cfade3ed-1", {
          "k": "scanCodePopup"
        }),
        m: common_vendor.p({
          type: "center",
          ["border-radius"]: "18rpx",
          ["background-color"]: "#fff"
        }),
        n: dataSelected.value === "All" ? 1 : "",
        o: common_vendor.o(($event) => handleTimeRange("All")),
        p: dataSelected.value === "lastDay" ? 1 : "",
        q: common_vendor.o(($event) => handleTimeRange("lastDay")),
        r: dataSelected.value === "lastMonths" ? 1 : "",
        s: common_vendor.o(($event) => handleTimeRange("lastMonths")),
        t: selectedDateRange.startDate,
        v: common_vendor.o(($event) => selectedDateRange.startDate = $event.detail.value),
        w: common_vendor.o(selectedStartDate),
        x: selectedDateRange.endDate,
        y: common_vendor.o(($event) => selectedDateRange.endDate = $event.detail.value),
        z: common_vendor.o(selectedEndDate),
        A: common_vendor.t(common_vendor.unref(selectedText)),
        B: showSceneName.value,
        C: common_vendor.o(bindPickerChange),
        D: common_vendor.o(reSet),
        E: common_vendor.o(submitSift),
        F: common_vendor.sr(popupBottom, "cfade3ed-2", {
          "k": "popupBottom"
        }),
        G: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "30rpx 30rpx 0 0",
          ["background-color"]: "#fff"
        }),
        H: selected.value === "view1" ? 1 : "",
        I: common_vendor.o(($event) => onClickItem("unfinish", "view1")),
        J: selected.value === "view2" ? 1 : "",
        K: common_vendor.o(($event) => onClickItem("finish", "view2")),
        L: current.value === "unfinish"
      }, current.value === "unfinish" ? common_vendor.e({
        M: unFinishDataList.value.length > 0
      }, unFinishDataList.value.length > 0 ? {
        N: common_vendor.f(unFinishDataList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.sceneName),
            b: common_vendor.t(item.levelName),
            c: common_vendor.o(($event) => toDailyInspection(item.id), item.id),
            d: item.id
          };
        }),
        O: common_assets._imports_4$4,
        P: common_vendor.o(bottomRefresh)
      } : {
        Q: common_assets._imports_5$1
      }) : current.value === "finish" ? common_vendor.e({
        S: finishDataList.value.length > 0
      }, finishDataList.value.length > 0 ? {
        T: common_vendor.f(finishDataList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.sceneName),
            b: common_vendor.t(item.completionUserName),
            c: common_vendor.t(item.completionTime),
            d: item.id,
            e: common_vendor.o(($event) => toInspectionCheck(item.id), item.id)
          };
        }),
        U: common_assets._imports_4$4,
        V: common_assets._imports_1$2,
        W: common_vendor.o(bottomRefresh)
      } : {
        X: common_assets._imports_5$1
      }) : {}, {
        R: current.value === "finish"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cfade3ed"]]);
wx.createPage(MiniProgramPage);
