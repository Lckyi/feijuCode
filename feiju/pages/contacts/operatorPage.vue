<template>
	<view style="width: 100vw; height: 100vh; background-color: #FAFAFB;">
		<view class="status_bar"></view>
		<view class="content-topbar">
			<view class="top-left" @click="toBack">
				<image style="width: 25rpx; height: 44rpx;" src="../../static/images/gaojing/back.png" mode="scaleToFill"></image>
			</view>
			<view v-if="viewValue === 'add'" class="top-center">
				添加联系人
			</view>
			<view v-else class="top-center">
				{{contactData.name}}
			</view>
			<view class="top-right" @click="deleteInfo">
				<image v-if="viewValue === 'edit'" style="width: 32rpx; height: 44rpx;" src="../../static/images/contacts/delete.png" mode="scaleToFill"></image>
			</view>
		</view>
		<view class="container">
			<view class="avatar-upload">
				<image class="avatar" src="../../static/images/contacts/touxiang.png" mode="aspectFill"></image>
			</view>
			<view class="info-input">
				<view class="contact-input">
					<text class="title">姓名</text><text style="color: #F56C6C;">*</text>
					<input v-if="viewValue === 'add'" v-model="editContactName" class="input-box" type="text" placeholder="请输入" />
					<view v-if="viewValue === 'check'" class="check-box">{{contactData.name}}</view>
					<input v-if="viewValue === 'edit'" v-model="editContactName" class="input-box" type="text" placeholder="请输入" />
				</view>
				<view class="contact-input">
					<text class="title">手机号</text><text style="color: #F56C6C;">*</text>
					<input v-if="viewValue === 'add'" v-model="editContactPhone" class="input-box" type="text" placeholder="请输入" />
					<view v-if="viewValue === 'check'" class="check-textarea">{{contactData.phone}}</view>
					<input v-if="viewValue === 'edit'" v-model="editContactPhone" class="input-box" type="text" placeholder="请输入" />
				</view>
				<view class="contact-input">
					<text class="title">备注</text>
					<view style="margin-right: 24rpx;">
						<textarea v-if="viewValue === 'add'" v-model="editContactRemark" class="textarea" name="" id="" cols="30" rows="10" placeholder="请输入"></textarea>
						<view v-if="viewValue === 'check'">
							<view v-if="contactData.remark" class="check-box">{{contactData.remark}}</view>
							<view v-else class="check-box">未填写</view>
						</view>
						<textarea v-if="viewValue === 'edit'" v-model="editContactRemark" class="textarea" name="" id="" cols="30" rows="10" placeholder="请输入"></textarea>
					</view>
				</view>
			</view>
			<view v-if="viewValue === 'add'" class="but" style="border-radius: 48rpx;" @click="addContact">
				新 增
			</view>
			<view v-if="viewValue === 'check'" class="but" style="border-radius: 10rpx;" @click="toEdit">
				<image style="width: 28rpx; height: 28rpx;" src="../../static/images/contacts/edit.png" mode="scaleToFill"></image>
				编 辑
			</view>
			<view v-if="viewValue === 'edit'" class="but-edit">
				<view class="butt" @click="cancelEdit">
					取 消
				</view>
				<view class="butt" @click="saveEdit">
					保 存
				</view>
			</view>
			
			<!-- 删除提示 -->
			<view class="delete-tips">
				<uni-popup ref="popup" type="bottom" border-radius="20rpx 20rpx 0 0" background-color="#fff" safe-area>
					<view class="video-delete">
						<view class="name">
							是否移除{{videoName}}
						</view>
						<view class="del-but" @click="deleteItem">
							确定
						</view>
						<view class="del-but" style="color: #4F505F; border: none;" @click="cancel">
							取消
						</view>
					</view>
				</uni-popup>
			</view>
			<uni-popup ref="deletePopup" type="message">
				<uni-popup-message type="success" :message="popUps" :duration="1000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { apiGetContactById, apiUpdateContact, apiAddContact, apiDeleteContact } from '@/api/apis.js';
	import { PROJECTID } from '@/config.js';
	
	const popup = ref(null);
	const deletePopup = ref(null);
	const viewValue = ref(null);
	const contactId = ref('');
	const contactData = ref([]);
	const popUps = ref('');//操作成功消息提示
	const editContactName = ref('');
	const editContactPhone = ref('');
	const editContactRemark = ref('');
	const phoneRegex = /^1[3-9]\d{9}$/; // 手机号码正则表达式
	
	onLoad((e) => {
		viewValue.value = e.value;
		contactId.value = e.id;
		if(contactId.value){
			getContactById(contactId.value);
		}
	});
	
	//联系人详情数据请求
	const getContactById = async(id) => {
		let res = await apiGetContactById(id);
		contactData.value = res.data;
	}
	
	/* 添加处理 */
	const addContact = async () => {
		if(fillJudge()) return;
		let res = await apiAddContact({
			name: editContactName.value,
			phone: editContactPhone.value,
			remark: editContactRemark.value,
			projectId: PROJECTID.globalProjectId
		});
		if(res.code === 200){
			popUps.value = '添加成功';
			deletePopup.value.open();
			setTimeout(() => {
				uni.navigateBack();
			},1500)
		}else {
			infoTips('添加失败');
		}
	}
	
	/* 编辑处理 */
	//切换页面为编辑
	function toEdit() {
		editContactName.value = contactData.value.name;
		editContactPhone.value = contactData.value.phone;
		editContactRemark.value = contactData.value.remark;
		viewValue.value = 'edit'
	}
	//取消编辑
	function cancelEdit() {
		viewValue.value = 'check'
	}
	//保存编辑提交修改
	const saveEdit = async () => {
		if(fillJudge()) return;
		contactData.value.name = editContactName.value;
		contactData.value.phone = editContactPhone.value;
		contactData.value.remark = editContactRemark.value;
		let res = await apiUpdateContact(contactData.value);
		if(res.code === 200){
			popUps.value = '修改完成';
			deletePopup.value.open();
			getContactById(contactId.value);
			viewValue.value = 'check';
		}else {
			infoTips('修改失败');
		}
	}
	
	/* 删除处理 */
	//打开删除提示
	function deleteInfo() {
		popup.value.open();
	}
	//提交删除请求
	const deleteItem = async () => {
		let res = await apiDeleteContact(contactId.value);
		if(res.code === 200){
			popUps.value = '删除成功';
			deletePopup.value.open();
			popup.value.close();
			setTimeout(() => {
				uni.navigateBack();
			},1500)
		}else {
			infoTips('删除失败');
			popup.value.close();
		}
	}
	//取消关闭提示选项
	function cancel() {
		popup.value.close();
	}
	
	//填写判断
	const fillJudge = () => {
		if(!editContactName.value){
			infoTips('请填写姓名');
			return true;
		}
		if(!phoneRegex.test(editContactPhone.value)){ //检查号码格式
			infoTips('请输入正确的手机号码');
			return true;
		}
		return false;
	}
	// 消息提示封装
	function infoTips(mass){
		uni.showToast({
			title: mass,
			icon: 'none',
			duration: 2000
		});
	}
	
	// 返回
	const toBack = () => {
		uni.navigateBack();
	};
	
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
		.top-right:active {
			opacity: 0.7;
		}
	}
	
	.container {
		.avatar-upload {
			margin-bottom: 80rpx;
			display: flex;
			align-items: center;
			flex-direction: column;
			.avatar {
				margin-top: 72rpx;
				width: 240rpx;
				height: 240rpx;
				border-radius: 50%;
			}
		}
		
		.info-input {
			margin: 24rpx;
			padding: 0 24rpx 24rpx 24rpx;
			border-radius: 16rpx;
			background-color: #fff;
			.contact-input {
				padding-top: 24rpx;
				.title {
					font-size: 28rpx;
					color: #4F505F;
				}
				.input-box {
					height: 72rpx;
					margin-top: 12rpx;
					padding-left: 30rpx;
					line-height: 72rpx;
					background-color: #FDFDFF;
					border: 2rpx solid #F6F7FA;
					border-radius: 8rpx;
				}
				.check-box {
					height: 72rpx;
					margin-top: 12rpx;
					padding-left: 30rpx;
					line-height: 72rpx;
				}
				.textarea {
					width: 100%;
					line-height: 72rpx;
					margin-top: 12rpx;
					padding-left: 24rpx;
					background-color: #FDFDFF;
					border: 2rpx solid #F6F7FA;
					border-radius: 8rpx;
				}
				.check-textarea {
					width: 100%;
					line-height: 72rpx;
					margin-top: 12rpx;
					padding-left: 24rpx;
				}
			}
		}
		
		.but {
			height: 80rpx;
			position: fixed; 
			bottom: 72rpx; 
			left: 48rpx;
			right: 48rpx;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
			line-height: 80rpx;
			background-color: #5187FF;
		}
		.but:active {
			opacity: 0.7;
		}
		
		.but-edit {
			height: 80rpx;
			position: fixed; 
			bottom: 72rpx; 
			left: 36rpx;
			right: 36rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.butt {
				width: 320rpx;
				text-align: center;
				font-size: 28rpx;
				color: #5187FF;
				line-height: 80rpx;
				border-radius: 48rpx;
				border: 2rpx solid #5187FF;
			}
			.butt:active {
				color: #fff;
				background-color: #5187FF;
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
				.del-but {
					padding: 24rpx 0;
					font-size: 28rpx;
					color: #F56C6C;
					border-bottom: 6rpx solid #FAFAFB;
				}
				.del-but:active {
					opacity: 0.7;
				}
			}
		}
		::v-deep .uni-popup.top {
			top: 200rpx;
		}
	}

</style>
