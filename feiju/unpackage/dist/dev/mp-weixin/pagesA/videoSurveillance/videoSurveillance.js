"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
const _sfc_main = {
  __name: "videoSurveillance",
  setup(__props) {
    const accessToken = common_vendor.ref("");
    common_vendor.ref("");
    const sceneName = common_vendor.ref([]);
    const videoInfoList = common_vendor.ref([]);
    const getAccessToken = async () => {
      let res = await api_apis.apiGetAccessToken({
        appKey: "3faeec72eb124975b6a92147542fa189",
        appSecret: "b1efca2432e67aa7a41dfb0427a45883"
      });
      accessToken.value = res.data.accessToken;
      getTreeVideo();
    };
    const getTreeVideo = async () => {
      let res = await api_apis.apiGetTreeVideo({
        projectId: config.PROJECTID.globalProjectId
      });
      sceneName.value = res.data.children;
      if (sceneName.value.length < 1)
        return;
      sceneName.value.forEach((item) => {
        if (item.children.length > 0) {
          item.children.forEach((childItem) => {
            if (childItem.children.length > 0) {
              childItem.children.forEach((subChildItem) => {
                let videoBject = {
                  videoSrc: "ezopen://open.ys7.com/" + subChildItem.serialNumber + "/2/live",
                  videoNum: subChildItem.serialNumber,
                  videoName: subChildItem.itemName,
                  videoId: subChildItem.itemId
                };
                videoInfoList.value.push(videoBject);
              });
            }
          });
        }
      });
    };
    function toLive(playerInfo) {
      playerInfo.accessToken = accessToken.value;
      toVideoPlayer(playerInfo);
    }
    function toReplayer(playerInfo) {
      const now = /* @__PURE__ */ new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const rePlayerUrl = "ezopen://open.ys7.com/" + playerInfo.videoNum + "/2/local/" + timeFormat(startOfDay) + "/" + timeFormat(now);
      let videoInfo = {
        accessToken: accessToken.value,
        videoSrc: rePlayerUrl,
        videoName: playerInfo.videoName,
        videoNum: playerInfo.videoNum,
        videoId: playerInfo.videoId,
        isReplay: true
      };
      toVideoPlayer(videoInfo);
    }
    function toVideoPlayer(info) {
      const videoInfoString = encodeURIComponent(JSON.stringify(info));
      common_vendor.index.navigateTo({
        url: "/pagesA/videoSurveillance/rePlayerVideo?videoInfo=" + videoInfoString
      });
    }
    const timeFormat = (now) => {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const toBack = () => {
      common_vendor.index.navigateBack();
    };
    getAccessToken();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: videoInfoList.value.length > 0
      }, videoInfoList.value.length > 0 ? {
        d: common_vendor.f(videoInfoList.value, (item, index, i0) => {
          return {
            a: common_vendor.o(($event) => toLive(item), item.videoId),
            b: common_vendor.t(item.videoName),
            c: common_vendor.o(($event) => toReplayer(item), item.videoId),
            d: common_vendor.o(($event) => toLive(item), item.videoId),
            e: item.videoId
          };
        }),
        e: common_assets._imports_1$12,
        f: common_assets._imports_2$12,
        g: common_assets._imports_3$7
      } : {
        h: common_assets._imports_4$1
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-68a7ddf2"]]);
wx.createPage(MiniProgramPage);
