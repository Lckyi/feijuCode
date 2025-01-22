<template>
	<view class="status_bar"></view>
	<view class="content-topbar">
		<view class="top-left">
			通讯录
		</view>
		<view class="top-right" @click="toAdd">
			<image style="width: 36rpx; height: 36rpx;" src="../../static/images/contacts/add.png" mode="scaleToFill"></image>
		</view>
	</view>
	
	<view class="name-search">
		<view class="search-dislay">
			<uni-search-bar class="search-bar" 
			placeholder="搜索" 
			clearButton="auto" 
			cancelButton="none" 
			@search="onSearchInput"
			v-model="searchQuery"
			@confirm="search" />
		</view>
	</view>
	<!-- 搜索列表 -->	
	<!-- <view v-for="(items, letter) in groupedData" :key="letter">
	    <view class="letter-header">{{ letter }}</view>
	    <view class="item-list">
	        <view v-for="item in items" :key="item.id">{{ item.name }}</view>
	    </view>
	</view> -->
	<view class="contenter">
		<scroll-view class="hiddentrouble-list" style="height: calc(100vh - 380rpx)" scroll-y="true">
			<view v-if="filteredOptions.length > 0" class="options-list" style="margin-bottom: 24rpx;">
				<view v-for="(option, index) in filteredOptions" :key="option.id" style="margin-bottom: 24rpx;">
					<label class="option-item">
						<image class="avatar" src="../../static/images/contacts/touxiang.png" mode="aspectFill"></image>
						<view class="option-text" @click="toCheck(option.id)">
							<view class="option-name">{{ option.name }}</view>
							<view class="option-number">{{ option.phone }}</view>
						</view>
						<image class="phone" 
						src="../../static/images/contacts/phone.png" 
						@click="phoneCall(option.phone)"
						mode="aspectFill"></image>
					</label>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref, computed, reactive, onMounted} from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { apiGetContactList } from '@/api/apis.js';
	import { PROJECTID } from '@/config.js'; 
	// import pinyin from 'pinyin';
	
		const searchQuery = ref(''); // 搜索关键词
		const contactList = ref([]);
		
		//切换页面时刷新数据
		onShow(() => {
			getContactList();
		})
		
		//联系人列表数据请求
		const getContactList = async() => {
			let res;
			if(PROJECTID.globalProjectId){
				res = await apiGetContactList({
					projectId: PROJECTID.globalProjectId
				});
				contactList.value = res.data;
			}
		}
		
		//拨打电话
		function phoneCall(phone) {
			uni.makePhoneCall({
			    phoneNumber: phone,
				success: function () {
				        console.log('拨打电话成功');
				    },
			    fail: function (err) {
			        console.error('拨打电话失败', err);
			    }
			});
		}
	
		// 根据搜索关键词过滤后的选项列表
		const filteredOptions = computed(() => {
			if(contactList.value){
				if (searchQuery.value === '') {
				  return [...contactList.value];
				} else {//实现姓名或号码搜索
				  return contactList.value.filter(option => 
				  option.name.toLowerCase().includes(searchQuery.value.toLowerCase())
				  || option.phone.toLowerCase().includes(searchQuery.value.toLowerCase()));
				}
			}
		});
		// 处理搜索输入
		const onSearchInput = (event) => {
		  searchQuery.value = event.detail.value;
		};
		 
		//分组
		// const state = reactive({
		// 	dataList: [], // 请求的数据
		// 	groupedData: {} // 分组后的数据
		// });
		// state.dataList = contactList.value;
		// groupDataByFirstLetter();
		
		// const groupDataByFirstLetter = () => {
		// 	const groupedData = {};
		// 	state.dataList.forEach(item => {
		//     let firstLetter = '';
		//     const name = item.name;
		 
		//     if (/^[\u4e00-\u9fa5]+$/.test(name)) { // 检查是否是汉字字符串
		// 		const pinyinArray = pinyin(name, {  // 获取汉字拼音首字母
		// 			style: pinyin.STYLE_FIRST_LETTER,
		// 			heteronym: false // 如果不需要多音字处理，可以设置为 false
		// 		});
		// 		firstLetter = pinyinArray[0][0].toUpperCase();  // 拼音数组的第一个元素的第一个字符（通常是单个字符的拼音首字母）
		//     } else {
		// 		firstLetter = name.charAt(0).toUpperCase(); // 非汉字字符串，直接取第一个字符的大写
		//     }
			
		//     if (!groupedData[firstLetter]) { // 如果分组数据中不存在该字母，则创建一个空数组
		// 		groupedData[firstLetter] = [];
		//     }
		// 	groupedData[firstLetter].push(item); // 将项目添加到对应的字母分组中
		// 	});
		// 	state.groupedData = groupedData;  // 更新状态中的分组数据
		// 	console.log(state.groupedData);
		// };
		 
		// onMounted(async () => {
		//   await getContactList();
		  
		// });
		
		//添加
		function toAdd() {
			uni.navigateTo({
				url:'/pages/contacts/operatorPage?value=add'
			})
		}
		//查看
		function toCheck(id) {
			uni.navigateTo({
				url:`/pages/contacts/operatorPage?id=${id}&value=${'check'}`
			})
		}
</script>

<style scoped lang="scss">
	.status_bar {
		height: 85px;
		width: 100%;
	}
	
	.content-topbar {
		width: 100%;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top-left {
			margin-left: 24rpx;
			font-weight: bold;
			font-size: 48rpx;
			color: #4F505F;
		}
		.top-left:active {
			opacity: 0.7; 
		}
		.top-right {
			margin-right: 30rpx;
		}
	}
	
	.name-search {
		padding-top: 24rpx;
		::v-deep .uni-searchbar__box {
			height: 80rpx;
		}
		.search-dislay {
			width: 100%;
			height: 80rpx;
		}
	}
	.contenter {
		margin-top: 40rpx;
		.options-list {
		  padding: 0 48rpx;
		  font-size: 28rpx;
		  color: #4F505F;
		  .option-item {
				margin-bottom: 24rpx;
				height: 110rpx;
				display: flex;
				align-items: center;
				.avatar {
					margin-right: 40rpx;
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
				.option-text {
				  flex: 1;
				  display: flex;
				  justify-content: left;
				  flex-direction: column;
				}
				.option-text:active {
					opacity: 0.7;
				}
				.phone {
					margin-left: 24rpx;
					width: 48rpx; 
					height: 48rpx;
				}
				.phone:active {
					opacity: 0.7;
				}
			}
		}
	}
</style>