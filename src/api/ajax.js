/**
 * 二次封装axios
 * 优化：统一处理请求异常，在外层包一个自己创建的promise对象
 */
import axios from "axios";
import { message } from "antd";

export default function ajax(url, data = {}, type = "GETF") {
    return new Promise((resolve, reject) => {
        let promise;
        if (type === "GET") {
            promise = axios.get(url, {
                params: data // 请求参数
            });
        } else if (type === "POST") {
            promise = axios.post(url, data);
        }
        // 成功调用resolve
        promise.then(res => {
            resolve(res.data);
        }).catch(error => {
            message.error(`请求出错了：${error.message}`)
        })
    })
}