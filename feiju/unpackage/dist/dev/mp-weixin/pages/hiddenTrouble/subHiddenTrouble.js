"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  (_easycom_uni_popup2 + _easycom_uni_popup_message2)();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
if (!Math) {
  (_easycom_uni_popup + _easycom_uni_popup_message)();
}
const _sfc_main = {
  __name: "subHiddenTrouble",
  setup(__props) {
    const hiddenTroubleId = common_vendor.ref(null);
    const hiddenTroubleData = common_vendor.ref([]);
    const imgRequestHead = config.imgRequestHeader.URL;
    const popup = common_vendor.ref("");
    const auditPopup = common_vendor.ref("");
    const successPopup = common_vendor.ref("");
    const playVideoUrl = common_vendor.ref("");
    const annexDataList = common_vendor.ref("");
    let firstLoad = true;
    common_vendor.onLoad((e) => {
      hiddenTroubleId.value = e.id;
      getHiddenDanger();
    });
    common_vendor.onShow(() => {
      if (firstLoad) {
        firstLoad = false;
        return;
      }
      hiddenTroubleData.value = "";
      getHiddenDanger();
    });
    const getHiddenDanger = async () => {
      let res = await api_apis.apiGetHiddenDangerById(hiddenTroubleId.value);
      hiddenTroubleData.value = res.data;
      annexDataList.value = [...hiddenTroubleData.value.attachmentList, ...hiddenTroubleData.value.disposalFileList];
    };
    function toAudit() {
      auditPopup.value.open();
    }
    const passAudit = async () => {
      auditPopup.value.close();
      try {
        let res = await api_apis.apiPutDisposalAudit({
          adopt: true,
          id: hiddenTroubleId.value
        });
        if (res.code === 200) {
          successPopup.value.open();
          hiddenTroubleData.value = "";
          getHiddenDanger();
        } else {
          infoTips("审核失败");
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
    function cancel() {
      auditPopup.value.close();
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/hiddenTroubleAudit?id=" + hiddenTroubleId.value
      });
    }
    function showVideo(url) {
      popup.value.open();
      playVideoUrl.value = url;
    }
    function showImg(url) {
      common_vendor.index.previewImage({
        current: "",
        urls: [url]
      });
    }
    function toLog() {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/hiddenTroubleLog?id=" + hiddenTroubleId.value
      });
    }
    function toDisposal() {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/hiddenTroubleDisposal?id=" + hiddenTroubleId.value
      });
    }
    function toAssign() {
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/hiddenTroubleAssign?id=" + hiddenTroubleId.value
      });
    }
    const toHiddenTrouble = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$5,
        b: common_vendor.o(toHiddenTrouble),
        c: common_vendor.t(hiddenTroubleData.value.sceneName),
        d: common_vendor.o(toLog),
        e: common_vendor.t(hiddenTroubleData.value.levelName),
        f: common_vendor.t(hiddenTroubleData.value.sceneName),
        g: hiddenTroubleData.value.state === "0"
      }, hiddenTroubleData.value.state === "0" ? {} : {}, {
        h: hiddenTroubleData.value.state === "1"
      }, hiddenTroubleData.value.state === "1" ? {} : {}, {
        i: hiddenTroubleData.value.state === "2"
      }, hiddenTroubleData.value.state === "2" ? {} : {}, {
        j: hiddenTroubleData.value.state === "3"
      }, hiddenTroubleData.value.state === "3" ? {} : {}, {
        k: hiddenTroubleData.value.state === "4"
      }, hiddenTroubleData.value.state === "4" ? {} : {}, {
        l: hiddenTroubleData.value.level === "0"
      }, hiddenTroubleData.value.level === "0" ? {} : {}, {
        m: hiddenTroubleData.value.level === "1"
      }, hiddenTroubleData.value.level === "1" ? {} : {}, {
        n: hiddenTroubleData.value.level === "2"
      }, hiddenTroubleData.value.level === "2" ? {} : {}, {
        o: hiddenTroubleData.value.level === "3"
      }, hiddenTroubleData.value.level === "3" ? {} : {}, {
        p: common_vendor.t(hiddenTroubleData.value.discovererName),
        q: common_vendor.t(hiddenTroubleData.value.discoveryTime),
        r: hiddenTroubleData.value.state !== "0"
      }, hiddenTroubleData.value.state !== "0" ? {
        s: common_vendor.t(hiddenTroubleData.value.assignorName),
        t: common_vendor.t(hiddenTroubleData.value.assignTime)
      } : {}, {
        v: hiddenTroubleData.value.state === "2" || hiddenTroubleData.value.state === "4"
      }, hiddenTroubleData.value.state === "2" || hiddenTroubleData.value.state === "4" ? {
        w: common_vendor.t(hiddenTroubleData.value.disposerName),
        x: common_vendor.t(hiddenTroubleData.value.disposalTime)
      } : {}, {
        y: hiddenTroubleData.value.state === "1" || hiddenTroubleData.value.state === "4"
      }, hiddenTroubleData.value.state === "1" || hiddenTroubleData.value.state === "4" ? {
        z: common_vendor.t(hiddenTroubleData.value.closingDate)
      } : {}, {
        A: common_assets._imports_1$8,
        B: common_vendor.t(hiddenTroubleData.value.dailyInspectionItemValue),
        C: common_vendor.f(annexDataList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item
          }, item ? common_vendor.e({
            b: item.split(".").pop() === "mp4"
          }, item.split(".").pop() === "mp4" ? {
            c: common_vendor.unref(imgRequestHead) + item,
            d: common_vendor.o(($event) => showVideo(common_vendor.unref(imgRequestHead) + item), index)
          } : {
            e: common_vendor.unref(imgRequestHead) + item,
            f: common_vendor.o(($event) => showImg(common_vendor.unref(imgRequestHead) + item), index)
          }) : {}, {
            g: index
          });
        }),
        D: common_vendor.t(hiddenTroubleData.value.note),
        E: hiddenTroubleData.value.state !== "0" && hiddenTroubleData.value.state !== "3"
      }, hiddenTroubleData.value.state !== "0" && hiddenTroubleData.value.state !== "3" ? {
        F: common_vendor.t(hiddenTroubleData.value.disposalSuggestion)
      } : {}, {
        G: hiddenTroubleData.value.state === "0"
      }, hiddenTroubleData.value.state === "0" ? {
        H: common_vendor.o(toAssign)
      } : {}, {
        I: hiddenTroubleData.value.state === "1"
      }, hiddenTroubleData.value.state === "1" ? {
        J: common_vendor.o(toDisposal)
      } : {}, {
        K: hiddenTroubleData.value.state === "4"
      }, hiddenTroubleData.value.state === "4" ? {
        L: common_vendor.o(toAudit)
      } : {}, {
        M: playVideoUrl.value,
        N: common_vendor.sr(popup, "39afe478-0", {
          "k": "popup"
        }),
        O: common_vendor.p({
          type: "center"
        }),
        P: common_vendor.o(passAudit),
        Q: common_vendor.o(cancel),
        R: common_vendor.sr(auditPopup, "39afe478-1", {
          "k": "auditPopup"
        }),
        S: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "20rpx 20rpx 0 0",
          ["background-color"]: "#fff",
          ["safe-area"]: true
        }),
        T: common_vendor.p({
          type: "success",
          message: "审核成功",
          duration: 1e3
        }),
        U: common_vendor.sr(successPopup, "39afe478-2", {
          "k": "successPopup"
        }),
        V: common_vendor.p({
          type: "message"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-39afe478"]]);
wx.createPage(MiniProgramPage);
