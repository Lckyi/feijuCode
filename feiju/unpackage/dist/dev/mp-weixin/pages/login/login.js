"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_rsa = require("../../utils/rsa.js");
const config = require("../../config.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const username = common_vendor.ref("");
    const password = common_vendor.ref("");
    const publicKey = common_vendor.ref("");
    let encryptPassword = common_vendor.ref("");
    const remember = common_vendor.ref(false);
    const autoLogin = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      const savedAutoLogin = common_vendor.index.getStorageSync("autoLogin");
      const savedUsername = common_vendor.index.getStorageSync("username");
      const savedPassword = common_vendor.index.getStorageSync("password");
      if (savedUsername && savedPassword) {
        username.value = savedUsername;
        password.value = savedPassword;
        remember.value = true;
      }
      if (savedAutoLogin) {
        autoLogin.value = true;
      } else {
        autoLogin.value = false;
      }
    });
    function changeRemember() {
      remember.value = !remember.value;
    }
    function changeLogin() {
      autoLogin.value = !autoLogin.value;
    }
    const login = async () => {
      if (!username.value) {
        infoTips("请输入账号");
        return;
      }
      if (!password.value) {
        infoTips("请输入密码");
        return;
      }
      try {
        const resKey = await common_vendor.index.request({
          url: config.BASE_URL + "/publicKey",
          method: "GET"
        });
        publicKey.value = resKey.data.publicKey;
        common_vendor.index.setStorageSync("publicKey", publicKey.value);
        encryptPassword = utils_rsa.rsaEncrypt(password.value, publicKey.value);
        const res = await common_vendor.index.request({
          url: config.BASE_URL + "/login",
          method: "POST",
          data: {
            username: username.value,
            password: encryptPassword
          }
        });
        if (res.data.code === 200) {
          const token = res.data.token;
          common_vendor.index.setStorageSync("token", token);
          if (remember.value) {
            common_vendor.index.setStorageSync("username", username.value);
            common_vendor.index.setStorageSync("password", password.value);
          } else {
            common_vendor.index.removeStorageSync("username");
            common_vendor.index.removeStorageSync("password");
          }
          if (autoLogin.value) {
            common_vendor.index.setStorageSync("autoLogin", autoLogin.value);
            common_vendor.index.setStorageSync("username", username.value);
            common_vendor.index.setStorageSync("password", password.value);
          } else {
            common_vendor.index.removeStorageSync("autoLogin");
          }
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.showToast({
            title: "登录失败：" + res.data.msg,
            icon: "none"
          });
        }
      } catch (error) {
        console.error("登录请求失败：", error);
        common_vendor.index.showToast({
          title: "网络错误",
          icon: "none"
        });
      }
    };
    function infoTips(mass) {
      common_vendor.index.showToast({
        title: mass,
        icon: "none",
        duration: 2e3
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: username.value,
        e: common_vendor.o(($event) => username.value = $event.detail.value),
        f: common_assets._imports_3,
        g: password.value,
        h: common_vendor.o(($event) => password.value = $event.detail.value),
        i: remember.value,
        j: common_vendor.o(changeRemember),
        k: autoLogin.value,
        l: common_vendor.o(changeLogin),
        m: common_assets._imports_4,
        n: common_vendor.o(login)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
