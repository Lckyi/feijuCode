"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_datetime_picker2 + _easycom_qiun_data_charts2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_datetime_picker + _easycom_qiun_data_charts + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "sceneDetails",
  setup(__props) {
    const imgRequestHead = config.imgRequestHeader.URL;
    const popup = common_vendor.ref(null);
    common_vendor.ref({});
    const showChartData = common_vendor.ref({});
    const equipmentData = common_vendor.ref([]);
    const equipmentId = common_vendor.ref("");
    const equipmentImg = common_vendor.ref("");
    const equipmentTitle = common_vendor.ref("");
    const equipmentValue = common_vendor.ref([]);
    const equipmentCharts = common_vendor.ref([]);
    const startTime = common_vendor.ref(null);
    const endTime = common_vendor.ref(null);
    const dateRange = common_vendor.ref([]);
    let isClosePop = common_vendor.ref(true);
    const isCloseDateRange = common_vendor.ref(null);
    let params = {
      types: "",
      startTime: "",
      endTime: "",
      deviceId: ""
    };
    common_vendor.onLoad((e) => {
      equipmentId.value = e.id;
      equipmentTitle.value = e.name;
      getEquipmentInfo();
    });
    const getEquipmentInfo = async () => {
      let res = await api_apis.apiGetEquipmentInfo({
        sceneId: equipmentId.value
      });
      equipmentData.value = res.data.deviceRecords;
      equipmentImg.value = imgRequestHead + res.data.image;
      if (equipmentData.value) {
        equipmentData.value.forEach((item) => {
          getEquipmentData(item.deviceNumber);
        });
      }
    };
    const getEquipmentData = async (deviceId) => {
      let res = await api_apis.apiGetEquipmentData({
        deviceIds: deviceId
      });
      equipmentValue.value = [...equipmentValue.value, ...res.data];
    };
    const getEquipmentCharts = async (params2) => {
      let res = await api_apis.apiGetChart(params2);
      equipmentCharts.value = res.data;
      getData();
    };
    const handleError = () => {
      equipmentImg.value = "../../static/images/changjing/icon.png";
    };
    function getCharts(type, deviceNumber) {
      const now = /* @__PURE__ */ new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      startTime.value = timeFormat(start, "show");
      endTime.value = timeFormat(now, "show");
      params.types = type;
      params.startTime = timeFormat(start, "");
      params.endTime = timeFormat(now, "");
      params.deviceId = deviceNumber;
      popup.value.open();
      getEquipmentCharts(params);
    }
    function openDateChart() {
      isClosePop.value = false;
    }
    function handleOverlayClick() {
      isCloseDateRange.value.close();
      isClosePop.value = true;
    }
    function changeDate(e) {
      isClosePop.value = true;
      const start = new Date(dateRange.value[0]);
      const end = new Date(dateRange.value[1]);
      startTime.value = timeFormat(start, "show");
      endTime.value = timeFormat(end, "show");
      params.startTime = dateRange.value[0];
      params.endTime = dateRange.value[1];
      getEquipmentCharts(params);
    }
    function getData() {
      try {
        if (!equipmentCharts.value[0].time || !equipmentCharts.value[0].valueOne) {
          console.error("没有图表数据");
          return;
        }
        showChartData.value = "";
        const data = equipmentCharts.value[0].valueOne;
        const chData = sliceChartData(equipmentCharts.value[0].time, equipmentCharts.value[0].valueOne);
        showChartData.value = {
          categories: chData.showData,
          series: [
            {
              name: equipmentCharts.value[0].typeName,
              data: chData.data
            }
          ]
        };
      } catch (error) {
        console.error("暂无图标数据", error);
      }
    }
    function sliceChartData(categories, data) {
      const chData = common_vendor.reactive({ categories: "", data: "", showData: "" });
      const timeArray = common_vendor.ref([]);
      chData.categories = categories.slice(-6);
      chData.data = data.slice(-6);
      for (const dateTimeString in chData.categories) {
        if (chData.categories.hasOwnProperty(dateTimeString)) {
          const [date, time] = chData.categories[dateTimeString].split(" ");
          const cutTime = time.slice(0, 5);
          timeArray.value.push(cutTime);
        }
      }
      chData.showData = timeArray.value;
      return chData;
    }
    const timeFormat = (now, type) => {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      if (type === "show") {
        return `${year}/${month}/${day}`;
      } else {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
    };
    const opts = common_vendor.ref({
      color: ["#1890FF"],
      padding: [15, 15, 0, 15],
      enableScroll: false,
      legend: {},
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        gridType: "dash",
        dashLength: 2
      },
      extra: {
        area: {
          type: "curve",
          opacity: 0.8,
          addLine: true,
          width: 2,
          gradient: true,
          activeType: "hollow"
        }
      }
    });
    const toBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      var _a, _b, _c;
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toBack),
        c: common_vendor.t(equipmentTitle.value),
        d: common_vendor.o(handleError),
        e: equipmentImg.value,
        f: common_vendor.f(equipmentValue.value, (item, index, i0) => {
          return {
            a: common_vendor.f(item, (subItem, subIndex, i1) => {
              return common_vendor.e({
                a: subIndex === 0
              }, subIndex === 0 ? {
                b: common_vendor.t(subItem.id)
              } : {}, {
                c: common_vendor.t(subItem.name),
                d: common_vendor.t(subItem.value),
                e: common_vendor.t(subItem.unit === "null" ? "" : subItem.unit),
                f: common_vendor.o(($event) => getCharts(subItem.key, subItem.deviceNumber), subIndex),
                g: subIndex
              });
            }),
            b: index
          };
        }),
        g: common_vendor.t((_a = equipmentCharts.value[0]) == null ? void 0 : _a.typeName),
        h: common_vendor.p({
          type: "calendar",
          color: "#C0C4CC",
          size: "28"
        }),
        i: common_vendor.t(startTime.value),
        j: common_vendor.t(endTime.value),
        k: common_vendor.o(openDateChart),
        l: common_vendor.sr(isCloseDateRange, "0883d76a-1,0883d76a-0", {
          "k": "isCloseDateRange"
        }),
        m: common_vendor.o(changeDate),
        n: common_vendor.o(($event) => dateRange.value = $event),
        o: common_vendor.p({
          type: "datetimerange",
          modelValue: dateRange.value
        }),
        p: (_b = equipmentCharts.value[0]) == null ? void 0 : _b.time
      }, ((_c = equipmentCharts.value[0]) == null ? void 0 : _c.time) ? {
        q: common_vendor.p({
          type: "area",
          opts: opts.value,
          chartData: showChartData.value,
          ontouch: true,
          canvas2d: true
        })
      } : {
        r: common_assets._imports_4$1
      }, {
        s: common_vendor.sr(popup, "0883d76a-0", {
          "k": "popup"
        }),
        t: common_vendor.o(handleOverlayClick),
        v: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "30rpx 30rpx 0 0",
          ["background-color"]: "#fff",
          ["safe-area"]: true,
          ["is-mask-click"]: common_vendor.unref(isClosePop)
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0883d76a"]]);
wx.createPage(MiniProgramPage);
