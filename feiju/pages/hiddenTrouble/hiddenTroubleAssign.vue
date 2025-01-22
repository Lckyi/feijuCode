<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toSubHiddenTrouble">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				隐患判断
			</view>
			<view class="top-right"></view>
		</view>
		
		<view class="container">
			<view class="disposal">
				<text>处置方式</text><text style="color: #F56C6C;">*</text>
				<uni-data-checkbox v-model="disposalWay" :localdata="range" @change="changeCheckbox"></uni-data-checkbox>
			</view>
			<view class="disposal">
				<text>隐患等级</text><text style="color: #F56C6C;">*</text>
				<view style="margin-top: 12rpx;">
					<picker @change="handlePickerChange" :value="selectedIndex" :range="options">
						<view class="picker-display">
							 <view class="uni-input">{{ options[selectedIndex] }}</view>
							 <view style="margin-right: 20rpx;"><image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
						</view>
					</picker>
				</view>
				<view v-show="disposalWay === 0">
					<view class="annex-upload">
						<text class="annex-title">处置人</text><text style="color: #F56C6C;">*</text>
						<view style="margin-top: 12rpx;">
							<view class="picker-display" @click="search">
								 <view class="uni-input">{{personneName}}</view>
								 <view style="margin-right: 20rpx;"><image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
							</view>
						</view>
					</view>
					<view class="annex-upload">
						<text class="annex-title">处置时限</text><text style="color: #F56C6C;">*</text>
						<view style="margin-top: 12rpx;">
							<picker mode="date" @change="bindDateChange">
								<view class="picker-display">
									<view class="uni-input">{{disposalDate}}</view>
									<view style="margin-right: 20rpx;"><image style="width: 17rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
								</view>
							</picker>
						</view>
					</view>
					<view class="annex-upload">
						<text class="annex-title">处置建议</text>
						<view style="margin-top: 12rpx;">
							<textarea cols="30" rows="10" 
							v-model="suggestion"
							placeholder = '请输入'
							style="width: 100%; 
							background-color: #FDFDFF; 
							border: 2rpx solid #F6F7FA;"></textarea>
						</view>
					</view>
				</view>
			</view>
			<view class="bottom-but" @click="submitInsert">
				确 定
			</view>
			<uni-popup ref="deletePopup" type="message">
				<uni-popup-message type="success" message="判断成功" :duration="1000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { apiPutHiddenDanger } from '@/api/apis.js';
	
	const disposalWay = ref(0);
	const disposalId = ref('');
	const deletePopup = ref('');//操作成功弹窗变量
	const selectedIndex = ref(0); //隐患等级下标
	const disposalDate = ref('日期选择');
	const suggestion = ref('');//处置建议
	const personnelId = ref('');//指派人员id
	const personneName = ref('请选择');//指派人员姓名
	const range = reactive([{"value": 0,"text": "发起运维指派"},{"value": 1,"text": "无需处置"}]);//单选框变量
	const options = ref(['请选择', '一般隐患', '严重隐患','较大隐患','重大隐患']);//隐患等级选项
	const params = {};
	
	onLoad((e) => {
		disposalId.value = e.id;
		params.id = disposalId.value;
	})
	//接受搜索页面传输过来的/指派人员id
	onShow(() => {
		uni.$on('personnel',res => {
			if (res) {
				personnelId.value = res.id;
				personneName.value = res.name;
			}
		});
	})
	
	//提交填写表单
	const submitInsert = async ()=> { 
		if (!params.id) {
			infoTips('隐患id为空');
			return;
		}
		if(disposalWay.value === 1){
			if(selectedIndex.value < 1) {
				infoTips('请选择隐患等级');
				return;
			}
			params.level = selectedIndex.value - 1;
			params.state = 3;
		}else {
			if(selectedIndex.value < 1 ) {
				infoTips('请选择隐患等级');
				return;
			}
			if(personneName.value === '请选择' ) {
				infoTips('请选择指派人员');
				return;
			}
			if(disposalDate.value==='日期选择') {
				infoTips('请选择处置时限');
				return;
			}
			params.disposer = personnelId.value;
			params.closingDate = disposalDate.value;
			params.level = selectedIndex.value - 1;
			params.state = 1;
			params.disposalSuggestion = suggestion.value;
		}
		let res = await apiPutHiddenDanger(params);
		if(res.code === 200) {
			deletePopup.value.open();
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		}else {
			infoTips('指派失败');
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
	
	//隐患等级处理方法
	const handlePickerChange = (e) => {
	  selectedIndex.value = e.detail.value; // 更新选中项的索引
	  // console.log(selectedIndex.value - 1);
	};
	//日期选择方法
	const bindDateChange = (e) => {
		disposalDate.value = e.detail.value;
	}
	
	//跳转到搜索页面
	function search() {
		if (disposalWay.value === 1) return;
		uni.navigateTo({
			url:'/pages/hiddenTrouble/nameSearch'
		})
	}
		
	//返回
	const toSubHiddenTrouble = () => {
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
		.disposal {
			margin: 24rpx;
			padding: 24rpx;
			font-size: 28rpx;
			color: #4F505F;
			border-radius: 16rpx;
			background-color: #fff;
			::v-deep .uni-data-checklist .checklist-group {
				display: flex;
				flex-direction: column;
			}
			::v-deep .uni-data-checklist .checklist-group .checklist-box {
				height: 72rpx;
				padding-left: 20rpx;
				border-radius: 8rpx;
				margin-right: 0px;
				background-color: #FDFDFF;
				border: 2rpx solid #F6F7FA;
			}
			::v-deep .uni-data-checklist .checklist-group .checklist-box.is--default.is-checked {
				border: 2rpx solid #95B6FF;
				background-color: #F5F8FF;
			}
			
			.picker-display {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-radius: 8rpx;
				background-color: #FDFDFF;
				border: 2rpx solid #F6F7FA;
				.uni-input {
					height: 72rpx;
					padding-left: 20rpx;
					text-align: left;
					line-height: 72rpx;
					color: #C0C4CC;
					margin-right: 0px;
				}
			}
			.annex-upload {
				margin-top: 24rpx;
				.annex-title {
					font-size: 28rpx;
					color: #4F505F;
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
			
	}
	
</style>
