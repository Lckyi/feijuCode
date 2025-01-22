"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_rsa = require("./utils/rsa.js");
const utils_update = require("./utils/update.js");
const config = require("./config.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
  "./pages/contacts/contacts.js";
  "./pages/user/user.js";
  "./pages/alarmRecords/alarmRecords.js";
  "./pages/alarmPush/alarmPush.js";
  "./pages/alarmPush/search.js";
  "./pages/alarmPush/alarmDetails.js";
  "./pages/inspection/inspection.js";
  "./pages/inspection/dailyInspection.js";
  "./pages/inspection/inspectionCheck.js";
  "./pages/hiddenTrouble/hiddenTrouble.js";
  "./pages/hiddenTrouble/subHiddenTrouble.js";
  "./pages/hiddenTrouble/hiddenTroubleDisposal.js";
  "./pages/hiddenTrouble/hiddenTroubleAssign.js";
  "./pages/hiddenTrouble/nameSearch.js";
  "./pages/hiddenTrouble/photographed.js";
  "./pages/contacts/operatorPage.js";
  "./pages/user/changePassword.js";
  "./pages/hiddenTrouble/hiddenTroubleAudit.js";
  "./pages/hiddenTrouble/hiddenTroubleLog.js";
  "./pages/sceneMonitoring/sceneMonitoring.js";
  "./pages/sceneMonitoring/sceneDetails.js";
  "./pagesA/videoSurveillance/videoSurveillance.js";
  "./pagesA/videoSurveillance/rePlayerVideo.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.index.getStorageSync("token");
    const password = common_vendor.index.getStorageSync("password");
    const username = common_vendor.index.getStorageSync("username");
    const saveautoLogin = common_vendor.index.getStorageSync("autoLogin");
    const { checkForUpdate } = utils_update.useUpdateManager();
    common_vendor.onLaunch(() => {
      if (saveautoLogin) {
        autoLogin();
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
        console.log("No token found");
      }
      checkForUpdate();
    });
    common_vendor.onMounted(() => {
      getLocation();
    });
    const autoLogin = async () => {
      try {
        const publicKey = common_vendor.index.getStorageSync("publicKey");
        const encryptPassword = utils_rsa.rsaEncrypt(password, publicKey);
        const res = await common_vendor.index.request({
          url: config.BASE_URL + "/login",
          method: "POST",
          data: {
            username,
            password: encryptPassword
          }
        });
        if (res.data.code === 200) {
          const token = res.data.token;
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.redirectTo({
            url: "/pages/login/login"
          });
        }
      } catch (error) {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
      }
    };
    const latitude = common_vendor.ref(null);
    const longitude = common_vendor.ref(null);
    const getLocation = () => {
      common_vendor.index.getLocation({
        type: "wgs84",
        success(res) {
          latitude.value = res.latitude;
          longitude.value = res.longitude;
          const webViewContext = common_vendor.index.createWebViewContext("myWebView");
          webViewContext.postMessage({
            data: {
              latitude: res.latitude,
              longitude: res.longitude
            }
          });
        },
        fail() {
          common_vendor.index.showToast({
            title: "获取位置失败",
            icon: "none"
          });
        }
      });
    };
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
