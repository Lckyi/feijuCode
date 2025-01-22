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
  __name: "search",
  setup(__props) {
    const searchText = common_vendor.ref("");
    common_vendor.ref(null);
    const noData = common_vendor.ref(false);
    const searchList = common_vendor.ref("");
    const searchType = common_vendor.ref("");
    const params = {
      pageNum: 1,
      pageSize: 20
    };
    common_vendor.onLoad((e) => {
      searchType.value = e.flag;
      console.log(searchType.value);
    });
    const search = () => {
      searchList.value = "";
      if (searchText.value) {
        getAlarmByName();
      }
    };
    const bottomRefresh = async () => {
      if (noData.value)
        return;
      params.pageNum++;
      getAlarmByName();
    };
    const getAlarmByName = async () => {
      let res;
      if (searchType.value === "alarmRecord") {
        res = await api_apis.apiGetAlarmRecords({
          projectId: config.PROJECTID.globalProjectId,
          pageNum: params.pageNum,
          pageSize: params.pageSize,
          deviceName: searchText.value
        });
        searchList.value = [...searchList.value, ...res.rows];
        if (params.pageSize > res.rows.length)
          noData.value = true;
      } else {
        res = await api_apis.apiGetRealTimeAlarm({
          projectId: config.PROJECTID.globalProjectId,
          deviceName: searchText.value,
          alarmState: 1
        });
        noData.value = true;
        const allArrayDsta = flattenTopLevelArrays(res.data);
        console.log(allArrayDsta);
        searchList.value = [...searchList.value, ...allArrayDsta];
      }
      common_vendor.index.setStorageSync("searchList", searchList.value);
    };
    function flattenTopLevelArrays(obj, result = []) {
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item) => {
            if (typeof item === "object" && item !== null) {
              result.push(item);
            }
          });
        }
      }
      return result;
    }
    const toAlarmPush = (devName) => {
      common_vendor.index.$emit("devName", devName);
      common_vendor.index.navigateBack();
    };
    common_vendor.onUnload(() => {
      common_vendor.index.removeStorageSync("searchList");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(($event) => toAlarmPush("")),
        c: common_vendor.o(search),
        d: common_vendor.o(($event) => searchText.value = $event),
        e: common_vendor.p({
          placeholder: "请输入设备名称",
          clearButton: "none",
          cancelButton: "none",
          modelValue: searchText.value
        }),
        f: searchList.value.length > 0
      }, searchList.value.length > 0 ? {
        g: common_vendor.f(searchList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.deviceName),
            b: item.alarmId,
            c: common_vendor.o(($event) => toAlarmPush(item.deviceName), item.alarmId)
          };
        }),
        h: common_assets._imports_1$4,
        i: common_vendor.o(bottomRefresh)
      } : {
        j: common_assets._imports_4$1
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e132ebdf"]]);
wx.createPage(MiniProgramPage);
