
//通用请求地址
// const ajaxUrl = 'http://172.17.7.172:8000'
const ajaxUrl = ''
//axios实例
var ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    //    withCredentials:true
});