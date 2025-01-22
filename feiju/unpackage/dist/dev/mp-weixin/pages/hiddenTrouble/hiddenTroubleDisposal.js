"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  (_easycom_uni_data_checkbox2 + _easycom_uni_popup2 + _easycom_uni_popup_message2)();
}
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
if (!Math) {
  (_easycom_uni_data_checkbox + _easycom_uni_popup + _easycom_uni_popup_message)();
}
const _sfc_main = {
  __name: "hiddenTroubleDisposal",
  setup(__props) {
    const disposalWay = common_vendor.ref(0);
    const disposalId = common_vendor.ref("");
    const selectedIndex = common_vendor.ref(0);
    const disposalFile = common_vendor.ref([]);
    const disposalFileVideo = common_vendor.ref([]);
    const deletePopup = common_vendor.ref("");
    const popup = common_vendor.ref("");
    const playVideoUrl = common_vendor.ref("");
    const range = common_vendor.reactive([{ "value": 0, "text": "处置完成" }, { "value": 1, "text": "无需处置" }]);
    const options = common_vendor.ref(["请选择", "一般隐患", "严重隐患", "较大隐患", "重大隐患"]);
    const params = {};
    const uploadUrls = [];
    common_vendor.onLoad((e) => {
      disposalId.value = e.id;
      params.id = disposalId.value;
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
        handleHiddenDanger(params);
      } else {
        if (selectedIndex.value < 1) {
          infoTips("请选择隐患等级");
          return;
        }
        params.state = 2;
        params.level = selectedIndex.value - 1;
        if (disposalFile.value.length > 0) {
          uploadAllFiles(disposalFile.value, (fileList) => {
            params.disposalFileList = fileList;
            handleHiddenDanger(params);
          });
        } else {
          handleHiddenDanger(params);
        }
      }
    };
    const handleHiddenDanger = async (params2) => {
      try {
        let res = await api_apis.apiPutDisposal(params2);
        if (res.code === 200) {
          deletePopup.value.open();
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1e3);
        } else {
          infoTips(res.msg);
        }
      } catch (error) {
        infoTips(error.msg);
      }
    };
    const uploadAllFiles = (files, onSuccess) => {
      let uploadedCount = 0;
      const uploadFile = (filePath) => {
        common_vendor.index.uploadFile({
          url: config.BASE_URL + "/minio/fileUpload",
          filePath,
          name: "file",
          header: { "Content-Type": "multipart/form-data" },
          success: (uploadFileRes) => {
            const responseData = JSON.parse(uploadFileRes.data);
            const uploadedFilePath = responseData.msg;
            uploadUrls.push(uploadedFilePath);
            uploadedCount++;
            if (uploadedCount === files.length) {
              onSuccess(uploadUrls);
            }
          },
          fail: (error) => {
            console.error("文件上传失败");
          }
        });
      };
      files.forEach((filePath) => {
        uploadFile(filePath);
      });
    };
    function addImgAndVideo() {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["mix"],
        sourceType: ["album", "camera"],
        maxDuration: 60,
        camera: "back",
        success(res) {
          disposalFile.value.push(res.tempFiles[0].tempFilePath);
          if (res.tempFiles[0].fileType === "video") {
            disposalFileVideo.value.push(res.tempFiles[0].thumbTempFilePath);
          } else {
            disposalFileVideo.value.push(res.tempFiles[0].tempFilePath);
          }
        }
      });
    }
    function deleteFile(index) {
      disposalFile.value.splice(index, 1);
      disposalFileVideo.value.splice(index, 1);
    }
    function showVideo(url) {
      popup.value.open();
      playVideoUrl.value = url;
    }
    function showImg(url) {
      common_vendor.index.previewImage({
        current: "",
        urls: [url]
      });
    }
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
        k: common_vendor.f(disposalFile.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.split(".").pop() === "mp4"
          }, item.split(".").pop() === "mp4" ? {
            b: disposalFileVideo.value[index],
            c: common_assets._imports_2$10,
            d: common_vendor.o(($event) => showVideo(item), index),
            e: common_assets._imports_3$5,
            f: common_vendor.o(($event) => deleteFile(index), index)
          } : {
            g: item,
            h: common_vendor.o(($event) => showImg(item), index),
            i: common_assets._imports_3$5,
            j: common_vendor.o(($event) => deleteFile(index), index)
          }, {
            k: index
          });
        }),
        l: common_assets._imports_4$5,
        m: common_vendor.o(addImgAndVideo),
        n: disposalWay.value === 0,
        o: common_vendor.o(submitInsert),
        p: playVideoUrl.value,
        q: common_vendor.sr(popup, "7b1d9a0c-1", {
          "k": "popup"
        }),
        r: common_vendor.p({
          type: "center"
        }),
        s: common_vendor.p({
          type: "success",
          message: "处置成功",
          duration: 1e3
        }),
        t: common_vendor.sr(deletePopup, "7b1d9a0c-2", {
          "k": "deletePopup"
        }),
        v: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7b1d9a0c"]]);
wx.createPage(MiniProgramPage);
