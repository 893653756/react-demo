import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';
const BASE_PATH = '';
const POST = 'POST';
// const GET = 'GET';
/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 */
export const reqLogin = (username, password) => ajax(BASE_PATH + '/login', { username, password }, POST);

/**
 * 获取一级、二级分类列表
 * @param {string} parentId 商品父id
 */
export const reqCategorys = (parentId) => ajax(BASE_PATH + "/manage/category/list", { parentId });

/**
 * 添加分类
 * @param {string} categoryName 商品名称
 * @param {string} parentId 商品父id
 */
export const reqAddCategory = (categoryName, parentId) => ajax(BASE_PATH + "/manage/category/add", { categoryName, parentId }, POST)

/**
 * 更新分类
 * @param {string} categoryId 商品id
 * @param {string} categoryName 商品名称
 */
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE_PATH + "/manage/category/update", { categoryId, categoryName }, POST)

/**
 * 获取商品分页列表
 * @param {number} pageNum 请求哪一页数据
 * @param {number} pageSize 请求数据量
 */
export const reqProducts = (pageNum, pageSize) => ajax(BASE_PATH + '/manage/product/list', { pageNum, pageSize })

/**
 * jsonp 回去天气
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        let url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url, {}, (err, data) => {
            console.log("jsonp", err, data);
            if (!err && data.status === 'success') {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather })
            } else {
                message.error('获取天气失败');
            }
        })
    })
}