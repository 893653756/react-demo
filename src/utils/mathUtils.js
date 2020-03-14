/**
 * 取一定范围的随机整数
 * @param {number} min 
 * @param {number} max 
 */
export const randomInt = (min = 0, max = 50) => {
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.ceil(Math.random() * (max - min) + min);
}