<template>
	<view style="width: 100vw; height: 100vh; background-color: #F5F6F8;">
		<view class="bg-img">
			<view class="status_bar"></view>
			<view class="content-topbar">
				<view class="top-left" @click="toBack">
					<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
				</view>
				<view class="top-center">
					视频监控中心
				</view>
				<view class="top-right"></view>
			</view>
		</view>
		<view class="container">
			<scroll-view v-if="videoInfoList.length > 0" scroll-y="true" style="height: calc(100vh - 250rpx);">
				<view class="video-box" v-for="(item,index) in videoInfoList" :key="item.videoId">
					<view class="video-cover">
						<image style="width: 100%; height: 356rpx;" @click="toLive(item)"
						src="../../static/images/shipin/cover.png" mode="aspectFill"></image>
					</view>
					<view class="video-info">
						<view class="video-title">
							{{item.videoName}}
						</view>
						<view class="replay-display">
							<image class="video-replayer" @click="toReplayer(item)"
							src="../../static/images/shipin/resume.png" mode="aspectFill"></image>
							<image class="video-replayer" style="margin-left: 24rpx;" @click="toLive(item)"
							src="../../static/images/shipin/full.png" mode="aspectFill"></image>
						</view>
					</view>
				</view>
			</scroll-view>
			<view v-else class="data-null">
				<image style="width: 460rpx; height: 412rpx;" src="../../static/images/gaojing/null.png" mode="scaleToFill"></image>
				暂无数据
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive } from 'vue';
	import {apiGetAccessToken, apiGetTreeVideo} from '@/api/apis.js';
	import { PROJECTID } from '@/config.js';
	
	const accessToken = ref('');
	const videoSrc = ref('');
	const sceneName = ref([]);
	const videoInfoList = ref([]);
	
	//获取萤石token
	const getAccessToken = async () =>{
		let res = await apiGetAccessToken({
			appKey: '3faeec72eb124975b6a92147542fa189',
			appSecret: 'b1efca2432e67aa7a41dfb0427a45883'
		})
		accessToken.value = res.data.accessToken;
		getTreeVideo();
	} 
	
	//获取视频列表
	const getTreeVideo = async()=> {
		let res = await apiGetTreeVideo({
			projectId: PROJECTID.globalProjectId
		});
		sceneName.value = res.data.children;
		// 取出监控名称id和编号
		if(sceneName.value.length < 1) return;
		sceneName.value.forEach(item => {
			if(item.children.length > 0) {
				item.children.forEach(childItem => {
					if(childItem.children.length > 0){
						childItem.children.forEach(subChildItem => {
							let videoBject = {
								videoSrc: "ezopen://open.ys7.com/" + subChildItem.serialNumber + "/2/live",
								videoNum: subChildItem.serialNumber,
								videoName: subChildItem.itemName,
								videoId: subChildItem.itemId
							}
							videoInfoList.value.push(videoBject);
						})
					}
				})
			}
		});
	}

	//跳转到监控直播
	function toLive(playerInfo){
		playerInfo.accessToken = accessToken.value;
		toVideoPlayer(playerInfo)
	}
	
	//跳转到监控回放
	function toReplayer(playerInfo){
		const now = new Date();
		const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
		const rePlayerUrl = "ezopen://open.ys7.com/" + playerInfo.videoNum + "/2/local/" + timeFormat(startOfDay) + "/" + timeFormat(now);
		let videoInfo = {
			accessToken: accessToken.value,
			videoSrc: rePlayerUrl,
			videoName: playerInfo.videoName,
			videoNum: playerInfo.videoNum,
			videoId: playerInfo.videoId,
			isReplay: true
		};
		toVideoPlayer(videoInfo);
	}
	
	//播放视频
	function toVideoPlayer(info){
		const videoInfoString = encodeURIComponent(JSON.stringify(info));
		uni.navigateTo({
			url:'/pagesA/videoSurveillance/rePlayerVideo?videoInfo=' + videoInfoString
		})
	}
	
	// 定义日期格式
	const timeFormat = (now) =>{
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	} 

	//返回
	const toBack = () => {
		uni.navigateBack();
	};
	
	getAccessToken();
	
</script>

<style scoped lang="scss">
	.data-null {
		padding-top: 300rpx;
		color: #8F91A1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
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
	
	.container {
		.video-box{
			margin-bottom: 20rpx;
			.video-cover{
				height: 356rpx;
			}
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
					.video-replayer{
						width: 32rpx; 
						height: 32rpx;
					}
					.video-replayer:active{
						opacity: 0.7;
					}
				}
			}
		}
	}
	
	
</style>
