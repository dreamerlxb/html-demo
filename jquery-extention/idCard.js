(function (Utils) {
    var aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };

    function IDCard(idCardNum) {
        this.idCardNum = idCardNum;
        this.errorInfo = "";
        this.hasError = true;
        this.birthday = null;
        this.province = "";
        this.provinceCode = 0;
        this.gender = 0;
    }

    //18位校验 XXXXXXXXXXXXXXXXXX
    // 六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。顺序码的奇数分给男性，偶数分给女性。
    // 1~2  省
    // 3~4  市
    // 5~6  区
    // 7~10 出生年
    // 11~12 月
    // 13~14 日
    // 15~17 顺序码
    // 18 校验位
    IDCard.prototype._isCardIDFor18 = function () {
        var sId = this.idCardNum;

        sId = sId.replace(/x$/i, "a");
        this.provinceCode = parseInt(sId.substr(0, 2));
        this.province = aCity[this.provinceCode];
        if (this.province == null) {
            this.errorInfo = "你的身份证地区非法";
            this.hasError = true;
            return false;
        }

        var year = sId.substr(6, 4);
        var month = sId.substr(10, 2);
        var day = sId.substr(12, 2);
        var sBirthday = year + "-" + month + "-" + day;

        this.birthday = new Date(sBirthday.replace(/-/g, "/"));

        if (year != this.birthday.getFullYear() ||
            month != (this.birthday.getMonth() + 1) ||
            day != this.birthday.getDate()) {
            this.errorInfo = "身份证上的出生日期非法";
            this.hasError = true;
            return false;
        }
        // 校验位
        var iSum = 0;
        for (var i = 17; i >= 0; i--) {
            // 第i位置上的加权因子 Wi = 2^ (n-1）(mod 11)
            var w = Math.pow(2, i) % 11; //从右往左
            console.log('w = ', w);

            // 第i位置上的号码字符值
            var a = parseInt(sId.charAt(17 - i), 11);
            console.log('a = ', a);
            iSum += w * a;
        }

        if (iSum % 11 != 1) {
            this.errorInfo = "你输入的身份证号非法";
            this.hasError = true;
            return false;
        }
        // 1: "男",  0: "女"
        this.gender = sId.substr(16, 1) % 2;

        this.errorInfo = null;
        this.hasError = false;
        return true;
    };

    // 15位校验规则 6位地址编码+6位出生日期+3位顺序号
    IDCard.prototype._isCardIDFor15 = function () {
        var sId = this.idCardNum;

        if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(sId)) {
            this.errorInfo = "身份证号格式错误";
            this.hasError = true;
            return false;
        }

        this.provinceCode = parseInt(sId.substr(0, 2));

        if (aCity[this.provinceCode] == null) {
            this.errorInfo = "你的身份证地区非法";
            this.hasError = true;
            return false;
        }

        this.errorInfo = null;
        this.hasError = false;
        return true;
    };

    IDCard.prototype.isCardID = function() {
        var sId = this.idCardNum;

        if (/^\d{17}(\d|x)$/i.test(sId)) {
            return this._isCardIDFor18();
        }
        if (/^\d{15}$/i.test(sId)) {
            return this._isCardIDFor15();
        }
        this.errorInfo = "你输入的身份证长度或格式错误";
        return false;
    };

    Utils.checkIDCard = function(sid) {
        var aa = new IDCard(sid);
        aa.isCardID();
        return aa;
    };
})(Utils);