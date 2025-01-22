export function useUpdateManager() {
  const updateManager = uni.getUpdateManager();

  const checkForUpdate = () => {
    if (uni.canIUse('getUpdateManager')) {
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log(res.hasUpdate);
          // showUpdateDialog();
        }
      });

      updateManager.onUpdateReady(() => {
        showUpdateDialog(true);
      });

      updateManager.onUpdateFailed(() => {
        uni.showModal({
          title: '更新失败',
          content: '新版本下载失败，请稍后重试。',
          showCancel: false,
        });
      });
    } else {
      console.error('当前环境不支持版本更新功能');
    }
  };

  const showUpdateDialog = (isReady = false) => {
    uni.showModal({
      title: '版本更新',
      content: isReady
        ? '新版本已经准备好，确定重启应用更新吗？'
        : '检测到新版本，将在下次启动时更新。',
      showCancel: !isReady,
      success: (res) => {
        if (res.confirm && isReady) {
          updateManager.applyUpdate();
        }
      },
    });
  };

  return {
    checkForUpdate,
  };
}