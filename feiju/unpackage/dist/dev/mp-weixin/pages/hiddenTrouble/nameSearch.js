"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  _easycom_uni_search_bar2();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
if (!Math) {
  _easycom_uni_search_bar();
}
const _sfc_main = {
  __name: "nameSearch",
  setup(__props) {
    const searchQuery = common_vendor.ref("");
    const personnelList = common_vendor.ref([]);
    const personnel = common_vendor.reactive({
      name: "",
      id: ""
    });
    const getPersonnelList = async () => {
      let res = await api_apis.apiGetPersonnelList({
        pageSize: 9999
      });
      personnelList.value = res.rows;
    };
    const filteredOptions = common_vendor.computed(() => {
      if (searchQuery.value === "") {
        return [...personnelList.value];
      } else {
        return personnelList.value.filter((option) => option.nickName.toLowerCase().includes(searchQuery.value.toLowerCase()));
      }
    });
    const onSearchInput = (event) => {
      searchQuery.value = event.detail.value;
    };
    const optioned = (id, name) => {
      personnel.id = id;
      personnel.name = name;
      common_vendor.index.$emit("personnel", personnel);
      common_vendor.index.navigateBack();
    };
    const toBack = () => {
      common_vendor.index.navigateBack();
    };
    getPersonnelList();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$5,
        b: common_vendor.o(toBack),
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
        h: common_vendor.f(filteredOptions.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.nickName),
            b: common_vendor.o(($event) => optioned(item.userId, item.nickName), item.userId),
            c: item.userId
          };
        }),
        i: common_assets._imports_2$3
      } : {
        j: common_assets._imports_2$9
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b0639505"]]);
wx.createPage(MiniProgramPage);
