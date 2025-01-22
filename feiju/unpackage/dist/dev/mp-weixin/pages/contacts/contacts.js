"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  _easycom_uni_search_bar2();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
if (!Math) {
  _easycom_uni_search_bar();
}
const _sfc_main = {
  __name: "contacts",
  setup(__props) {
    const searchQuery = common_vendor.ref("");
    const contactList = common_vendor.ref([]);
    common_vendor.onShow(() => {
      getContactList();
    });
    const getContactList = async () => {
      let res;
      if (config.PROJECTID.globalProjectId) {
        res = await api_apis.apiGetContactList({
          projectId: config.PROJECTID.globalProjectId
        });
        contactList.value = res.data;
      }
    };
    function phoneCall(phone) {
      common_vendor.index.makePhoneCall({
        phoneNumber: phone,
        success: function() {
          console.log("拨打电话成功");
        },
        fail: function(err) {
          console.error("拨打电话失败", err);
        }
      });
    }
    const filteredOptions = common_vendor.computed(() => {
      if (contactList.value) {
        if (searchQuery.value === "") {
          return [...contactList.value];
        } else {
          return contactList.value.filter((option) => option.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || option.phone.toLowerCase().includes(searchQuery.value.toLowerCase()));
        }
      }
    });
    const onSearchInput = (event) => {
      searchQuery.value = event.detail.value;
    };
    function toAdd() {
      common_vendor.index.navigateTo({
        url: "/pages/contacts/operatorPage?value=add"
      });
    }
    function toCheck(id) {
      common_vendor.index.navigateTo({
        url: `/pages/contacts/operatorPage?id=${id}&value=${"check"}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_vendor.o(toAdd),
        c: common_vendor.o(onSearchInput),
        d: common_vendor.o(_ctx.search),
        e: common_vendor.o(($event) => searchQuery.value = $event),
        f: common_vendor.p({
          placeholder: "搜索",
          clearButton: "auto",
          cancelButton: "none",
          modelValue: searchQuery.value
        }),
        g: filteredOptions.value.length > 0
      }, filteredOptions.value.length > 0 ? {
        h: common_vendor.f(filteredOptions.value, (option, index, i0) => {
          return {
            a: common_vendor.t(option.name),
            b: common_vendor.t(option.phone),
            c: common_vendor.o(($event) => toCheck(option.id), option.id),
            d: common_vendor.o(($event) => phoneCall(option.phone), option.id),
            e: option.id
          };
        }),
        i: common_assets._imports_2$3,
        j: common_assets._imports_2$4
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-90a1bbf6"]]);
wx.createPage(MiniProgramPage);
