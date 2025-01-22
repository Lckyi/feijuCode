"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_qiun_data_charts2 = common_vendor.resolveComponent("qiun-data-charts");
  _easycom_qiun_data_charts2();
}
const _easycom_qiun_data_charts = () => "../../uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.js";
if (!Math) {
  _easycom_qiun_data_charts();
}
const _sfc_main = {
  __name: "alarmDetails",
  setup(__props) {
    const current = common_vendor.ref("content1");
    const selected = common_vendor.ref("view1");
    const chartData = common_vendor.ref([]);
    const showChartData = common_vendor.ref({});
    const alarmId = common_vendor.ref("");
    const alarmDetails = common_vendor.ref([]);
    const params = {
      deviceId: "",
      types: "",
      startTime: "",
      endTime: ""
    };
    common_vendor.onLoad((e) => {
      alarmId.value = e.alarmId;
    });
    common_vendor.onMounted(() => {
      getAlarm();
    });
    const timeFormat = (now) => {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    const getAlarm = async () => {
      let res = await api_apis.apiGetAlarmRecords({
        projectId: config.PROJECTID.globalProjectId,
        alarmId: alarmId.value
      });
      alarmDetails.value = res.rows;
      params.deviceId = alarmDetails.value[0].deviceNumber;
      params.types = alarmDetails.value[0].dataId;
      let parsedAlarmTime = new Date(alarmDetails.value[0].alarmTime);
      let parsedAlarmRecoverTime = "";
      if (!alarmDetails.value[0].alarmRecoverTime) {
        parsedAlarmRecoverTime = new Date(alarmDetails.value[0].alarmTime);
      } else {
        parsedAlarmRecoverTime = new Date(alarmDetails.value[0].alarmRecoverTime);
      }
      parsedAlarmTime.setHours(parsedAlarmTime.getHours() - 1);
      parsedAlarmRecoverTime.setHours(parsedAlarmRecoverTime.getHours() + 1);
      params.startTime = timeFormat(parsedAlarmTime);
      params.endTime = timeFormat(parsedAlarmRecoverTime);
      await getChartData(params);
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
    function refreshChart() {
      getChartData(params);
    }
    const getChartData = async (params2) => {
      try {
        let res = await api_apis.apiGetChart(params2);
        if (!res.data[0].time || !res.data[0].valueOne) {
          console.error("没有图表数据");
          return;
        }
        chartData.value = res.data;
        const data = chartData.value[0].valueOne;
        const chData = sliceChartData(chartData.value[0].time, chartData.value[0].valueOne);
        setTimeout(() => {
          showChartData.value = {
            categories: chData.showData,
            series: [
              {
                name: chartData.value[0].typeName,
                data: chData.data
              }
            ]
          };
        }, 500);
      } catch (error) {
        console.error("暂无图标数据", error);
      }
    };
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
    const toAlarmPush = () => {
      common_vendor.index.navigateBack();
    };
    function onClickItem(content, view) {
      current.value = content;
      selected.value = view;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toAlarmPush),
        c: common_assets._imports_1$5,
        d: selected.value === "view1" ? 1 : "",
        e: common_vendor.o(($event) => onClickItem("content1", "view1")),
        f: selected.value === "view2" ? 1 : "",
        g: common_vendor.o(($event) => onClickItem("content2", "view2")),
        h: common_vendor.f(alarmDetails.value, (item, k0, i0) => {
          return current.value === "content1" ? common_vendor.e({
            a: common_vendor.t(item.alarmTime),
            b: item.alarmLevel === 2
          }, item.alarmLevel === 2 ? {} : {}, {
            c: item.alarmLevel === 1
          }, item.alarmLevel === 1 ? {} : {}, {
            d: common_vendor.t(item.alarmContent),
            e: common_vendor.t(item.alarmValue),
            f: common_vendor.t(item.unit),
            g: item.alarmState === 0
          }, item.alarmState === 0 ? {
            h: common_vendor.t(item.alarmRecoverTime)
          } : {}, {
            i: item.alarmState === 0
          }, item.alarmState === 0 ? {
            j: common_assets._imports_2$6
          } : {}, {
            k: item.alarmState === 1
          }, item.alarmState === 1 ? {
            l: common_assets._imports_3$3
          } : {}, {
            m: common_vendor.t(item.alarmContent)
          }) : current.value === "content2" ? {
            n: common_vendor.t(item.deviceName),
            o: common_vendor.t(item.deviceNumber),
            p: common_vendor.t(item.deviceAddress)
          } : {};
        }),
        i: current.value === "content1",
        j: current.value === "content2",
        k: common_assets._imports_4$3,
        l: common_vendor.o(refreshChart),
        m: chartData.value.length > 0
      }, chartData.value.length > 0 ? {
        n: common_vendor.p({
          type: "area",
          opts: opts.value,
          chartData: showChartData.value
        })
      } : {
        o: common_assets._imports_4$1
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-46ebea06"]]);
wx.createPage(MiniProgramPage);
