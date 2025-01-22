"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../utils/jsencrypt.min.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_popup_message + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "changePassword",
  setup(__props) {
    const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/;
    const oldPwd = common_vendor.ref("");
    const newPwd = common_vendor.ref("");
    const updatePopup = common_vendor.ref("");
    const submitUpdate = async () => {
      if (!oldPwd.value) {
        infoTips("请输入旧密码");
        return;
      }
      if (!newPwd.value) {
        infoTips("请输入新密码");
        return;
      }
      if (!passwordFormat.test(newPwd.value)) {
        infoTips("密码需包含数字和字母长度为6~20个字符");
        return;
      }
      try {
        let res = await api_apis.apiUpdatePssword({
          oldPassword: oldPwd.value,
          newPassword: newPwd.value
        });
        if (res.code === 200) {
          updatePopup.value.open();
          setTimeout(() => {
            common_vendor.index.removeStorageSync("publicKey");
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.reLaunch({
              // 跳转到登录页面
              url: "/pages/login/login"
            });
          }, 900);
        } else {
          infoTips("请输入正确的旧密码");
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
    const toBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: common_vendor.o(($event) => oldPwd.value = $event),
        d: common_vendor.p({
          type: "password",
          focus: true,
          clearable: false,
          placeholder: "请输入",
          modelValue: oldPwd.value
        }),
        e: common_vendor.o(($event) => newPwd.value = $event),
        f: common_vendor.p({
          type: "password",
          clearable: false,
          placeholder: "请输入",
          modelValue: newPwd.value
        }),
        g: common_vendor.o(submitUpdate),
        h: common_vendor.p({
          type: "success",
          message: "修改成功",
          duration: 1e3
        }),
        i: common_vendor.sr(updatePopup, "2fd5dd78-2", {
          "k": "updatePopup"
        }),
        j: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fd5dd78"]]);
wx.createPage(MiniProgramPage);
