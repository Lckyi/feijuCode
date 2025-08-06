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
  __name: "photographed",
  setup(__props) {
    const trouble = common_vendor.ref(["请选择", "一般隐患", "严重隐患", "较大隐患", "重大隐患"]);
    const selectedregion = common_vendor.ref(0);
    const selectedscenario = common_vendor.ref(0);
    const selectedtrouble = common_vendor.ref(0);
    const sceneName = common_vendor.ref([]);
    common_vendor.ref([]);
    const description = common_vendor.ref("");
    const popup = common_vendor.ref("");
    const deletePopup = common_vendor.ref("");
    const successPopup = common_vendor.ref("");
    const recordingPopup = common_vendor.ref("");
    const popUps = common_vendor.ref("");
    const playVideoUrl = common_vendor.ref("");
    const attachmentList = common_vendor.ref([]);
    const attachmentListVideo = common_vendor.ref([]);
    const recordingList = common_vendor.ref([]);
    const recorderManager = common_vendor.index.getRecorderManager();
    const audioContext = common_vendor.index.createInnerAudioContext();
    const startTime = common_vendor.ref(null);
    const recordingDuration = common_vendor.ref(null);
    const hasPermission = common_vendor.ref(false);
    const isEndAllowed = common_vendor.ref(false);
    const playIndex = common_vendor.ref(null);
    const deleteIndex = common_vendor.ref(null);
    const audioTempFilePath = common_vendor.ref([]);
    const uploadUrls = [];
    const audioUploadUrls = [];
    const params = {
      projectId: config.PROJECTID.globalProjectId
    };
    const getSceneName = async () => {
      let res = await api_apis.apiGetSceneName({
        projectId: config.PROJECTID.globalProjectId
      });
      sceneName.value = res.data.children;
    };
    const addHiddenDanger = async () => {
      if (!params.sceneId) {
        infoTips("请选择场景");
        return;
      }
      if (selectedtrouble.value < 1) {
        infoTips("请选择隐患等级");
        return;
      }
      if (!description.value) {
        infoTips("请填写描述");
        return;
      }
      params.note = description.value;
      params.level = selectedtrouble.value - 1;
      let uploadFileList = [...audioTempFilePath.value, ...attachmentList.value];
      if (uploadFileList.length < 1) {
        handleAddHiddenDanger(params).then((result) => {
          if (result.code === 200) {
            popUps.value = "提交成功";
            successPopup.value.open();
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1e3);
          } else {
            infoTips("提交失败");
          }
        }).catch((error) => {
          console.error("提交过程中发生错误", error);
        });
        return;
      }
      uploadAllFiles(uploadFileList, (fileList, audioFileList) => {
        params.attachmentList = fileList;
        params.recordingList = audioFileList;
        handleAddHiddenDanger(params).then((result) => {
          if (result.code === 200) {
            popUps.value = "提交成功";
            successPopup.value.open();
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1e3);
          } else {
            infoTips("提交失败");
          }
        }).catch((error) => {
          console.error("提交过程中发生错误", error);
        });
      }, (error) => {
        console.error("文件上传失败", error);
      });
    };
    async function handleAddHiddenDanger(params2) {
      let res = await api_apis.apiAddHiddenDanger(params2);
      return res;
    }
    const uploadAllFiles = (files, onSuccess, onError) => {
      let uploadedCount = 0;
      const uploadFile = (filePath) => {
        common_vendor.index.uploadFile({
          url: config.BASE_URL + "/minio/fileUpload",
          filePath,
          name: "file",
          header: { "Content-Type": "multipart/form-data" },
          success: (uploadFileRes) => {
            try {
              const responseData = JSON.parse(uploadFileRes.data);
              const uploadedFilePath = responseData.msg;
              if (uploadedFilePath.split(".").pop() === "mp3") {
                audioUploadUrls.push(uploadedFilePath);
              } else {
                uploadUrls.push(uploadedFilePath);
              }
              uploadedCount++;
              if (uploadedCount === files.length) {
                onSuccess(uploadUrls, audioUploadUrls);
              }
            } catch (error) {
              onError("Error parsing JSON response:", error);
            }
          },
          fail: (error) => {
            onError("Upload failed for file", error);
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
          attachmentList.value.push(res.tempFiles[0].tempFilePath);
          if (res.tempFiles[0].fileType === "video") {
            attachmentListVideo.value.push(res.tempFiles[0].thumbTempFilePath);
          } else {
            attachmentListVideo.value.push(res.tempFiles[0].tempFilePath);
          }
        }
      });
    }
    function deleteFile(index) {
      attachmentList.value.splice(index, 1);
      attachmentListVideo.value.splice(index, 1);
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
    const checkPermission = async () => {
      await common_vendor.index.authorize({
        scope: "scope.record",
        success: (res) => {
          hasPermission.value = true;
        },
        fail: (err) => {
          hasPermission.value = false;
          console.error("用户拒绝了录音权限", err);
          common_vendor.index.showModal({
            title: "权限申请",
            content: "需要录音权限，请前往设置开启",
            showCancel: "取消",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.openSetting();
              }
            }
          });
        }
      });
    };
    const startRecording = async () => {
      try {
        if (!hasPermission.value) {
          await checkPermission();
        }
        if (hasPermission.value) {
          isEndAllowed.value = true;
          startTime.value = (/* @__PURE__ */ new Date()).getTime() / 1e3;
          recordingPopup.value.open();
          recorderManager.start({
            format: "mp3"
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    const stopRecording = () => {
      if (!isEndAllowed.value)
        return;
      const endTime = (/* @__PURE__ */ new Date()).getTime() / 1e3;
      recordingDuration.value = endTime - startTime.value;
      recordingPopup.value.close();
      recorderManager.stop();
    };
    recorderManager.onStop((res) => {
      if (recordingDuration.value < 1) {
        infoTips("录音时长过短");
        return;
      }
      const { tempFilePath } = res;
      audioTempFilePath.value.push(tempFilePath);
      let audioData = {
        url: tempFilePath,
        progressWidth: Math.floor(recordingDuration.value)
      };
      recordingList.value.push(audioData);
    });
    const playRecording = (index) => {
      audioContext.stop();
      if (playIndex.value === index) {
        playIndex.value = "";
      } else {
        playIndex.value = index;
        audioContext.src = recordingList.value[index].url;
        recordingList.value[index];
        audioContext.play();
        audioContext.onEnded(() => {
          playIndex.value = "";
        });
      }
    };
    function toDeleteInfo(index) {
      deleteIndex.value = index;
      deletePopup.value.open();
    }
    const deleteItem = () => {
      recordingList.value.splice(deleteIndex.value, 1);
      popUps.value = "删除成功";
      successPopup.value.open();
      deletePopup.value.close();
    };
    function cancel() {
      deletePopup.value.close();
    }
    const regionChange = (e) => {
      var _a, _b, _c;
      selectedregion.value = e.detail.value;
      if ((_b = (_a = sceneName.value[selectedregion.value]) == null ? void 0 : _a.children[0]) == null ? void 0 : _b.sceneId) {
        params.sceneId = (_c = sceneName.value[selectedregion.value]) == null ? void 0 : _c.children[0].sceneId;
      } else {
        params.sceneId = null;
      }
    };
    const scenarioChange = (e) => {
      var _a;
      selectedscenario.value = e.detail.value;
      params.sceneId = (_a = sceneName.value[selectedregion.value]) == null ? void 0 : _a.children[selectedscenario.value].sceneId;
    };
    const troubleChange = (e) => {
      selectedtrouble.value = e.detail.value;
    };
    function infoTips(mass) {
      common_vendor.index.showToast({
        title: mass,
        icon: "none",
        duration: 2e3
      });
    }
    const toIndex = () => {
      common_vendor.index.navigateBack();
    };
    getSceneName();
    common_vendor.onUnmounted(() => {
      audioContext.destroy();
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.o(toIndex),
        c: common_vendor.t((_a = sceneName.value[selectedregion.value]) == null ? void 0 : _a.levelName),
        d: common_assets._imports_1$2,
        e: common_vendor.o(regionChange),
        f: selectedregion.value,
        g: sceneName.value,
        h: ((_b = sceneName.value[selectedregion.value]) == null ? void 0 : _b.children.length) > 0
      }, ((_c = sceneName.value[selectedregion.value]) == null ? void 0 : _c.children.length) > 0 ? {
        i: common_vendor.t((_d = sceneName.value[selectedregion.value]) == null ? void 0 : _d.children[selectedscenario.value].sceneName)
      } : {}, {
        j: common_assets._imports_1$2,
        k: common_vendor.o(scenarioChange),
        l: selectedscenario.value,
        m: (_e = sceneName.value[selectedregion.value]) == null ? void 0 : _e.children,
        n: common_vendor.t(trouble.value[selectedtrouble.value]),
        o: common_assets._imports_1$2,
        p: common_vendor.o(troubleChange),
        q: selectedtrouble.value,
        r: trouble.value,
        s: common_vendor.f(attachmentList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.split(".").pop() === "mp4"
          }, item.split(".").pop() === "mp4" ? {
            b: attachmentListVideo.value[index],
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
        t: common_assets._imports_4$5,
        v: common_vendor.o(addImgAndVideo),
        w: description.value,
        x: common_vendor.o(($event) => description.value = $event.detail.value),
        y: common_vendor.o(startRecording),
        z: common_vendor.o(stopRecording),
        A: common_vendor.o(() => {
        }),
        B: common_assets._imports_5$2,
        C: common_vendor.f(recordingList.value, (item, index, i0) => {
          return common_vendor.e({
            a: playIndex.value === index
          }, playIndex.value === index ? {
            b: common_assets._imports_1$9
          } : {
            c: common_assets._imports_2$11
          }, {
            d: common_vendor.t(item.progressWidth),
            e: item.progressWidth * 20 + "rpx",
            f: common_vendor.o(($event) => playRecording(index), index),
            g: common_vendor.o(($event) => toDeleteInfo(index), index),
            h: index
          });
        }),
        D: common_assets._imports_8$1,
        E: common_vendor.o(addHiddenDanger),
        F: playVideoUrl.value,
        G: common_vendor.sr(popup, "3c22f9d1-0", {
          "k": "popup"
        }),
        H: common_vendor.p({
          type: "center"
        }),
        I: common_assets._imports_9,
        J: common_vendor.sr(recordingPopup, "3c22f9d1-1", {
          "k": "recordingPopup"
        }),
        K: common_vendor.p({
          type: "center"
        }),
        L: common_vendor.p({
          type: "success",
          message: popUps.value,
          duration: 1e3
        }),
        M: common_vendor.sr(successPopup, "3c22f9d1-2", {
          "k": "successPopup"
        }),
        N: common_vendor.p({
          type: "message"
        }),
        O: common_vendor.o(deleteItem),
        P: common_vendor.o(cancel),
        Q: common_vendor.sr(deletePopup, "3c22f9d1-4", {
          "k": "deletePopup"
        }),
        R: common_vendor.p({
          type: "bottom",
          ["border-radius"]: "20rpx 20rpx 0 0",
          ["background-color"]: "#fff",
          ["safe-area"]: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3c22f9d1"]]);
wx.createPage(MiniProgramPage);
