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
									</view>
								</view>
							</template>
							<view class="content">
								<view class="content-camera">
									<view style="display: inline-block;" 
										v-for="(subItem,subIndex) in item.attachmentList" 
										:key="subIndex">
										<view v-if="subItem.split('.').pop() === 'mp4'" class="video-wrapper" @click="showVideo(imgRequestHead + subItem)">
											<video class="show-img" object-fit="cover" :src="imgRequestHead + subItem"></video>
											<view class="video-mask"></view>
										</view>
		
										<image v-else class="show-img" 
											:src="imgRequestHead + subItem" 
											@click="showImg(imgRequestHead + subItem)"
											mode="scaleToFill"></image>
									</view>
								</view>
								<view class="remark">
									<view style="margin: 6rpx 12rpx;
									padding-bottom: 12rpx;
									border: 2rpx solid #F6F7FA; 
									background-color: #FDFDFF;" >备注：{{item.note}}</view>
								</view>
							</view>
						</uni-collapse-item>
					</uni-collapse>
					</scroll-view>
					<!-- 视频弹窗 playsinline -->
					<uni-popup ref="popup" type="center">
						<video style="height: 420rpx; width: 700rpx;" :src="playVideoUrl" 
						controls="true" object-fit="cover" playsinline></video>
					</uni-popup>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { apiGetInspectionById } from '@/api/apis.js';
	import { onLoad } from '@dcloudio/uni-app';
	import {imgRequestHeader} from '@/config.js';
	
	const selectedRows = ref([null]);
	const inspectionId = ref('');
	const inspectionData = ref([]); //巡检数据
	const inspectionItemList = ref([]);//检查项列表
	const attachmentList = ref([]);//检查项-附件列表
	const imgRequestHead = imgRequestHeader.URL; //初始化图片请求头部地址
	const popup = ref('');
	const playVideoUrl = ref(''); //视频播放地址
		
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
			attachmentList.value = res.data.inspectionItemList.attachmentList;
		}else {
			uni.showModal({
				content:'未获取ID',
				showCancel:false
			})
		}
		
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
	
	//返回巡检管理界面
	const toInspection = () => {
		uni.navigateBack();
	};
	
	
</script>

<style scoped lang="scss">
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
					background-color: #F6FDFC;
					border: 2rpx solid #A1EADE;
					border-radius: 10rpx;
					.coll-list {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
					}
				}
				.content-camera {
					padding-top: 12rpx;
					padding-left: 12rpx;
					.video-wrapper {
						position: relative;
						width: 200rpx;
						height: 200rpx;
						padding-right: 12rpx;
						.video-mask {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 1; 
							background: transparent;
						}
					}
					.show-img {
						width: 200rpx;
						height: 200rpx;
						margin-right: 12rpx;
						margin-bottom: 12rpx;
						display: inline-block;
						border-radius: 8rpx;
					}
				}
			}
		}
	}
	
</style>
