
// const BASE_URL = 'https://iot.moshme.cn:18888/prod-api';//正式地址
const BASE_URL = 'http://192.168.10.233:8888/stage-api';//测试地址

export function request(config={}){	
	let {
		url,
		data={},
		method="GET",
		header={}
	} = config

	url = BASE_URL+url
	header['authorization'] = uni.getStorageSync('token')
	
	return new Promise((resolve,reject)=>{		
		uni.request({
			url,
			data,
			method,
			header,
			success:res=>{
				if(res.data.code===200){
					resolve(res.data)
				}else if(res.data.code === 400){
					reject(res.data)
				}else{
					reject(res.data)
				}
			},
			fail:err=>{
				reject(err)
			}
		})
	})
}

