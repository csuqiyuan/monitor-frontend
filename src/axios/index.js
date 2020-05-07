import axios from 'axios';
import router from "../router";

axios.defaults.baseURL = 'http://localhost:8081';
// 添加一个请求拦截器
axios.interceptors.request.use(config => {
		config.headers.languagetype = 'CN';
		return config;
	},
	err => {
		return Promise.reject(err);
	});
//添加一个响应拦截器
axios.interceptors.response.use(res => {
	//在这里对返回的数据进行处理
	console.log(res.data, '网络正常');
	if (res.data.message === "找不到主节点") {
		router.replace("/404")
	}
	return res.data;
}, err => {
	console.log('网络开了小差！请重试...');
	return Promise.reject(err);
})

export function get(url, params) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		}).then(res => {
			resolve(res.data);
		}).catch(err => {
			reject(err.data)
		})
	});
}

export function post(url, params) {
	return new Promise((resolve, reject) => {
		axios.post(url, params)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	});
}

export function deleteRequest (url, params)
{
	return new Promise((resolve, reject) => {
		axios.delete(url, params)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err.data)
			})
	});
}

export default axios
