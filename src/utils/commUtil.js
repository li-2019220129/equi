import moment from 'moment';

export const weekPlane = (star = 0, end = 0) => {
  const startTime = new Date(moment().subtract(star, 'days').format('YYYY-MM-DD HH:mm:ss'))
  const endTime = new Date(moment().subtract(end, 'days').format('YYYY-MM-DD HH:mm:ss')
  )

  endTime.setMonth(0)
  endTime.setDate(1)
  return Math.ceil(Math.ceil((startTime - endTime) / (24 * 60 * 60 * 1000)) / 7)
}


export const guid =() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  }

// 确保精度 两数相加
  export const floatAdd = (arg1, arg2)=> {
		let r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length//获取小数点的位数
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2));//获取放大倍数
		let arg1M = arg1 * m;
		let arg2M = arg2 * m;
		let argM = arg1M + arg2M;
		let number =  argM / m;
		return number;
	}

/**
 * 
 * @param {过滤掉不等的} array 
 * @param {*} row 
 * @param {*} name 
 * @returns 
 */
export const commfilter =(array,row,name) => {
	return  array.filter((item)=> item[name] === row[name])
}  
	
/**
 * 
 */