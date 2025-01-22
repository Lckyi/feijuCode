<template>
	<view class="status_bar"></view>
	<view class="content">
		<image style="width: 100%; height: 100%; position: fixed; z-index: -1; top: 0;" src="../../static/images/view/bg.png" mode="scaleToFill"></image>
		<!-- 头部 -->
		<view class="content-topbar">
			<view class="project-options">
				<picker mode="selector" :range="projectNames" @change="bindPickerChange">
					<view class="project-show">{{ selectedText }}
					<image style="margin-left: 12rpx; margin-bottom: 6rpx; width: 12rpx; height: 9rpx;" src="../../static/images/topbar/down.png" mode="scaleToFill"></image>
					</view>
				</picker>
			</view>
			<view class="content-topbar--right">
				<view class="camera" @click="toPhotographed">
					<image style="width: 40rpx; height: 40rpx;" src="../../static/images/topbar/camera.png" mode="scaleToFill"></image>
				</view>
				<view class="message_horn" @click="toAlarmPush">
					<image style="width: 40rpx; height: 40rpx;" src="../../static/images/topbar/horn.png" mode="scaleToFill"></image>
					<view v-if="sumRealTime > 99" class="superscript">99+</view>
					<view v-if="sumRealTime > 0 && sumRealTime < 100" class="superscript">{{sumRealTime}}</view>
				</view>
			</view>
		</view>
		<!-- 功能区 -->
		<view class="content-main">
			<view class="main-massage">
				<view class="massage" style="margin-right: 88rpx;">
					<view class="number">{{realTimeList.alarmNumber}}</view>
					<view class="massageName">实时报警数</view>
				</view>
				<view class="massage" style="margin-right: 88rpx;">
					<view class="number">{{realTimeList.warningNumber}}</view>
					<view class="massageName">实时预警数</view>
				</view>
				<view class="massage">
					<view class="number">{{realTimeList.dangerNumber}}</view>
					<view class="massageName">待处置隐患数</view>
				</view>
			</view>
			<view class="main-function">
				<view class="function-list">
					<view class="function-item" @click="toAlarmRecords">
						<image style="width: 60rpx; height: 60rpx;" src="../../static/images/view/gaojingjilu.png" mode="aspectFill"></image>
						<view class="function-name">
							<text>告警记录</text>
						</view>
					</view>
					<view class="function-item" @click="toInspection">
						<image style="width: 60rpx; height: 60rpx;" src="../../static/images/view/xunjianguanli.png" mode="aspectFill"></image>
						<view class="function-name">
							<text>巡检管理</text>
						</view>
					</view>
					<view class="function-item" @click="toHiddenTrouble">
						<image style="width: 60rpx; height: 60rpx;" src="../../static/images/view/yinhuanguanli.png" mode="aspectFill"></image>
						<view class="function-name">
							<text>隐患管理</text>
						</view>
					</view>
					<view class="function-item" @click="toSceneMonitoring">
						<image style="width: 60rpx; height: 60rpx;" src="../../static/images/view/changjingjiankong.png" mode="aspectFill"></image>
						<view class="function-name">
							<text>场景监控</text>
						</view>
					</view>
					<view class="function-item" @click="toVideoSurveillance">
						<image style="width: 60rpx; height: 60rpx;" src="../../static/images/view/shipinjiankong.png" mode="aspectFill"></image>
						<view class="function-name">
							<text>视频监控</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 近期隐患列表 -->
		<view class="content-hiddentrouble">
			<view class="hiddentrouble-text">近期隐患</view>
			<scroll-view v-if="hiddenDangers.length > 0" class="hiddentrouble-list" scroll-y="true">
				<view class="hiddentroubleitem" v-for="(item,index) in hiddenDangers" :key="item.id" 
				@click="toSubHiddenTrouble(item.id)">
					<view class="htitem-left">
						<view class="htitem-left-l">
							<image style="width: 100%; height: 100%;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
						</view>
						<view class="htitem-left-r">
							<view class="htitem-name">{{item.sceneName}}</view>
							<view class="htitem-info">{{item.dailyInspectionItemValue}}</view>
						</view>
					</view>
					<view class="htitem-right" :style="{ backgroundColor: getItemColor(item.state)}">
						<text v-if="item.state === '0'">待指派</text>
						<text v-else-if="item.state === '1'">待处置</text>
						<text v-else-if="item.state === '2'">处置完成</text>
						<text v-else-if="item.state === '3'">无需处置</text>
						<text v-else-if="item.state === '4'">待审核</text>
					</view>
				</view>
			</scroll-view>
			<view v-else class="data-null">
				<image style="width: 330rpx; height: 306rpx;" src="../../static/images/gaojing/null.png" mode="scaleToFill"></image>
			</view>
		</view>		
	</view>
</template>

<script setup>
	import { ref, onMounted,reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import {apiGetProject, apiGetRealTimeNum, apiGetHiddenDanger } from '@/api/apis.js';
	import { PROJECTID } from '@/config.js'; //导入项目id全局变量

	const projectList = ref([]);//项目列表数据
	const realTimeList = ref([]); //实时告警、预警和未处理数据列表
	let projectNames = ref([]);
	const projectMap = ref([]);
	const hiddenDangers = ref([]);
	let selectedText = ref('');
	let selectedIndex = ref(0);
	let sumRealTime = ref(0);
	const userInfo = ref([]);
	
	//刷新数据
	onShow(() => {
		if(PROJECTID.globalProjectId){
			getRealTimeNum(PROJECTID.globalProjectId);
			getHiddenDanger(PROJECTID.globalProjectId);
		}
	})
	
	//项目列表数据请求
	const getProject = async () => {
		try {
			let res = await apiGetProject({
				userType: 1
			});
			projectList.value = res.data;
			//获取项目名称用于显示选择
			projectList.value.forEach(item => {
			  projectNames.value.push(item.projectName);
			});
			//将项目名称和项目id转换成字典保存
			projectList.value.forEach(person => {
				projectMap[person.projectName] = person.projectId;
			});
			//默认选择第一个项目
			selectedText.value = projectNames.value[0];
			PROJECTID.globalProjectId = projectMap[selectedText.value];
			getRealTimeNum(PROJECTID.globalProjectId);
			getHiddenDanger(PROJECTID.globalProjectId);
		} catch (error) {
		    console.error("捕获到错误:", error);
		}
	}
	//项目数据选择
	function bindPickerChange(e) {
	    let index = e.detail.value;
	    selectedIndex.value = index;
	    selectedText.value = projectNames.value[index];
		PROJECTID.globalProjectId = projectMap[selectedText.value];
		getRealTimeNum(PROJECTID.globalProjectId);
		getHiddenDanger(PROJECTID.globalProjectId);
	}
	
	//实时告警、预警和未处理数据求取
	const getRealTimeNum = async (projectId)=>{
		let res = await apiGetRealTimeNum({
			projectId: projectId
		});
		realTimeList.value = res.data;
		//消息喇叭数值
		let sum = realTimeList.value.alarmNumber + realTimeList.value.warningNumber;
		sumRealTime.value = sum;
	}
	
	//近期隐患数据请求
	const getHiddenDanger = async (projectId) => {
		let now = new Date();
		let lastWeek = new Date(now);
		lastWeek.setDate(lastWeek.getDate() - 7);
		
		let res = await apiGetHiddenDanger({
			projectId: projectId,
			startDate: timeFormat(lastWeek),
			endDate: timeFormat(now)
		});
		hiddenDangers.value = res.data.records;
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
	//近期隐患列表处理
	const statusColors = {//状态到颜色的映射
		'0': '#F56C6C',
		'1': '#FFAF41',
		'2': '#61D19F',
		'3': '#9CABCB',
		'4': '#00ADB5',
	};
	// 根据状态返回颜色
	const getItemColor = (status) => {
	  return statusColors[status] || 'black'; // 如果没有匹配的状态，返回默认颜色
	};

	//跳转到隐患随手拍
	function toPhotographed() {
		uni.navigateTo({
			url:'/pages/hiddenTrouble/photographed'
		})
	}

	// 跳转到实时告警
	function toAlarmPush() {
		uni.navigateTo({
			url: '/pages/alarmPush/alarmPush'
		})
	}
	
	// 跳转到告警记录
	function toAlarmRecords() {
		uni.navigateTo({
			url: '/pages/alarmRecords/alarmRecords'
		})
	}
	
	// 跳转到巡检管理
	function toInspection() {
		uni.navigateTo({
			url: '/pages/inspection/inspection'
		})
	}
	
	//跳转到隐患管理
	function toHiddenTrouble() {
		uni.navigateTo({
			url:'/pages/hiddenTrouble/hiddenTrouble'
		})
	}
	
	//跳转到隐患详情
	function toSubHiddenTrouble(id) {
		uni.navigateTo({
			url:'/pages/hiddenTrouble/subHiddenTrouble?id=' + id
		})
	}
	
	//跳转到场景监控
	function toSceneMonitoring() {
		uni.navigateTo({
			url:'/pages/sceneMonitoring/sceneMonitoring'
		})
	}
	
	//跳转到视频监控
	function toVideoSurveillance() {
		uni.navigateTo({
			url:'/pagesA/videoSurveillance/videoSurveillance'
		})
	}
	
	getProject();
	
</script>

<style scoped lang="scss">
	
	.data-null {
		height: 400rpx;
		margin-top: 24rpx;
		color: #8F91A1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.content {
		width: 100%;
		height: 100%;
		font-family: "Microsoft YaHei", sans-serif;
		font-weight: 400;
		font-style: normal;
		text-transform: none;
		line-height: 16rpx; 
	}
	.status_bar {
		height: 90px;
		width: 100%;
	}
	.content-topbar {
		display: flex;
		height: 48rpx;
		margin: 0 24rpx;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}
	.project-show {
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #FDFDFF;
		font-size: 36rpx;
	}
	.content-topbar--right {
		width: 134rpx;
	}
	.camera {
		display: inline-block;
	}
	.camera:active {
		opacity: 0.7;
	} 
	
	.message_horn {
		display: inline-block;
		margin-left: 24rpx;
		position: relative;
	}
	/* 添加按压效果模拟按钮 */
	.message_horn:active {  
	  opacity: 0.6; 
	}  
	.superscript {
		 position: absolute;  
		  top: -10rpx; 
		  right: -10rpx; 
		  background-color: red;  
		  color: white;  
		  border-radius: 50%;  
		  min-width: 28rpx;  
		  min-height: 28rpx;  
		  display: flex;  
		  justify-content: center;  
		  align-items: center;  
		  font-size: 20rpx;  
		  font-weight: bold; 
	}
	
	.content-main {
		height: 624rpx;
		margin: 36rpx 24rpx 0rpx 24rpx;
		box-shadow: 0rpx 6rpx 20rpx 2rpx rgba(0,0,0,0.08);
		border-radius: 20rpx;
		background-image: url("../../static/images/view/bg-main.png"); 
		background-size: 100% 358rpx;  
		background-repeat: no-repeat;  
	} 
	.main-massage {
		height: 174rpx;
		padding: 0rpx 72rpx;
		display: flex;
		justify-content: center;
	}
	.massage {
		width: 144rpx;
		height: 82rpx;
		margin-top: 52rpx;
		color: #FAFAFA;
		display: inline-block;
	}
	.number {
		width: 144rpx;
		height: 32rpx;
		font-size: 32rpx;
		text-align: center;
	}
	.massageName {
		width: 144rpx;
		height: 32rpx;
		margin-top: 8rpx;
		font-size: 24rpx;
		text-align: center;
	}
	
	.main-function{
		height: 358rpx;
		padding: 48rpx 32rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #4F505F;
		line-height: 16rpx;
		text-align: center;
		background: #FFFFFF;
		box-shadow: 0rpx 6rpx 20rpx 2rpx rgba(0,0,0,0.08);
		border-radius: 20rpx;
	}
	.function-list {
		height: 104rpx;
		margin-bottom: 24rpx;
		display: flex;
		justify-content: left;
	}
	.function-list .function-item:not(:first-child) {
		margin-left: 38rpx;
	}
	.function-item {
		width: 96rpx;
		display: inline-block;
	}
	.function-item:active {
		opacity: 0.7;
	}
	.function-name {
		margin-top: 16rpx;
	}
	
	.content-hiddentrouble {
		margin: 30rpx 24rpx 0rpx 24rpx;
	}
	
	.hiddentrouble-list{
		margin-top: 20rpx;
		height: 480rpx;
	}
	.hiddentrouble-text {
		font-weight: bold;
		font-size: 32rpx;
		color: #4F505F;
		text-align: left;
	}	
	.hiddentroubleitem {
		height: 146rpx;
		display: flex;
		margin-top: 12rpx;
		background-color: darkgrey;
		justify-content: space-between;
		box-shadow: 0rpx 6rpx 20rpx 2rpx rgba(0,0,0,0.08);
		border-radius: 10rpx 10rpx 10rpx 10rpx;
		background-color: #fff;
	}
	.hiddentroubleitem:active {
		opacity: 0.7;
	}
	.htitem-left {
		width: 500rpx;
		height: 100%;
		display: flex;
		align-items: center;
	}
	.htitem-left-l {
		width: 58rpx; 
		height: 63rpx;
		margin-left: 22rpx;
		display: inline-block;
	}
	.htitem-left-r{
		margin-left: 44rpx;
		display: inline-block;
	}
	.htitem-name {
		font-weight: bold;
		font-size: 28rpx;
		color: #4F505F;
		text-align: left;
		display: block;
	}
	.htitem-info {
		height: 20rpx;
		font-size: 24rpx;
		color: #8F91A1;
		text-align: left;
		margin-top: 24rpx;
		display: block;
	}
	.htitem-right {
		width: 132rpx;
		height: 44rpx;
		display: flex;
		border-radius: 0rpx  10rpx  0rpx  10rpx;
		font-weight: 400;
		font-size: 24rpx;
		color: #FAFAFA;
		line-height: 2rpx;
		align-items: center;
		justify-content: center;
	}
</style>
