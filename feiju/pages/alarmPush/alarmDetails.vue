<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toAlarmPush">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				告警详情
			</view>
			<view class="top-right">
				<image style="width: 36rpx; height: 36rpx;" src="../../static/images/gaojing/details.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="contenter">
			<!-- 页面内实现多个选项卡切换 -->
			<view class="contenter-data">
				<view class="tab">
					<view class="tab-options"
						:class="{ 'tab-options--selected': selected === 'view1' }"
						@click="onClickItem('content1','view1')">
						告警信息
					</view>
					<view class="tab-options"
						:class="{ 'tab-options--selected': selected === 'view2' }"
						@click="onClickItem('content2','view2')">
						设备信息
					</view>
				</view>
				<view class="tab-list" v-for="item in alarmDetails">
					<view class="content-left" v-if="current === 'content1'">
					  <view class="data-list">
						<view class="left">
							<view class="lrow">
								<view class="lleft">告警时间</view>
								<view class="lright" style="font-size: 28rpx; color: #4F505F;">{{item.alarmTime}}</view>
							</view>
							<view class="lrow">
								<view class="lleft">告警等级</view>
								<view v-if="item.alarmLevel === 2" class="lright" style="font-size: 28rpx; color: #4F505F;">预警</view>
								<view v-if="item.alarmLevel === 1" class="lright" style="font-size: 28rpx; color: #4F505F;">报警</view>
							</view>
							<view class="lrow">
								<view class=“>告警内容</view>
								<view class="lright">{{item.alarmContent}}</view>
							</view>
							<view class="lrow">
								<view class="lleft" style="width: 84rpx; padding-left: 28rpx;">告警值</view>
								<view class="lright">{{item.alarmValue}}{{item.unit}}</view>
							</view>
							<view class="lrow" v-if="item.alarmState === 0">
								<view class="lleft">解除时间</view>
								<view class="lright" style="font-size: 28rpx; color: #4F505F;">{{item.alarmRecoverTime}}</view>
							</view>
						</view>
						<view v-if="item.alarmState === 0" class="right">
							<image style="width: 200rpx; height: 160rpx;" src="../../static/images/gaojing/relieve.png" mode="scaleToFill"></image>
						</view>
						<view v-if="item.alarmState === 1" class="right">
							<image style="width: 200rpx; height: 160rpx;" src="../../static/images/gaojing/unrelieve.png" mode="scaleToFill"></image>
						</view>
					  </view>
					  <!-- 告警原因 -->
					  <view style="display: flex; justify-content: left; font-size: 28rpx;">
						<view style="color: #8F91A1; margin-right: 24rpx; white-space: nowrap;">告警原因</view>
						<view style="color: #4F505F;">{{item.alarmContent}}</view>
					  </view>
					</view>
					
					<view class="content-right" v-else-if="current === 'content2'">
						  <view class="left">
							<view class="lrow">
								<view class="lleft">监控点名称</view>
								<view class="lright">{{item.deviceName}}</view>
							</view>
							<view class="lrow">
								<view class="lleft" style="margin-left: 28rpx;">设备编号</view>
								<view class="lright">{{item.deviceNumber}}</view>
							</view>
							<view class="lrow">
								<view class="lleft" style="margin-left: 28rpx;">所在位置</view>
								<view class="lright">{{item.deviceAddress}}</view>
							</view>
						  </view>
					</view>
				</view>
			</view>
		</view>
		<!-- 折线图 -->
		<view class="data-sheet">
			<view class="sheet-title">
				<view class="sheet-left">
					<view class="vertical"></view>
					<view class="title">
						警告数据曲线
					</view>
				</view>
				<view class="sheet-right" @click="refreshChart">
					<image style="width: 32rpx; height: 32rpx;" src="../../static/images/gaojing/update.png" mode="scaleToFill"></image>
				</view>
			</view>
			<view class="charts-box"  v-if="chartData.length > 0">
				<qiun-data-charts type="area" :opts="opts" :chartData="showChartData"/>
			</view>
			<view class="charts-null" v-else>
				<image style="width: 330rpx; height: 306rpx;" src="../../static/images/gaojing/null.png" mode="scaleToFill"></image>
				暂无图表数据
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { apiGetAlarmRecords, apiGetChart } from '@/api/apis.js';
	import { PROJECTID } from '@/config.js';

	    const current = ref('content1');
		const selected = ref('view1');
		const chartData = ref([]);
		const showChartData = ref({});
		const alarmId = ref('');
		const alarmDetails = ref([]);
		const params = {
			deviceId:'',
			types:'',
			startTime:'',
			endTime: ''
		};
		
		onLoad((e) => {
			alarmId.value = e.alarmId;
		});
		
		onMounted(() => {
			getAlarm();
		});
		
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

		//数据请求
		const getAlarm = async ()=>{
			let res = await apiGetAlarmRecords({
				projectId: PROJECTID.globalProjectId,
				alarmId: alarmId.value
			});
			alarmDetails.value = res.rows;
			params.deviceId = alarmDetails.value[0].deviceNumber;
			params.types = alarmDetails.value[0].dataId;
			
			// 时间处理开始时间为告警时间前一小时，结束时间为告警恢复后一小时
			let parsedAlarmTime = new Date(alarmDetails.value[0].alarmTime);
			let parsedAlarmRecoverTime = '';
			if(!alarmDetails.value[0].alarmRecoverTime) {
				parsedAlarmRecoverTime = new Date(alarmDetails.value[0].alarmTime);
			}else {
				parsedAlarmRecoverTime = new Date(alarmDetails.value[0].alarmRecoverTime);
			}
			parsedAlarmTime.setHours(parsedAlarmTime.getHours() - 1);
			parsedAlarmRecoverTime.setHours(parsedAlarmRecoverTime.getHours() + 1);
			
			params.startTime = timeFormat(parsedAlarmTime);
			params.endTime = timeFormat(parsedAlarmRecoverTime);
			await getChartData(params);
		}
		
		//图表样式
		const opts = ref({
		  color: ["#1890FF"],
		  padding: [15,15,0,15],
		  enableScroll: false,
		  legend: {},
		  xAxis: {
		    disableGrid: true
		  },
		  yAxis: {
		    gridType: "dash",
		    dashLength: 2
		  },
		  extra: {
		    area: {
		      type: "curve",
		      opacity: 0.8,
		      addLine: true,
		      width: 2,
		      gradient: true,
		      activeType: "hollow"
		    }
		  }
		});
		//刷新图表数据
		function refreshChart() {
			getChartData(params);
		}
		//加载折线图
		const getChartData = async (params)=> {
			try {
				let res = await apiGetChart(params);
				if (!res.data[0].time || !res.data[0].valueOne) {
					console.error("没有图表数据");
					return;
				}
				chartData.value = res.data;
				const data = chartData.value[0].valueOne;
				const chData = sliceChartData(chartData.value[0].time, chartData.value[0].valueOne);
				setTimeout(() => {
					showChartData.value = {
						categories: chData.showData,
						series: [
						  {
							name: chartData.value[0].typeName,
							data: chData.data
						  },
						]
					}
				}, 500)
			} catch (error) {
				console.error("暂无图标数据", error);
			}
		}
		//显示时间处理
		function sliceChartData(categories, data) {
			const chData = reactive({categories:'',data:'',showData:''});
			const timeArray = ref([]);
			chData.categories = categories.slice(-6);//截取最新的6条数据
			chData.data = data.slice(-6);
			for (const dateTimeString in chData.categories) {
			  if (chData.categories.hasOwnProperty(dateTimeString)) {
				// 使用字符串的 split 方法来分割日期和时间
				const [date, time] = chData.categories[dateTimeString].split(' ');
				// 只保留小时和分钟
				const cutTime = time.slice(0, 5);
				timeArray.value.push(cutTime);
			  }
			}
			chData.showData = timeArray.value;
			return chData;
		}
		
		// 返回告警推送页面
		const toAlarmPush = () => {
			uni.navigateBack();
		};
		
		//选项卡方法
		function onClickItem(content,view) {
		      current.value = content;
			  selected.value = view;
		}
	
</script>

<style scoped lang="scss">
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
	}
	
	
	.contenter {
		padding: 48rpx 24rpx 0rpx 24rpx;
		background: linear-gradient( 180deg, #3776FF 0%, rgba(55,118,255,0.5) 50%, rgba(0,80,255,0) 100%);
		.contenter-data {
			padding: 32rpx;
			border-radius: 16rpx;
			background-color: #fff;
			.tab {
				height: 68rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background-color: #3776FF;
				border-radius: 38rpx;
				.tab-options {
					width: 314rpx;
					height: 60rpx;
					margin: 0 4rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 60rpx;
					color: #FDFDFF;
					border-radius: 34rpx;
					background-color: #3776FF;
				}
				.tab-options--selected {
					color: #3776FF;
					background-color: #fff;	
				}
			}
			
			.tab-list {
				margin-top: 12rpx;
				.content-left {
					.data-list {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-bottom: 24rpx;
						.left {
							font-size: 28rpx;
							color: #8F91A1;
							.lrow {
								margin-top: 24rpx;
								display: flex;
								align-items: center;
								.lleft {
									width: 112rpx;
								}
								.lright {
									margin-left: 24rpx;
									font-size: 28rpx;
									color: #F56C6C;
								}
							}
							
						}
						.right {
							margin-right: 18rpx;
						}
					}
				}
				
				.content-right {
					margin-top: 12rpx;
					.left {
						font-size: 28rpx;
						color: #8F91A1;
						.lrow {
							margin-top: 24rpx;
							display: flex;
							align-items: center;
							.lright {
								margin-left: 24rpx;
								font-size: 28rpx;
								color: #4F505F;
							}
						}
					}
				}
			}
			
		}
	}
	
	.data-sheet {
		margin: 24rpx;
		border-radius: 16rpx;
		background-color: #fff;
		.sheet-title {
			height: 88rpx;
			padding-top: 24rpx;
			border-bottom: 2rpx solid #FAFAFB;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.sheet-left {
				display: flex;
				align-items: center;
				justify-content: left;
				.vertical {
					margin-left:  24rpx;
					width: 8rpx;
					height: 28rpx;
					border: 2rpx solid #3776FF;
					border-radius: 8rpx;
					background-color: #3776FF;
				}
				.title {
					height: 38rpx;
					margin-left: 8rpx;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 38rpx;
					color: #4F505F;
				}
			}
			.sheet-right {
				margin-right: 32rpx;
			}
			.sheet-right:active {
				opacity: 0.7;
				background-color: #FAFAFB;
			}
			
		}
		.charts-box {
			height: 400rpx;
			margin-top: 24rpx;
		}
		.charts-null {
			height: 400rpx;
			margin-top: 24rpx;
			color: #8F91A1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
		}
	}
	
	
</style>
