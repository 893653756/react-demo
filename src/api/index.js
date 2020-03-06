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
 * 搜索商品分页列表 (根据商品名称/商品描述)
 * @param {object} 
 * pageNum 请求哪一页数据
 * pageSize 请求数据量
 * searchName 搜索字段
 * searchType 搜索类型
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE_PATH + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
});

/**
 * 更新商品状态(上架/下架)
 * @param {string} productId 商品id
 * @param {number} status 商品状态 1 | 2
 */
export const reqUpdateStatus = (productId, status) => ajax(BASE_PATH + '/manage/product/updateStatus', {productId, status}, POST);

/**
 * 删除指定图片
 * @param {string} name 图片名称 
 */
export const reqDeleteImg = (name) => ajax(BASE_PATH + '/manage/img/delete', {name}, POST);

/**
 * 添加/更新商品
 * @param {object} product 商品对象
 */
export const reqAddOrUpdateProduct = (product) => ajax(BASE_PATH + '/manage/product/' + (product._id ? 'update' : 'add'), product, POST);

/**
 * 获取角色列表
 */
export const reqRoles = () => ajax(BASE_PATH + '/manage/role/list');

/**
 * 添加角色
 * @param {string} roleName 角色名称
 */
export const reqAddRole = (roleName) => ajax(BASE_PATH + '/manage/role/add', { roleName }, POST);

/**
 * jsonp 回去天气
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        let url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0];
                resolve({ dayPictureUrl, weather })
            } else {
                message.error('获取天气失败');
            }
        })
    })
}