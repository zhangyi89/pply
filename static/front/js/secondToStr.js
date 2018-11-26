

//秒转年月日
function secondToString(timestamp) {
    var year, month, day, hour, min, second;
    year = month = day = hour = min = second = 0;
    var yearStr,monthStr,dayStr,hourStr,minStr,secStr;
    yearStr=monthStr=dayStr=hourStr=minStr=secStr=""
    if (typeof(timestamp)!="number"){
        console.error("timestamp must be number type!")
        return
    }
    if (timestamp === 0) {
        return "0秒";
    }
    year = Math.floor(timestamp / (3600 * 24 * 365))
    if (year != 0) {
        timestamp = timestamp - year * 3600 * 24 * 365
        yearStr=year+"天"
    }
    month = Math.floor(timestamp / (3600 * 24 * 30))
    if (month != 0) {
        timestamp = timestamp  - month * 3600 * 30
        monthStr=month+"月"
    }
    day = Math.floor(timestamp / (3600 * 24))
    if (day != 0) {
        timestamp = timestamp  - day * 3600 * 24
        dayStr=day+"天"
    }
    hour = Math.floor(timestamp / 3600)
    if (hour != 0) {
        timestamp = timestamp  - hour * 3600
        hourStr=hour+"小时"
    }
    min = Math.floor(timestamp / 60)
    if (min != 0) {
        timestamp = timestamp - min * 60
        minStr=min+"分"
    }
    second = timestamp
    if(second!=0){
      secStr=second+"秒"
    }
    return yearStr+monthStr+dayStr+hourStr+minStr+secStr;
}