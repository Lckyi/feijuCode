<template>
	<view style="width: 100vw; height: 100vh; background-color: #F5F6F8;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toIndex">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				隐患管理
			</view>
			<view class="top-right" @click="popupBottomOpen">
				<image style="width: 36rpx; height: 36rpx;" src="../../static/images/gaojing/sift.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="container">
			<view class="bg-top"></view>
			<view class="bg-bottom"></view>
			<view class="content">
				<!-- 页面内实现多个选项卡切换 -->
				<view class="contenter-data">
					<scroll-view class="tab" scroll-x="true" >
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view1' }"
							@click="onClickItem('全部','view1')">
							全部
						</view>
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view2' }"
							@click="onClickItem('待指派','view2')">
							待指派
						</view>
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view3' }"
							@click="onClickItem('待处置','view3')">
							待处置
						</view>
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view4' }"
							@click="onClickItem('待审核','view4')">
							待审核
						</view>
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view5' }"
							@click="onClickItem('处置完成','view5')">
							处置完成
						</view>
						<view class="tab-options"
							:class="{ 'tab-options--selected': selected === 'view6' }"
							@click="onClickItem('无需处置','view6')">
							无需处置
						</view>
					</scroll-view>
					<!-- 全部选项卡 -->
					<view class="content-pending" v-if="current === '全部'">
						<scroll-view v-if="hiddenDangerList.length > 0"
						class="pending-tab-area" scroll-y="true" 
						@scrolltolower="bottomRefresh">
							<view class="pending-datalist" v-for="(item, index) in hiddenDangerList" :key="item.id" @click="toSubHiddenTrouble(item.id)">
								<view class="pending-list">
									<view class="pending-left">
										<view>
											<image style="width: 58rpx; height: 63rpx;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
										</view>
										<view class="pending-massage">
											<view class="pending-title">
												{{item.sceneName}}巡检报告
											</view>
											<view class="pending-detail">
												<text style="margin-right: 12rpx;">{{item.disposerName}}</text>|
												<text style="margin-left: 8rpx;">{{item.disposalTime}}</text>
											</view>
										</view>
									</view>
									<view class="assigning" :style="{ backgroundColor: getItemColor(item.state)}">
										<text v-if="item.state === '0'">待指派</text>
										<text v-else-if="item.state === '1'">待处置</text>
										<text v-else-if="item.state === '2'">处置完成</text>
										<text v-else-if="item.state === '3'">无需处置</text>
										<text v-else-if="item.state === '4'">待审核</text>
									</view>
									</view>
								<view class="pending-list--down">
									<view class="listDown-title">
										检查项
									</view>
									<view class="listDown-content">
										<view>
											<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
										</view>
										<view class="listDown-text">
											{{item.dailyInspectionItemValue}}
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="data-null">
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
							当前暂无内容
						</view>
					</view>
					<!-- 待指派选项卡 -->
					<view class="content-pending" v-if="current === '待指派'">
						<scroll-view v-if="hiddenDangerList.length > 0"
						class="pending-tab-area" scroll-y="true" 
						@scrolltolower="bottomRefresh">
							<view v-for="(item, index) in hiddenDangerList" :key="item.id" @click="toSubHiddenTrouble(item.id)">
								<view class="pending-datalist" v-if="item.state ==='0'">
									<view class="pending-list">
										<view class="pending-left">
											<view>
												<image style="width: 58rpx; height: 63rpx;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
											</view>
											<view class="pending-massage">
												<view class="pending-title">
													{{item.sceneName}}巡检报告
												</view>
												<view class="pending-detail">
													<text style="margin-right: 12rpx;">{{item.disposerName}}</text>|
													<text style="margin-left: 8rpx;">{{item.disposalTime}}</text>
												</view>
											</view>
										</view>
										<view class="assigning" style="background-color: #F56C6C;">
											<text>待指派</text>
										</view>
										</view>
									<view class="pending-list--down">
										<view class="listDown-title">
											检查项
										</view>
										<view class="listDown-content">
											<view>
												<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
											</view>
											<view class="listDown-text">
												{{item.dailyInspectionItemValue}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="data-null">
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
							当前暂无内容
						</view>
					</view>
					<!-- 待处置选项卡 -->
					<view class="content-pending" v-if="current === '待处置'">
						<scroll-view v-if="hiddenDangerList.length > 0"
						class="pending-tab-area" scroll-y="true" 
						@scrolltolower="bottomRefresh">
							<view v-for="(item, index) in hiddenDangerList" :key="item.id" @click="toSubHiddenTrouble(item.id)">
								<view class="pending-datalist" v-if="item.state ==='1'">
									<view class="pending-list">
										<view class="pending-left">
											<view>
												<image style="width: 58rpx; height: 63rpx;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
											</view>
											<view class="pending-massage">
												<view class="pending-title">
													{{item.sceneName}}巡检报告
												</view>
												<view class="pending-detail">
													<text style="margin-right: 12rpx;">{{item.disposerName}}</text>|
													<text style="margin-left: 8rpx;">{{item.disposalTime}}</text>
												</view>
											</view>
										</view>
										<view class="assigning" style="background-color: #FFAF41;">
											<text>待处置</text>
										</view>
										</view>
									<view class="pending-list--down">
										<view class="listDown-title">
											检查项
										</view>
										<view class="listDown-content">
											<view>
												<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
											</view>
											<view class="listDown-text">
												{{item.dailyInspectionItemValue}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="data-null">
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
							当前暂无内容
						</view>
					</view>
					<!-- 待审核选项卡 -->
					<view class="content-pending" v-if="current === '待审核'">
						<scroll-view v-if="hiddenDangerList.length > 0"
						class="pending-tab-area" scroll-y="true" 
						@scrolltolower="bottomRefresh">
							<view v-for="(item, index) in hiddenDangerList" :key="item.id" @click="toSubHiddenTrouble(item.id)">
								<view class="pending-datalist" v-if="item.state ==='4'">
									<view class="pending-list">
										<view class="pending-left">
											<view>
												<image style="width: 58rpx; height: 63rpx;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
											</view>
											<view class="pending-massage">
												<view class="pending-title">
													{{item.sceneName}}巡检报告
												</view>
												<view class="pending-detail">
													<text style="margin-right: 12rpx;">{{item.disposerName}}</text>|
													<text style="margin-left: 8rpx;">{{item.disposalTime}}</text>
												</view>
											</view>
										</view>
										<view class="assigning" style="background-color: #00ADB5;">
											<text>待审核</text>
										</view>
										</view>
									<view class="pending-list--down">
										<view class="listDown-title">
											检查项
										</view>
										<view class="listDown-content">
											<view>
												<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
											</view>
											<view class="listDown-text">
												{{item.dailyInspectionItemValue}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="data-null">
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
							当前暂无内容
						</view>
					</view>
					<!-- 处置完成选项卡 -->
					<view class="content-pending" v-if="current === '处置完成'">
						<scroll-view v-if="hiddenDangerList.length > 0"
						class="pending-tab-area" scroll-y="true" 
						@scrolltolower="bottomRefresh">
							<view v-for="(item, index) in hiddenDangerList" :key="item.id" @click="toSubHiddenTrouble(item.id)">
								<view class="pending-datalist" v-if="item.state ==='2'">
									<view class="pending-list">
										<view class="pending-left">
											<view>
												<image style="width: 58rpx; height: 63rpx;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
											</view>
											<view class="pending-massage">
												<view class="pending-title">
													{{item.sceneName}}巡检报告
												</view>
												<view class="pending-detail">
													<text style="margin-right: 12rpx;">{{item.disposerName}}</text>|
													<text style="margin-left: 8rpx;">{{item.disposalTime}}</text>
												</view>
											</view>
										</view>
										<view class="assigning" style="background-color: #61D19F;">
											<text>处置完成</text>
										</view>
										</view>
									<view class="pending-list--down">
										<view class="listDown-title">
											检查项
										</view>
										<view class="listDown-content">
											<view>
												<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
											</view>
											<view class="listDown-text">
												{{item.dailyInspectionItemValue}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="data-null">
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
							当前暂无内容
						</view>
					</view>
					<!-- 无需处置选项卡 -->
					<view class="content-pending" v-if="current === '无需处置'">
						<scroll-view v-if="hiddenDangerList.length > 0"
						class="pending-tab-area" scroll-y="true" 
						@scrolltolower="bottomRefresh">
							<view v-for="(item, index) in hiddenDangerList" :key="item.id" @click="toSubHiddenTrouble(item.id)">
								<view class="pending-datalist" v-if="item.state ==='3'">
									<view class="pending-list">
										<view class="pending-left">
											<view>
												<image style="width: 58rpx; height: 63rpx;" src="../../static/images/view/alarm.png" mode="scaleToFill"></image>
											</view>
											<view class="pending-massage">
												<view class="pending-title">
													{{item.sceneName}}巡检报告
												</view>
												<view class="pending-detail">
													<text style="margin-right: 12rpx;">{{item.disposerName}}</text>|
													<text style="margin-left: 8rpx;">{{item.disposalTime}}</text>
												</view>
											</view>
										</view>
										<view class="assigning" style="background-color: #9CABCB;">
											<text>无需处置</text>
										</view>
										</view>
									<view class="pending-list--down">
										<view class="listDown-title">
											检查项
										</view>
										<view class="listDown-content">
											<view>
												<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
											</view>
											<view class="listDown-text">
												{{item.dailyInspectionItemValue}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
						<view v-else class="data-null">
							<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
							当前暂无内容
						</view>
					</view>
				</view>
			</view>
			<!-- 底部筛选栏 -->
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
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue';
	import { apiGetHiddenDanger, apiGetSceneName } from '@/api/apis.js';
	import { onUnload, onLoad, onShow} from '@dcloudio/uni-app';
	import { PROJECTID } from '@/config.js';
	
	const current = ref('全部');
	const selected = ref('view1');
	const popupBottom = ref('');
	const hiddenDangerList = ref([]);
	const noData = ref(false);
	let allPageNum = 1; //全部页面页数
	let assignedPageNum = 1; //待指派页面页数
	let disposedPageNum = 1; //待处置页面页数
	let reviewedPageNum = 1; //待审核页面页数
	let disposalPageNum = 1; //处置完成页面页数
	let noDisposalPageNum = 1; //无需处置页面页数
	/* 筛选功能变量 */
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
	
	//刷新数据
	onShow(() => {
		noData.value = false;
		initializeCurrent(current.value);
	});
	
	//数据请求
	const getHiddenDanger = async()=> { 
		const params = {
			projectId: PROJECTID.globalProjectId,
			pageSize: 10
		};
		if (current.value === '全部') {
			params.pageNum = allPageNum;
		}
		if(current.value === '待指派'){
			params.pageNum = assignedPageNum;
			params.state = 0;
		}
		if(current.value === '待处置'){
			params.pageNum = disposedPageNum;
			params.state = 1;
		}
		if(current.value === '待审核'){
			params.pageNum = reviewedPageNum;
			params.state = 4;
		}
		if(current.value === '处置完成'){
			params.pageNum = disposalPageNum;
			params.state = 2;
		}
		if(current.value === '无需处置'){
			params.pageNum = noDisposalPageNum;
			params.state = 3;
		}
		if(requestSceneId.value){
			params.sceneId = requestSceneId.value;
		}
		if(requestendDate.value && requestStartDate.value){
			params.startDate = requestStartDate.value;
			params.endDate = requestendDate.value;
		}
		let res = await apiGetHiddenDanger(params);
		hiddenDangerList.value = [...hiddenDangerList.value , ...res.data.records];//数据拼接
		if(params.pageSize > res.data.records.length) noData.value = true;
		uni.setStorageSync("hiddenDangerList",hiddenDangerList.value);
		// console.log(hiddenDangerList.value);
	}

	//触底刷新
	const bottomRefresh = async () =>{
		// console.log(noData.value);
	  	if(noData.value) return;
		if (current.value === '全部') {
			allPageNum++;
		}
		if(current.value === '待指派'){
			assignedPageNum++;
		}
		if(current.value === '待处置'){
			disposedPageNum++;	
		}
		if(current.value === '待审核'){
			reviewedPageNum++;
		}
		if(current.value === '处置完成'){
			disposalPageNum++;
		}
		if(current.value === '无需处置'){
			noDisposalPageNum++;
		}
	  	getHiddenDanger();
		// console.log('触底加载数据');
	};
	
	/*  筛选处理  */
	//提交筛选
	const submitSift = async() => {
		noData.value = false;
		//点击确定给请求参数赋值
		requestSceneId.value = selectedSceneId.value;
		requestStartDate.value = selectedDateRange.startDate;
		requestendDate.value = selectedDateRange.endDate;
		initializeCurrent(current.value);
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
	
	//切换选项卡
	function onClickItem(content,view) {
	    current.value = content;
		selected.value = view;
		noData.value = false;
		initializeCurrent(current.value);
	}
	//初始化选项卡页数
	function initializeCurrent(current){
		if (current === '全部') {
			allPageNum = 1;
		}
		if(current === '待指派'){
			assignedPageNum = 1;
		}
		if(current === '待处置'){
			disposedPageNum = 1;	
		}
		if(current === '待审核'){
			reviewedPageNum = 1;
		}
		if(current === '处置完成'){
			disposalPageNum = 1;
		}
		if(current === '无需处置'){
			noDisposalPageNum = 1;
		}
		hiddenDangerList.value = '';
		getHiddenDanger();
	}
	
	//状态到颜色的映射
	const statusColors = {
		'0': '#F56C6C',//待指派
		'1': '#FFAF41',//待处置
		'2': '#61D19F',//处置完成
		'3': '#9CABCB',//无需处置
		'4': '#00ADB5',//待审核
	};
	// 根据状态返回颜色
	const getItemColor = (status) => {
	  return statusColors[status] || 'black'; // 如果没有匹配的状态，返回默认颜色
	};

	// 返回首页
	const toIndex = () => {
		uni.navigateBack();
	};
	
	//详情页
	function toSubHiddenTrouble(id) {
		uni.navigateTo({
			url: '/pages/hiddenTrouble/subHiddenTrouble?id=' + id
		})
	}
	
	//打开底部筛选栏
	function popupBottomOpen() {
		popupBottom.value.open();
	}
	
	getSceneName();//获取场景名称
	//清除本地缓存的数据
	onUnload(()=>{
		uni.removeStorageSync("hiddenDangerList")
	});
	
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
		
		.content {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			.contenter-data {
				margin: 60rpx 24rpx 0rpx 24rpx;
				border-radius: 16rpx;
				.tab {
					margin-bottom: 44rpx;
					white-space: nowrap;
					.tab-options {
						height: 46rpx;
						margin-right: 40rpx;
						padding-bottom: 2rpx;
						font-size: 28rpx;
						text-align: center;
						line-height: 38rpx;
						color: #B5CCFF;
						display: inline-block;
					}
					.tab-options--selected {
						color: #fff;
						border-bottom: 5rpx solid #fff;
					}
				}
				
				.content-pending {
					.pending-tab-area {
						height: 1200rpx;
						background-color: rgba(255,255,255,0);
						.pending-datalist {
							margin-bottom: 20rpx;
							background-color: #fff;
							border-radius: 10rpx;
							.pending-list {
								height: 130rpx;
								padding-left: 24rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;
								.pending-left {
									display: flex;
									align-items: center;
									justify-content: space-between;
									.pending-massage {
										margin-left: 32rpx;
										.pending-title {
											font-weight: bold;
											font-size: 28rpx;
											color: #4F505F;
										}
										.pending-detail {
											margin-top: 12rpx;
											font-size: 24rpx;
											color: #8F91A1;
											.detail {
												text-align: center;
											}
										}
									}
								}
								// 状态卡
								.assigning {
									width: 136rpx;
									height: 50rpx;
									font-size: 20rpx;
									color: #FAFAFA;
									margin-bottom: 80rpx;
									text-align: center;
									line-height: 50rpx;
									border-radius: 0rpx 10rpx 0rpx 10rpx;
								}
							}
							
							.pending-list--down {
								height: 110rpx;
								margin-left: 24rpx;
								.listDown-title {
									margin-top: 10rpx;
									font-size: 24rpx;
									color: #8F91A1;
								}
								.listDown-content {
									margin-top: 14rpx;
									display: flex;
									align-items: center;
									justify-content: left;
									.listDown-text {
										margin-left: 12rpx;
										font-size: 24rpx;
										color: #4F505F;
									}
								}
							}
						}
					}
				}
			}
		}
		// 底部筛选
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
	}

</style>
