// (function () {
   function Calendar(dom) {
        this.container = dom;

        this.header = document.createElement("div");
        // 表格区 显示数据
        this.body = document.createElement("div");
        // this.footer = document.createElement("div");

        this.calendarStart = new Date();
        this.calendarEnd = new Date();

        this.current = new Date();

        this.createHeaderHtml();
        this.createBodyHtml();

       // this.container.appendChild(this.footer);
   }

   Calendar.prototype.createHeaderHtml = function() {
        this.header.className = 'calendar-title-box';     // 设置标题盒子中的html
        this.header.innerHTML = "" +
            "<span class='prev-month' id='prevMonth'></span>" +       
            "<span class='calendar-title' id='calendarYear'> " + this.current.getFullYear() + "</span>" + // year
            "<span class='calendar-title' id='calendarMonth'>" + (this.current.getMonth() + 1) + "</span>" + // month
            "<span id='nextMonth' class='next-month'></span>";

        this.container.appendChild(this.header);
        this.__bindEvent__();
   };
   
   Calendar.prototype.createBodyHtml = function() {
        // 设置表格区的html结构 
        this.body.className = 'calendar-body-box';    
        var _headHtml = "" +
            "<thead>" +
                "<tr>" +
                    "<th>一</th>" +
                    "<th>二</th>" +
                    "<th>三</th>" +
                    "<th>四</th>" +
                    "<th>五</th>" +
                    "<th>六</th>" +
                    "<th>日</th>" +
                "</tr>" +
            "</thead>";
        var _bodyHtml ="<tbody> </tbody>";
        
        this.body.innerHTML = "" +
            "<table id='calendarTable' class='calendar-table'>" +
                _headHtml +
                _bodyHtml +
            "</table>";     // 添加到calendar div中

        this.container.appendChild(this.body);
        
   };

    Calendar.prototype.show = function() {
        this.__calData__();
        this.__createDayHtml__();
    };

    Calendar.prototype.reload = function() {
        this.header.querySelector('#calendarYear').innerHTML = this.current.getFullYear();
        this.header.querySelector('#calendarMonth').innerHTML = (this.current.getMonth() + 1)
        this.show();
    };

   /**
    * 共5行 7列 35个数据
    prevDays： 上月共有几天
    currentDays： 本月有几天
    */
   Calendar.prototype.__createDayHtml__ = function() {
        var _bodyHtml = "";      // 一个月最多31天，所以一个月最多占6行表格
        
        console.log(this.calendarStart.getFullYear() + "-" + (this.calendarStart.getMonth() + 1) + "-" + this.calendarStart.getDate());
        var tmpDate = new Date();
        tmpDate.setTime(this.calendarStart.getTime());

        var now = new Date();

        for (var i = 0; i < 5; i++) {
            _bodyHtml += "<tr>";
            for(var j = 0; j < 7; j++) {
                tmpDate.setTime(tmpDate.getTime() + 24 * 60 * 60 * 1000);

                if(now.getFullYear() === tmpDate.getFullYear() &&
                    now.getMonth() === tmpDate.getMonth() &&
                        now.getDate() === tmpDate.getDate() ) {
                        _bodyHtml += "<td class='today' data-date='" + (tmpDate.getFullYear() + "-" + (tmpDate.getMonth() + 1) + "-" + tmpDate.getDate()) + "'>" + tmpDate.getDate() + "</td>";
                    } else {
                        _bodyHtml += "<td data-date='" + (tmpDate.getFullYear() + "-" + (tmpDate.getMonth() + 1) + "-" + tmpDate.getDate()) + "'>" + tmpDate.getDate() + "</td>";
                    }
            }
            _bodyHtml += "</tr>";
        }

        this.body.querySelector('table tbody').innerHTML = _bodyHtml;
   };

   Calendar.prototype.__calData__ = function() {
        // 下月的第一天
        var firstDayOfNextMonth = new Date(this.current.getFullYear() + '-' + (this.current.getMonth() + 1 + 1) + '-01');
        // 当前月的第一天
        var firstDayOfCurrentMonth = new Date(this.current.getFullYear() + "-" + (this.current.getMonth() + 1) + "-01");
        // 当前月的最后一天
        var lastDayOfCurrentMonth = new Date(firstDayOfNextMonth.getTime() - 1 * 24 * 60 * 60 * 1000);
        // 上月的最后一天
        var lastDayOfPrevMonth = new Date(firstDayOfCurrentMonth.getTime() - 1 * 24 * 60 * 60 * 1000);

        // 当前月第一天的星期
        var week1 = firstDayOfCurrentMonth.getDay();
        // 需要向前一个月借 (week1 - 1)天
        // 所以日历的开始点为上月的最后一天减去(week1 - 1)天
        this.calendarStart = new Date(lastDayOfPrevMonth.getTime() - (week1 - 1) * 24 * 60 * 60 * 1000);
        console.log(this.calendarStart);

        // 当前月最后一天的星期
        var week2 = lastDayOfCurrentMonth.getDay();
        // 需要向下一个月借 (7 - week2) 天
        // 所以日历的结束点为下月的第一天加上(7 - week2)天
        this.calendarEnd = new Date(firstDayOfNextMonth.getTime() + (7 - week2) * 24 * 60 * 60 * 1000);
        console.log(this.calendarEnd);
   };

   Calendar.prototype.__bindEvent__ = function() {
        var prevMonth = document.getElementById("prevMonth");
        var nextMonth = document.getElementById("nextMonth");
        var self = this;
        addEvent(prevMonth, 'click', function(e) {
            self.current.setTime(self.current.getTime() - 30 * 24 * 60 * 60 * 1000);
            self.reload();
        });
        addEvent(nextMonth, 'click', function(e) {
            self.current.setTime(self.current.getTime() + 30 * 24 * 60 * 60 * 1000);
            self.reload();
        });
   };
// })();

/**
 * 绑定事件
 */
function addEvent(dom, eType, func) {
    if (dom.addEventListener) {  // DOM 2.0
        dom.addEventListener(eType, func);
    } else if (dom.attachEvent) {  // IE5+
        dom.attachEvent('on' + eType, func);
    } else {  // DOM 0
        dom['on' + eType] = func;
    }
}