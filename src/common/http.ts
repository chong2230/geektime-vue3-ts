import axios from 'axios';
// import qs from 'qs';
import { Toast } from 'vant';
import Config from '../config/config';

axios.defaults.baseURL = '';//Config.httpServer;
axios.defaults.headers.common['Aughorization'] = 'Bearer ' + localStorage.getItem('token');
axios.defaults.headers.post['Content-Type'] = 'application/json';//'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 10000;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {        
        Toast({
            message: '网络请求失败，请刷新重试',
            duration: 1500,
            forbidClick: true
        })
        return Promise.reject(error);
    }
)

const http: any = {};

// 存在多个HTTPServer
http.request = (url: string, data={}, method: string, options={ baseUrl: Config.httpServer }, contentType?: string) => {
    let config: any = {
        method,
        url: options.baseUrl + url,
    };
    if (method == 'POST') {
        config.data = data;
    } else {
        config.params = data;
    }
    if (contentType) config['Content-Type'] = contentType;
    return new Promise((resolve, reject) => {
        axios(config).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err);
        })
    })
}

http.post = (url: string, data = {}, options?: object | null, contentType?: string) => {
    return http.request(url, data, 'POST', options, contentType);
}

http.get = (url: string, data?: object | null, options?: object | null) => {
    return http.request(url, data, 'GET', options);
}

export default http;