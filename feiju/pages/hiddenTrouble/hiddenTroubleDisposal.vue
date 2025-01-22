<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toSubHiddenTrouble">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				隐患处置
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="container">
			<view class="disposal">
				<text>处置方式</text><text style="color: #F56C6C;">*</text>
				<uni-data-checkbox v-model="disposalWay" :localdata="range" @change="changeCheckbox"></uni-data-checkbox>
			</view>
			<view class="disposal">
				<text>隐患等级</text><text style="color: #F56C6C;">*</text>
				<view style="margin-top: 12rpx;">
					<picker @change="handlePickerChange" :value="selectedIndex" :range="options">
						<view class="picker-display">
							 <view class="uni-input">{{ options[selectedIndex] }}</view>
							 <view style="margin-right: 20rpx;"><image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
						</view>
					</picker>
				</view>
				<view v-show="disposalWay === 0" class="annex-upload">
					<text class="annex-title">附件上传</text>
					<view class="content-camera">
							 <view style="display: inline-block;"
								v-for="(item,index) in disposalFile"
								:key="index">
								<view v-if="item.split('.').pop() === 'mp4'" class="video-display">
									<image class="show-img" :src= "disposalFileVideo[index]" mode="scaleToFill"></image>
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
				</view>
			</view>
			<view class="bottom-but" @click="submitInsert">
				确 定
			</view>
			<!-- 视频弹窗 playsinline -->
			<uni-popup ref="popup" type="center">
				<video style="height: 420rpx; width: 700rpx;" :src="playVideoUrl" 
				controls="true" object-fit="cover" playsinline></video>
			</uni-popup>
			<uni-popup ref="deletePopup" type="message">
				<uni-popup-message type="success" message="处置成功" :duration="1000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { apiPutDisposal } from '@/api/apis.js';
	import { BASE_URL } from '@/config.js';
	
	const disposalWay = ref(0);
	const disposalId = ref('');
	const selectedIndex = ref(0); 
	const disposalFile = ref([]); //文件变量
	const disposalFileVideo = ref([]);//视频回显变量
	const deletePopup = ref('');
	const popup = ref('');
	const playVideoUrl = ref('');
	const range = reactive([{"value": 0,"text": "处置完成"},{"value": 1,"text": "无需处置"}]);//单选框变量
	const options = ref(['请选择', '一般隐患', '严重隐患','较大隐患','重大隐患']);//隐患等级选项
	const params = {};
	const uploadUrls = [];
	
	
	onLoad((e) => {
		disposalId.value = e.id;
		params.id = disposalId.value;
	})

	//提交填写表单
	const submitInsert = async ()=> {
		if (!params.id) {
			infoTips('隐患id为空');
			return;
		}
		if(disposalWay.value === 1){
			if(selectedIndex.value < 1) {
				infoTips('请选择隐患等级');
				return;
			}
			params.level = selectedIndex.value - 1;
			params.state = 3;
			handleHiddenDanger(params);
		}else {
			if(selectedIndex.value < 1 ) {
				infoTips('请选择隐患等级');
				return;
			}
			params.state = 2;
			params.level = selectedIndex.value - 1;
			// 调用文件上传
			if(disposalFile.value.length > 0){
				uploadAllFiles(disposalFile.value, (fileList) => {
					params.disposalFileList = fileList; //文件路径数组
					handleHiddenDanger(params);	
				});
			}else{
				handleHiddenDanger(params);	
			}
		}
	}

	 const handleHiddenDanger = async(params) => {
		 try {
			let res = await apiPutDisposal(params);
			if (res.code === 200) {
				deletePopup.value.open();
				setTimeout(() => {
					uni.navigateBack();
				}, 1000);
			} else {
				infoTips(res.msg);
			}
		} catch (error) {
			infoTips(error.msg);
		}
	}
	
	//文件上传
	const uploadAllFiles = (files, onSuccess) => {
	    let uploadedCount = 0;
	    const uploadFile = (filePath) => {
	        uni.uploadFile({
	            url: BASE_URL+'/minio/fileUpload',
	            filePath: filePath,
	            name: 'file',
	            header: {'Content-Type' : 'multipart/form-data'}, 
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
	                console.error('文件上传失败');
	            },
	        });
	    };
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
			disposalFile.value.push(res.tempFiles[0].tempFilePath);//保存图片视频临时地址
			if(res.tempFiles[0].fileType === 'video'){
				disposalFileVideo.value.push(res.tempFiles[0].thumbTempFilePath);
			}else {
				disposalFileVideo.value.push(res.tempFiles[0].tempFilePath);
			}
		  }
		})
	}
	//删除上传的图片和视频
	function deleteFile(index) {
		disposalFile.value.splice(index,1);
		disposalFileVideo.value.splice(index,1);
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
	
	// 消息提示封装
	function infoTips(mass){
		uni.showToast({
			title: mass,
			icon: 'none',
			duration: 2000
		});
	}
	
	//处理选择器变化的方法
	const handlePickerChange = (e) => {
	  selectedIndex.value = e.detail.value; // 更新选中项的索引
	};		
		
	//返回
	const toSubHiddenTrouble = () => {
		uni.navigateBack();
	};
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
	.topbar {
		width: 100%;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #3776FF;
		.top-center {
			flex: 1;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-weight: 400;
			font-size: 36rpx;
			color: #fff;
		}
		.top-left {
			flex: 1;
			color: #4F505F;
			margin-left: 26rpx;
		}
		.top-left:active {
			opacity: 0.6; 
		}
		.top-right {
			flex: 1;
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
			::v-deep .uni-data-checklist .checklist-group {
				display: flex;
				flex-direction: column;
			}
			::v-deep .uni-data-checklist .checklist-group .checklist-box {
				height: 72rpx;
				padding-left: 20rpx;
				border-radius: 8rpx;
				margin-right: 0px;
				background-color: #FDFDFF;
				border: 2rpx solid #F6F7FA;
			}
			::v-deep .uni-data-checklist .checklist-group .checklist-box.is--default.is-checked {
				border: 2rpx solid #95B6FF;
				background-color: #F5F8FF;
			}
			
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
					color: #C0C4CC;
					margin-right: 0px;
				}
			}
			.annex-upload {
				margin-top: 24rpx;
				.annex-title {
					font-size: 28rpx;
					color: #4F505F;
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
		}
		
		.bottom-but {
			height: 80rpx;
			position: fixed; 
			bottom: 72rpx; 
			left: 48rpx;
			right: 48rpx;
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
	}
	
</style>
