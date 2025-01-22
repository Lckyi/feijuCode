<template>
	<view style="width: 100%; height: 100%; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toIndex">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				巡检管理
			</view>
			<view class="top-right" @click="popupOpen">
				<image style="width: 36rpx; height: 36rpx;" src="../../static/images/xunjian/add.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="container">
			<view class="bg-top"></view>
			<view class="bg-bottom"></view>
			<!-- 右上角选项弹窗 -->
			<uni-popup ref="popup" type="top" border-radius="0 0 20rpx 20rpx" mask-background-color="rgba(0,0,0,0)">
				<view class="popup">
					<view class="pop-content" @click="scanCode">
						<view><image style="width: 30rpx; height: 30rpx;" src="../../static/images/xunjian/sweep.png" mode="scaleToFill"></image></view>
						<view class="pop-option">
							扫一扫
						</view>
					</view>
					<view class="pop-content" @click="popupBottomOpen">
						<view><image style="width: 30rpx; height: 30rpx;" src="../../static/images/xunjian/sift.png" mode="scaleToFill"></image></view>
						<view class="pop-option">
							筛选
						</view>
					</view>
				</view>
			</uni-popup>
			<!-- 扫码弹窗 -->
			<uni-popup ref="scanCodePopup" type="center" border-radius="18rpx" background-color="#fff">
				<view style="width: 680rpx; height: 400rpx; overflow-y: auto; word-wrap: break-word;">
				    <view>{{scanCodeData}}</view>
				</view>
			</uni-popup>
			<!-- 底部筛选弹出栏 -->
			<uni-popup ref="popupBottom" type="bottom" border-radius="30rpx 30rpx 0 0" background-color="#fff">
				<view class="popup-bottom">
					<view class="title">
						筛选查询
					</view>
					<view class="date">
						<view class="massage">
							日期选择
						</view>
						<view class="date-range">
							<view class="range" 
								:class="{ 'range-selected': dataSelected === 'All'}"
								@click="handleTimeRange('All')">全部
							</view>
							<view class="range" 
								:class="{ 'range-selected': dataSelected === 'lastDay'}"
								@click="handleTimeRange('lastDay')">昨日
							</view>
							<view class="range"
								:class="{ 'range-selected': dataSelected === 'lastMonths'}"
								@click="handleTimeRange('lastMonths')">近一个月
							</view>
						</view>
						<view class="date-choose">
							<view class="choose">
								<picker mode="date" @change="selectedStartDate">
									<input style="width: 100%; height: 64rpx; line-height: 64rpx;"
									type="text" v-model="selectedDateRange.startDate"
									placeholder="起始日期" disabled/>
								</picker>
							</view>
							<view class="arrowhead"></view>
							<view class="choose">
								<picker mode="date" @change="selectedEndDate">
									<input style="width: 100%; height: 64rpx; line-height: 64rpx;"
									type="text" v-model="selectedDateRange.endDate"
									placeholder="终止日期" disabled/>
								</picker>
							</view>
						</view>
					</view>
					<view class="search">
						<view class="title">场景名称</view>
						<view class="search-bar">
							<picker mode="selector" :range="showSceneName" @change="bindPickerChange">
								<view>{{selectedText}}</view>
							</picker>
						</view>
					</view>
					<view class="search-but">
						<view class="but" style="border-radius: 24rpx 0 0 24rpx;" @click="reSet">重置</view>
						<view class="but" @click="submitSift">确定</view>
					</view>
				</view>
			</uni-popup>
			
			<view class="content">
				<!-- 页面内实现多个选项卡切换 -->
				<view class="contenter-data">
					<view class="tab">
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view1' }"
							@click="onClickItem('unfinish','view1')">
							未完成
						</view>
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view2' }"
							@click="onClickItem('finish','view2')">
							已完成
						</view>
					</view>
					<!-- 未完成选项卡 -->
					<view class="content-unfinish" v-if="current === 'unfinish'">
						<scroll-view v-if="unFinishDataList.length > 0"
						class="unfinish-tab-area" 
						style="height: calc(100vh - 400rpx);" 
						scroll-y="true"
						@scrolltolower="bottomRefresh">
							<view class="unfinish-dataList" v-for="item in unFinishDataList" :key="item.id">
								<view class="unfinish-left">
									<view>
										<image style="width: 70rpx; height: 65rpx;" src="../../static/images/xunjian/inspection.png" mode="scaleToFill"></image>
									</view>
									<view class="unfinish-massage">
										<view class="unfinish-title">
											{{item.sceneName}}
										</view>
										<view class="unfinish-detail">
											{{item.levelName}}
										</view>
									</view>
								</view>
								<view class="fill-button" @click="toDailyInspection(item.id)">
									填写
								</view>
							 </view>
						</scroll-view>
						<view class="data-null" v-else>
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/xunjian/null.png" mode="scaleToFill"></image>
							今日任务已全部完成
						</view>
					</view>
					<!-- 已完成选项卡 -->
					<view class="content-finish" v-else-if="current === 'finish'">
						<scroll-view v-if="finishDataList.length > 0"
						class="tab-area" 
						style="height: calc(100vh - 400rpx);" 
						scroll-y="true"
						@scrolltolower="bottomRefresh">
							<view class="data-list" 
							v-for="item in finishDataList" :key="item.id" 
							@click="toInspectionCheck(item.id)">
								<view class="left">
									<view>
										<image style="width: 70rpx; height: 65rpx;" src="../../static/images/xunjian/inspection.png" mode="scaleToFill"></image>
									</view>
									<view class="massage">
										<view class="title">
											{{item.sceneName}}日常巡检
										</view>
										<view class="detail">
											{{item.completionUserName}}完成了巡检 {{item.completionTime}}
										</view>
									</view>
								</view>
								<view class="right">
									<image style="width: 16rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image>
								</view>
							 </view>
						</scroll-view>
						<view class="data-null" v-else>
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/xunjian/null.png" mode="scaleToFill"></image>
							暂无数据
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive, } from 'vue';
	import { apiGetInspection, apiGetSceneName } from '@/api/apis.js';
	import { onUnload, onLoad, onShow} from '@dcloudio/uni-app';
	import { PROJECTID } from '@/config.js';
	    
		const current = ref('unfinish');
		const selected = ref('view1');
		const popup = ref(null);
		const popupBottom = ref(null);
		const scanCodePopup = ref(null);
		const scanCodeData = ref('');
		const noData = ref(false);
		const finishDataList = ref([]);
		const unFinishDataList = ref([]);
		let finishPageNum = 1; //完成页面请求页数
		let unfinishPageNum = 1; //未完成页面请求页数
		const dataSelected = ref('All');
		let selectedText = ref('全部');
		let sceneName = ref(0);
		const showSceneName = ref([]);
		const sceneId = ref([]);
		const selectedSceneId = ref(null);
		const requestSceneId = ref('');
		const requestStartDate = ref('');
		const requestendDate = ref('');
		const selectedDateRange = reactive({
			startDate: '',
			endDate: ''
		});
		
		onShow(() =>{
			if(current.value === 'unfinish'){
				noData.value = false;
				unfinishPageNum = 1;
				unFinishDataList.value = '';
				getInspection();//刷新数据
			}
		})
		
		//触底刷新
		const bottomRefresh = async () =>{
		  	if(noData.value) return;
		  	if(current.value === 'finish') {
				finishPageNum++;
			}else {
				unfinishPageNum++
			}
		  	getInspection();
		};
		
		//数据请求
		const getInspection = async()=> {
			const params = {
				projectId: PROJECTID.globalProjectId,
				pageSize: 10
			};
			let res;
			if(requestSceneId.value){
				params.sceneId = requestSceneId.value;
			}
			if(requestendDate.value && requestStartDate.value){
				params.startDate = requestStartDate.value;
				params.endDate = requestendDate.value;
			}
			if(current.value === 'finish') {
				params.state = 1;
				params.pageNum = finishPageNum;
				res = await apiGetInspection(params);
				finishDataList.value = [...finishDataList.value , ...res.data.records];//数据拼接
				if(params.pageSize > res.data.records.length) noData.value = true;
				uni.setStorageSync("finishDataList",finishDataList.value);
			}else {
				params.pageNum = unfinishPageNum;
				params.state = 0;
				res = await apiGetInspection(params);
				unFinishDataList.value = [...unFinishDataList.value , ...res.data.records];
				if(params.pageSize > res.data.records.length) noData.value = true;
				uni.setStorageSync("unFinishDataList",unFinishDataList.value);
			}
		}
		
		/*  筛选处理  */
		//提交筛选
		const submitSift = async() => {
			noData.value = false;
			//点击确定给请求参数赋值
			requestSceneId.value = selectedSceneId.value;
			requestStartDate.value = selectedDateRange.startDate;
			requestendDate.value = selectedDateRange.endDate;
			if(current.value === 'finish') {
				finishDataList.value = '';
				finishPageNum = 1;
			}else {
				unFinishDataList.value = '';
				unfinishPageNum = 1;
			}
			getInspection();
			popupBottom.value.close();
		}
		//请求场景名称列表
		const getSceneName = async()=> {
			let res = await apiGetSceneName({
				projectId: PROJECTID.globalProjectId
			});
			sceneName.value = res.data.children;
			// 取出场景名称
			sceneName.value.forEach(item => {
				if(item.children.length > 0) {
					item.children.forEach(childItem => {
						if(childItem.sceneName && childItem.sceneId) {
							showSceneName.value.push(childItem.sceneName);//场景名称用于picker显示选择
							sceneId.value.push(childItem.sceneId);//选择场景名称对应的id用于筛选请求
						}
					})
				}
			});
		}
		//选择显示场景名称
		function bindPickerChange(e) {
		    let index = e.detail.value;
		    selectedText.value = showSceneName.value[index];
			selectedSceneId.value = sceneId.value[index];
		}
		// 定义日期格式
		const timeFormat = (now) =>{
			const year = now.getFullYear();
			const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
			const day = String(now.getDate()).padStart(2, '0');
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			return `${year}-${month}-${day}`;
		} 
		//时间范围/样式选中处理
		const handleTimeRange = (range) => {
		  let startDate, endDate;
		  dataSelected.value = range;
		  const today = new Date();
		  switch (range) {
			case 'lastDay':
			  const lastDay = new Date(today.getTime() - 24 * 60 * 60 * 1000);
			  startDate = timeFormat(lastDay);
			  endDate = timeFormat(today);
			  break;
			case 'lastMonths':
			 const lastMonths = new Date();
			 lastMonths.setMonth(today.getMonth() - 1);
			 startDate = timeFormat(lastMonths);
			 endDate = timeFormat(today);
			  break;
			case 'All':
				startDate = endDate = null;
			default:
			  startDate = endDate = null;
		  }
		  selectedDateRange.startDate = startDate;
		  selectedDateRange.endDate = endDate;
		};
		
		//开始日期表选择处理
		let rstartDate = '';
		let rendDate = '';
		const selectedStartDate = (event) => {
			rstartDate = event.detail.value;//记录选中的开始时间
			let dateTime1 = new Date(rstartDate);
			let dateTime2 = new Date(rendDate);
			if(dateTime1 >= dateTime2 && dateTime2) {
				uni.showToast({
				          title: '起始日期需小于结束日期',
				          icon: 'none',
						  duration: 2000
				        });
				selectedDateRange.startDate = '';
				rstartDate = '';
			}else {
				selectedDateRange.startDate = rstartDate;
			}
		}
		//结束日期表选择处理
		const selectedEndDate = (event) => {
			rendDate = event.detail.value;//记录选中的结束时间
			let dateTime1 = new Date(rstartDate);
			let dateTime2 = new Date(rendDate);
			if(dateTime1 >= dateTime2 && dateTime1) {
				uni.showToast({
				          title: '起始日期需小于结束日期',
				          icon: 'none',
						  duration: 2000
				        });
				selectedDateRange.endDate = '';
				rendDate = '';
			}else {
				selectedDateRange.endDate = rendDate;
			}
		}
		//重置筛选
		const reSet = () =>{
			selectedDateRange.startDate = '';
			selectedDateRange.endDate = '';
			rstartDate = '';
			rendDate = '';
			dataSelected.value = 'All';
			selectedText.value = '全部';
			selectedSceneId.value = '';
		}
		
		//选项卡切换方法
		function onClickItem(content,view) {
			noData.value = false;
			current.value = content;
			selected.value = view;
			if(current.value === 'finish') {
				finishDataList.value = '';
				finishPageNum = 1;
			}else {
				unFinishDataList.value = '';
				unfinishPageNum = 1;
			}
			getInspection();
		}
		
		//打开右上角选项卡
		function popupOpen() {
			popup.value.open();
		}
		
		//打开底部筛选栏
		function popupBottomOpen() {
			popup.value.close();
			popupBottom.value.open();
		}
		
		//扫码
		function scanCode() {
			popup.value.close();
		    uni.scanCode({
		    	success: function (res) {
					scanCodeData.value = res.result;
					scanCodePopup.value.open();
		    	}
		    });
		}
		
		// 返回告警推送页面
		const toIndex = () => {
			uni.navigateBack();
		};
		
		//跳转到填写界面
		function toDailyInspection(id) {
			uni.navigateTo({
				url: '/pages/inspection/dailyInspection?id='+id
			})
		}
		
		//跳转到查看界面
		function toInspectionCheck(id) {
			uni.navigateTo({
				url: '/pages/inspection/inspectionCheck?id='+id
			})
		}
		
		getSceneName();//初始化场景名称选择列表
		onUnload(()=>{ //清除缓存
			uni.removeStorageSync("unFinishDataList");
			uni.removeStorageSync("finishDataList");
		})
	
</script>

<style scoped lang="scss">
	// 空数据样式
	.data-null {
		padding-top: 200rpx;
		color: #8F91A1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
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
		.top-right:active {
			opacity: 0.7;
			
		}
	}
	
	.container {
		position: relative;
		.bg-top {
			height: 180rpx;
			background-color: #3776FF;
		}
		.bg-bottom {
			height: 60rpx;
			background: linear-gradient( 180deg, #3776FF 0%, rgba(55,118,255,0.5) 50%, rgba(0,80,255,0) 100%);
		}
		
		.popup {
			position: absolute;
			top: 214rpx;
			right: 24rpx;
			width: 198rpx;
			height: 173rpx;
			background-image: url("../../static/images/xunjian/popup.png");
			background-size: 100% 100%;  
			background-repeat: no-repeat;  
			.pop-content {
				padding: 0rpx 32rpx;
				height: 82rpx;
				border-bottom: 2rpx solid #FAFAFB;
				display: flex;
				align-items: center;
				justify-content: left;
				.pop-option {
					margin-left: 20rpx;
					font-size: 28rpx;
					color: #4F505F;
				}
			}
			.pop-content:active {
				opacity: 0.7;
			}
		}
		
		.popup-bottom {
			margin: 0 24rpx;
			.title {
				font-weight: bold;
				font-size: 32rpx;
				color: #4F505F;
				text-align: center;
				margin-top: 32rpx;
			}
			
			.date {
				margin-top: 40rpx;
				.massage {
					font-weight: bold;
					font-size: 28rpx;
					color: #4F505F;
				}
				.date-range {
					margin-top: 32rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.range {
						width: 216rpx;
						height: 64rpx;
						border-radius: 32rpx;
						font-size: 28rpx;
						color: #4F505F;
						text-align: center;
						line-height: 64rpx;
						background-color: #F5F7FA;
						border: 2rpx solid #F5F7FA;
					}
					.range-selected {
						color: #3776FF;
						border: 2rpx solid #3776FF;
					}
				}
				
				.date-choose {
					margin-top: 24rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					color: #C0C4CC;
					.choose {
						width: 320rpx;
						height: 64rpx;
						border-radius: 24rpx;
						text-align: center;
						line-height: 64rpx;
						background-color: #F5F7FA;
					}
					.arrowhead {
						width: 36rpx;
						height: 4rpx;
						border-top: 4rpx solid #F5F7FA;
						border-bottom: 4rpx solid #F5F7FA;
					}
				}
			}
			
			.search {
				margin-top: 40rpx;
				.title {
					font-weight: bold;
					font-size: 28rpx;
					color: #4F505F;
					text-align: left;
				}
				
				.search-bar {
					margin-top: 32rpx;
					height: 58rpx;
					font-size: 28rpx;
					line-height: 58rpx;
					text-align: center;
					color: #5187FF;
					border-radius: 24rpx;
					border: 2rpx solid #5187FF;
					background-color: #EDF3FF;
				}
				
			}
			
			.search-but {
				margin: 60rpx 0rpx 72rpx 0rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				border-radius: 24rpx;
				background-color: #5187FF;
				.but {
					flex: 1;
					height: 58rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 58rpx;
					color: #fff;
					border-radius: 0 24rpx 24rpx 0;
				}
				.but:active {
					background-color: #4C7EEC;
				}
			}
		}
		
		.content {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
	
			.contenter-data {
				margin: 52rpx 24rpx 0rpx 24rpx;
				border-radius: 16rpx;
				.tab {
					height: 76rpx;
					margin-bottom: 32rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					background-color: #5F91FF;
					border-radius: 38rpx;
					.tab-options {
						width: 354rpx;
						height: 68rpx;
						margin: 0 4rpx;
						font-size: 28rpx;
						text-align: center;
						line-height: 68rpx;
						color: #FDFDFF;
						border-radius: 34rpx;
						background-color: #5F91FF;
					}
					.tab-options--selected {
						font-weight: bold;
						color: #3776FF;
						background-color: #fff;	
					}
				}
				
				.content-unfinish {
					.unfinish-tab-area {
						height: 1200rpx;
						.unfinish-dataList {
							height: 162rpx;
							margin-bottom: 24rpx;
							padding: 0rpx 24rpx;
							border-radius: 20rpx;
							background-color: #fff;
							box-shadow: 0rpx 6rpx 20rpx 2rpx rgba(0,0,0,0.08);
							display: flex;
							align-items: center;
							justify-content: space-between;
							.unfinish-left {
								display: flex;
								align-items: center;
								justify-content: space-between;
								.unfinish-massage {
									margin-left: 32rpx;
									.unfinish-title {
										font-weight: bold;
										font-size: 28rpx;
										color: #4F505F;
									}
									.unfinish-detail {
										margin-top: 12rpx;
										font-size: 24rpx;
										color: #8F91A1;
									}
								}
							}
							.fill-button {
								width: 136rpx;
								height: 50rpx;
								font-size: 24rpx;
								color: #5187FF;
								text-align: center;
								line-height: 50rpx;
								border-radius: 26rpx;
								border: 2rpx solid #5187FF;
							}
							.fill-button:active {
								background-color: #5187FF;
								color: #fff;
							}
						}
					}
				}
				
				.content-finish {
					.tab-area {
						height: 1200rpx;
						.data-list {
							height: 162rpx;
							margin-bottom: 24rpx;
							padding: 0rpx 24rpx;
							border-radius: 20rpx;
							background-color: #fff;
							box-shadow: 0rpx 6rpx 20rpx 2rpx rgba(0,0,0,0.08);
							display: flex;
							align-items: center;
							justify-content: space-between;
							.left {
								display: flex;
								align-items: center;
								justify-content: space-between;
								.massage {
									margin-left: 32rpx;
									.title {
										font-weight: bold;
										font-size: 28rpx;
										color: #4F505F;
									}
									.detail {
										margin-top: 12rpx;
										font-size: 24rpx;
										color: #8F91A1;
									}
								}
							}
						}
						.data-list:active {
							background-color: #FAFAFB;
						}
					}
				}
			}
		
		}
		
	}
	
</style>
