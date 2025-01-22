<template>
	<view style="width: 100vw; height: 100vh; background-color: #F5F6F8;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toBack">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				修改密码
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="container">
			<view class="container-row">
				<view class="title">
					旧密码<text style="color: #F56C6C;">*</text>
				</view>
				<uni-easyinput type="password" :focus="true" v-model="oldPwd" :clearable="false" placeholder="请输入"></uni-easyinput>
			</view>
			<view class="container-row">
				<view class="title">
					新密码<text style="color: #F56C6C;">*</text>
				</view>
				<uni-easyinput type="password" v-model="newPwd" :clearable="false" placeholder="请输入"></uni-easyinput>
			</view>
			<view class="but" style="border-radius: 48rpx;" @click="submitUpdate">
				确 认
			</view>
			<uni-popup ref="updatePopup" type="message">
				<uni-popup-message type="success" message="修改成功" :duration="1000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { rsaEncrypt, rsaDecrypt } from '@/utils/rsa';
	import { apiUpdatePssword } from '@/api/apis.js';
	
	const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d).{6,20}$/; //包含数字和字母长度为6~20个字符
	const oldPwd = ref('');
	const newPwd = ref('');
	const updatePopup = ref('');
	
	//提交密码修改请求
	const submitUpdate = async () => {
		if(!oldPwd.value){
			infoTips('请输入旧密码');
			return;
		}
		if(!newPwd.value){
			infoTips('请输入新密码');
			return;
		}
		if(!passwordFormat.test(newPwd.value)){
			infoTips('密码需包含数字和字母长度为6~20个字符');
			return;
		}
		try{
			let res = await apiUpdatePssword({
				oldPassword:oldPwd.value,
				newPassword:newPwd.value
			});
			if(res.code === 200){
				updatePopup.value.open();
				setTimeout(() => {
					uni.removeStorageSync('publicKey');
					uni.removeStorageSync('token');// 清除存储中的token和用户信息
					uni.removeStorageSync('userInfo');
					uni.reLaunch({ // 跳转到登录页面
						url: '/pages/login/login'
					});
				},900)
			}else {
				infoTips('请输入正确的旧密码');
			}
		}catch(err) {
			infoTips(err.msg);
		}
	}
	
	// 消息提示
	function infoTips(mass){
		uni.showToast({
			title: mass,
			icon: 'none',
			duration: 2000
		});
	}
	
	//返回
	const toBack = () => {
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
		margin: 24rpx;
		padding-top: 24rpx;
		background-color: #fff;
		border-radius: 16rpx;
		.container-row {
			padding: 0 24rpx 24rpx 24rpx;
			.title {
				margin-bottom: 12rpx;
				font-size: 28rpx;
				color: #4F505F;
			}
		}
		
		.but {
			height: 80rpx;
			position: fixed; 
			bottom: 72rpx; 
			left: 48rpx;
			right: 48rpx;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
			line-height: 80rpx;
			background-color: #5187FF;
		}
		.but:active {
			opacity: 0.7;
		}
		
	}
</style>
