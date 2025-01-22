"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _component_ezplayer = common_vendor.resolveComponent("ezplayer");
  (_easycom_uni_datetime_picker2 + _component_ezplayer)();
}
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  _easycom_uni_datetime_picker();
}
const _sfc_main = {
  __name: "rePlayerVideo",
  setup(__props) {
    common_vendor.ref(null);
    let startTime = common_vendor.ref(null);
    let endtTime = common_vendor.ref(null);
    const videoInfo = common_vendor.ref([]);
    common_vendor.onLoad((options) => {
      if (options.videoInfo) {
        try {
          videoInfo.value = JSON.parse(decodeURIComponent(options.videoInfo));
        } catch (error) {
          console.error("Error parsing video info:", error);
        }
      }
      console.log("传输的信息", videoInfo.value);
      console.log("设备编号", videoInfo.value.videoNum);
    });
    function selectedRange(e) {
      startTime.value = e[0];
      endtTime.value = e[1];
      if (compareDates(startTime.value, endtTime.value)) {
        videoInfo.value.videoSrc = "ezopen://open.ys7.com/" + videoInfo.value.videoNum + "/2/local/" + startTime.value + "/" + endtTime.value;
      } else {
        common_vendor.index.showToast({
          title: "日期必须是同一天",
          icon: "none",
          duration: 2e3
        });
      }
    }
    function compareDates(dateStr1, dateStr2) {
      const date1 = new Date(dateStr1);
      const date2 = new Date(dateStr2);
      const year1 = date1.getFullYear();
      const month1 = date1.getMonth() + 1;
      const day1 = date1.getDate();
      const year2 = date2.getFullYear();
      const month2 = date2.getMonth() + 1;
      const day2 = date2.getDate();
      return year1 === year2 && month1 === month2 && day1 === day2;
    }
    const toBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: common_vendor.t(videoInfo.value.videoName),
        d: videoInfo.value.isReplay
      }, videoInfo.value.isReplay ? {
        e: common_vendor.o(selectedRange),
        f: common_vendor.p({
          type: "datetimerange"
        })
      } : {}, {
        g: videoInfo.value.videoId,
        h: videoInfo.value.accessToken,
        i: videoInfo.value.videoSrc
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-70fcaac9"]]);
wx.createPage(MiniProgramPage);
