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
  __name: "hiddenTrouble",
  setup(__props) {
    const current = common_vendor.ref("全部");
    const selected = common_vendor.ref("view1");
    const popupBottom = common_vendor.ref("");
    const hiddenDangerList = common_vendor.ref([]);
    const noData = common_vendor.ref(false);
    let allPageNum = 1;
    let assignedPageNum = 1;
    let disposedPageNum = 1;
    let reviewedPageNum = 1;
    let disposalPageNum = 1;
    let noDisposalPageNum = 1;
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
      noData.value = false;
      initializeCurrent(current.value);
    });
    const getHiddenDanger = async () => {
      const params = {
        projectId: config.PROJECTID.globalProjectId,
        pageSize: 10
      };
      if (current.value === "全部") {
        params.pageNum = allPageNum;
      }
      if (current.value === "待指派") {
        params.pageNum = assignedPageNum;
        params.state = 0;
      }
      if (current.value === "待处置") {
        params.pageNum = disposedPageNum;
        params.state = 1;
      }
      if (current.value === "待审核") {
        params.pageNum = reviewedPageNum;
        params.state = 4;
      }
      if (current.value === "处置完成") {
        params.pageNum = disposalPageNum;
        params.state = 2;
      }
      if (current.value === "无需处置") {
        params.pageNum = noDisposalPageNum;
        params.state = 3;
      }
      if (requestSceneId.value) {
        params.sceneId = requestSceneId.value;
      }
      if (requestendDate.value && requestStartDate.value) {
        params.startDate = requestStartDate.value;
        params.endDate = requestendDate.value;
      }
      let res = await api_apis.apiGetHiddenDanger(params);
      hiddenDangerList.value = [...hiddenDangerList.value, ...res.data.records];
      if (params.pageSize > res.data.records.length)
        noData.value = true;
      common_vendor.index.setStorageSync("hiddenDangerList", hiddenDangerList.value);
    };
    const bottomRefresh = async () => {
      if (noData.value)
        return;
      if (current.value === "全部") {
        allPageNum++;
      }
      if (current.value === "待指派") {
        assignedPageNum++;
      }
      if (current.value === "待处置") {
        disposedPageNum++;
      }
      if (current.value === "待审核") {
        reviewedPageNum++;
      }
      if (current.value === "处置完成") {
        disposalPageNum++;
      }
      if (current.value === "无需处置") {
        noDisposalPageNum++;
      }
      getHiddenDanger();
    };
    const submitSift = async () => {
      noData.value = false;
      requestSceneId.value = selectedSceneId.value;
      requestStartDate.value = selectedDateRange.startDate;
      requestendDate.value = selectedDateRange.endDate;
      initializeCurrent(current.value);
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
      current.value = content;
      selected.value = view;
      noData.value = false;
      initializeCurrent(current.value);
    }
    function initializeCurrent(current2) {
      if (current2 === "全部") {
        allPageNum = 1;
      }
      if (current2 === "待指派") {
        assignedPageNum = 1;
      }
      if (current2 === "待处置") {
        disposedPageNum = 1;
      }
      if (current2 === "待审核") {
        reviewedPageNum = 1;
      }
      if (current2 === "处置完成") {
        disposalPageNum = 1;
      }
      if (current2 === "无需处置") {
        noDisposalPageNum = 1;
      }
      hiddenDangerList.value = "";
      getHiddenDanger();
    }
    const statusColors = {
      "0": "#F56C6C",
      //待指派
      "1": "#FFAF41",
      //待处置
      "2": "#61D19F",
      //处置完成
      "3": "#9CABCB",
      //无需处置
      "4": "#00ADB5"
      //待审核
    };
    const getItemColor = (status) => {
      return statusColors[status] || "black";
    };
    const toIndex = () => {
      common_vendor.index.navigateBack();
    };
    function toSubHiddenTrouble(id) {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/subHiddenTrouble?id=" + id
      });
    }
    function popupBottomOpen() {
      popupBottom.value.open();
    }
    getSceneName();
    common_vendor.onUnload(() => {
      common_vendor.index.removeStorageSync("hiddenDangerList");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toIndex),
        c: common_assets._imports_1$3,
        d: common_vendor.o(popupBottomOpen),
        e: selected.value === "view1" ? 1 : "",
        f: common_vendor.o(($event) => onClickItem("全部", "view1")),
        g: selected.value === "view2" ? 1 : "",
        h: common_vendor.o(($event) => onClickItem("待指派", "view2")),
        i: selected.value === "view3" ? 1 : "",
        j: common_vendor.o(($event) => onClickItem("待处置", "view3")),
        k: selected.value === "view4" ? 1 : "",
        l: common_vendor.o(($event) => onClickItem("待审核", "view4")),
        m: selected.value === "view5" ? 1 : "",
        n: common_vendor.o(($event) => onClickItem("处置完成", "view5")),
        o: selected.value === "view6" ? 1 : "",
        p: common_vendor.o(($event) => onClickItem("无需处置", "view6")),
        q: current.value === "全部"
      }, current.value === "全部" ? common_vendor.e({
        r: hiddenDangerList.value.length > 0
      }, hiddenDangerList.value.length > 0 ? {
        s: common_vendor.f(hiddenDangerList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.sceneName),
            b: common_vendor.t(item.disposerName),
            c: common_vendor.t(item.disposalTime),
            d: item.state === "0"
          }, item.state === "0" ? {} : item.state === "1" ? {} : item.state === "2" ? {} : item.state === "3" ? {} : item.state === "4" ? {} : {}, {
            e: item.state === "1",
            f: item.state === "2",
            g: item.state === "3",
            h: item.state === "4",
            i: getItemColor(item.state),
            j: common_vendor.t(item.dailyInspectionItemValue),
            k: item.id,
            l: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        t: common_assets._imports_2$1,
        v: common_assets._imports_1$8,
        w: common_vendor.o(bottomRefresh)
      } : {
        x: common_assets._imports_2$9
      }) : {}, {
        y: current.value === "待指派"
      }, current.value === "待指派" ? common_vendor.e({
        z: hiddenDangerList.value.length > 0
      }, hiddenDangerList.value.length > 0 ? {
        A: common_vendor.f(hiddenDangerList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.state === "0"
          }, item.state === "0" ? {
            b: common_assets._imports_2$1,
            c: common_vendor.t(item.sceneName),
            d: common_vendor.t(item.disposerName),
            e: common_vendor.t(item.disposalTime),
            f: common_assets._imports_1$8,
            g: common_vendor.t(item.dailyInspectionItemValue)
          } : {}, {
            h: item.id,
            i: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        B: common_vendor.o(bottomRefresh)
      } : {
        C: common_assets._imports_2$9
      }) : {}, {
        D: current.value === "待处置"
      }, current.value === "待处置" ? common_vendor.e({
        E: hiddenDangerList.value.length > 0
      }, hiddenDangerList.value.length > 0 ? {
        F: common_vendor.f(hiddenDangerList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.state === "1"
          }, item.state === "1" ? {
            b: common_assets._imports_2$1,
            c: common_vendor.t(item.sceneName),
            d: common_vendor.t(item.disposerName),
            e: common_vendor.t(item.disposalTime),
            f: common_assets._imports_1$8,
            g: common_vendor.t(item.dailyInspectionItemValue)
          } : {}, {
            h: item.id,
            i: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        G: common_vendor.o(bottomRefresh)
      } : {
        H: common_assets._imports_2$9
      }) : {}, {
        I: current.value === "待审核"
      }, current.value === "待审核" ? common_vendor.e({
        J: hiddenDangerList.value.length > 0
      }, hiddenDangerList.value.length > 0 ? {
        K: common_vendor.f(hiddenDangerList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.state === "4"
          }, item.state === "4" ? {
            b: common_assets._imports_2$1,
            c: common_vendor.t(item.sceneName),
            d: common_vendor.t(item.disposerName),
            e: common_vendor.t(item.disposalTime),
            f: common_assets._imports_1$8,
            g: common_vendor.t(item.dailyInspectionItemValue)
          } : {}, {
            h: item.id,
            i: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        L: common_vendor.o(bottomRefresh)
      } : {
        M: common_assets._imports_2$9
      }) : {}, {
        N: current.value === "处置完成"
      }, current.value === "处置完成" ? common_vendor.e({
        O: hiddenDangerList.value.length > 0
      }, hiddenDangerList.value.length > 0 ? {
        P: common_vendor.f(hiddenDangerList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.state === "2"
          }, item.state === "2" ? {
            b: common_assets._imports_2$1,
            c: common_vendor.t(item.sceneName),
            d: common_vendor.t(item.disposerName),
            e: common_vendor.t(item.disposalTime),
            f: common_assets._imports_1$8,
            g: common_vendor.t(item.dailyInspectionItemValue)
          } : {}, {
            h: item.id,
            i: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        Q: common_vendor.o(bottomRefresh)
      } : {
        R: common_assets._imports_2$9
      }) : {}, {
        S: current.value === "无需处置"
      }, current.value === "无需处置" ? common_vendor.e({
        T: hiddenDangerList.value.length > 0
      }, hiddenDangerList.value.length > 0 ? {
        U: common_vendor.f(hiddenDangerList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.state === "3"
          }, item.state === "3" ? {
            b: common_assets._imports_2$1,
            c: common_vendor.t(item.sceneName),
            d: common_vendor.t(item.disposerName),
            e: common_vendor.t(item.disposalTime),
            f: common_assets._imports_1$8,
            g: common_vendor.t(item.dailyInspectionItemValue)
          } : {}, {
            h: item.id,
            i: common_vendor.o(($event) => toSubHiddenTrouble(item.id), item.id)
          });
        }),
        V: common_vendor.o(bottomRefresh)
      } : {
        W: common_assets._imports_2$9
      }) : {}, {
        X: dataSelected.value === "All" ? 1 : "",
        Y: common_vendor.o(($event) => handleTimeRange("All")),
        Z: dataSelected.value === "lastDay" ? 1 : "",
        aa: common_vendor.o(($event) => handleTimeRange("lastDay")),
        ab: dataSelected.value === "lastMonths" ? 1 : "",
        ac: common_vendor.o(($event) => handleTimeRange("lastMonths")),
        ad: selectedDateRange.startDate,
        ae: common_vendor.o(($event) => selectedDateRange.startDate = $event.detail.value),
        af: common_vendor.o(selectedStartDate),
        ag: selectedDateRange.endDate,
        ah: common_vendor.o(($event) => selectedDateRange.endDate = $event.detail.value),
        ai: common_vendor.o(selectedEndDate),
        aj: common_vendor.t(common_vendor.unref(selectedText)),
        ak: showSceneName.value,
        al: common_vendor.o(bindPickerChange),
        am: common_vendor.o(reSet),
        an: common_vendor.o(submitSift),
        ao: common_vendor.sr(popupBottom, "368ba206-0", {
          "k": "popupBottom"
        }),
        ap: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "30rpx 30rpx 0 0",
          ["background-color"]: "#fff"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-368ba206"]]);
wx.createPage(MiniProgramPage);
