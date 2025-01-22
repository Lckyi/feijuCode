"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
const _sfc_main = {
  __name: "user",
  setup(__props) {
    common_vendor.ref(null);
    const userInfo = common_vendor.ref([]);
    const avatarUrl = common_vendor.ref("");
    const HeaderUrl = config.imgRequestHeader.URL;
    const getUserInfo = async () => {
      let res = await api_apis.apiGetUserInfo();
      userInfo.value = res.user;
      avatarUrl.value = HeaderUrl + userInfo.value.avatar;
    };
    const loadImageError = () => {
      avatarUrl.value = "../../static/images/contacts/touxiang.png";
    };
    function toChangePassword() {
      common_vendor.index.navigateTo({
        url: "/pages/user/changePassword"
      });
    }
    const logout = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("publicKey");
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.reLaunch({
              // 跳转到登录页面
              url: "/pages/login/login"
            });
          }
        }
      });
    };
    getUserInfo();
    return (_ctx, _cache) => {
      return {
        a: avatarUrl.value,
        b: common_vendor.o(loadImageError),
        c: common_vendor.t(userInfo.value.nickName),
        d: common_vendor.t(userInfo.value.phonenumber),
        e: common_assets._imports_0$3,
        f: common_assets._imports_1$2,
        g: common_vendor.o(toChangePassword),
        h: common_assets._imports_2$5,
        i: common_assets._imports_3$2,
        j: common_vendor.o(logout)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f7520f0"]]);
wx.createPage(MiniProgramPage);
