<template>
	<view style="width: 100vw; height: 100vh; background-color: #F5F6F8;">
		<view class="status_bar"></view>
		<view class="content-topbar">
			<view class="top-left" @click="toIndex">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="aspectFill"></image>
			</view>
			<view class="top-center">
				隐患随手拍
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="container">
			<scroll-view style="height: calc(100vh - 250rpx);" scroll-y="true">
			<view class="disposal">
				<text>区域等级</text><text style="color: #F56C6C;">*</text>
				<view style="margin-top: 12rpx;">
					<picker @change="regionChange" :value="selectedregion" :range="sceneName" range-key="levelName">
						<view class="picker-display">
							 <view class="uni-input">{{ sceneName[selectedregion]?.levelName }}</view>
							 <view style="margin-right: 20rpx;"><image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
						</view>
					</picker>
				</view>
				<view class="disposal" style="margin: 24rpx 0 0 0; padding: 0;">
					<text>场景名称</text><text style="color: #F56C6C;">*</text>
					<view style="margin-top: 12rpx;">
						<picker @change="scenarioChange" :value="selectedscenario" :range="sceneName[selectedregion]?.children" range-key="sceneName">
							<view class="picker-display">
								 <view class="uni-input" v-if="sceneName[selectedregion]?.children.length>0">
									{{ sceneName[selectedregion]?.children[selectedscenario].sceneName }}
								 </view>
								 <view v-else class="uni-input">无场景</view>
								 <view style="margin-right: 20rpx;">
									 <image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image>
								 </view>
							</view>
						</picker>
					</view>
				</view>
				<view class="disposal" style="margin: 24rpx 0 0 0; padding: 0;">
					<text>隐患等级</text><text style="color: #F56C6C;">*</text>
					<view style="margin-top: 12rpx;">
						<picker @change="troubleChange" :value="selectedtrouble" :range="trouble">
							<view class="picker-display">
								 <view class="uni-input">{{ trouble[selectedtrouble] }}</view>
								 <view style="margin-right: 20rpx;"><image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
							</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="disposal">
				<text>附件上传</text>
				<view class="content-camera">
					<view style="display: inline-block;"
						v-for="(item,index) in attachmentList"
						:key="index">
						<view v-if="item.split('.').pop() === 'mp4'" class="video-display">
							<image class="show-img" :src= "attachmentListVideo[index]" mode="scaleToFill"></image>
							<image class="play-icon" src= "../../static/images/xunjian/video2.png" mode="scaleToFill" @click="showVideo(item)"></image>
							<image class="close-icon" src= "../../static/images/xunjian/chacha.png" mode="scaleToFill" @click="deleteFile(index)"></image>
						</view>
						<view v-else class="video-display">
							<image class="show-img" :src="item" mode="scaleToFill" @click="showImg(item)"></image>
							<image class="close-icon" src= "../../static/images/xunjian/chacha.png" mode="scaleToFill" @click="deleteFile(index)"></image>
						</view>
					</view>
					<image class="show-img"
						src= "../../static/images/xunjian/upload.png"
						@click="addImgAndVideo"
						mode="scaleToFill">
					</image>
				</view>
				<view class="disposal" style="margin: 24rpx 0 0 0; padding: 0;">
					<text>描述</text><text style="color: #F56C6C;">*</text>
					<view style="margin-top: 12rpx;">
						<textarea name="" id="" cols="30" rows="10"
								  v-model="description"
								  placeholder = '请输入'
								  style="width: 100%; 
								  background-color: #FDFDFF; 
								  border: 2rpx solid #F6F7FA;">
						</textarea>
					</view>
				</view>
			</view>
			<view class="disposal">
				<text>录音</text>
				<view class="audio-icon">
					<view class="icon-selected">
						<image style="width: 100rpx; height: 100rpx; margin-bottom: 20rpx;" 
							@touchstart="startRecording"
							@touchend="stopRecording"
							@touchmove.prevent
							src= "../../static/images/gaojing/lyicon.png" 
							mode="scaleToFill">
						</image>
					</view>
					<text>长按开始录音</text>
				</view>
				<view class="audio-list" v-for="(item,index) in recordingList" :key="index">
					<view class="audio-list audio-left" @click="playRecording(index)">
						<image v-if="playIndex === index"
						style="width: 30rpx; height: 34rpx; margin-right: 6rpx;" 
						src= "../../static/images/gaojing/play.gif" mode="scaleToFill"></image>
						<image v-else src="../../static/images/gaojing/luyin.png" mode="scaleToFill"
							style="width: 24rpx; height: 34rpx; margin-right: 12rpx;" >
						</image>
						<text>{{item.progressWidth}}"</text><view :style="{ width: item.progressWidth*20 + 'rpx'}"></view>
					</view>
					<view class="audio-right" @click="toDeleteInfo(index)">
						<image style="width: 30rpx; height: 30rpx;" src= "../../static/images/gaojing/quxioa.png" mode="scaleToFill"></image>
					</view>
				</view>
			</view>
			<view style="height: 150rpx;"></view>
			</scroll-view>
			<view class="bottom-but" @click="addHiddenDanger">
				提 交
			</view>
			<!-- 视频弹窗 playsinline -->
			<uni-popup ref="popup" type="center">
				<video style="height: 420rpx; width: 700rpx;" :src="playVideoUrl" 
				controls="true" object-fit="cover" playsinline></video>
			</uni-popup>
			<!-- 录音ing -->
			<uni-popup ref="recordingPopup" type="center">
				<view class="recording-pop" style="width: 340rpx; height: 127rpx; background-color: #3776FF;">
					<image style="width: 230rpx; height: 40rpx;" src= "../../static/images/gaojing/Recording.gif" mode="scaleToFill"></image>
				</view>
			</uni-popup>
			<!-- 成功提示 -->
			<uni-popup ref="successPopup" type="message">
				<uni-popup-message type="success" :message="popUps" :duration="1000"></uni-popup-message>
			</uni-popup>
			<!-- 删除提示 -->
			<view class="delete-tips">
				<uni-popup ref="deletePopup" type="bottom" border-radius="20rpx 20rpx 0 0" background-color="#fff" safe-area>
					<view class="video-delete">
						<view class="name">
							<text>删除后将无法恢复，确认要删除吗？</text>
						</view>
						<view class="del-but" @click="deleteItem">
							确定
						</view>
						<view class="del-but" style="color: #4F505F; border: none;" @click="cancel">
							取消
						</view>
					</view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onUnmounted } from 'vue';
	import { apiGetSceneName, apiAddHiddenDanger } from '@/api/apis.js';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { PROJECTID, BASE_URL } from '@/config.js';
	
	const trouble = ref(['请选择','一般隐患', '严重隐患','较大隐患','重大隐患']);
	const selectedregion = ref(0);
	const selectedscenario = ref(0);
	const selectedtrouble = ref(0);
	const sceneName = ref([]);
	const sceneArea = ref([]);
	const description = ref('');
	const popup = ref('');
	const deletePopup = ref('');
	const successPopup = ref('');
	const recordingPopup = ref('');
	const popUps = ref('');
	const playVideoUrl = ref('');
	const attachmentList = ref([]);
	const attachmentListVideo = ref([]);//视频回显图片
	const recordingList = ref([]); //录音数据列表
	const recorderManager = uni.getRecorderManager();
	const audioContext = uni.createInnerAudioContext(); //创建音频上下文
	const startTime = ref(null); //录音开始时间
	const recordingDuration = ref(null); //录音时长
	const hasPermission = ref(false);//是否拥有录音权限
	const isEndAllowed = ref(false);//是否允许结束录音
	const playIndex = ref(null);
	const deleteIndex = ref(null);
	const audioTempFilePath = ref([]);
	const uploadUrls = [];
	const audioUploadUrls = [];
	const params = {
		projectId: PROJECTID.globalProjectId
	};
	
	//请求场景名称列表
	const getSceneName = async()=> {
		let res = await apiGetSceneName({
			projectId: PROJECTID.globalProjectId
		});
		sceneName.value = res.data.children;
	}
	
	//提交表单新增隐患接口请求
	const addHiddenDanger = async () => {
		if(!params.sceneId){
			infoTips('请选择场景');
			return;
		}
		if(selectedtrouble.value < 1) {
			infoTips('请选择隐患等级');
			return;
		}
		if(!description.value) {
			infoTips('请填写描述');
			return;
		}
		params.note = description.value;
		params.level = selectedtrouble.value -1;
		// 调用文件上传
		let uploadFileList = [...audioTempFilePath.value, ...attachmentList.value]
		if(uploadFileList.length < 1){
			handleAddHiddenDanger(params).then(result => {
			    if (result.code === 200) {
					popUps.value = '提交成功';
			        successPopup.value.open();
			        setTimeout(() => {
			            uni.navigateBack();
			        }, 1000);
			    } else {
			        infoTips('提交失败');
			    }
			}).catch(error => {
			    console.error('提交过程中发生错误', error);
			});
			return;
		}
		uploadAllFiles(uploadFileList, (fileList,audioFileList) => {
			params.attachmentList = fileList; //文件路径数组
			params.recordingList = audioFileList;
			handleAddHiddenDanger(params).then(result => {
			    if (result.code === 200) {
					popUps.value = '提交成功';
			        successPopup.value.open();
			        setTimeout(() => {
			            uni.navigateBack();
			        }, 1000);
			    } else {
			        infoTips('提交失败');
			    }
			}).catch(error => {
			    console.error('提交过程中发生错误', error);
			});
		}, (error) => {
		    console.error('文件上传失败',error);
		});
	}
	
	// 定义async函数以便能够在文件上传回调函数中处理请求
	async function handleAddHiddenDanger(params) {
	    let res = await apiAddHiddenDanger(params);
	    return res; // 返回响应给 .then() 处理
	}
	
	//文件上传
	const uploadAllFiles = (files, onSuccess, onError) => {
	    let uploadedCount = 0; // 记录已上传的文件个数
	    const uploadFile = (filePath) => {
	        uni.uploadFile({
	            url: BASE_URL+'/minio/fileUpload',
	            filePath: filePath,
	            name: 'file',
	            header: {'Content-Type' : 'multipart/form-data'}, 
	            success: (uploadFileRes) => {
	                try {
	                    const responseData = JSON.parse(uploadFileRes.data);
	                    const uploadedFilePath = responseData.msg;
						if(uploadedFilePath.split('.').pop() === 'mp3'){
							audioUploadUrls.push(uploadedFilePath);
						}else {
							uploadUrls.push(uploadedFilePath);
						}
	                    uploadedCount++; // 增加已上传的文件计数
	                    if (uploadedCount === files.length) { // 文件上传完成，回调onSuccess传递返回到文件路径
	                        onSuccess(uploadUrls, audioUploadUrls);
	                    }
	                } catch (error) {
	                    onError('Error parsing JSON response:', error);
	                }
	            },
	            fail: (error) => {
	                // 处理上传失败的逻辑
	                onError('Upload failed for file', error);
	            },
	        });
	    };
	
	    // 循环上传文件
	    files.forEach((filePath) => {
	        uploadFile(filePath);
	    });
	};
	
	//选择文件(视频、图片)
	function addImgAndVideo() {
		uni.chooseMedia({
		  count: 1,
		  mediaType: ['mix'],
		  sourceType: ['album', 'camera'],
		  maxDuration: 60,
		  camera: 'back',
		  success(res) {
			attachmentList.value.push(res.tempFiles[0].tempFilePath);//保存图片视频临时地址
			if(res.tempFiles[0].fileType === 'video'){
				attachmentListVideo.value.push(res.tempFiles[0].thumbTempFilePath);
			}else {
				attachmentListVideo.value.push(res.tempFiles[0].tempFilePath);
			}
		  }
		})
	}
	//删除上传的图片和视频
	function deleteFile(index) {
		attachmentList.value.splice(index,1);
		attachmentListVideo.value.splice(index,1);
	}
	//点击播放视频
	function showVideo(url) {
		popup.value.open();
		playVideoUrl.value = url;
	}
	//点击放大图片查看
	function showImg(url) {
		uni.previewImage({
			current: '',
			urls: [url]
		});
	}
	
	/*录音处理*/
	//获取录音权限处理
	const checkPermission = async () => {
		await uni.authorize({
			scope: 'scope.record',
			success: (res) => {
				hasPermission.value = true;
				console.log('trun');
			},
			fail: (err) => {
				hasPermission.value = false;
				console.error('用户拒绝了录音权限', err);
				uni.showModal({
					title: '权限申请',
					content: '需要录音权限，请前往设置开启',
					showCancel: '取消',
					confirmText: '去设置',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting();
						}
					},
				});
			}
		});
	}
	//长按录音
	const startRecording = async () =>{
		try {
			if(!hasPermission.value) {
				await checkPermission();
			}
			if(hasPermission.value) {
				isEndAllowed.value = true;//开始才允许结束
				startTime.value = new Date().getTime() / 1000;
				recordingPopup.value.open();
				recorderManager.start({
					format: 'mp3',
				});
			}
		}catch(err){
			console.error(err);
		}
	}
	//松开结束
	const stopRecording = () =>{
		if(!isEndAllowed.value) return;
		const endTime = new Date().getTime() / 1000;
		recordingDuration.value = endTime - startTime.value; 
		recordingPopup.value.close();
		recorderManager.stop();
	}
	//监听结束事件
	recorderManager.onStop((res) => {
		if(recordingDuration.value < 1){
			infoTips('录音时长过短');
			return;
		}
		const { tempFilePath } = res;
		audioTempFilePath.value.push(tempFilePath);
		let audioData = {
			url: tempFilePath,
			progressWidth: Math.floor(recordingDuration.value)
		}
		recordingList.value.push(audioData);
		console.log('录音列表',recordingList.value);
	});
	
	//播放录音
	const playRecording = (index) => {
		audioContext.stop();
		if (playIndex.value === index) {
				playIndex.value = '';
		} else {
			playIndex.value = index;
			audioContext.src = recordingList.value[index].url;
			let a = recordingList.value[index];
			console.log('当前播放的是：',a);
			audioContext.play();
			// 播放结束
			audioContext.onEnded(() => {
				playIndex.value = '';
			});
		}
	};
	//删除处理 
	function toDeleteInfo(index) {
		deleteIndex.value = index;
		deletePopup.value.open();
	}
	const deleteItem = () => {
		recordingList.value.splice(deleteIndex.value, 1);
		popUps.value = '删除成功';
		successPopup.value.open();
		deletePopup.value.close();
		console.log('录音列表',recordingList.value);
	}
	function cancel() {
		deletePopup.value.close();
	}
	
	//处理选择器变化的方法
	const regionChange = (e) => {
	  selectedregion.value = e.detail.value; // 区域等级更新选中项的索引
	  if(sceneName.value[selectedregion.value]?.children[0]?.sceneId){
		params.sceneId = sceneName.value[selectedregion.value]?.children[0].sceneId;
	  }else {
		  params.sceneId = null;
	  }
	};
	const scenarioChange = (e) => {
	  selectedscenario.value = e.detail.value; // 场景名称更新选中项的索引
	  params.sceneId = sceneName.value[selectedregion.value]?.children[selectedscenario.value].sceneId;
	};
	const troubleChange = (e) => {
	  selectedtrouble.value = e.detail.value; // 隐患等级更新选中项的索引
	};
	
	// 消息提示封装
	function infoTips(mass){
		uni.showToast({
			title: mass,
			icon: 'none',
			duration: 2000
		});
	}
	
	//返回
	const toIndex = () => {
		uni.navigateBack();
	};
	
	getSceneName();
	// 页面卸载时清理音频
	onUnmounted(() => {
		audioContext.destroy();
	});
	
</script>

<style scoped lang="scss">
	::v-deep .uni-popup.top {
		top: 200rpx;
	}
	.status_bar {
		height: 85px;
		width: 100%;
		background-color: #3776FF;
	}
	.content-topbar {
		width: 100%;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #3776FF;
		.top-center {
			margin-bottom: 10rpx;
			font-weight: 400;
			font-size: 36rpx;
			color: #FDFDFF;
		}
		.top-left {
			margin-left: 26rpx;
		}
		.top-left:active {
			opacity: 0.6; 
		}
		.top-right {
			margin-right: 26rpx;
		}
	}
	
	.container {
		.disposal {
			margin: 24rpx;
			padding: 24rpx;
			font-size: 28rpx;
			color: #4F505F;
			border-radius: 16rpx;
			background-color: #fff;
			.picker-display {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 8rpx;
				background-color: #FDFDFF;
				border: 2rpx solid #F6F7FA;
				.uni-input {
					height: 72rpx;
					padding-left: 20rpx;
					text-align: left;
					line-height: 72rpx;
					color: #4F505F;
					margin-right: 0px;
				}
			}
			.content-camera {
				padding-top: 12rpx;
				padding-left: 12rpx;
				.show-img {
					width: 200rpx;
					height: 200rpx;
					margin-right: 12rpx;
					margin-bottom: 12rpx;
					display: inline-block;
					border-radius: 8rpx;
				}
			}
			.audio-icon {
				width: 100%;
				height: 260rpx;
				font-size: 28rpx;
				color: #8F91A1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.icon-selected:active {
					opacity: 0.9;
				}
			}
			.audio-list {
				margin-bottom: 24rpx;
				font-size: 28rpx;
				color: #FAFAFA;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.audio-left {
					height: 64rpx;
					padding-left: 24rpx;
					margin-bottom: 0;
					justify-content: left;
					border-radius: 6rpx;
					background-color: #709CFE;
				}
				.audio-left:active {
					opacity: 0.7;
				}
				.audio-right:active {
					opacity: 0.7;
				}
			}
			.video-display {
				display: inline-block;
				position: relative;
				.play-icon {
				  position: absolute;
				  top: 50%;
				  left: 50%;
				  width: 60rpx; 
				  height: 60rpx; 
				  transform: translate(-50%, -50%);
				  cursor: pointer;
				}
				.close-icon {
				  position: absolute;
				  top: 0;
				  right: 12rpx;
				  width: 50rpx; 
				  height: 50rpx; 
				  cursor: pointer; 
				}
			}
		}
		.bottom-but {
			height: 80rpx;
			position: fixed; 
			bottom: 72rpx; 
			left: 48rpx;
			right: 48rpx;
			z-index: 10;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
			line-height: 80rpx;
			border-radius: 48rpx;
			background-color: #5187FF;
		}
		.bottom-but:active {
			opacity: 0.7;
		}
		.recording-pop {
			width: 100%;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.delete-tips {
			.video-delete {
				height: 320rpx;
				text-align: center;
				.name {
					padding: 24rpx 0;
					font-size: 24rpx;
					color: #8F91A1;
					border-bottom: 2rpx solid #FAFAFB;
				}
				.del-but {
					padding: 24rpx 0;
					font-size: 28rpx;
					color: #F56C6C;
					border-bottom: 6rpx solid #FAFAFB;
				}
				.del-but:active {
					opacity: 0.7;
				}
			}
		}
	}
</style>