"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_collapse_item2 + _easycom_uni_collapse2 + _easycom_uni_popup2)();
}
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_collapse_item + _easycom_uni_collapse + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "inspectionCheck",
  setup(__props) {
    const selectedRows = common_vendor.ref([null]);
    const inspectionId = common_vendor.ref("");
    const inspectionData = common_vendor.ref([]);
    const inspectionItemList = common_vendor.ref([]);
    const attachmentList = common_vendor.ref([]);
    const imgRequestHead = config.imgRequestHeader.URL;
    const popup = common_vendor.ref("");
    const playVideoUrl = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      inspectionId.value = e.id;
      getInspectionById();
    });
    const getInspectionById = async () => {
      if (inspectionId.value) {
        let res = await api_apis.apiGetInspectionById(inspectionId.value);
        inspectionData.value = res.data;
        inspectionItemList.value = res.data.inspectionItemList;
        attachmentList.value = res.data.inspectionItemList.attachmentList;
      } else {
        common_vendor.index.showModal({
          content: "未获取ID",
          showCancel: false
        });
      }
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
    const toInspection = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toInspection),
        c: common_vendor.t(inspectionData.value.sceneName),
        d: common_vendor.t(inspectionData.value.taskName),
        e: common_vendor.t(inspectionData.value.levelName),
        f: common_vendor.t(inspectionData.value.sceneName),
        g: common_vendor.f(inspectionItemList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.f(item.attachmentList, (subItem, subIndex, i1) => {
              return common_vendor.e({
                a: subItem.split(".").pop() === "mp4"
              }, subItem.split(".").pop() === "mp4" ? {
                b: common_vendor.unref(imgRequestHead) + subItem,
                c: common_vendor.o(($event) => showVideo(common_vendor.unref(imgRequestHead) + subItem), subIndex)
              } : {
                d: common_vendor.unref(imgRequestHead) + subItem,
                e: common_vendor.o(($event) => showImg(common_vendor.unref(imgRequestHead) + subItem), subIndex)
              }, {
                f: subIndex
              });
            }),
            c: common_vendor.t(item.note),
            d: item.id,
            e: common_vendor.n({
              selected: selectedRows.value.includes(index)
            }),
            f: "2b8c8013-1-" + i0 + ",2b8c8013-0"
          };
        }),
        h: common_vendor.p({
          ["title-border"]: "none",
          border: false
        }),
        i: common_vendor.p({
          accordion: true
        }),
        j: playVideoUrl.value,
        k: common_vendor.sr(popup, "2b8c8013-2", {
          "k": "popup"
        }),
        l: common_vendor.p({
          type: "center"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2b8c8013"]]);
wx.createPage(MiniProgramPage);
