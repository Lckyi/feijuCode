<template>
	<view class="status_bar"></view>
	<view class="topbar">
		<view class="top-left" @click="toBack">
			<image style="width: 25rpx; height: 44rpx;" src="../../static/images/yinhuan/left.png" mode="scaleToFill"></image>
		</view>
		<view class="top-center">
			人员选择
		</view>
		<view class="top-right">
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
	<view class="contenter">
		<scroll-view class="hiddentrouble-list" scroll-y="true" style="height: calc(100vh - 300rpx);">
			<view v-if="filteredOptions.length > 0" class="options-list" style="margin-bottom: 24rpx;">
			    <view v-for="(item, index) in filteredOptions" :key="item.userId" style="margin-bottom: 24rpx;">
					<label class="option-item" @click="optioned(item.userId,item.nickName)">
						<image class="avatar" src="../../static/images/contacts/touxiang.png" mode="aspectFill"></image>
						<view class="option-text">{{ item.nickName }}</view>
					</label>
			    </view>
			</view>
			<view v-else class="data-null">
				<image style="width: 460rpx; height: 412rpx;" src="../../static/images/yinhuan/null.png" mode="scaleToFill"></image>
				暂无内容
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref, onMounted, computed,reactive } from 'vue';
	import { apiGetPersonnelList } from '@/api/apis.js';
		
		const searchQuery = ref(''); // 搜索关键词
		const personnelList = ref([]);
		const personnel = reactive({
			name:'',
			id:''
		});
		
		//人员列表数据请求
		const getPersonnelList = async () => {
			let res = await apiGetPersonnelList({
				pageSize: 9999
			});
			personnelList.value = res.rows;
		}
		
		// 根据搜索关键词过滤后的选项列表
		const filteredOptions = computed(() => {
		  if (searchQuery.value === '') {
		    return [...personnelList.value];
		  } else {
		    return personnelList.value.filter(option => option.nickName.toLowerCase().includes(searchQuery.value.toLowerCase()));
		  }
		});
		
		// 处理搜索输入
		const onSearchInput = (event) => {
		  searchQuery.value = event.detail.value;
		};
		
		 const optioned = (id, name) => {
			 personnel.id = id;
			 personnel.name = name;
			 uni.$emit('personnel',personnel);
			 uni.navigateBack();
		 }
	
	    // 返回告警推送页面
	    const toBack = () => {
			uni.navigateBack();
	    };
		
		getPersonnelList();
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
	// 消除搜索框的padding
	::v-deep .uni-searchbar {
		padding: 0px;
	}
	.status_bar {
		height: 85px;
		width: 100%;
	}
	.status_bar {
		height: 85px;
		width: 100%;
	}
	
	.topbar {
		width: 100%;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.top-center {
			flex: 2;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-weight: 400;
			font-size: 36rpx;
			color: #4F505F;
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
	
	.name-search {
		padding: 24rpx;
		::v-deep .uni-searchbar__box {
			height: 80rpx;
		}
		.search-dislay {
			width: 100%;
			height: 80rpx;
		}
	}
	
	.contenter {
		margin-top: 58rpx;
		.options-list {
		  padding: 0 48rpx;
		  font-size: 28rpx;
		  color: #4F505F;
		  .option-item {
			height: 80rpx;
		    display: flex;
		    align-items: center;
			.avatar {
				margin-right: 24rpx;
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
			.option-text {
			  flex: 1;
			  padding-right: 24rpx;
			}
			.option-checkbox {
				flex-shrink: 0; /* 防止 checkbox 被压缩 */
			}
		  }
		}
	}
</style>
