import { reactive, ref } from 'vue'

// 用来保存项目ID的全局变量
const PROJECTID = reactive({
  globalProjectId: '',
});

//图片请求头部地址
// const imgRequestHeader = reactive({
// 	URL:"https://iot.moshme.cn:18888",
// }) 
const imgRequestHeader = reactive({
	URL:"http://192.168.10.233:8888",
}) 

//头部地址
// const BASE_URL = 'https://iot.moshme.cn:18888/prod-api';
const BASE_URL = 'http://192.168.10.233:8888/stage-api';

export { PROJECTID, imgRequestHeader, BASE_URL};