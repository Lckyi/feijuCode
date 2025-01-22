<template>
	<view style="width: 100%; height: 100%; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toInspection">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				{{inspectionData.sceneName}}巡检
			</view>
			<view class="top-right"></view>
		</view>
		<view class="container">
			<view class="content-up">
				<view class="title">
					任务名称
				</view>
				<view class="text-input">{{inspectionData.taskName}}</view>
				<view class="title">
					区域等级
				</view>
				<view class="text-input">{{inspectionData.levelName}}</view>
				<view class="title">
					场景名称
				</view>
				<view class="text-input">{{inspectionData.sceneName}}</view>
			</view>
			<view class="content-down">
				<view class="content-title">
					检查项<text style="color: #F56C6C;">*</text>
				</view>
				<view class="down-collapse">
					<scroll-view style="height: 745rpx;" scroll-y="true">
					<uni-collapse accordion>
						<uni-collapse-item v-for="(item, index) in inspectionItemList" :key="item.id" 
						:class="['coll-item', {selected: selectedRows.includes(index) }]"
						 title-border="none" :border="false">
							<template v-slot:title>
								<view class="coll-list">
									<view class="coll-title">
										<text>{{item.name}}</text>
									</view>
									<view class="right">
										<view class="icon1" @click.stop.prevent ="collSelected(index)">
											<image style="width: 30rpx; height: 30rpx;" src="../../static/images/xunjian/gou.png" mode="scaleToFill"></image>
										</view>
										<view class="icon2" @click.stop.prevent="unCollSelected(index)">
											<image style="width: 30rpx; height: 30rpx;" src="../../static/images/xunjian/cha.png" mode="scaleToFill"></image>
										</view>
									</view>
								</view>
							</template>
							<view class="content">
									<view class="content-camera">
										 <view style="display: inline-block;"
											v-for="(subItem,subIndex) in item.attachmentList" 
											:key="subIndex">
											<view v-if="subItem.split('.').pop() === 'mp4'" class="video-display">
												<video class="show-img" object-fit="cover" :src="imgRequestHead + subItem"></video>
												<view class="video-mask" @click="showVideo(subItem)"></view>
												<image class="close-icon" src= "../../static/images/xunjian/chacha.png" mode="scaleToFill" @click="deleteFile(index,subIndex)"></image>
											</view>
											<view v-else class="video-display">
												<image class="show-img" :src="imgRequestHead + subItem" mode="scaleToFill" @click="showImg(imgRequestHead + subItem)"></image>
												<image class="close-icon" src= "../../static/images/xunjian/chacha.png" mode="scaleToFill" @click="deleteFile(index,subIndex)"></image>
											</view>
										</view>
									<image class="show-img"
										src= "../../static/images/xunjian/upload.png"
										@click="addImgAndVideo(index)"
										mode="scaleToFill">
									</image>
								</view>
								<view class="remark">
									<textarea class="remark-text" :disabled="isDisabled[index]"
										v-model="remarkText[index]" cols="30" rows="10"
										placeholder="请输入备注">
									</textarea>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
					<view style="height: 200rpx;"></view>
					</scroll-view>
					<!-- 视频弹窗 playsinline -->
					<uni-popup ref="popup" type="center">
						<video style="height: 420rpx; width: 700rpx;" :src="playVideoUrl" 
						controls="true" object-fit="cover" playsinline></video>
					</uni-popup>
				</view>
			</view>
		</view>
		<view class="submit-but" style="border-radius: 48rpx;" @click="updateInspection">
			提 交
		</view>
		<uni-popup ref="updatePopup" type="message">
			<uni-popup-message type="success" message="提交成功" :duration="1000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { apiGetInspectionById, apiUploadFile,apiUpdateInspection } from '@/api/apis.js';
	import { onLoad } from '@dcloudio/uni-app';
	import {imgRequestHeader,BASE_URL} from '@/config.js';
	
	const selectedRows = ref([null]);
	const inspectionId = ref('');
	const inspectionData = ref([]); //巡检数据
	const inspectionItemList = ref([]);//检查项列表
	const attachmentList = ref([]);//检查项-附件列表(用于修改请求)
	const imgRequestHead = imgRequestHeader.URL; //初始化图片请求头部地址
	const playVideoUrl = ref('');//视频播放地址
	const isDisabled = ref([]);//是否可以输入备注
	const remarkText = ref([]); //备注内容
	const uploadFile = ref([]);
	const popup = ref('');
	const updatePopup = ref('');
	
	onLoad((e) => {
		inspectionId.value = e.id;
		getInspectionById();
	})
	
	//数据请求
	const getInspectionById = async() => {
		if (inspectionId.value) {
			let res = await apiGetInspectionById(inspectionId.value);
			inspectionData.value = res.data;
			inspectionItemList.value = res.data.inspectionItemList;
			isDisabled.value.length = inspectionItemList.value.length; //初始化检查项控制长度(禁用后才可提交)
			isDisabled.value.fill(false);//初始化检查项控制
			remarkText.value.length = inspectionItemList.value.length; //初始化备注内容长度
		}else {
			uni.showModal({
				content:'未获取ID',
				showCancel:false
			})
		}
	}
	
	//提交请求
	const updateInspection = async () => {
		try{
			if(isDisabled.value.every(Boolean)){
				let res = await apiUpdateInspection(inspectionData.value)
				if(res.code === 200){
					updatePopup.value.open();
					setTimeout(() => {
						uni.navigateBack();
					},1000)
				}else {
					uni.showToast({
						title: '提交失败',
						icon: 'none',
						duration: 2000
					});
				}
			}else {
				uni.showToast({
					title: '请先确认检查项',
					icon: 'none',
					duration: 2000
				});
			}
		}catch(err) {
			uni.showToast({
				title: err.msg,
				icon: 'none',
				duration: 2000
			});
		}
	}
	
	//选择文件(视频、图片)上传
	const addImgAndVideo = (index) =>{
		uni.chooseMedia({
			count: 1,
			mediaType: ['mix'],
			sourceType: ['album', 'camera'],
			maxDuration: 60,
			camera: 'back',
			success(res) {
				uni.uploadFile({
					url: BASE_URL+'/minio/fileUpload',
					filePath: res.tempFiles[0].tempFilePath,
					name: 'file',
					header: {'Content-Type' : 'multipart/form-data'},
					success: (ras) => {
						try {
							const parsedData = JSON.parse(ras.data);
							const msgValue = parsedData.msg;
							inspectionItemList.value[index].attachmentList.push(msgValue);//保存图片视频地址
						} catch (error) {
							console.error('解析JSON字符串出错：', error);
						}
					},
					fail: (err) => {
					  console.error('上传失败', err);
					},
				});
			}
		})
	}
	
	//删除上传的图片和视频
	function deleteFile(index,subIndex) {
		inspectionItemList.value[index].attachmentList.splice(subIndex,1);
	}
	
	//点击播放视频
	function showVideo(url) {
		popup.value.open();
		playVideoUrl.value = imgRequestHead +  url;
	}
	//点击放大图片查看
	function showImg(url) {
		uni.previewImage({
			current: '',
			urls: [url]
		});
	}
	
	//确定选中collapse列表数据
	function collSelected(index) {
		if (!selectedRows.value.includes(index)) {
			selectedRows.value.push(index); // 如果未选中，则添加
			if(!remarkText.value[index]){
				inspectionItemList.value[index].note = '';
			}else {
				inspectionItemList.value[index].note = remarkText.value[index];//勾选后备注生效
			}
			inspectionItemList.value[index].normal = true;
			isDisabled.value[index] = true;//禁用输入框
		}
	}
	
	//取消选中collapse列表数据
	function unCollSelected(index) {
		if (selectedRows.value.includes(index)) {
		   // 如果已经选中，则移除
		   selectedRows.value = selectedRows.value.filter(rowIndex => rowIndex !== index);
		   isDisabled.value[index] = false;//启用输入框
		}
	}
	
	//返回巡检管理界面
	const toInspection = () => {
		uni.navigateBack();
	};
	
	
</script>

<style scoped lang="scss">
	::v-deep .uni-popup.top {
		top: 200rpx;
	}
	// 检查项箭头图标修改
	::v-deep .uniui-bottom:before {
		font-size: 20rpx;
	    content: "\25BC";
		color: #4F505F;
	}
	
	::v-deep .uni-collapse-item__title-box {
		height: 80rpx;
		padding: 0;
		font-size: 28rpx;
		color: #4F505F;
		background-color: rgba(255, 255, 255, 0);
	}
	::v-deep .uni-collapse-item__title {
		background-color: rgba(255, 255, 255, 0);
	}
	::v-deep .uni-collapse-item__title-arrow {
		margin-right: 8rpx;
		transform: rotate(-90deg);
	}
	::v-deep .uni-collapse-item__title-arrow-active {
		transform: rotate(0deg);
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
		.content-up {
			margin: 24rpx;
			padding: 24rpx;
			border-radius: 16rpx;
			background-color: #fff;
			.title {
				margin-bottom: 28rpx;
				font-size: 28rpx;
				color: #4F505F;
			}
			.text-input {
				margin-bottom: 40rpx;
				margin-left: 24rpx;
				font-size: 28rpx;
				color: #C0C4CC;
			} 
		}
		
		.content-down {
			margin: 24rpx;
			padding: 24rpx;
			border-radius: 16rpx;
			background-color: #fff;
			.content-title {
				margin-bottom: 24rpx;
				font-size: 28rpx;
				color: #4F505F;
			}
			.down-collapse {
				height: 84rpx;
				margin-bottom: 16rpx;
				position: relative;
				border-radius: 8rpx;
				.coll-item {
					font-size: 28rpx;
					color: #4F505F;
					margin-bottom: 12rpx;
					padding: 17rpx 0;
					background-color: #FDFDFF;
					border: 2rpx solid #F6F7FA;
					border-radius: 10rpx;
					.coll-list {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.right {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.icon1 {
								margin: 0 24rpx;
							}
							.icon1:active {
								opacity: 0.6;
							}
							.icon2 {
								margin-right: 24rpx;
							}
							.icon2:active {
								opacity: 0.6;
							}
						}
					}
				}
				.coll-item.selected {
					background-color: #F6FDFC;
					border: 2rpx solid #A1EADE;
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
					.video-mask {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 1; 
						background: transparent;
					}
					.close-icon {
					  position: absolute;
					  top: 0;
					  right: 12rpx;
					  width: 50rpx; 
					  height: 50rpx; 
					  z-index: 2;
					  cursor: pointer;
					}
				}
				.remark {
					margin: 6rpx 12rpx;
					.remark-text {
						height: 200rpx;
						width: 100%;
						background-color: #FDFDFF;
						border: 2rpx solid #F6F7FA;
					}
				}
				.file-upload {
					height: 320rpx;
					text-align: center;
					.but {
						padding: 24rpx 0;
						font-size: 28rpx;
						color: #F56C6C;
						border-bottom: 2rpx solid #FAFAFB;
					}
					.but:active {
						opacity: 0.7;
					}
				}
			}
		}
	}
	// 提交按钮
	.submit-but {
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
		background-color: #5187FF;
	}
	.submit-but:active {
		opacity: 0.7;
	}
	
</style>
