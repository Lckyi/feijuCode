"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_message + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "hiddenTroubleAudit",
  setup(__props) {
    const hiddenTroubleId = common_vendor.ref("");
    const reviewReason = common_vendor.ref("");
    const successPopup = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      hiddenTroubleId.value = e.id;
    });
    const submitBack = async () => {
      if (!reviewReason.value) {
        infoTips("请填写退回原因");
        return;
      }
      try {
        let res = await api_apis.apiPutDisposalAudit({
          adopt: false,
          id: hiddenTroubleId.value,
          reviewRejectReason: reviewReason.value
        });
        if (res.code === 200) {
          successPopup.value.open();
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          infoTips("退回失败");
        }
      } catch (err) {
        infoTips(err.msg);
      }
    };
    function infoTips(mass) {
      common_vendor.index.showToast({
        title: mass,
        icon: "none",
        duration: 2e3
      });
    }
    function toBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: reviewReason.value,
        d: common_vendor.o(($event) => reviewReason.value = $event.detail.value),
        e: common_vendor.o(submitBack),
        f: common_vendor.p({
          type: "success",
          message: "成功退回",
          duration: 1e3
        }),
        g: common_vendor.sr(successPopup, "f8cb946c-0", {
          "k": "successPopup"
        }),
        h: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f8cb946c"]]);
wx.createPage(MiniProgramPage);
