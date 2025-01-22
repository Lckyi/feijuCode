<template>
	<view class="status_bar"></view>
	<view class="topbar">
		<view class="top-left" @click="toAlarmPush('')">
			<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
		</view>
		<view class="top-center">
			<uni-search-bar 
			class="search-bar" 
			v-model="searchText"
			placeholder="请输入设备名称" 
			clearButton="none" 
			cancelButton="none" 
			@confirm="search" />
		</view>
	</view>
		
	<view class="contenter">
		<scroll-view v-if="searchList.length > 0"
		style="height: calc(100vh - 350rpx)" 
		scroll-y="true" 
		@scrolltolower="bottomRefresh">
			<view class="data-list" v-for="item in searchList" :key="item.alarmId" @click="toAlarmPush(item.deviceName)">
				<view class="left">
					<image style="width: 30rpx; height: 30rpx;" src="../../static/images/gaojing/searchList.png" mode="scaleToFill"></image>
				</view>
				<view class="right">
					{{item.deviceName}}
				</view>
			</view>
		</scroll-view>
		<view class="data-null" v-else>
			<image style="width: 460rpx; height: 412rpx;" src="../../static/images/gaojing/null.png" mode="scaleToFill"></image>
			暂无数据
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive } from 'vue';
	import { apiGetAlarmRecords, apiGetRealTimeAlarm} from '@/api/apis.js';
	import { onUnload,onLoad } from '@dcloudio/uni-app';
	import { PROJECTID } from '@/config.js';
	
	const searchText = ref('');
	const loadingType = ref(null);
	const noData = ref(false);
	const searchList = ref('');
	const searchType = ref('');
	const params = {
		pageNum: 1,
		pageSize: 20
	  };
	  
	onLoad((e) => {
		searchType.value = e.flag;
		console.log(searchType.value);
	})

	//搜索
	const search = () => {
		searchList.value = '';
		if(searchText.value) {
			getAlarmByName();
		}		
	}
	//触底刷新
	const bottomRefresh = async () =>{
	  	if(noData.value) return;
	  	params.pageNum++;
	  	getAlarmByName();
	};
	//搜索(设备名称)数据请求
	const getAlarmByName = async ()=>{
		let res;
		if (searchType.value === 'alarmRecord') { //告警记录数据请求By设备名称
			res = await apiGetAlarmRecords({
				projectId: PROJECTID.globalProjectId,
				pageNum: params.pageNum,
				pageSize: params.pageSize,
				deviceName: searchText.value
			});
			searchList.value = [...searchList.value , ...res.rows];//数据拼接
			if(params.pageSize > res.rows.length) noData.value = true;
			
		}else {//实时告警数据请求By设备名称
			res = await apiGetRealTimeAlarm({
				projectId: PROJECTID.globalProjectId,
				deviceName: searchText.value,
				alarmState: 1
			});
			noData.value = true; //该请求接口未设定分页，禁用触底刷新
			const allArrayDsta = flattenTopLevelArrays(res.data);
			console.log(allArrayDsta);
			searchList.value = [...searchList.value , ...allArrayDsta];
		}
		uni.setStorageSync("searchList",searchList.value);	
	}
	
	//处理请求到的数据方法(实时告警)
	function flattenTopLevelArrays(obj, result = []) {
	  for (let key in obj) {
	    if (Array.isArray(obj[key])) {
	      obj[key].forEach(item => {
	        if (typeof item === 'object' && item !== null) {
	          result.push(item);
	        }
	      });
	    }
	  }
	  return result;
	}
	

	// 选中数据/返回
	const toAlarmPush = (devName) => {
		uni.$emit('devName',devName);
		uni.navigateBack();
	};
	
	//清除本地缓存的数据
	onUnload(()=>{
		uni.removeStorageSync("searchList")
	})
</script>

<style scoped lang="scss">
	// 消除搜索框的padding
	::v-deep .uni-searchbar {
		padding: 0px;
	}
	.status_bar {
		height: 85px;
		width: 100%;
		background-color: #3776FF;
	}
	.topbar {
		margin-bottom: 20rpx;
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: left;
		background-color: #3776FF;
		
		.top-center {
			width: 100%;
			height: 64rpx;
			margin: 0rpx 24rpx 12rpx 24rpx;
		}
		.top-left {
			margin-left: 26rpx;
		}
		.top-left:active {
			opacity: 0.6; 
		}
	}
	
	.contenter {
		.data-null {
			padding-top: 300rpx;
			color: #8F91A1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
		}
		.data-list {
			margin: 0 24rpx;
			height: 94rpx;
			display: flex;
			align-items: center;
			justify-content: left;
			border-bottom: 2rpx solid #DDE4EF;
			.left {
				margin-right: 10rpx;
			}
			.right {
				font-size: 28rpx;
				color: #4F505F;
				text-align: center;
				line-height: 38rpx;
			}
		}
		.data-list:active {
			opacity: 0.7;
		}
	}
</style>
