<script setup>
	import { ref, reactive, onMounted} from 'vue';
	import { mapActions } from 'vuex';
	import { rsaEncrypt, rsaDecrypt } from '@/utils/rsa';
	import { onLaunch } from '@dcloudio/uni-app';
	import { useUpdateManager } from '@/utils/update.js'//导入更新方法
	import { BASE_URL } from '@/config.js'
	
	const token = uni.getStorageSync('token');
	const password = uni.getStorageSync('password');
	const username = uni.getStorageSync('username');
	const saveautoLogin = uni.getStorageSync('autoLogin');
	const { checkForUpdate } = useUpdateManager();//更新方法
	
	onLaunch(() => {
		if (saveautoLogin) {
			autoLogin();
		} else {
			uni.redirectTo({
				url: '/pages/login/login'
			});
			 console.log('No token found');
		}
		
		checkForUpdate();
	});
	
	onMounted(() => {
	  getLocation();
	});
			
	const autoLogin = async () => {
		try {
		   const publicKey = uni.getStorageSync('publicKey');
			// 密码加密
			const encryptPassword = rsaEncrypt(password, publicKey);
			const res = await uni.request({
			  url: BASE_URL + '/login',
			  method: 'POST',
			  data: {
				username: username,
				password: encryptPassword
			  }
			});
			if (res.data.code === 200) {
				// 登录成功，保存token
				const token = res.data.token;
				uni.setStorageSync('token', token);
				uni.switchTab({
					url:'/pages/index/index',
				});
			} else {
				// 验证失败，清除 token 并跳转到登录页面
				uni.removeStorageSync('token');
				uni.redirectTo({
					url: '/pages/login/login'
				});
			}
		} catch (error) {
			//请求失败，清除 token 并跳转到登录页面
			uni.removeStorageSync('token');
			uni.redirectTo({
				url: '/pages/login/login'
			});
		}
	};
	
	const latitude = ref(null);
	const longitude = ref(null);
	
	    const getLocation = () => {
	      uni.getLocation({
	        type: 'wgs84',
	        success(res) {
	          latitude.value = res.latitude;
	          longitude.value = res.longitude;
	
	          // 发送位置信息到 WebView
	          const webViewContext = uni.createWebViewContext('myWebView');
	          webViewContext.postMessage({
	            data: {
	              latitude: res.latitude,
	              longitude: res.longitude,
	            },
	          });
	        },
	        fail() {
	          uni.showToast({
	            title: '获取位置失败',
	            icon: 'none',
	          });
	        },
	      });
	    };
	    

</script>

<style>
	
</style>
