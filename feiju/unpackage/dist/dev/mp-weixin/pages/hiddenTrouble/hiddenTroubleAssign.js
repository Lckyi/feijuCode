"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_data_checkbox2 + _easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_data_checkbox + _easycom_uni_popup_message + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "hiddenTroubleAssign",
  setup(__props) {
    const disposalWay = common_vendor.ref(0);
    const disposalId = common_vendor.ref("");
    const deletePopup = common_vendor.ref("");
    const selectedIndex = common_vendor.ref(0);
    const disposalDate = common_vendor.ref("日期选择");
    const suggestion = common_vendor.ref("");
    const personnelId = common_vendor.ref("");
    const personneName = common_vendor.ref("请选择");
    const range = common_vendor.reactive([{ "value": 0, "text": "发起运维指派" }, { "value": 1, "text": "无需处置" }]);
    const options = common_vendor.ref(["请选择", "一般隐患", "严重隐患", "较大隐患", "重大隐患"]);
    const params = {};
    common_vendor.onLoad((e) => {
      disposalId.value = e.id;
      params.id = disposalId.value;
    });
    common_vendor.onShow(() => {
      common_vendor.index.$on("personnel", (res) => {
        if (res) {
          personnelId.value = res.id;
          personneName.value = res.name;
        }
      });
    });
    const submitInsert = async () => {
      if (!params.id) {
        infoTips("隐患id为空");
        return;
      }
      if (disposalWay.value === 1) {
        if (selectedIndex.value < 1) {
          infoTips("请选择隐患等级");
          return;
        }
        params.level = selectedIndex.value - 1;
        params.state = 3;
      } else {
        if (selectedIndex.value < 1) {
          infoTips("请选择隐患等级");
          return;
        }
        if (personneName.value === "请选择") {
          infoTips("请选择指派人员");
          return;
        }
        if (disposalDate.value === "日期选择") {
          infoTips("请选择处置时限");
          return;
        }
        params.disposer = personnelId.value;
        params.closingDate = disposalDate.value;
        params.level = selectedIndex.value - 1;
        params.state = 1;
        params.disposalSuggestion = suggestion.value;
      }
      let res = await api_apis.apiPutHiddenDanger(params);
      if (res.code === 200) {
        deletePopup.value.open();
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } else {
        infoTips("指派失败");
      }
    };
    function infoTips(mass) {
      common_vendor.index.showToast({
        title: mass,
        icon: "none",
        duration: 2e3
      });
    }
    const handlePickerChange = (e) => {
      selectedIndex.value = e.detail.value;
    };
    const bindDateChange = (e) => {
      disposalDate.value = e.detail.value;
    };
    function search() {
      if (disposalWay.value === 1)
        return;
      common_vendor.index.navigateTo({
        url: "/pages/hiddenTrouble/nameSearch"
      });
    }
    const toSubHiddenTrouble = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toSubHiddenTrouble),
        c: common_vendor.o(_ctx.changeCheckbox),
        d: common_vendor.o(($event) => disposalWay.value = $event),
        e: common_vendor.p({
          localdata: range,
          modelValue: disposalWay.value
        }),
        f: common_vendor.t(options.value[selectedIndex.value]),
        g: common_assets._imports_1$2,
        h: common_vendor.o(handlePickerChange),
        i: selectedIndex.value,
        j: options.value,
        k: common_vendor.t(personneName.value),
        l: common_assets._imports_1$2,
        m: common_vendor.o(search),
        n: common_vendor.t(disposalDate.value),
        o: common_assets._imports_1$2,
        p: common_vendor.o(bindDateChange),
        q: suggestion.value,
        r: common_vendor.o(($event) => suggestion.value = $event.detail.value),
        s: disposalWay.value === 0,
        t: common_vendor.o(submitInsert),
        v: common_vendor.p({
          type: "success",
          message: "判断成功",
          duration: 1e3
        }),
        w: common_vendor.sr(deletePopup, "0f2faf20-1", {
          "k": "deletePopup"
        }),
        x: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f2faf20"]]);
wx.createPage(MiniProgramPage);
