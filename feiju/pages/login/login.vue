<template>
	<view class="contenter">
		<view class="contenter-top">
			<view class="icon">
				<image style="width: 150rpx; height: 180rpx;" src="../../static/images/login/logo.png" mode="scaleToFill"></image>
			</view>
			<view class="title">
				<image style="width: 480rpx; height: 70rpx;" src="../../static/images/login/title.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="login-box">
			<view class="userName">
				<image style="width: 34rpx; height: 40rpx;" src="../../static/images/login/user.png" mode="scaleToFill"></image>
				<input class="login-input" type="text" v-model="username" placeholder="账号" />    
			</view>
			<view class="passWord">
				<image style="width: 34rpx; height: 40rpx;" src="../../static/images/login/password.png" mode="scaleToFill"></image>
				<input class="login-input" type="password" v-model="password" placeholder="密码" />
			</view>
			<view class="login-checkbox">
				<label style="margin-left: 8rpx;" @click="changeRemember">
					<checkbox :checked="remember" color="#3399FF" style="transform:scale(0.7)"/>记住密码
				</label>
				<label style="margin-left: 40rpx;" @click="changeLogin">
					<checkbox :checked="autoLogin" color="#3399FF" style="transform:scale(0.7)"/>自动登录
				</label>
			</view>
			<view class="login-button" @click="login">
				<image style="width: 674rpx; height: 136rpx;" src="../../static/images/login/button.png" mode="scaleToFill"></image>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, onMounted} from 'vue';
	import { mapActions } from 'vuex';
	import { rsaEncrypt, rsaDecrypt } from '@/utils/rsa';
	import { BASE_URL } from '@/config.js';
	
	const username = ref('');
	const password = ref('');
	const publicKey = ref('');
	let encryptPassword = ref('');
	const remember = ref(false);
	const autoLogin = ref(false);

	// 读取本地存储中的用户名和密码
	onMounted(() => {
	  const savedAutoLogin = uni.getStorageSync('autoLogin');
	  const savedUsername = uni.getStorageSync('username');
	  const savedPassword = uni.getStorageSync('password');
	  // console.log(savedAutoLogin);
	  if (savedUsername && savedPassword) {
	    username.value = savedUsername;
	    password.value = savedPassword;
	    remember.value = true;
	  }
	   if (savedAutoLogin) {
			autoLogin.value = true;
		}else {
			autoLogin.value = false;
		}
	});
	 
	// 处理记住密码复选框的变化
	function changeRemember() {
		remember.value = !remember.value;
	}
	// 处理自动登录复选框的变化
	function changeLogin() {
		autoLogin.value = !autoLogin.value;
	}
	 
	
	// 定义登录方法
	const login = async () => {
		if(!username.value){
			infoTips('请输入账号')
			return;
		}
		if(!password.value){
			infoTips('请输入密码')
			return;
		}
	  try {
	    const resKey = await uni.request({
	      url: BASE_URL + '/publicKey',
	      method: 'GET',
	    });
		publicKey.value = resKey.data.publicKey;
		uni.setStorageSync('publicKey', publicKey.value);
		// 密码加密
		encryptPassword = rsaEncrypt(password.value, publicKey.value);
		const res = await uni.request({
		  url: BASE_URL + '/login',
		  method: 'POST',
		  data: {
		    username: username.value,
		    password: encryptPassword
		  }
		});
	
	    if (res.data.code === 200) {
			// 登录成功，保存token和用户信息
			const token = res.data.token;
			uni.setStorageSync('token', token);
			if (remember.value) {
			    uni.setStorageSync('username', username.value);
			    uni.setStorageSync('password', password.value);
			  } else {
			    uni.removeStorageSync('username');
			    uni.removeStorageSync('password');
			  }
			  if (autoLogin.value) {
				  uni.setStorageSync('autoLogin', autoLogin.value);
				  uni.setStorageSync('username', username.value);
				  uni.setStorageSync('password', password.value);
			  }else {
				  uni.removeStorageSync('autoLogin');
			  }
		
	      uni.showToast({
	        title: '登录成功',
	        icon: 'success'
	      });
	      // 跳转到首页
	      uni.switchTab({
	      	url:'/pages/index/index',
	      });
	    } else {
	      uni.showToast({
	        title: '登录失败：' + res.data.msg,
	        icon: 'none',
	      });
	    }
	  } catch (error) {
	    console.error('登录请求失败：', error);
	    uni.showToast({
	      title: '网络错误',
	      icon: 'none'
	    });
	  }
	};
	
	// 消息提示封装
	function infoTips(mass){
		uni.showToast({
			title: mass,
			icon: 'none',
			duration: 2000
		});
	}
	
</script>

<style scoped lang="scss">
	.contenter-top {
		height: 605rpx;
		display: flex;
		flex-direction: column; /* 设置垂直布局 */ 
		align-items: center;
		justify-content: center;
		background-image: url("../../static/images/login/bg.png");
		background-size: 100% 100%;
		background-repeat: no-repeat;
		.icon {
			width: 150rpx; 
			height: 180rpx;
		}
		.title {
			width: 480rpx; 
			height: 70rpx;
			margin-top: 48rpx;
		}
	}
	
	.login-box {
		display: flex;
		align-items: center;
		flex-direction: column; 
		.userName {
			width: 616rpx;
			height: 70rpx;
			margin-top: 82rpx;
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #2C5ECC;
			.login-input{
				width: 100%;
				margin-left: 18rpx;
			}
		}
		.passWord {
			width: 616rpx;
			height: 70rpx;
			margin-top: 80rpx;
			padding-left: 30rpx;
			display: flex;
			align-items: center;
			border-bottom: 2rpx solid #F0F2F2;
			.login-input{
				width: 100%;
				margin-left: 18rpx;
			}
		}
		.login-checkbox {
			width: 616rpx;
			margin-top: 24rpx;
			font-size: 28rpx;
			color: #8F91A1;
			display: flex;
			align-items: center;
			justify-content: left;
		}
		
		.login-button {
			width: 674rpx;
			height: 136rpx;
			margin-top: 96rpx;
		}
		.login-button:active {
			opacity: 0.7;
		}
		
		
	}
		
</style>
