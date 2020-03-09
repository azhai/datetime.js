var SECOND_MILLS = 1000,
    HOUR_SECS = 3600,
    DAY_SECS = 86400;
var ZONE_HOURS = 8; // 北京时区

Date.today = function () {
    var time = new Date();
    time.toNow().toMidnight();
    return time.getTime();
};

Date.prototype.toNow = function () {
    this.setTime(Date.now());
    return this;
};

Date.prototype.toMidnight = function () {
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
};

Date.prototype.secsAgo = function (secs) {
    secs = secs ? secs - 0 : 0;
    return new Date(this.getTime() - secs * SECOND_MILLS);
};

Date.prototype.daysAgo = function (days, midnight) {
    days = days ? days - 0 : 1;
    var date = this.secsAgo(days * DAY_SECS);
    if (midnight) {
        return date.toMidnight();
    }
    return date;
};

Date.prototype.monthBegin = function (offset) {
    offset = offset ? offset - 0 : 0;
    var days = this.getDate() - 1 - offset;
    return this.daysAgo(days, true);
};

Date.prototype.getDaysOfYear = function () {
    var first_day = new Date(this.getFullYear(), 0, 1);
    var micro_secs = this.getTime() - first_day.getTime();
    return parseInt(micro_secs / DAY_SECS) + 1;
};

Date.prototype.getWeeksOfYear = function (start) {
    var offset = this.getDaysOfYear() - 1;
    var remain = offset % 7;
    if (remain > 0) {
        var first_day = new Date(this.getFullYear(), 0, 1);
        if (start) {
            offset += (first_day.getDay() + 6) % 7;
        } else {
            offset += first_day.getDay();
        }
    }
    return parseInt(offset / 7);
};

Date.prototype.strftime = function (format, local) {
    if (!format) {
        var str = this.secsAgo(0 - ZONE_HOURS * HOUR_SECS).toISOString();
        return str.substr(0, 16).replace("T", " ");
    }
    local = local && local.startsWith("zh") ? "zh" : "en";
    var padZero = function padZero(str, len) {
        var pads = len - str.toString().length;
        return (pads && pads > 0 ? "0".repeat(pads) : "") + str;
    };
    format = format.replace("%F", "%Y-%m-%d");
    format = format.replace(/%D|%x/, "%m/%d/%y");
    format = format.replace(/%T|%X/, "%H:%M:%S");
    format = format.replace("%R", "%H:%M");
    format = format.replace("%r", "%H:%M:%S %p");
    format = format.replace("%c", "%a %b %e %H:%M:%S %Y");
    var _this = this;
    return format.replace(/%[A-Za-z%]/g, function (f) {
        var ans = f;
        switch (f) {
            case "%%":
                ans = "%";
                break;

            case "%Y":
            case "%G":
                ans = _this.getFullYear();
                break;

            case "%y":
                ans = _this.getFullYear() % 100;
                break;

            case "%C":
                ans = _this.getFullYear() / 100;
                break;

            case "%m":
            case "%n":
                ans = _this.getMonth() + 1;
                break;

            case "%B":
                local = local.startsWith("en") ? "english" : local;

            case "%b":
                var m = _this.getMonth();
                ans = local_labels.monthes[local][m];
                break;

            case "%d":
            case "%e":
                ans = _this.getDate();
                break;

            case "%j":
                ans = _this.getDaysOfYear();
                break;

            case "%U":
            case "%W":
                var ws = _this.getWeeksOfYear("%W" === f);
                ans = padZero(ws, 2);
                break;

            case "%w":
                ans = _this.getDay();

            case "%u":
                ans = 0 === ans ? 7 : ans;
                break;

            case "%A":
                local = local.startsWith("en") ? "english" : local;

            case "%a":
                var d = _this.getDay();
                ans = local_labels.weekdays[local][d];
                break;

            case "%H":
            case "%k":
                ans = _this.getHours();
                break;

            case "%I":
            case "%l":
                ans = _this.getHours();
                ans = ans % 12;
                break;

            case "%M":
                ans = _this.getMinutes();
                break;

            case "%S":
                ans = _this.getSeconds();
                break;

            case "%s":
                ans = parseInt(_this.getTime() / SECOND_MILLS);
                break;

            case "%f":
                var ms = _this.getMilliseconds();
                ans = padZero(ms * 1e3, 6);
                break;

            case "%P":
                local = local.startsWith("en") ? "english" : local;

            case "%p":
                var h = _this.getHours();
                ans = local_labels.meridians[local][h < 12 ? 0 : 1];
                break;

            case "%z":
                var tzo = _this.getTimezoneOffset();
                var sign = tzo < 0 ? "-" : "+";
                tzo = Math.abs(tzo);
                var ho = padZero(tzo / 60, 2);
                var mo = padZero(tzo % 60, 2);
                ans = sign + ho + mo;
                break;

            default:
                break;
        }
        if ("%C" === f || "%y" === f || "%m" === f || "%d" === f || "%H" === f || "%M" === f || "%S" === f) {
            ans = padZero(ans, 2);
        }
        return ans.toString();
    });
};

Date.prototype.humanize = function (local) {
    local = local && local.startsWith("zh") ? "zh" : "en";
    var result = this.strftime("", local);
    var days = (Date.today() - this.toMidnight().getTime()) / SECOND_MILLS / DAY_SECS;
    if (days <= -10 || days >= 10) {
        return result;
    }
    var labels = local_labels.dayagos[local];
    var lbl = "";
    if (days === 0 || days === 1) {
        lbl = labels[days];
    } else if (days === -1) {
        lbl = labels[2];
    } else if (days >= 2) {
        lbl = days + labels[3];
    } else {
        lbl = days + labels[4];
    }
    return lbl + result.substr(10, 6);
};

var local_labels = {
    monthes: {
        english: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        zh: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    },
    weekdays: {
        english: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        zh: ["日", "一", "二", "三", "四", "五", "六"]
    },
    meridians: {
        english: ["a.m.", "p.m."],
        en: ["AM", "PM"],
        zh: ["上午", "下午"]
    },
    dayagos: {
        english: ["Today", "Yesterday", "Tomorrow", " days ago", " days late"],
        en: ["Today", "Yesterday", "Tomorrow", " days ago", " days late"],
        zh: ["今天", "昨天", "明天", "天前", "天后"]
    }
};