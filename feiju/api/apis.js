import {request} from "@/utils/request.js"
const header = {'Content-Type' : 'application/json'}

/* 首页接口 */
//获取项目列表
export function apiGetProject(data={}){
	return request({
		url:"/inspection/project/allProjectList",
		data,
		header
	})	
}
//获取实时报警、预警、未处置隐患数
export function apiGetRealTimeNum(data={}){
	return request({
		url:"/inspection/alarm/getAlarmStatistics",
		data,
		header
	})	
}

/*通讯录接口*/
//获取联系人接口
export function apiGetContactList(data={}){
	return request({
		url:'/inspection/contact/listAll',
		data,
		header
	})
}
//获取联系人详情接口(ById)
export function apiGetContactById(uurl){
	let url = '/inspection/contact/'+ uurl
	return request({
		url,
		header
	})
}
//修改联系人接口
export function apiUpdateContact(data={}){
	return request({
		url:'/inspection/contact',
		data,
		method:"PUT",
		header
	})
}
//新增联系人
export function apiAddContact(data={}){
	return request({
		url:'/inspection/contact',
		data,
		method:"POST",
		header
	})
}
//删除联系人
export function apiDeleteContact(ids){
	let url = '/inspection/contact/'+ ids
	return request({
		url,
		method:"DELETE",
		header
	})
}

/* 我的页面接口 */
//获取用户信息
export function apiGetUserInfo(){
	return request({
		url:"/getInfo",
		header
	})	
}
//修改密码接口
export function apiUpdatePssword(data={}){
	return request({
		url:"/system/user/profile/updatePwd",
		data,
		method:"PUT",
		header:{'Content-Type' : 'application/x-www-form-urlencoded'}
	})
}

/* 告警记录页面接口 */
//告警记录数据请求
export function apiGetAlarmRecords(data={}){
	return request({
		url:"/inspection/alarm/list",
		data,
		header
	})
}

//告警记录曲线数据请求(charts图表)
export function apiGetChart(data={}){
	return request({
		url:"/inspection/mongodb/getCurveDataOfTypeList",
		data,
		header
	})
}

/* 实时告警接口 */
export function apiGetRealTimeAlarm(data={}){
	return request({
		url:"/inspection/alarm/listGroupByLevel?alarmLevelTemp=1,2",
		data,
		header
	})
}

/* 巡检管理接口请求 */
//巡检任务列表接口
export function apiGetInspection(data={}){
	return request({
		url:"/dailyInspectionRecord/page",
		data,
		header
	})
}
//获取场景名称列表
export function apiGetSceneName(data={}){
	return request({
		url:"/inspection/project",
		data,
		header
	})
}
//巡检已完成详情数据请求By(id)
export function apiGetInspectionById(id){
	let url = '/dailyInspectionRecord/'+ id;
	return request({
		url,
		header
	})
}
//日常巡检填写完成修改
export function apiUpdateInspection(data={}){
	return request({
		url:"/dailyInspectionRecord",
		data,
		method:"PUT",
		header
	})
}

/* 隐患管理接口请求 */
//隐患随手拍(新增隐患接口)
export function apiAddHiddenDanger(data={}){
	return request({
		url:"/hiddenDanger",
		data,
		method:"POST",
		header
	})
}
//获取隐患列表数据
export function apiGetHiddenDanger(data={}){
	return request({
		url:"/hiddenDanger/page",
		data,
		header
	})
}
//获取隐患详情(ById)
export function apiGetHiddenDangerById(id){
	let url = '/hiddenDanger/'+ id;
	return request({
		url,
		header
	})
}
//获取系统人员列表
export function apiGetPersonnelList(data={}){
	return request({
		url:"/system/user/list",
		data,
		header
	})
}
//提交指派接口
export function apiPutHiddenDanger(data={}){
	return request({
		url:"/hiddenDanger/assign",
		data,
		method:"PUT",
		header
	})
}
//提交处置接口
export function apiPutDisposal(data={}){
	return request({
		url:"/hiddenDanger/disposal",
		data,
		method:"PUT",
		header
	})
}
//隐患审核接口
export function apiPutDisposalAudit(data={}){
	return request({
		url:"/hiddenDanger/review",
		data,
		method:"PUT",
		header
	})
}
//隐患日志接口
export function apiGetHiddenDangerLog(data={}){
	return request({
		url:"/hiddenDangerLog/page",
		data,
		header
	})
}

/*场景监控接口*/
//通过场景ID获取设备信息
export function apiGetEquipmentInfo(data={}){
	return request({
		url:"/system/scada/getInfoBySceneId",
		data,
		header
	})
}
//获取设备值接口
export function apiGetEquipmentData(data={}){
	return request({
		url:'/system/scada/deviceData',
		data,
		header
	})
}

/* 视频页面接口 */
//获取萤石AccessToken
export function apiGetAccessToken(data={}){
	return request({
		url:'/inspection/util/getAccessToken',
		data,
		header:{'Content-Type' : 'application/x-www-form-urlencoded'}
	})
}
//获取监控树状图
export function apiGetTreeVideo(data={}){
	return request({
		url:'/inspection/project/treeVideo',
		data,
		header:{'Content-Type' : 'application/x-www-form-urlencoded'}
	})
}
