(function (window, undefined) {
    var Utils = (function () {
        // 构建Utils对象 
        var Utils = function () {
            return new Utils.fn.init();
        };

        // Utils对象原型
        Utils.fn = Utils.prototype = {
            constructor: Utils,
            init: function () {
            }
        };

        // Give the init function the Utils prototype for later instantiation 
        Utils.fn.init.prototype = Utils.fn;

        // 合并内容到第一个参数中，后续大部分功能都通过该函数扩展 
        // 通过Utils.fn.extend扩展的函数，大部分都会调用通过Utils.extend扩展的同名函数 
        Utils.extend = Utils.fn.extend = function () {};

        // 在jQuery上扩展静态方法 
        Utils.extend({
            // something to do 
        });

        // 到这里，Utils对象构造完成，后边的代码都是对Utils或Utils对象的扩展 
        return Utils;
    })();
    window.Utils = Utils;
})(window);