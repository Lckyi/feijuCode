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
  __name: "hiddenTroubleLog",
  setup(__props) {
    const HiddenDangerId = common_vendor.ref("");
    const logList = common_vendor.ref([]);
    const playVideoUrl = common_vendor.ref("");
    const popup = common_vendor.ref("");
    const imgRequestHead = config.imgRequestHeader.URL;
    const audioContext = common_vendor.index.createInnerAudioContext();
    const playIndex = common_vendor.ref(null);
    const recordingList = common_vendor.ref([]);
    common_vendor.onLoad((e) => {
      HiddenDangerId.value = e.id;
      getHiddenDangerLog();
    });
    const getHiddenDangerLog = async () => {
      let res = await api_apis.apiGetHiddenDangerLog({
        hiddenDangerId: HiddenDangerId.value,
        pageSize: 999
      });
      logList.value = res.data.records;
      recordingList.value = logList.value[0].recordingList;
    };
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
    const playRecording = (index) => {
      audioContext.stop();
      if (playIndex.value === index) {
        playIndex.value = "";
      } else {
        playIndex.value = index;
        audioContext.src = imgRequestHead + recordingList.value[index];
        audioContext.play();
        audioContext.onEnded(() => {
          playIndex.value = "";
        });
      }
    };
    function toBack() {
      common_vendor.index.navigateBack();
    }
    common_vendor.onUnmounted(() => {
      audioContext.destroy();
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: common_vendor.f(logList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "3"
          }, item.type === "3" ? {
            b: common_vendor.t(item.reviewer)
          } : {}, {
            c: item.type === "2"
          }, item.type === "2" ? {
            d: common_vendor.t(item.disposerName)
          } : {}, {
            e: item.type === "1"
          }, item.type === "1" ? {
            f: common_vendor.t(item.assignorName)
          } : {}, {
            g: item.type === "0"
          }, item.type === "0" ? {
            h: common_vendor.t(item.discovererName)
          } : {}, {
            i: item.type === "3"
          }, item.type === "3" ? {} : {}, {
            j: item.type === "2"
          }, item.type === "2" ? {} : {}, {
            k: item.type === "1"
          }, item.type === "1" ? {} : {}, {
            l: item.type === "0"
          }, item.type === "0" ? {} : {}, {
            m: common_vendor.t(item.time),
            n: item.type === "3"
          }, item.type === "3" ? common_vendor.e({
            o: item.reviewRejectReason
          }, item.reviewRejectReason ? {
            p: common_vendor.t(item.reviewRejectReason)
          } : {}) : {}, {
            q: item.type === "1"
          }, item.type === "1" ? {
            r: common_vendor.t(item.disposerName)
          } : {}, {
            s: item.type !== "3"
          }, item.type !== "3" ? common_vendor.e({
            t: item.hiddenDangerState === "0"
          }, item.hiddenDangerState === "0" ? {} : {}, {
            v: item.hiddenDangerState === "1"
          }, item.hiddenDangerState === "1" ? {} : {}, {
            w: item.hiddenDangerState === "4"
          }, item.hiddenDangerState === "4" ? {} : {}, {
            x: item.hiddenDangerLevel === "0"
          }, item.hiddenDangerLevel === "0" ? {} : {}, {
            y: item.hiddenDangerLevel === "1"
          }, item.hiddenDangerLevel === "1" ? {} : {}, {
            z: item.hiddenDangerLevel === "2"
          }, item.hiddenDangerLevel === "2" ? {} : {}, {
            A: item.hiddenDangerLevel === "3"
          }, item.hiddenDangerLevel === "3" ? {} : {}) : {}, {
            B: item.type === "2" || item.type === "0"
          }, item.type === "2" || item.type === "0" ? {
            C: common_vendor.f(item.type === "2" ? item.disposalFileList : item.attachmentList, (subItem, subIndex, i1) => {
              return common_vendor.e({
                a: subItem
              }, subItem ? common_vendor.e({
                b: subItem.split(".").pop() === "mp4"
              }, subItem.split(".").pop() === "mp4" ? {
                c: common_vendor.unref(imgRequestHead) + subItem,
                d: common_vendor.o(($event) => showVideo(common_vendor.unref(imgRequestHead) + subItem), subIndex)
              } : {
                e: common_vendor.unref(imgRequestHead) + subItem,
                f: common_vendor.o(($event) => showImg(common_vendor.unref(imgRequestHead) + subItem), subIndex)
              }) : {}, {
                g: subIndex
              });
            })
          } : {}, {
            D: item.type === "0"
          }, item.type === "0" ? {
            E: common_vendor.f(item.recordingList, (subItem, subIndex, i1) => {
              return common_vendor.e({
                a: subItem
              }, subItem ? common_vendor.e({
                b: playIndex.value === subIndex
              }, playIndex.value === subIndex ? {
                c: common_assets._imports_1$9
              } : {
                d: common_assets._imports_2$11
              }, {
                e: common_vendor.o(($event) => playRecording(subIndex), subIndex)
              }) : {}, {
                f: subIndex
              });
            })
          } : {}, {
            F: item.id
          });
        }),
        d: common_vendor.o((...args) => _ctx.bottomRefresh && _ctx.bottomRefresh(...args)),
        e: playVideoUrl.value,
        f: common_vendor.sr(popup, "8fb3ba3f-0", {
          "k": "popup"
        }),
        g: common_vendor.p({
          type: "center"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8fb3ba3f"]]);
wx.createPage(MiniProgramPage);
