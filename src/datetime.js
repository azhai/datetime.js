//今天零点的时间戳
Date.today = function() {
    var time = new Date();
    time.toNow().toMidnight();
    return time.getTime();
};

//回到当前时刻
Date.prototype.toNow = function() {
    this.setTime(Date.now());
    return this;
};

//回到午夜零点
Date.prototype.toMidnight = function() {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};

//获取若干秒前
Date.prototype.secsAgo = function(secs) {
    secs = secs ? secs - 0 : 0;
    return new Date(this.getTime() - secs * 1000);
};

//获取几天前
Date.prototype.daysAgo = function(days) {
    days = days ? days - 0 : 1;
    return this.secsAgo(days * 86400).toMidnight();
};

//获取月初第一天
Date.prototype.monthBegin = function(offset) {
    offset = offset ? offset - 0 : 0;
    var days = this.getDate() - 1 - offset;
    return this.daysAgo(days);
};

//今年第多少天
Date.prototype.getDaysOfYear = function() {
    var first_day = new Date(this.getFullYear(), 0, 1);
    var micro_secs = this.getTime() - first_day.getTime();
    return parseInt(micro_secs / 8.64E7) + 1;
};

//今年第多少周
Date.prototype.getWeeksOfYear = function(start) {
    var offset = this.getDaysOfYear() - 1;
    var remain = offset % 7;
    if (remain > 0) {
        var first_day = new Date(this.getFullYear(), 0, 1);
        if (start) { //周一作为一周开始
            offset += (first_day.getDay() + 6) % 7;
        } else { //周日作为一周开始
            offset += first_day.getDay();
        }
    }
    return parseInt(offset / 7);
};

//格式化输出
Date.prototype.strftime = function(format, local) {
    if (! format) { //标准格式，直到分钟
        return this.toISOString().substr(0, 16).replace('T', ' ');
    }
    var _this = this;

    //前面补充0
    var padZero = function padZero(str, len) {
        var pads = len - str.toString().length;
        return (pads && pads > 0 ? '0'.repeat(pads) : '') + str;
    };

    //语言配置
    var local_labels = {
        monthes: {
            english: ['January', 'February', 'March', 'April',
                    'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'],
            en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            zh: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
        },
        weekdays: {
            english: ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday'],
            en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            zh: ['日', '一', '二', '三', '四', '五', '六'],
        },
        meridians: {
            english: ['a.m.', 'p.m.'],
            en: ['AM', 'PM'],
            zh: ['上午', '下午'],
        },
    };

    local = local && local.startsWith('zh') ? 'zh' : 'en';
    format = format.replace('%F', '%Y-%m-%d');
    format = format.replace(/%D|%x/, '%m/%d/%y');
    format = format.replace(/%T|%X/, '%H:%M:%S');
    format = format.replace('%R', '%H:%M');
    format = format.replace('%r', '%H:%M:%S %p');
    format = format.replace('%c', '%a %b %e %H:%M:%S %Y');

    return format.replace(/%[A-Za-z%]/g, function(f) {
        var ans = f;
        switch (f) {
            case '%%': //原始的%
                ans = '%';
                break;
            case '%Y': //4位年份，前置补0
            case '%G': //4位年份
                ans = _this.getFullYear();
                break;
            case '%y': //2位年份，前置补0
                ans = _this.getFullYear() % 100;
                break;
            case '%C': //年份前2位（世纪减1），前置补0
                ans = _this.getFullYear() / 100;
                break;
            case '%m': //月份，前置补0
            case '%n': //月份（Python中无此参数）
                ans = _this.getMonth() + 1;
                break;
            case '%B': //月份，英文全称
                local = local.startsWith('en') ? 'english' : local;
            case '%b': //月份，英文缩写
                var m = _this.getMonth();
                ans = local_labels.monthes[local][m];
                break;
            case '%d': //日期，前置补0
            case '%e': //日期
                ans = _this.getDate();
                break;
            case '%j': //今年第多少天
                ans = _this.getDaysOfYear();
                break;
            case '%U': //今年第多少周，周日作为一周开始
            case '%W': //今年第多少周，周一作为一周开始
                var ws = _this.getWeeksOfYear('%W' === f);
                ans = padZero(ws, 2);
                break;
            case '%w': //周几，周日为0
                ans = _this.getDay();
            case '%u': //周几，周日为7
                ans = (0 === ans) ? 7 : ans;
                break;
            case '%A': //周几，英文全称
                local = local.startsWith('en') ? 'english' : local;
            case '%a': //周几，英文缩写
                var d = _this.getDay();
                ans = local_labels.weekdays[local][d];
                break;
            case '%H': //24小时格式时钟，前置补0
            case '%k': //24小时格式时钟
                ans = _this.getHours();
                break;
            case '%I': //12小时格式时钟，前置补0
            case '%l': //12小时格式时钟
                ans = _this.getHours();
                ans = ans % 12;
                break;
            case '%M': //分钟，前置补0
                ans = _this.getMinutes();
                break;
            case '%S': //秒钟，前置补0
                ans = _this.getSeconds();
                break;
            case '%s': //时间戳
                ans = parseInt(_this.getTime() / 1000);
                break;
            case '%f': //百万分之一秒，前置补0
                var ms = _this.getMilliseconds();
                ans = padZero(ms * 1000, 6);
                break;
            case '%P': //上午或下午，小写带点号（Python中无点号）
                local = local.startsWith('en') ? 'english' : local;
            case '%p': //上午或下午，大写不带点号
                var h = _this.getHours();
                ans = local_labels.meridians[local][h < 12 ? 0 : 1];
                break;
            case '%z': //时区，格式+0800
                var tzo = _this.getTimezoneOffset();
                var sign = tzo < 0 ? '-' : '+';
                tzo = Math.abs(tzo);
                var ho = padZero(tzo / 60, 2);
                var mo = padZero(tzo % 60, 2);
                ans = sign + ho + mo;
                break;
            default:
                break;
        }
        if ('%C' === f || '%y' === f || '%m' === f || '%d' === f
                    || '%H' === f || '%M' === f || '%S' === f) {
            ans = padZero(ans, 2); //两位前置补0的字段
        }
        return ans.toString();
    });
};