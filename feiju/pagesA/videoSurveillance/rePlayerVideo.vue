<template>
	<view style="width: 100vw; height: 100vh; background-color: #F5F6F8;">
		<view class="bg-img">
			<view class="status_bar"></view>
			<view class="content-topbar">
				<view class="top-left" @click="toBack">
					<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
				</view>
				<view class="top-center">
					监控视频播放
				</view>
				<view class="top-right"></view>
			</view>
		</view>
		
		<view class="video-box">
			<view class="video-info">
				<view class="video-title">
					{{videoInfo.videoName}}
				</view>
				<view v-if="videoInfo.isReplay" class="replay-display">
					<uni-datetime-picker type="datetimerange" @change="selectedRange">
						<text class="select-but">选集</text>
					</uni-datetime-picker>
				</view>
			</view>
			<ezplayer
				:id="videoInfo.videoId"
				:accessToken="videoInfo.accessToken"
				:url="videoInfo.videoSrc"
				width="100%"
				height="220"
				bind:handleError="handleError"
			/>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onShow, onLoad } from '@dcloudio/uni-app';
	
	const rePlayerUrl = ref(null);
	let startTime = ref(null);
	let endtTime = ref(null);
	const videoInfo = ref([]);
	
	onLoad((options) => {
		if (options.videoInfo) {
			try {
				// 从 JSON 字符串解析对象
				videoInfo.value = JSON.parse(decodeURIComponent(options.videoInfo));
			} catch (error) {
				console.error('Error parsing video info:', error);
			}
		}
	})
	
	//选择视频回放时间
	function selectedRange(e){
		startTime.value = e[0];
		endtTime.value = e[1];
		if(compareDates(startTime.value, endtTime.value)){
			videoInfo.value.videoSrc = "ezopen://open.ys7.com/" + videoInfo.value.videoNum + "/2/local/" + startTime.value + "/" + endtTime.value;
		}else{
			uni.showToast({
				title: '日期必须是同一天',
				icon: 'none',
				duration: 2000
			});
		}
	}
	
	//比较日期(保证日期为同一天)
	function compareDates(dateStr1, dateStr2) {
	    const date1 = new Date(dateStr1);
	    const date2 = new Date(dateStr2);
	    const year1 = date1.getFullYear();
	    const month1 = date1.getMonth() + 1; 
	    const day1 = date1.getDate();
	    const year2 = date2.getFullYear();
	    const month2 = date2.getMonth() + 1; 
	    const day2 = date2.getDate();
	    return year1 === year2 && month1 === month2 && day1 === day2;
	}
	
	//返回
	const toBack = () => {
		uni.navigateBack();
	};
	
</script>

<style scoped lang="scss">
	.bg-img {
		background-image: url('../../static/images/shipin/bg-video.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;  
	}
	.status_bar {
		height: 85px;
		width: 100%;
	}
	.content-topbar {
		width: 100%;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
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
	.video-box{
		.video-info{
			height: 64rpx;
			padding: 0 24rpx;
			display: flex;
			font-size: 24rpx;
			color: #FAFAFA;
			align-items: center;
			justify-content: space-between;
			background-color: #2E2E2E;
			.replay-display{
				display: flex;
				align-items: center;
				justify-content: space-between;
				z-index: 1002;
				color: #FFFFFF;
			}
			.select-but:active{
				opacity: 0.7;
			}
		}
	}

</style>
