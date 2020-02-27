import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';
const BASE_PATH = '';
const POST = 'POST';
const GET = 'GET';
/**
 * 登录
 */
export const reqLogin = (username, password) => ajax(BASE_PATH + '/login', {username, password}, POST);




/**
 * jsonp 回去天气
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        let url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url, {}, (err, data) => {
            console.log("jsonp",err, data);
            if (!err && data.status === 'success') {
                const {dayPictureUrl, weather} = data.results[0].weather_data[0];
                resolve({dayPictureUrl, weather})
            } else {
                message.error('获取天气失败');
            }
        })
    })
}