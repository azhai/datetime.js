# datetime.js

Date对象的补充函数，包括类似Python中的strftime()

示例  
https://runjs.cn/code/pbphsxrs （已失效）
http://jsrun.pro/FafKp/edit

```
<script>
//在页面导入 datetime.min.js
var format = "%Y年 %B %e日 星期%A %H:%M";
document.write((new Date).strftime(format, "zh"));
document.write("<br>");
document.write((new Date).daysAgo(3).humanize("zh"));
document.write("<br>");
</script>
```

## 压缩JS文件

```
#安装 UglifyJS2
npm install uglify-js -g
#压缩文件
uglifyjs -c -m -o datetime.min.js -- src/datetime.js
```

## Date.prototype.humanize(local)

将最近几天日期改为 今天、昨天、x天前、明天、x天后（x为2~9）

## Date.prototype.strftime(format, local)

* %%    原始的%
* %Y    4位年份，前置补0
* %G    4位年份
* %y    2位年份，前置补0
* %C    年份前2位（世纪减1），前置补0
* %m    月份，前置补0
* %n    月份（Python中无此参数）
* %B    月份，英文全称
* %b    月份，英文缩写
* %d    日期，前置补0
* %e    日期
* %j    今年第多少天
* %U    今年第多少周，周日作为一周开始
* %W    今年第多少周，周一作为一周开始
* %w    周几，周日为0
* %u    周几，周日为7
* %A    周几，英文全称
* %a    周几，英文缩写
* %H    24小时格式时钟，前置补0
* %k    24小时格式时钟
* %I    12小时格式时钟，前置补0
* %l    12小时格式时钟
* %M    分钟，前置补0
* %S    秒钟，前置补0
* %s    时间戳
* %f    百万分之一秒，前置补0
* %P    上午或下午，小写带点号（Python中无点号）
* %p    上午或下午，大写不带点号
* %z    时区，格式+0800
* %F    相当于 %Y-%m-%d
* %D    相当于 %m/%d/%y
* %x    相当于 %m/%d/%y
* %T    相当于 %H:%M:%S
* %X    相当于 %H:%M:%S
* %R    相当于 %H:%M
* %r    相当于 %H:%M:%S %p
* %c    相当于 %a %b %e %H:%M:%S %Y


## Date.prototype.getDaysOfYear()

今年第多少天


## Date.prototype.getWeeksOfYear(start)

今年第多少周


## Date.today()

今天零点的时间戳


## Date.prototype.toNow()

回到当前时刻


## Date.prototype.toMidnight()

回到午夜零点


## Date.prototype.secsAgo(secs)

获取若干秒前


## Date.prototype.daysAgo(days)

获取几天前


## Date.prototype.monthBegin(offset)

获取月初第一天
