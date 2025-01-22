"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_load_more2 + _easycom_uni_datetime_picker2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_datetime_picker + _easycom_uni_icons + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "alarmRecords",
  setup(__props) {
    const popup = common_vendor.ref(null);
    const alarmList = common_vendor.ref([]);
    const loadingType = common_vendor.ref(null);
    const noData = common_vendor.ref(false);
    const searchText = common_vendor.ref(null);
    const dataSelected = common_vendor.ref(null);
    let pageNum = 1;
    const selectedDateRange = common_vendor.reactive({
      startDate: "",
      endDate: ""
    });
    common_vendor.onShow(() => {
      common_vendor.index.$on("devName", (res) => {
        if (res) {
          searchText.value = res;
          console.log(searchText.value);
        }
      });
    });
    const submitSift = async () => {
      alarmList.value = "";
      pageNum = 1;
      getAlarm();
      noData.value = false;
      popup.value.close();
    };
    const bottomRefresh = async () => {
      if (noData.value)
        return;
      pageNum++;
      getAlarm();
    };
    const getAlarm = async () => {
      let res;
      const params = {
        projectId: config.PROJECTID.globalProjectId,
        pageNum,
        pageSize: 10
      };
      if (selectedDateRange.startDate && selectedDateRange.endDate) {
        params.startTime = selectedDateRange.startDate;
        params.endTime = selectedDateRange.endDate;
      }
      if (searchText.value) {
        params.deviceName = searchText.value;
      }
      res = await api_apis.apiGetAlarmRecords(params);
      alarmList.value = [...alarmList.value, ...res.rows];
      if (params.pageSize > res.rows.length)
        noData.value = true;
      common_vendor.index.setStorageSync("alarmList", alarmList.value);
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
    const handleTimeRange = (range) => {
      let startDate, endDate;
      dataSelected.value = range;
      const today = /* @__PURE__ */ new Date();
      switch (range) {
        case "lastMonth":
          const oneMonthsAgo = /* @__PURE__ */ new Date();
          oneMonthsAgo.setMonth(today.getMonth() - 1);
          startDate = timeFormat(oneMonthsAgo);
          endDate = timeFormat(today);
          break;
        case "lastThreeMonths":
          const threeMonthsAgo = /* @__PURE__ */ new Date();
          threeMonthsAgo.setMonth(today.getMonth() - 3);
          startDate = timeFormat(threeMonthsAgo);
          endDate = timeFormat(today);
          break;
        case "lastSixMonths":
          const sixMonthsAgo = /* @__PURE__ */ new Date();
          sixMonthsAgo.setMonth(today.getMonth() - 6);
          startDate = timeFormat(sixMonthsAgo);
          endDate = timeFormat(today);
          break;
        default:
          startDate = endDate = null;
      }
      selectedDateRange.startDate = startDate;
      selectedDateRange.endDate = endDate;
    };
    const rstartDate = common_vendor.ref("");
    const selectedStartDate = (event) => {
      let dateTime1 = new Date(rstartDate.value);
      let dateTime2 = new Date(rendDate.value);
      if (dateTime1 >= dateTime2 && dateTime2) {
        common_vendor.index.showToast({
          title: "起始日期需小于结束日期",
          icon: "none",
          duration: 2e3
        });
        selectedDateRange.startDate = "";
      } else {
        selectedDateRange.startDate = rstartDate.value;
      }
    };
    const rendDate = common_vendor.ref("");
    const selectedEndDate = (event) => {
      let dateTime1 = new Date(rstartDate.value);
      let dateTime2 = new Date(rendDate.value);
      if (dateTime1 >= dateTime2 && dateTime1) {
        common_vendor.index.showToast({
          title: "起始日期需小于结束日期",
          icon: "none",
          duration: 2e3
        });
        selectedDateRange.endDate = "";
      } else {
        selectedDateRange.endDate = rendDate.value;
      }
    };
    const reSet = () => {
      selectedDateRange.startDate = "";
      selectedDateRange.endDate = "";
      dataSelected.value = "";
      searchText.value = "";
      rendDate.value = "";
      rstartDate.value = "";
    };
    const toIndex = () => {
      common_vendor.index.navigateBack();
    };
    function messageBottom() {
      popup.value.open();
    }
    function toAlarmDetails(alarmId) {
      common_vendor.index.navigateTo({
        url: "/pages/alarmPush/alarmDetails?alarmId=" + alarmId
      });
    }
    function toSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/alarmPush/search?flag=alarmRecord"
      });
    }
    getAlarm();
    common_vendor.onUnload(() => {
      common_vendor.index.removeStorageSync("alarmList");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toIndex),
        c: common_assets._imports_1$3,
        d: common_vendor.o(messageBottom),
        e: alarmList.value.length > 0
      }, alarmList.value.length > 0 ? {
        f: common_vendor.f(alarmList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.deviceName),
            b: item.alarmLevel === 1
          }, item.alarmLevel === 1 ? {} : {}, {
            c: item.alarmLevel === 2
          }, item.alarmLevel === 2 ? {} : {}, {
            d: common_vendor.t(item.alarmTime),
            e: item.alarmLevel === 1
          }, item.alarmLevel === 1 ? {
            f: common_vendor.t(item.alarmContent)
          } : {
            g: common_vendor.t(item.alarmContent)
          }, {
            h: item.alarmLevel === 1
          }, item.alarmLevel === 1 ? {
            i: common_vendor.t(item.alarmValue),
            j: common_vendor.t(item.unit)
          } : {
            k: common_vendor.t(item.alarmValue),
            l: common_vendor.t(item.unit)
          }, {
            m: item.alarmState === 0
          }, item.alarmState === 0 ? {
            n: common_assets._imports_2$6
          } : {}, {
            o: item.alarmState === 1
          }, item.alarmState === 1 ? {
            p: common_assets._imports_3$3
          } : {}, {
            q: common_vendor.o(($event) => toAlarmDetails(item.alarmId), item.alarmId),
            r: item.alarmId
          });
        }),
        g: common_assets._imports_1$2,
        h: common_vendor.p({
          status: loadingType.value
        }),
        i: common_vendor.o(bottomRefresh)
      } : {
        j: common_assets._imports_4$1
      }, {
        k: dataSelected.value === "lastMonth" ? 1 : "",
        l: common_vendor.o(($event) => handleTimeRange("lastMonth")),
        m: dataSelected.value === "lastThreeMonths" ? 1 : "",
        n: common_vendor.o(($event) => handleTimeRange("lastThreeMonths")),
        o: dataSelected.value === "lastSixMonths" ? 1 : "",
        p: common_vendor.o(($event) => handleTimeRange("lastSixMonths")),
        q: selectedDateRange.startDate,
        r: common_vendor.o(($event) => selectedDateRange.startDate = $event.detail.value),
        s: common_vendor.o(selectedStartDate),
        t: common_vendor.o(($event) => rstartDate.value = $event),
        v: common_vendor.p({
          type: "datetime",
          modelValue: rstartDate.value
        }),
        w: selectedDateRange.endDate,
        x: common_vendor.o(($event) => selectedDateRange.endDate = $event.detail.value),
        y: common_vendor.o(selectedEndDate),
        z: common_vendor.o(($event) => rendDate.value = $event),
        A: common_vendor.p({
          type: "datetime",
          ["min-date"]: rstartDate.value,
          modelValue: rendDate.value
        }),
        B: common_vendor.p({
          type: "search",
          size: "26",
          color: "#DDE4EF"
        }),
        C: searchText.value,
        D: common_vendor.o(($event) => searchText.value = $event.detail.value),
        E: common_vendor.o(toSearch),
        F: common_vendor.o(reSet),
        G: common_vendor.o(submitSift),
        H: common_vendor.sr(popup, "b72ac77b-1", {
          "k": "popup"
        }),
        I: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "16rpx 16rpx 0 0",
          ["background-color"]: "#fff",
          ["safe-area"]: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b72ac77b"]]);
wx.createPage(MiniProgramPage);
