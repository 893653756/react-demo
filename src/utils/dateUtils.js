/**
 * 格式化时间
 */
export function formateDate(time) {
    if (!time) {
        return '';
    }
    let date = new Date(time);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    let hours = date.getHours();
    hours = hours >= 10 ? hours : "0" + hours;
    let minutes = date.getMinutes();
    minutes = minutes >= 10 ? minutes : "0" + minutes;
    let seconds = date.getSeconds();
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    return `${year}-${month}-${day}  ${hours}:${minutes}:${seconds}`
}