<template>
	<view style="width: 100vw; height: 100vh; background-color: #FFFFFF;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toBack">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				隐患日志
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="content">
			<scroll-view
			style="height: calc(100vh - 300rpx);"
			scroll-y="true" 
			@scrolltolower="bottomRefresh">
				<view class="content-item" v-for="(item, index) in logList" :key="item.id">
					<view class="content-title">
						<view class="circle-icon"></view>
						<text v-if="item.type === '3'" class="title">{{item.reviewer}}审核隐患</text> 
						<text v-if="item.type === '2'" class="title">{{item.disposerName}}完成处置</text>
						<text v-if="item.type === '1'" class="title">{{item.assignorName}}发起指派</text>
						<text v-if="item.type === '0'" class="title">{{item.discovererName}}发现隐患</text>
					</view>
					<view class="line-left">
						<view class="content-text">
							<view v-if="item.type === '3'" class="part-left">审核时间</view>
							<view v-if="item.type === '2'" class="part-left">完成时间</view><!-- 处置 -->
							<view v-if="item.type === '1'" class="part-left">指派时间</view>
							<view v-if="item.type === '0'" class="part-left">发现时间</view><!-- 发现 -->
							<view class="part-right">{{item.time}}</view>
						</view>
						<!-- 审核 -->
						<view v-if="item.type === '3'">
							<view v-if="item.reviewRejectReason">
								<view class="content-text">
									<view class="part-left">审核结果</view><view class="part-right">退回</view>
								</view>
								<view class="content-text">
									<view class="part-left">退回原因</view><view class="part-right">{{item.reviewRejectReason}}</view>
								</view>
							</view>
							<view v-else class="content-text">
								<view class="part-left">审核结果</view><view class="part-right">通过</view>
							</view>
						</view>
						<!-- 指派 -->
						<view  v-if="item.type === '1'" class="content-text">
							<view class="part-left">处置人</view><view class="part-right">{{item.disposerName}}</view>
						</view>
						
						<view v-if="item.type !== '3'">
							<view class="content-text">
								<view class="part-left">状态</view>
								<view v-if="item.hiddenDangerState === '0'" class="part-right">待指派</view>
								<view v-if="item.hiddenDangerState === '1'" class="part-right">待处置</view>
								<view v-if="item.hiddenDangerState === '4'" class="part-right">待审核</view>
							</view>
							<view class="content-text">
								<view class="part-left">隐患等级</view>
								<view class="part-right">
									<text v-if="item.hiddenDangerLevel === '0'" style="color:#5187FF;">一般隐患</text>
									<text v-if="item.hiddenDangerLevel === '1'" style="color: #FCD7A4;">严重隐患</text>
									<text v-if="item.hiddenDangerLevel === '2'" style="color: #FFAF41;">较大隐患</text>
									<text v-if="item.hiddenDangerLevel === '3'" style="color: #F56C6C;">重大隐患</text>
								</view>
							</view>
						</view>
						<view v-if="item.type === '2' || item.type === '0'" class="content-text">
							<view class="content-camera">
								<view style="display: inline-block;" 
									v-for="(subItem,subIndex) in item.type === '2' ? item.disposalFileList : item.attachmentList " 
									:key="subIndex">
									<view v-if="subItem">
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
							</view>
						</view>
						<view v-if="item.type === '0'" class="content-text">
							<view>
							<view  class="audio-list" v-for="(subItem,subIndex) in item.recordingList" :key="subIndex">
								<view v-if="subItem" class="audio-list audio-left" @click="playRecording(subIndex)">
									<image v-if="playIndex === subIndex"
										style="width: 30rpx; height: 34rpx; margin-right: 6rpx;" 
										src= "../../static/images/gaojing/play.gif" mode="scaleToFill"></image>
									<image v-else src="../../static/images/gaojing/luyin.png" mode="scaleToFill"
										style="width: 24rpx; height: 34rpx; margin-right: 12rpx;" >
									</image>
									<view style="width: 60rpx"></view>
								</view>
							</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 视频弹窗 playsinline -->
			<uni-popup ref="popup" type="center">
				<video style="height: 420rpx; width: 700rpx;" :src="playVideoUrl" 
				controls="true" object-fit="cover" playsinline></video>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, onUnmounted } from 'vue';
	import { apiGetHiddenDangerLog } from '@/api/apis.js';
	import { onLoad } from '@dcloudio/uni-app';
	import { imgRequestHeader } from '@/config.js';
	
	const HiddenDangerId = ref('');
	const logList = ref([]);
	const playVideoUrl = ref(''); //视频播放地址
	const popup = ref('');
	const imgRequestHead = imgRequestHeader.URL; //初始化图片请求头部地址
	const audioContext = uni.createInnerAudioContext(); //创建音频上下文
	const playIndex = ref(null);
	const recordingList = ref([]);
	// const progressWidth = ref([]);
	
	onLoad((e) => {
		HiddenDangerId.value = e.id;
		getHiddenDangerLog();
	})
	
	//日志数据请求
	const getHiddenDangerLog = async () => {
		let res = await apiGetHiddenDangerLog({
			hiddenDangerId: HiddenDangerId.value,
			pageSize: 999
		});
		logList.value = res.data.records;
		recordingList.value = logList.value[0].recordingList;
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
	
	//播放录音
	const playRecording = (index) => {
		audioContext.stop();
		if (playIndex.value === index) {
				playIndex.value = '';
		} else {
			playIndex.value = index;
			audioContext.src = imgRequestHead + recordingList.value[index];
			audioContext.play();
			// 播放结束
			audioContext.onEnded(() => {
				playIndex.value = '';
			});
		}
	};
	
	function toBack() {
		uni.navigateBack();
	}

	onUnmounted(() => {
		audioContext.destroy();
	});
	
</script>

<style scoped lang="scss">
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
	
	.content {
		padding: 24rpx;
		.content-title {
			display: flex;
			justify-content: left;
			align-items: center;
			.circle-icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 24rpx;
				border-radius: 15rpx;
				background-color: #D4D8DC;
			}
			.title {
				font-weight: bold;
				font-size: 28rpx;
				color: #384159;
			}
		}
		.line-left {
			margin-left: 14rpx;
			padding: 32rpx 0 30rpx 38rpx;
			border-left: 2rpx solid #F0F3F6;
			.content-text {
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				.part-left {
					color: #8F91A1;
				}
				.part-right {
					color: #2F2F46;
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
				}
			}
		}
	}

</style>
