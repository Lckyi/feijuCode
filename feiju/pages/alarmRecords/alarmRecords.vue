<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="contenter">
			<view class="content-topbar">
				<view class="top-left" @click="toIndex">
					<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
				</view>
				<view class="top-center">
					告警记录
				</view>
				<view class="top-right" @click="messageBottom">
					<image style="width: 36rpx; height: 36rpx;" src="../../static/images/gaojing/sift.png" mode="scaleToFill"></image>
				</view>
			</view>
			
			<scroll-view v-if="alarmList.length > 0" 
			style="height: calc(100vh - 250rpx);" 
			scroll-y="true"  
			@scrolltolower="bottomRefresh">
				<view class="data-list" v-for="(item, index) in alarmList" :key="item.alarmId">
					<view class="list-top">
						<view class="left">{{item.deviceName}}</view>
						<view v-if="item.alarmLevel === 1" class="right" style="background-color: #F56C6C;">报警</view>
						<view v-if="item.alarmLevel === 2" class="right" style="background-color: #FFAF41;">预警</view>
					</view>
					<view class="list-center">
						<view class="left">
							<view class="lrow">
								<view class="lleft">告警时间</view>
								<view class="lright" style="font-size: 28rpx; color: #4F505F;">{{item.alarmTime}}</view>
							</view>
							<view class="lrow">
								<view class=“>告警内容</view>
								<view v-if="item.alarmLevel === 1" class="lright" style="color: #F56C6C;">{{item.alarmContent}}</view>
								<view v-else class="lright">{{item.alarmContent}}</view>
							</view>
							<view class="lrow">
								<view class="lleft" style="width: 84rpx; padding-left: 28rpx;">告警值</view>
								<view v-if="item.alarmLevel === 1" class="lright" style="color: #F56C6C;">
									{{item.alarmValue}}{{item.unit}}
								</view>
								<view v-else class="lright" >{{item.alarmValue}}{{item.unit}}</view>
							</view>
						</view>
						<view v-if="item.alarmState === 0" class="right"><image style="width: 120rpx; height: 94rpx;" src="../../static/images/gaojing/relieve.png" mode="scaleToFill"></image></view>
						<view v-if="item.alarmState === 1" class="right"><image style="width: 120rpx; height: 94rpx;" src="../../static/images/gaojing/unrelieve.png" mode="scaleToFill"></image></view>
					</view>
					<view class="list-bottom" @click="toAlarmDetails(item.alarmId)">
						<view class="left">点击查看详情</view>
						<view class="right"><image style="width: 16rpx; height: 30rpx;" src="../../static/images/gaojing/right.png" mode="scaleToFill"></image></view>
					</view>
				</view>
				<uni-load-more :status="loadingType"></uni-load-more>
			</scroll-view>
			<view class="data-null" v-else>
				<image style="width: 460rpx; height: 412rpx;" src="../../static/images/gaojing/null.png" mode="scaleToFill"></image>
				暂无数据
			</view>
		</view>
		<!-- 底部弹窗 -->
		<uni-popup ref="popup" type="bottom" border-radius="16rpx 16rpx 0 0" background-color="#fff" safe-area>
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
							:class="{ 'range-selected': dataSelected === 'lastMonth'}"
							@click="handleTimeRange('lastMonth')">近一个月
						</view>
						
						<view class="range" 
							:class="{ 'range-selected': dataSelected === 'lastThreeMonths'}"
							@click="handleTimeRange('lastThreeMonths')">近三个月
						</view>
						<view class="range" 
							:class="{ 'range-selected': dataSelected === 'lastSixMonths'}"
							@click="handleTimeRange('lastSixMonths')">近半年
						</view>
					</view>
					<view class="date-choose">
						<view class="choose">
							<uni-datetime-picker v-model="rstartDate" type="datetime" @change="selectedStartDate">
								<input style="width: 100%; height: 64rpx; line-height: 64rpx;"
								type="text" v-model="selectedDateRange.startDate"
								placeholder="起始日期" disabled/>
							</uni-datetime-picker>
						</view>
						<view class="arrowhead"></view>
						<view class="choose">
							<uni-datetime-picker v-model="rendDate" type="datetime" 
							:min-date="rstartDate"
							@change="selectedEndDate">
								<input style="width: 100%; height: 64rpx; line-height: 64rpx;"
								type="text" v-model="selectedDateRange.endDate"
								placeholder="终止日期" disabled/>
							</uni-datetime-picker>
						</view>
					</view>
				</view>
				<view class="search">
					<view class="title">设备搜索</view>
					<view class="search-bar" @click="toSearch">
						<uni-icons type="search" size="26" color="#DDE4EF"></uni-icons>
						<input style="margin-left: 24rpx; width: 100%;" 
						type="text" v-model="searchText"
						placeholder="请输入设备名称" disabled/>
					</view>
				</view>
				<view class="search-but">
					<view class="but" @click="reSet">重置</view>
					<view class="but" @click="submitSift">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive } from 'vue';
	import { apiGetAlarmRecords} from '@/api/apis.js';
	import { onUnload, onLoad, onShow} from '@dcloudio/uni-app';
	import { PROJECTID } from '@/config.js';
	
		const popup = ref(null);
		const alarmList = ref([]);
		const loadingType = ref(null);
		const noData = ref(false);
		const searchText = ref(null);
		const dataSelected = ref(null);
		let pageNum = 1;
		const selectedDateRange = reactive({
			startDate: '',
			endDate: ''
		});
	
		onShow(() => {
			uni.$on('devName',res => {
				if (res) {
					searchText.value = res;
					console.log(searchText.value);
				}
			})
		})
		
		//提交筛选以及初始化：页数、触底刷新、数据列表
		const submitSift = async () => {
			alarmList.value = '';
			pageNum = 1;
			getAlarm();
			noData.value = false;
			popup.value.close();
		}
		//触底刷新
		const bottomRefresh = async () =>{
		  	if(noData.value) return;
		  	pageNum++;
		  	getAlarm();
		};
		
		//数据请求/提交筛选请求数据
		const getAlarm = async ()=>{
			let res;
			const params = {
				projectId: PROJECTID.globalProjectId,
				pageNum: pageNum,
				pageSize: 10
			};
			if(selectedDateRange.startDate && selectedDateRange.endDate) {
				params.startTime = selectedDateRange.startDate;
				params.endTime = selectedDateRange.endDate;
			}
			if(searchText.value) {
				params.deviceName = searchText.value;
			}
			res = await apiGetAlarmRecords(params);
			alarmList.value = [...alarmList.value , ...res.rows];//数据拼接
			if(params.pageSize > res.rows.length) noData.value = true;
			uni.setStorageSync("alarmList",alarmList.value);
		}
		
		/*  筛选处理  */
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
		//时间范围/样式选中处理
		const handleTimeRange = (range) => {
		  let startDate, endDate;
		  dataSelected.value = range;
		  const today = new Date();
		  switch (range) {
			case 'lastMonth':
			  const oneMonthsAgo = new Date();
			  oneMonthsAgo.setMonth(today.getMonth() - 1);
			  startDate = timeFormat(oneMonthsAgo);
			  endDate = timeFormat(today);
			  break;
			case 'lastThreeMonths':
			 const threeMonthsAgo = new Date();
			 threeMonthsAgo.setMonth(today.getMonth() - 3);
			 startDate = timeFormat(threeMonthsAgo);
			 endDate = timeFormat(today);
			  break;
			case 'lastSixMonths':
			const sixMonthsAgo = new Date();
			sixMonthsAgo.setMonth(today.getMonth() - 6);
			startDate = timeFormat(sixMonthsAgo);
			endDate = timeFormat(today);
			  break;
			default:
			  startDate = endDate = null;
		  }
		  selectedDateRange.startDate = startDate;
		  selectedDateRange.endDate = endDate;
		};
		
		//开始日期表选择处理
		const rstartDate = ref('');
		const selectedStartDate = (event) => {
			let dateTime1 = new Date(rstartDate.value);
			let dateTime2 = new Date(rendDate.value);
			if(dateTime1 >= dateTime2 && dateTime2) {
				uni.showToast({
				          title: '起始日期需小于结束日期',
				          icon: 'none',
						  duration: 2000
				        });
				selectedDateRange.startDate = '';
			}else {
				selectedDateRange.startDate = rstartDate.value;
			}
		}
		//结束日期表选择处理
		const rendDate = ref('');
		const selectedEndDate = (event) => {
			let dateTime1 = new Date(rstartDate.value);
			let dateTime2 = new Date(rendDate.value);
			if(dateTime1 >= dateTime2 && dateTime1) {
				uni.showToast({
				          title: '起始日期需小于结束日期',
				          icon: 'none',
						  duration: 2000
				        });
				selectedDateRange.endDate = '';
			}else {
				selectedDateRange.endDate = rendDate.value;
			}
		}
		//重置筛选
		const reSet = () =>{
			selectedDateRange.startDate = '';
			selectedDateRange.endDate = '';
			dataSelected.value = '';
			searchText.value = '';
			rendDate.value = '';
			rstartDate.value = '';
		}
		
	    // 返回首页
	    const toIndex = () => {
			uni.navigateBack();
	    };
		
		//打开底部弹窗
		function messageBottom() {  
		        popup.value.open()  
		    };
			
		//跳转到详情页面
		function toAlarmDetails(alarmId) {
			uni.navigateTo({
				url: '/pages/alarmPush/alarmDetails?alarmId=' + alarmId
			})
		}
		
		//跳转到搜索页面
		function toSearch() {
			uni.navigateTo({
				url: '/pages/alarmPush/search?flag=alarmRecord'
			});
		}

	getAlarm();//初始化列表数据
	//清除本地缓存的数据
	onUnload(()=>{
		uni.removeStorageSync("alarmList");
	})

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
	
	.data-null {
		padding-top: 300rpx;
		color: #8F91A1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	.data-list {
		height: 386rpx;
		margin: 24rpx;
		background-color: #fff;
		border-radius: 16rpx;
		.list-top {
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #FAFAFB;
			.left {
				margin-left: 40rpx;
				font-weight: bold;
				font-size: 28rpx;
				color: #4F505F;
			}
			.right {
				width: 100rpx;
				height: 45rpx;
				margin-right: 24rpx;
				text-align: center;
				line-height: 45rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				border-radius: 6rpx;
			}
		}
		.list-center {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #FAFAFB;
			padding-bottom: 24rpx;
			.left {
				font-size: 28rpx;
				color: #8F91A1;
				margin-left: 40rpx;
				.lrow {
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					.lleft {
						width: 112rpx;
					}
					.lright {
						margin-left: 40rpx;
						font-size: 28rpx;
						color: #FFAF41;
					}
				}
				
			}
			.right {
				margin-right: 40rpx;
			}
		}
		
		.list-bottom {
			display: flex;
			padding: 24rpx 0;
			align-items: center;
			justify-content: space-between;
			.left {
				font-size: 28rpx;
				color: #4F505F;
				margin-left: 40rpx;
			}
			.right {
				width: 16rpx;
				height: 30rpx;
				margin-right: 40rpx;
			}
		}
	}
	
	// 底部弹窗样式
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
					width: 280rpx;
					height: 64rpx;
					border-radius: 32rpx;
					text-align: center;
					line-height: 64rpx;
					background-color: #F5F7FA;
				}
				.arrowhead {
					width: 110rpx;
					height: 0rpx;
					border: 2rpx solid #F5F7FA;
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
				padding-left: 32rpx;
				height: 72rpx;
				display: flex;
				flex-direction: row;
				justify-content: left;
				align-items: center;
				font-size: 28rpx;
				color: #C0C4CC;
				border-radius: 8rpx;
				border: 2rpx solid #DDE4EF;
			}
			
		}
		
		.search-but {
			margin: 42rpx 0rpx 82rpx 0rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			.but {
				width: 302rpx;
				height: 72rpx;
				font-size: 28rpx;
				text-align: center;
				line-height: 72rpx;
				color: #4F505F;
				border-radius: 36rpx;
				background: #F5F7FA;
			}
			.but:active {
				background-color: #5187FF ;
				color: #FFFFFF;
			}
		}
	}
</style>
