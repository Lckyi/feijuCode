"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
const _sfc_main = {
  __name: "sceneMonitoring",
  setup(__props) {
    const scenNameList = common_vendor.ref([]);
    const getSceneName = async () => {
      let res = await api_apis.apiGetSceneName({
        projectId: config.PROJECTID.globalProjectId
      });
      scenNameList.value = res.data.children;
    };
    const toBack = () => {
      common_vendor.index.navigateBack();
    };
    function toSceneDetails(id, name) {
      common_vendor.index.navigateTo({
        url: `/pages/sceneMonitoring/sceneDetails?id=${id}&name=${name}`
      });
    }
    getSceneName();
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: common_vendor.f(scenNameList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.levelName),
            b: common_vendor.f(item.children, (subItem, sunIndex, i1) => {
              return {
                a: common_vendor.t(subItem.sceneName),
                b: common_vendor.o(($event) => toSceneDetails(subItem.sceneId, subItem.sceneName))
              };
            }),
            c: item.levelId
          };
        }),
        d: common_assets._imports_1$11
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d3a8d4f0"]]);
wx.createPage(MiniProgramPage);
