<template>
	<view class="container">
		<view class="userInfo-bg">
			<view class="userInfo">
				<view class="avatar">
					<image class="sub-avatar" 
							:src="avatarUrl"
							@error="loadImageError"
							mode="aspectFit">
					</image>
				</view>
				<view class="user-info">
					<view class="user-naem">
						{{userInfo.nickName}}
					</view>
					<view class="user-phone">
						{{userInfo.phonenumber}}
					</view>
				</view>
			</view>
		</view>
	
		<view class="container-main">
			<view class="updatepsw">
			<view class="container-row" @click="toChangePassword">
				<view class="list-left">
					<image style="width: 46rpx; height: 50rpx;" src="../../static/images/me/password.png" mode="scaleToFill"></image>
					<text class="text-style">修改密码</text>
				</view>
				<image style="width: 16rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image>
			</view>
			</view>
			<view class="container-row">
				<view class="list-left">
					<image style="width: 46rpx; height: 50rpx;" src="../../static/images/me/update.png" mode="scaleToFill"></image>
					<text class="text-style">当前版本</text>
				</view>
				<view class="version-info">
					<text style="font-size: 28rpx; color: #384159;">V1.0.0</text>
				</view>
			</view>
			<view class="container-row">
				<view class="login-out" @click="logout">
				<view class="list-left">
					<image style="width: 46rpx; height: 50rpx;" src="../../static/images/me/exit.png" mode="scaleToFill"></image>
					<text class="text-style">退出</text>
				</view>
				</view>
			</view>
		</view>
		<view class="bottom-info">
			当前版本 V1.0.0 
		</view>
  </view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { apiGetUserInfo } from '@/api/apis.js';
	import { PROJECTID, imgRequestHeader } from '@/config.js';
	
	const popup = ref(null);
	const userInfo = ref([]);
	const avatarUrl = ref('');
	const HeaderUrl = imgRequestHeader.URL;
	
	//获取用户信息
	const getUserInfo = async ()=>{
		let res = await apiGetUserInfo();
		userInfo.value = res.user;
		avatarUrl.value = HeaderUrl + userInfo.value.avatar;
	}
	//图片加载失败时显示默认头像
	const loadImageError = () => {
      avatarUrl.value = '../../static/images/contacts/touxiang.png';
    };
	
	//跳转修改密码
	function toChangePassword() {
		uni.navigateTo({
			url:'/pages/user/changePassword'
		})
	}
	
	//退出登录
	const logout = () => {
		uni.showModal({
			title: '提示',
			content: '确定要退出吗？',
			success: (res) => {
				if (res.confirm) {
					// 清除存储中的token和用户信息
					uni.removeStorageSync('publicKey');
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
					uni.reLaunch({ // 跳转到登录页面
						url: '/pages/login/login'
					});
				} 
			}
		});
	};
	getUserInfo();
</script>

<style scoped lang="scss">
	.userInfo-bg {
		height: 414rpx;
		background-image: url('../../static/images/me/mebg.png');
		background-size: 100% 100%;
		background-repeat: no-repeat; 
		.userInfo {
			padding-top: 170rpx;
			margin-left: 48rpx;
			height: 160rpx;
			display: flex;
			justify-content: left;
			align-items: center;
			.avatar {
				height: 160rpx;
				width: 160rpx;
				border-radius: 50%;
				background-color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				.sub-avatar{
					height: 160rpx;
					width: 160rpx;
					border-radius: 50%;
				}
			}
			.user-info {
				margin-left: 48rpx;
				.user-naem {
					font-weight: bold;
					font-size: 44rpx;
					color: #FAFAFA;
				}
				.user-phone {
					margin-top: 8rpx;
					font-weight: 400;
					font-size: 32rpx;
					color: #FAFAFA;
				}
			}
		}
	}
	
	.container-main {
		padding-top: 96rpx;
		.container-row {
			margin: 0 48rpx 72rpx 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.list-left {
				display: flex;
				justify-content: left;
				align-items: center;
				.text-style {
					height: 50rpx;
					margin-left: 48rpx;
					font-size: 32rpx;
					line-height: 50rpx;
					color: #384159;
				}
			}
			.version-info {
				display: flex;
				justify-content: left;
				align-items: center;
				.version-icon {
					margin-right: 10rpx;
					width: 80rpx;
					height: 32rpx;
					font-size: 20rpx;
					line-height: 32rpx;
					color: #FAFAFA;
					text-align: center;
					background-color: #F56C6C;
					border-radius: 10rpx;
				}
			}
			.login-out:active {
				opacity: 0.7;
			}
		}
		.updatepsw:active {
			opacity: 0.7;
		}
	}
	
	.popup-box {
		width: 600rpx;
		height: 668rpx;
		border-radius: 16rpx;
		background-color: #FAFAFA;
		.up-bg {
			width: 600rpx;
			height: 180rpx;
			background-image: url('../../static/images/me/updated.png');
			background-size: 100% 100%;
			background-repeat: no-repeat; 
			display: flex;
			align-items: center;
			.popup-version-info {
				margin-left: 328rpx;
				.find-version {
					margin-bottom: 8rpx;
					font-weight: bold;
					font-size: 40rpx;
					color: #FAFAFA;
				}
				.version-number {
					font-weight: bold;
					font-size: 28rpx;
					color: #FAFAFA;
				}
			}
		}
		.popup-content {
			padding-top: 72rpx;
			padding-left: 72rpx;
			.content-text {
				margin-bottom: 12rpx;
				font-size: 28rpx;
				color: #4F505F;
			}
		}
		.popup-but {
			margin-top: 90rpx;
			text-align: center;
			.but-img:active {
				opacity: 0.7;
			}
		}
		
		.updating-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			.updating {
				width: 276rpx;
				height: 229rpx;
				padding-top: 100rpx;
			}
			.tips-text {
				margin-top: 28rpx;
				font-size: 28rpx;
				color: #4F505F;
			}
			.progress-box {
				margin-top: 48rpx;
				width: 520rpx;
				font-weight: bold;
				font-size: 24rpx;
				color: #4F505F;
			}
		}
		
	}
	
	.bottom-info {
		height: 38rpx;
		position: fixed;
		bottom: 76rpx;
		left: 50%;
		transform: translateX(-50%);
		font-size: 28rpx;
		color: #E2E2E2;
	}
	
</style>