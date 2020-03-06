/**
 * 日志打印
 */
import { LOG_DEBUG } from "../config/constant"

export default {
    log: (...rest) => LOG_DEBUG && console.log(...rest),
    error: (...rest) => LOG_DEBUG && console.error(...rest),
    warn: (...rest) => LOG_DEBUG && console.warn(...rest)
}