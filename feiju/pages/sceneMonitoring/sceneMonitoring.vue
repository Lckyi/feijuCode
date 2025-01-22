<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="content-topbar">
			<view class="top-left" @click="toBack">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				场景监控
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="container">
			<scroll-view scroll-y="true" style="height: calc(100vh - 250rpx);">
				<view v-for="(item,index) in scenNameList" :key="item.levelId">
					<view class="Level">
						<text class="Level-title">{{item.levelName}}</text>
						<view class="Level-list">
							<view class="Level-item" v-for="(subItem,sunIndex) in item.children" @click="toSceneDetails(subItem.sceneId,subItem.sceneName)">
								<view class="scene-img">
									<image style="width: 112rpx; height: 112rpx;" src="../../static/images/changjing/icon.png" mode="scaleToFill"></image>
								</view>
								<view class="scene-name">
									{{subItem.sceneName}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { apiGetSceneName, apiGetEquipmentInfo } from '@/api/apis.js'
	import { PROJECTID } from '@/config.js';
	
	const scenNameList = ref([]);
	
	const getSceneName = async () => {
		let res = await apiGetSceneName({
			projectId: PROJECTID.globalProjectId
		});
		scenNameList.value = res.data.children;
	}
	
	//返回
	const toBack = () => {
		uni.navigateBack();
	};
	
	//跳转到场景查看
	function toSceneDetails(id,name) {
		uni.navigateTo({
			url:`/pages/sceneMonitoring/sceneDetails?id=${id}&name=${name}`
		})
	}
	
	getSceneName();
	
</script>

<style scoped lang="scss">
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
		padding: 0 12rpx 32rpx 12rpx;
		.Level {
			margin-top: 32rpx;
			.Level-title {
				margin-left: 24rpx;
				font-weight: bold;
				font-size: 28rpx;
				color: #4F505F;
			}
			.Level-list {
				.Level-item {
					width: 218rpx;
					height: 218rpx;
					margin: 24rpx 12rpx 0 12rpx;
					display: inline-block;
					text-align: center;
					border-radius: 16rpx;
					background-color: #fff;
					box-shadow: 0rpx 2rpx 6rpx 2rpx rgba(0,0,0,0.16);
					.scene-img {
						margin-top: 12rpx;
					}
					.scene-name {
						font-weight: bold;
						font-size: 28rpx;
						color: #4F505F;
					}
				}
				.Level-item:active {
					opacity: 0.7;
				}
			}
		}
	}

</style>
