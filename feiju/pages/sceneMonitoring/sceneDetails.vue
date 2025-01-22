<template>
	<view class="status_bar"></view>
	<view class="content-topbar">
		<view class="top-left" @click="toBack">
			<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
		</view>
		<view class="top-center">
			{{equipmentTitle}}
		</view>
		<view class="top-right"></view>
	</view>
	
	<view class="container">
		<view class="scene-img">
			<image @error="handleError" style="width: 100%; height: 376rpx;" :src="equipmentImg" mode="aspectFit"></image>
		</view>
		<scroll-view scroll-y="true" style="height: calc(100vh - 640rpx);">
			<view class="data-list" v-for="(item,index) in equipmentValue" :key="index">
				<view class="data-list" v-for="(subItem,subIndex) in item" :key="subIndex">
					<text v-if="subIndex === 0" class="place-name">{{subItem.id}}</text>
					<view class="gas-list" @click="getCharts(subItem.key,subItem.deviceNumber)">
						<view class="gas-name">
							{{subItem.name}}
						</view>
						<view class="gas-unit">
							{{subItem.value}}{{subItem.unit === 'null' ? '' : subItem.unit}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部弹出栏-折线图 -->
		<view class="charts">
			<uni-popup ref="popup" type="bottom" 
				border-radius="30rpx 30rpx 0 0" 
				background-color="#fff" 
				safe-area 
				:is-mask-click="isClosePop"
				@maskClick="handleOverlayClick">
				<view class="data-sheet">
					<view style="width: 88rpx; height: 8rpx; margin: 0 auto; background-color: #C0C4CC; border-radius: 4rpx;"></view>
					<view class="title">{{equipmentCharts[0]?.typeName}}</view>
					<view class="daterange">
						<uni-datetime-picker ref="isCloseDateRange" class="dateDisplay" 
							v-model="dateRange" 
							type="datetimerange" 
							@change="changeDate">
								<view class="dateShow-box" @click="openDateChart">
									<uni-icons style="padding-left: 30rpx;" type="calendar" color="#C0C4CC" size="28"></uni-icons>
									<view class="dataShow-text">
										{{startTime}} - {{endTime}}
									</view>
								</view>
						</uni-datetime-picker>
					</view>
					<view v-if="equipmentCharts[0]?.time" class="charts-box">
						<qiun-data-charts type="area" :opts="opts" :chartData="showChartData" :ontouch="true" :canvas2d="true"/>
					</view>
					<view v-else class="charts-null">
						<image style="width: 330rpx; height: 306rpx;" src="../../static/images/gaojing/null.png" mode="scaleToFill"></image>
						暂无图表数据
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive } from 'vue';
	import { apiGetEquipmentInfo, apiGetEquipmentData, apiGetChart } from '@/api/apis.js';
	import { onLoad } from '@dcloudio/uni-app';
	import { imgRequestHeader } from '@/config.js';
	
	const imgRequestHead = imgRequestHeader.URL;
	const popup = ref(null);
	const chartData = ref({});
	const showChartData = ref({});
	const equipmentData = ref([]);
	const equipmentId = ref('');
	const equipmentImg = ref('');
	const equipmentTitle = ref('');
	const equipmentValue = ref([]);
	const equipmentCharts = ref([]);
	const startTime = ref(null);
	const endTime = ref(null);
	const dateRange = ref([]);
	let isClosePop = ref(true);
	const isCloseDateRange = ref(null);
	let params = {
		types: '',
		startTime: '',
		endTime: '',
		deviceId: ''
	}
	
	//接收传值(id,场景名称)
	onLoad((e) => {
		equipmentId.value = e.id;
		equipmentTitle.value = e.name;
		getEquipmentInfo();
	})
	
	//获取设备信息
	const getEquipmentInfo = async () =>{
		let res = await apiGetEquipmentInfo({
			sceneId: equipmentId.value
		});
		equipmentData.value = res.data.deviceRecords;
		equipmentImg.value = imgRequestHead + res.data.image;
		if(equipmentData.value) {
			equipmentData.value.forEach(item => {
				getEquipmentData(item.deviceNumber);
			})
		}
	}

	//获取设备对应的值
	const getEquipmentData = async (deviceId) => {
		let res = await apiGetEquipmentData({
			deviceIds: deviceId
		})
		equipmentValue.value = [...equipmentValue.value, ...res.data];
	}

	//请求图表数据
	const getEquipmentCharts = async (params) => {
		let res = await apiGetChart(params);
		equipmentCharts.value = res.data;
		getData();
	}
	
	//场景图片加载失败处理
	const handleError = () => {
		// equipmentImg.value = "../../static/images/yinhuan/null.png"
		equipmentImg.value = "../../static/images/changjing/icon.png"
	};
	
	//点击打开图表
	function getCharts(type,deviceNumber) {
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
		startTime.value = timeFormat(start, 'show');
		endTime.value = timeFormat(now, 'show');
		params.types = type;
		params.startTime = timeFormat(start, '');
		params.endTime = timeFormat(now, '');
		params.deviceId = deviceNumber;
		popup.value.open();
		getEquipmentCharts(params);
	}
	
	//打开时间选择器
	function openDateChart() {
		isClosePop.value = false;
	}
	
	//控制图表和日期弹窗的关闭
	function handleOverlayClick() {
		isCloseDateRange.value.close();
		isClosePop.value = true;
	}
	
	//修改日期时间
	function changeDate(e) {
		isClosePop.value = true;
		const start = new Date(dateRange.value[0]);
		const end = new Date(dateRange.value[1]);
		startTime.value = timeFormat(start, 'show');
		endTime.value = timeFormat(end, 'show');
		params.startTime = dateRange.value[0];
		params.endTime = dateRange.value[1];
		getEquipmentCharts(params);
	}
	
	//加载折线图
	function getData(){
		try {
			if (!equipmentCharts.value[0].time || !equipmentCharts.value[0].valueOne) {
				console.error("没有图表数据");
				return;
			}
			showChartData.value = '';//清空上一次数据
			const data = equipmentCharts.value[0].valueOne;
			const chData = sliceChartData(equipmentCharts.value[0].time, equipmentCharts.value[0].valueOne);
			showChartData.value = {
				categories: chData.showData,
				series: [
				  {
					name: equipmentCharts.value[0].typeName,
					data: chData.data
				  },
				]
			}
		} catch (error) {
			console.error("暂无图标数据", error);
		}
	}
	
	//显示数据、时间处理
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
	
	// 定义日期格式
	const timeFormat = (now, type) =>{
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		if(type === 'show'){
			return `${year}/${month}/${day}`;
		}else{
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		}
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
		
	//返回
	const toBack = () => {
		uni.navigateBack();
	};
	
</script>

<style scoped lang="scss">
	::v-deep .dialog-close {
	    display: none;
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
	
	.container {
		.scene-img {
			height: 376rpx;
		}
		.data-list {
			margin: 12rpx;
			.place-name {
				font-weight: bold;
				font-size: 24rpx;
				color: #2F2F46;
			}
			.gas-list {
				margin-top: 12rpx;
				height: 84rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-radius: 16rpx;
				background-color: #F5F6F8;
				.gas-name {
					margin-left: 24rpx;
					font-size: 28rpx;
					color: #8F91A1;
				}
				.gas-unit {
					margin-right: 24rpx;
					font-size: 28rpx;
					color: #4F505F;
				}
			}
		}
		
		.charts {
			.data-sheet {
				margin: 24rpx;
				height: 622rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				border-radius: 16rpx;
				.title {
					height: 38rpx;
					margin-top: 32rpx;
					margin-left: 8rpx;
					margin-bottom: 42rpx;
					font-weight: bold;
					font-size: 28rpx;
					line-height: 38rpx;
					color: #4F505F;
				}
				.daterange {
					width: 482rpx;
					height: 64rpx;
					z-index: 999;
					.dateShow-box {
						width: 482rpx;
						height: 64rpx;
						display: flex;
						justify-content: left;
						align-items: center;
						border: 2rpx solid #DDE4EF;
						border-radius: 8rpx;
						.dataShow-text {
							margin-left: 30rpx;
							font-size: 28rpx;
							color: #4F505F;
						}
					}
				}
				.charts-box {
					height: 400rpx;
					margin-top: 16rpx;
				}
			}
		}
	}
	
</style>
