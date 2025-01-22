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
  __name: "operatorPage",
  setup(__props) {
    const popup = common_vendor.ref(null);
    const deletePopup = common_vendor.ref(null);
    const viewValue = common_vendor.ref(null);
    const contactId = common_vendor.ref("");
    const contactData = common_vendor.ref([]);
    const popUps = common_vendor.ref("");
    const editContactName = common_vendor.ref("");
    const editContactPhone = common_vendor.ref("");
    const editContactRemark = common_vendor.ref("");
    const phoneRegex = /^1[3-9]\d{9}$/;
    common_vendor.onLoad((e) => {
      viewValue.value = e.value;
      contactId.value = e.id;
      if (contactId.value) {
        getContactById(contactId.value);
      }
    });
    const getContactById = async (id) => {
      let res = await api_apis.apiGetContactById(id);
      contactData.value = res.data;
    };
    const addContact = async () => {
      if (fillJudge())
        return;
      let res = await api_apis.apiAddContact({
        name: editContactName.value,
        phone: editContactPhone.value,
        remark: editContactRemark.value,
        projectId: config.PROJECTID.globalProjectId
      });
      if (res.code === 200) {
        popUps.value = "添加成功";
        deletePopup.value.open();
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } else {
        infoTips("添加失败");
      }
    };
    function toEdit() {
      editContactName.value = contactData.value.name;
      editContactPhone.value = contactData.value.phone;
      editContactRemark.value = contactData.value.remark;
      viewValue.value = "edit";
    }
    function cancelEdit() {
      viewValue.value = "check";
    }
    const saveEdit = async () => {
      if (fillJudge())
        return;
      contactData.value.name = editContactName.value;
      contactData.value.phone = editContactPhone.value;
      contactData.value.remark = editContactRemark.value;
      let res = await api_apis.apiUpdateContact(contactData.value);
      if (res.code === 200) {
        popUps.value = "修改完成";
        deletePopup.value.open();
        getContactById(contactId.value);
        viewValue.value = "check";
      } else {
        infoTips("修改失败");
      }
    };
    function deleteInfo() {
      popup.value.open();
    }
    const deleteItem = async () => {
      let res = await api_apis.apiDeleteContact(contactId.value);
      if (res.code === 200) {
        popUps.value = "删除成功";
        deletePopup.value.open();
        popup.value.close();
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } else {
        infoTips("删除失败");
        popup.value.close();
      }
    };
    function cancel() {
      popup.value.close();
    }
    const fillJudge = () => {
      if (!editContactName.value) {
        infoTips("请填写姓名");
        return true;
      }
      if (!phoneRegex.test(editContactPhone.value)) {
        infoTips("请输入正确的手机号码");
        return true;
      }
      return false;
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
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: viewValue.value === "add"
      }, viewValue.value === "add" ? {} : {
        d: common_vendor.t(contactData.value.name)
      }, {
        e: viewValue.value === "edit"
      }, viewValue.value === "edit" ? {
        f: common_assets._imports_1$10
      } : {}, {
        g: common_vendor.o(deleteInfo),
        h: common_assets._imports_2$3,
        i: viewValue.value === "add"
      }, viewValue.value === "add" ? {
        j: editContactName.value,
        k: common_vendor.o(($event) => editContactName.value = $event.detail.value)
      } : {}, {
        l: viewValue.value === "check"
      }, viewValue.value === "check" ? {
        m: common_vendor.t(contactData.value.name)
      } : {}, {
        n: viewValue.value === "edit"
      }, viewValue.value === "edit" ? {
        o: editContactName.value,
        p: common_vendor.o(($event) => editContactName.value = $event.detail.value)
      } : {}, {
        q: viewValue.value === "add"
      }, viewValue.value === "add" ? {
        r: editContactPhone.value,
        s: common_vendor.o(($event) => editContactPhone.value = $event.detail.value)
      } : {}, {
        t: viewValue.value === "check"
      }, viewValue.value === "check" ? {
        v: common_vendor.t(contactData.value.phone)
      } : {}, {
        w: viewValue.value === "edit"
      }, viewValue.value === "edit" ? {
        x: editContactPhone.value,
        y: common_vendor.o(($event) => editContactPhone.value = $event.detail.value)
      } : {}, {
        z: viewValue.value === "add"
      }, viewValue.value === "add" ? {
        A: editContactRemark.value,
        B: common_vendor.o(($event) => editContactRemark.value = $event.detail.value)
      } : {}, {
        C: viewValue.value === "check"
      }, viewValue.value === "check" ? common_vendor.e({
        D: contactData.value.remark
      }, contactData.value.remark ? {
        E: common_vendor.t(contactData.value.remark)
      } : {}) : {}, {
        F: viewValue.value === "edit"
      }, viewValue.value === "edit" ? {
        G: editContactRemark.value,
        H: common_vendor.o(($event) => editContactRemark.value = $event.detail.value)
      } : {}, {
        I: viewValue.value === "add"
      }, viewValue.value === "add" ? {
        J: common_vendor.o(addContact)
      } : {}, {
        K: viewValue.value === "check"
      }, viewValue.value === "check" ? {
        L: common_assets._imports_3$6,
        M: common_vendor.o(toEdit)
      } : {}, {
        N: viewValue.value === "edit"
      }, viewValue.value === "edit" ? {
        O: common_vendor.o(cancelEdit),
        P: common_vendor.o(saveEdit)
      } : {}, {
        Q: common_vendor.t(_ctx.videoName),
        R: common_vendor.o(deleteItem),
        S: common_vendor.o(cancel),
        T: common_vendor.sr(popup, "5a2a56a4-0", {
          "k": "popup"
        }),
        U: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "20rpx 20rpx 0 0",
          ["background-color"]: "#fff",
          ["safe-area"]: true
        }),
        V: common_vendor.p({
          type: "success",
          message: popUps.value,
          duration: 1e3
        }),
        W: common_vendor.sr(deletePopup, "5a2a56a4-1", {
          "k": "deletePopup"
        }),
        X: common_vendor.p({
          type: "message"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5a2a56a4"]]);
wx.createPage(MiniProgramPage);
