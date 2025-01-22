"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_apis = require("../../api/apis.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  (_easycom_uni_collapse_item2 + _easycom_uni_collapse2 + _easycom_uni_popup2 + _easycom_uni_popup_message2)();
}
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
if (!Math) {
  (_easycom_uni_collapse_item + _easycom_uni_collapse + _easycom_uni_popup + _easycom_uni_popup_message)();
}
const _sfc_main = {
  __name: "dailyInspection",
  setup(__props) {
    const selectedRows = common_vendor.ref([null]);
    const inspectionId = common_vendor.ref("");
    const inspectionData = common_vendor.ref([]);
    const inspectionItemList = common_vendor.ref([]);
    common_vendor.ref([]);
    const imgRequestHead = config.imgRequestHeader.URL;
    const playVideoUrl = common_vendor.ref("");
    const isDisabled = common_vendor.ref([]);
    const remarkText = common_vendor.ref([]);
    common_vendor.ref([]);
    const popup = common_vendor.ref("");
    const updatePopup = common_vendor.ref("");
    common_vendor.onLoad((e) => {
      inspectionId.value = e.id;
      getInspectionById();
    });
    const getInspectionById = async () => {
      if (inspectionId.value) {
        let res = await api_apis.apiGetInspectionById(inspectionId.value);
        inspectionData.value = res.data;
        inspectionItemList.value = res.data.inspectionItemList;
        isDisabled.value.length = inspectionItemList.value.length;
        isDisabled.value.fill(false);
        remarkText.value.length = inspectionItemList.value.length;
      } else {
        common_vendor.index.showModal({
          content: "未获取ID",
          showCancel: false
        });
      }
    };
    const updateInspection = async () => {
      try {
        if (isDisabled.value.every(Boolean)) {
          let res = await api_apis.apiUpdateInspection(inspectionData.value);
          if (res.code === 200) {
            updatePopup.value.open();
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1e3);
          } else {
            common_vendor.index.showToast({
              title: "提交失败",
              icon: "none",
              duration: 2e3
            });
          }
        } else {
          common_vendor.index.showToast({
            title: "请先确认检查项",
            icon: "none",
            duration: 2e3
          });
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: err.msg,
          icon: "none",
          duration: 2e3
        });
      }
    };
    const addImgAndVideo = (index) => {
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["mix"],
        sourceType: ["album", "camera"],
        maxDuration: 60,
        camera: "back",
        success(res) {
          common_vendor.index.uploadFile({
            url: config.BASE_URL + "/minio/fileUpload",
            filePath: res.tempFiles[0].tempFilePath,
            name: "file",
            header: { "Content-Type": "multipart/form-data" },
            success: (ras) => {
              try {
                const parsedData = JSON.parse(ras.data);
                const msgValue = parsedData.msg;
                inspectionItemList.value[index].attachmentList.push(msgValue);
              } catch (error) {
                console.error("解析JSON字符串出错：", error);
              }
            },
            fail: (err) => {
              console.error("上传失败", err);
            }
          });
        }
      });
    };
    function deleteFile(index, subIndex) {
      inspectionItemList.value[index].attachmentList.splice(subIndex, 1);
    }
    function showVideo(url) {
      popup.value.open();
      playVideoUrl.value = imgRequestHead + url;
    }
    function showImg(url) {
      common_vendor.index.previewImage({
        current: "",
        urls: [url]
      });
    }
    function collSelected(index) {
      if (!selectedRows.value.includes(index)) {
        selectedRows.value.push(index);
        if (!remarkText.value[index]) {
          inspectionItemList.value[index].note = "";
        } else {
          inspectionItemList.value[index].note = remarkText.value[index];
        }
        inspectionItemList.value[index].normal = true;
        isDisabled.value[index] = true;
      }
    }
    function unCollSelected(index) {
      if (selectedRows.value.includes(index)) {
        selectedRows.value = selectedRows.value.filter((rowIndex) => rowIndex !== index);
        isDisabled.value[index] = false;
      }
    }
    const toInspection = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.o(toInspection),
        c: common_vendor.t(inspectionData.value.sceneName),
        d: common_vendor.t(inspectionData.value.taskName),
        e: common_vendor.t(inspectionData.value.levelName),
        f: common_vendor.t(inspectionData.value.sceneName),
        g: common_vendor.f(inspectionItemList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.o(($event) => collSelected(index), item.id),
            c: common_vendor.o(($event) => unCollSelected(index), item.id),
            d: common_vendor.f(item.attachmentList, (subItem, subIndex, i1) => {
              return common_vendor.e({
                a: subItem.split(".").pop() === "mp4"
              }, subItem.split(".").pop() === "mp4" ? {
                b: common_vendor.unref(imgRequestHead) + subItem,
                c: common_vendor.o(($event) => showVideo(subItem), subIndex),
                d: common_assets._imports_3$5,
                e: common_vendor.o(($event) => deleteFile(index, subIndex), subIndex)
              } : {
                f: common_vendor.unref(imgRequestHead) + subItem,
                g: common_vendor.o(($event) => showImg(common_vendor.unref(imgRequestHead) + subItem), subIndex),
                h: common_assets._imports_3$5,
                i: common_vendor.o(($event) => deleteFile(index, subIndex), subIndex)
              }, {
                j: subIndex
              });
            }),
            e: common_vendor.o(($event) => addImgAndVideo(index), item.id),
            f: isDisabled.value[index],
            g: remarkText.value[index],
            h: common_vendor.o(($event) => remarkText.value[index] = $event.detail.value, item.id),
            i: item.id,
            j: common_vendor.n({
              selected: selectedRows.value.includes(index)
            }),
            k: "c09b1c54-1-" + i0 + ",c09b1c54-0"
          };
        }),
        h: common_assets._imports_1$7,
        i: common_assets._imports_2$8,
        j: common_assets._imports_4$5,
        k: common_vendor.p({
          ["title-border"]: "none",
          border: false
        }),
        l: common_vendor.p({
          accordion: true
        }),
        m: playVideoUrl.value,
        n: common_vendor.sr(popup, "c09b1c54-2", {
          "k": "popup"
        }),
        o: common_vendor.p({
          type: "center"
        }),
        p: common_vendor.o(updateInspection),
        q: common_vendor.p({
          type: "success",
          message: "提交成功",
          duration: 1e3
        }),
        r: common_vendor.sr(updatePopup, "c09b1c54-3", {
          "k": "updatePopup"
        }),
        s: common_vendor.p({
          type: "message"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c09b1c54"]]);
wx.createPage(MiniProgramPage);
