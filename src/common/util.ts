/**
 * 按指定格式格式化时间戳
 * @param {Number} time 时间戳，以秒为单位 
 * @param {String} format YYYY-MM-DD H:m:s
 * @return {String}
 */
export const formatTime = (time?: number, formatStr?: string): string => {
    if (!time) return '';
    if (!formatStr) formatStr = 'YYYY-MM-DD H:m:s';
	let date: Date = new Date(time * 1000);
	let Y: number = date.getFullYear();
	let M: number | string = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
	let D: number | string = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
	let h: number | string = date.getHours();
	h = h < 10 ? '0' + h : h;
	let m: number | string = date.getMinutes();
	m = m < 10 ? '0' + m : m;
	let s: number | string = date.getSeconds();
	s = s < 10 ? '0' + s : s;
    const formatObj: { [key: string]: number | string } = {
        YYYY: Y,
        MM: M,
        DD: D,
        H: h,
        m: m,
        s: s
    }
	return formatStr.replace(/YYYY|MM|DD|H|m|s/ig, (matches) => {
        return formatObj[matches].toString();
	});
}

/**
 * 格式化直播时间戳
 * @param {Number} time 时间戳，以秒为单位 
 * @param {String} format YYYY-MM-DD H:m:s
 * @return {String}
 */
 export const formatLiveTime = (time?: number, formatStr='YYYY-MM-DD H:m:s'): string => {
	if (!time) return '';
	let date: Date = new Date(time * 1000);
	let M: number = date.getMonth() + 1;
    let D: number = date.getDate();
    let days: string[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let day: number = date.getDay();

	let h: number | string = date.getHours();
	h = h < 10 ? '0' + h : h;
	let m: number | string = date.getMinutes();
	m = m < 10 ? '0' + m : m;
	return M+'月'+D+'日'+'（'+days[day]+'）'+' '+h+':'+m;
}

/**
 * 通过link字符串获取url
 */
export const getLink = (link: string, name='url'): string => {
    let arr: string[] = link.split('?');
    if (arr.length > 1) {
        let str: string = arr[1];
        let reg: RegExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r: string[] | null = str.match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        } 
    }
    return '';
}

/**
 * 防抖
 * @param {*} fn 需要防抖的函数
 * @param {*} delay 毫秒，防抖间隔时间
 */
export const debounce = (fn: Function, delay = 500) => {
    let timer: any = null;
    return function() {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, delay);
    }
}

/**
 * 节流
 * @param {*} fn 执行函数
 * @param {*} delay 毫秒，延时时间
 * @returns 
 */
 let _running: boolean = false;
 export const throttle = (fn: Function, delay = 500) => {
	if (_running) return;
	_running = true;
	fn();
	setTimeout(() => {
		_running = false;
	}, delay);
}

export const getSaleType = (saleType: number): string => {
	let type = '限时';
	switch(saleType) {
		case 1:
			break;
		case 2:
			type = '限时';
			break;    
		case 3:
			type = '拼团';
			break; 
		default:
			break;

	}
	return type;
}

export const getSaleLabel = (price: any) => {
	let type = getSaleType(price.sale_type);
	return type + ' ¥' + price.sale/100;
}