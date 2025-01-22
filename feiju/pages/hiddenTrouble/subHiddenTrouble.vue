<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="topbar">
			<view class="top-left" @click="toHiddenTrouble">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/yinhuan/left.png" mode="scaleToFill"></image>
			</view>
			<view class="top-center">
				{{hiddenTroubleData.sceneName}}
			</view>
			<view class="top-right" @click="toLog">
				隐患日志
			</view>
		</view>
		<view class="container">
			<scroll-view scroll-y="true" style="height: calc(100vh - 250rpx);">
				<view class="basicInfo">
					<text style="basicInfo-title">基本信息</text>
					<view class="basicInfo-list" style="margin-top: 32rpx;">
						<text class="basicInfo-item--left">区域等级</text>
						<text class="basicInfo-item--right">{{hiddenTroubleData.levelName}}</text>
					</view>
					<view class="basicInfo-list">
						<text class="basicInfo-item--left">场景名称</text>
						<text class="basicInfo-item--right">{{hiddenTroubleData.sceneName}}</text>
					</view>
					<view class="basicInfo-list">
						<text class="basicInfo-item--left" style="margin-right: 144rpx;">状态</text>
						<text v-if="hiddenTroubleData.state === '0'" class="basicInfo-item--right">
							待指派
						</text>
						<text v-if="hiddenTroubleData.state === '1'" class="basicInfo-item--right">
							待处置
						</text>
						<text v-if="hiddenTroubleData.state === '2'" class="basicInfo-item--right">
							已处置
						</text>
						<text v-if="hiddenTroubleData.state === '3'" class="basicInfo-item--right">
							无需处置
						</text>
						<text v-if="hiddenTroubleData.state === '4'" class="basicInfo-item--right">
							待审核
						</text>
					</view>
					<view class="basicInfo-list">
						<text class="basicInfo-item--left">隐患等级</text>
						<text v-if="hiddenTroubleData.level === '0'" class="basicInfo-item--right" style="color:#5187FF;">
							一般隐患
						</text>
						<text v-if="hiddenTroubleData.level === '1'" class="basicInfo-item--right" style="color: #FCD7A4;">
							严重隐患
						</text>
						<text v-if="hiddenTroubleData.level === '2'" class="basicInfo-item--right" style="color: #FFAF41;">
							较大隐患
						</text>
						<text v-if="hiddenTroubleData.level === '3'" class="basicInfo-item--right" style="color: #F56C6C;">
							重大隐患
						</text>
					</view>
					<view class="basicInfo-list">
						<text class="basicInfo-item--left" style="margin-right: 116rpx;">发现人</text>
						<text class="basicInfo-item--right">{{hiddenTroubleData.discovererName}}</text>
					</view>
					<view class="basicInfo-list">
						<text class="basicInfo-item--left">发现时间</text>
						<text class="basicInfo-item--right">{{hiddenTroubleData.discoveryTime}}</text>
					</view>
					<view v-if="hiddenTroubleData.state !== '0'">
						<view class="basicInfo-list">
							<text class="basicInfo-item--left" style="margin-right: 116rpx;">指派人</text>
							<text class="basicInfo-item--right">{{hiddenTroubleData.assignorName}}</text>
						</view>
						<view class="basicInfo-list">
							<text class="basicInfo-item--left">指派时间</text>
							<text class="basicInfo-item--right">{{hiddenTroubleData.assignTime}}</text>
						</view>
					</view>
					<view v-if="hiddenTroubleData.state === '2' || hiddenTroubleData.state === '4'">
						<view class="basicInfo-list">
							<text class="basicInfo-item--left" style="margin-right: 116rpx;">处置人</text>
							<text class="basicInfo-item--right">{{hiddenTroubleData.disposerName}}</text>
						</view>
						<view class="basicInfo-list">
							<text class="basicInfo-item--left">处置时间</text>
							<text class="basicInfo-item--right">{{hiddenTroubleData.disposalTime}}</text>
						</view>
					</view>
					<view v-if="hiddenTroubleData.state === '1' || hiddenTroubleData.state === '4'" class="basicInfo-list">
						<text class="basicInfo-item--left">处置时限</text>
						<text class="basicInfo-item--right">{{hiddenTroubleData.closingDate}}</text>
					</view>
				</view>
				<view class="Details">
					<text class="Details-title">详细信息</text>
					<view class="Details-list">
						<text class="Details-item">检查项</text>
						<view class="listDown-content">
							<view>
								<image style="width: 24rpx; height: 24rpx;" src="../../static/images/yinhuan/cc.png" mode="scaleToFill"></image>
							</view>
							<view class="listDown-text">
								{{hiddenTroubleData.dailyInspectionItemValue}}
							</view>
						</view>
					</view>
					<view class="Details-list">
						<text class="Details-item">附件</text>
						<view class="content-camera">
							<view style="display: inline-block;" 
								v-for="(item,index) in annexDataList" 
								:key="index">
								<view v-if="item">
									<view v-if="item.split('.').pop() === 'mp4'" class="video-wrapper" @click="showVideo(imgRequestHead + item)">
										<video class="show-img" object-fit="cover" :src="imgRequestHead + item"></video>
										<view class="video-mask"></view>
									</view>
									<image v-else class="show-img" 
										:src="imgRequestHead + item" 
										@click="showImg(imgRequestHead + item)"
										mode="scaleToFill"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="Details-list">
						<text class="Details-item">备注</text>
						<view style="margin-top: 20rpx;">
							<text style="color: #4F505F;">{{hiddenTroubleData.note}}</text>
						</view>
					</view>
					<view v-if="hiddenTroubleData.state !== '0' && hiddenTroubleData.state !== '3'" class="Details-list">
						<text class="Details-item">处置建议</text>     
						<view style="margin-top: 20rpx;">
							<text style="color: #4F505F;">{{hiddenTroubleData.disposalSuggestion}}</text>
						</view>
					</view>
					<view v-if="hiddenTroubleData.state === '0'" class="bottom-but" @click="toAssign">
						隐患判断
					</view>
					<view v-if="hiddenTroubleData.state === '1'" class="bottom-but" @click="toDisposal">
						隐患处置
					</view>
					<view v-if="hiddenTroubleData.state === '4'" class="bottom-but" @click="toAudit">
						隐患审核
					</view>
				</view>
				<!-- 视频弹窗 playsinline -->
				<uni-popup ref="popup" type="center">
					<video style="height: 420rpx; width: 700rpx;" :src="playVideoUrl" 
					controls="true" object-fit="cover" playsinline></video>
				</uni-popup>
			<view style="height: 150rpx;"></view>
			</scroll-view>
			<view class="delete-tips">
				<uni-popup ref="auditPopup" type="bottom" border-radius="20rpx 20rpx 0 0" background-color="#fff" safe-area>
					<view class="video-delete">
						<view class="name">
							是否允许事件通过审核
						</view>
						<view class="but" @click="passAudit">
							通过
						</view>
						<view class="but" style="color: #4F505F; border: none;" @click="cancel">
							退回
						</view>
					</view>
				</uni-popup>
			</view>
			<uni-popup ref="successPopup" type="message">
				<uni-popup-message type="success" message="审核成功" :duration="1000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, computed, onMounted } from 'vue';
	import { apiGetHiddenDangerById, apiPutDisposalAudit } from '@/api/apis.js';
	import { onLoad, onShow} from '@dcloudio/uni-app';
	import {imgRequestHeader} from '@/config.js';
	
	const hiddenTroubleId = ref(null);
	const hiddenTroubleData = ref([]);
	const imgRequestHead = imgRequestHeader.URL; //初始化图片请求头部地址
	const popup = ref('');
	const auditPopup = ref('');
	const successPopup = ref('');
	const playVideoUrl = ref(''); //视频播放地址
	const annexDataList = ref('');
	let firstLoad = true;
	
	//获取id
	onLoad((e) => {
		hiddenTroubleId.value = e.id;
		getHiddenDanger();
	});
	
	//刷新数据
	onShow(() => {
		if(firstLoad){
			firstLoad = false;
			return;
		}
		hiddenTroubleData.value = '';
		getHiddenDanger();
	});
	
	//数据请求Byid
	const getHiddenDanger = async()=> {
		let res = await apiGetHiddenDangerById(hiddenTroubleId.value);
		hiddenTroubleData.value = res.data;
		annexDataList.value = [...hiddenTroubleData.value.attachmentList,...hiddenTroubleData.value.disposalFileList];
	}
	
	//打开审核弹窗
	function toAudit() { 
		auditPopup.value.open();
	}
	//通过审核
	const passAudit = async() => {
		auditPopup.value.close();
		try {
			let res = await apiPutDisposalAudit({
				adopt: true,
				id: hiddenTroubleId.value
			})
			if(res.code === 200){
				successPopup.value.open();
				//刷新数据
				hiddenTroubleData.value = '';
				getHiddenDanger();
			}else {
				infoTips("审核失败")
			}
		}catch(err) {
			infoTips(err.msg);
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
	//跳转到审核退回填写
	function cancel() {
		auditPopup.value.close();
		uni.navigateTo({
			url:'/pages/hiddenTrouble/hiddenTroubleAudit?id=' + hiddenTroubleId.value
		})
	}
	
	//点击播放视频
	function showVideo(url) {
		popup.value.open();
		playVideoUrl.value = url;
	}
	
	//点击放大图片查看
	function showImg(url) {
		uni.previewImage({
			current: '',
			urls: [url]
		});
	}
	
	//跳转到隐患日志
	function toLog() {
		uni.navigateTo({
			url:'/pages/hiddenTrouble/hiddenTroubleLog?id=' + hiddenTroubleId.value
		})
	}
	
	//跳转到隐患处置
	function toDisposal() {
		uni.navigateTo({
			url:'/pages/hiddenTrouble/hiddenTroubleDisposal?id=' + hiddenTroubleId.value
		})
	}
	//跳转到隐患指派
	function toAssign() {
		uni.navigateTo({
			url:'/pages/hiddenTrouble/hiddenTroubleAssign?id=' + hiddenTroubleId.value
		})
	}
	
	//返回
	const toHiddenTrouble = () => {
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
			width: 120rpx;
			height: 48rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			color: #5187FF;
			text-align: center;
			border-radius: 30rpx;
			border: 2rpx solid #5187FF;
			background-color: #EDF3FF;
			margin-right: 26rpx;
		}
		.top-right:active {
			opacity: 0.7;	
		}
	}
	
	.container {
		.basicInfo {
			padding: 24rpx;
			margin-top: 48rpx;
			.basicInfo-title {
				margin-bottom: 32rpx;
				font-weight: bold;
				font-size: 36rpx;
				color: #4F505F;
			}
			.basicInfo-list {
				margin-bottom: 24rpx;
				.basicInfo-item--left {
					width: 112rpx;
					height: 38rpx;
					margin-right: 88rpx;
					font-weight: 400;
					font-size: 28rpx;
					color: #8F91A1;
				}
				.basicInfo-item--right {
					font-weight: 400;
					font-size: 28rpx;
					color: #2F2F46;
				}
			}
		}
		.Details {
			padding: 24rpx;
			margin-top: 12rpx;
			background-color: #FFFFFF;
			.Details-title {
				margin-bottom: 32rpx;
				font-weight: bold;
				font-size: 36rpx;
				color: #4F505F;
			}
			.Details-list {
				margin-top: 48rpx;
				.Details-item {
					font-weight: 400;
					font-size: 28rpx;
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
				.details-img {
					margin-top: 16rpx;
					margin-left: 24rpx;
					display: flex;
					align-items: center;
					justify-content: left;
					.img-item {
						margin-right: 12rpx;
						width: 210rpx;
						height: 210rpx;
					}
				}
				.content-camera {
					padding-top: 12rpx;
					padding-left: 12rpx;
					.video-wrapper {
						position: relative;
						width: 200rpx;
						height: 200rpx;
						padding-right: 12rpx;
						.video-mask {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 1; 
							background: transparent;
						}
					}
					.show-img {
						width: 200rpx;
						height: 200rpx;
						margin-right: 12rpx;
						margin-bottom: 12rpx;
						display: inline-block;
						border-radius: 8rpx;
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
				border-radius: 8rpx;
				background-color: #5187FF;
			}
			.bottom-but:active {
				opacity: 0.7;
			}
		}
		.delete-tips {
			.video-delete {
				height: 320rpx;
				text-align: center;
				.name {
					padding: 24rpx 0;
					font-size: 24rpx;
					color: #8F91A1;
					border-bottom: 2rpx solid #FAFAFB;
				}
				.but {
					padding: 24rpx 0;
					font-size: 28rpx;
					color: #F56C6C;
					border-bottom: 6rpx solid #FAFAFB;
				}
				.but:active {
					opacity: 0.7;
				}
			}
		}
		::v-deep .uni-popup.top {
			top: 200rpx;
		}
	}
	
</style>
