<template>
	<view style="width: 100vw; height: 100vh; background-color: #F5F6F8;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toBack">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				隐患退回
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="content">
			<view class="content-title">
				<text>退回原因</text><text style="color: #F56C6C;">*</text>
			</view>
			<view class="content-text">
				<textarea class="txtarea" v-model="reviewReason" cols="30" rows="10" placeholder="请输入"></textarea>
			</view>
		</view>
		<view class="bottom-but" @click="submitBack">
			确 定
		</view>
		<uni-popup ref="successPopup" type="message">
			<uni-popup-message type="success" message="成功退回" :duration="1000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { apiPutDisposalAudit } from '@/api/apis.js';
	import { onLoad } from '@dcloudio/uni-app';
	
	const hiddenTroubleId = ref('');
	const reviewReason = ref('');
	const successPopup = ref('');
	
	onLoad((e) => {
		hiddenTroubleId.value = e.id;
	})
	
	const submitBack = async () => {
		if(!reviewReason.value) {
			infoTips("请填写退回原因")
			return;
		}
		try{
			let res = await apiPutDisposalAudit({
				adopt: false,
				id: hiddenTroubleId.value,
				reviewRejectReason: reviewReason.value
			})
			if(res.code === 200){
				successPopup.value.open();
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}else {
				infoTips("退回失败")
			}
		}catch(err) {
			infoTips(err.msg);
		}
	}
	// 消息提示封装
	function infoTips(mass){
		uni.showToast({
			title: mass,
			icon: 'none',
			duration: 2000
		});
	}
	
	function toBack() {
		uni.navigateBack();
	}
	
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
	.content {
		background-color: #fff;
		margin: 32rpx 24rpx;
		padding: 24rpx;
		.content-title {
			margin-bottom: 12rpx;
			font-size: 28rpx;
			color: #4F505F;
		}
		.content-text {
			margin-right: 68rpx;
			.txtarea {
				width: 100%;
				padding: 16rpx 30rpx;
				background-color: #FDFDFF;
				border-radius: 8rpx;
				border: 2rpx solid #F6F7FA;
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

</style>
