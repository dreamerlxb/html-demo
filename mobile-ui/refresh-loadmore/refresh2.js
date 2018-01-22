function Refresh(el, options) {
    this.el = el;

    this.refreshLayer = this.el.querySelector('.refresh-layer'); //$(this.children('.refresh-layer')[0]);
    this.refreshContainer = this.el.parentNode;
    this.loadMoreLayer = this.el.querySelector('.loadmore-layer'); // $(this.children('.loadmore-layer')[0]);
    this.refreshContent = this.el.querySelector('.refresh-content');

    this.startMoveY = 0;
    this.endMoveY = 0;
    this.refreshDistance = 56; //this.children('.refresh-layer:first-child').height();
    this.isRefresh = false;
    this.isLoadMore = false;
    this.options = options || {};
    this.refreshFunc = this.options.refreshFunc || null;
    this.loadMoreFunc = this.options.loadMoreFunc || null;

    this.__initEvent__();
}

Refresh.prototype.init = function () {

}

Refresh.prototype.__initEvent__ = function () {
    var that = this;
    this.loadMoreLayer.addEventListener('click', function (e) {
        that.finishLoadMore();
    }, false);

    this.el.addEventListener('touchstart', function (e) {
        // console.log('touchstart', e);
        removeClass(that.el, 'refresh'); // 滑动开始时，移除移动动画

        if (that.el.clientTop >= 0) { // 说明已经在最顶端了
            that.isRefresh = true;
            that.startMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
        } else {
            that.isRefresh = false;
        }
    }, false);

    this.el.addEventListener('touchmove', function (e) {
        console.log('touchmove', e);
        if(that.isRefresh) {
            that.endMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
            // console.log(that.endMoveY);
            if(that.endMoveY > that.startMoveY) { // 说明开始向下移动

                that.el.style.transform = "translateY(" + (that.endMoveY - that.startMoveY) + "px)";

                if (that.endMoveY - that.startMoveY > that.refreshDistance) {
                    that.refreshLayer.querySelector('span:first-child').innerHTML = '↑';
                    that.refreshLayer.querySelector('span:last-child').innerHTML = '释放刷新';
                } else { // 改变箭头方向
                    that.refreshLayer.querySelector('span:first-child').innerHTML = '↓';
                    that.refreshLayer.querySelector('span:last-child').innerHTML = '下拉刷新';
                }
            }
        } else {
            // console.log('touchmove', that.el.clientTop);
            if (that.el.clientTop >= 0) { // 说明已经在最顶端了
                that.isRefresh = true;
                that.startMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
            } else {
                that.isRefresh = false;
            }
        }
    }, false);

    this.el.addEventListener('touchend', function (e) {
        console.log(that.el.scrollHeight)
        console.log(that.el.scrollTop)
        console.log(that.el.clientHeight)
        console.log(that.el.offsetHeight)

            console.log('===========');
        if (that.isRefresh) { // 说明已经在最顶端了
            if(that.endMoveY > that.startMoveY) {// 说明是向下移动的
                if (that.endMoveY - that.startMoveY >= that.refreshDistance) { // 如果移动超过refreshDistance的高度后,进入刷新状态
                    that.el.className = that.el.className + ' refresh';
                    that.el.style.webkitTransform = "translateY(" + that.refreshDistance + "px)";

                    that.refreshLayer.querySelector('span:last-child').innerHTML = ('加载中...');
                    that.refreshLayer.querySelector('span:first-child').innerHTML = ('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                    if (that.refreshFunc) { // 开始刷新
                        that.refreshFunc(that);
                    }
                } else { // 否则重置
                    that.el.className = that.el.className + ' refresh';

                    that.el.style.transform = "translateY(-0px)";
                }
            }
        } else {
            if(Math.abs(that.loadMoreLayer.clientTop -  that.refreshContainer.offsetHeight)  < 1) {
                that.isLoadMore = true;
                that.loadMoreLayer.querySelector('span:last-child').innerHTML = '加载中...';
                that.loadMoreLayer.querySelector('span:first-child').innerHTML = '<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>';
                if(that.loadMoreFunc) {
                    that.loadMoreFunc(that);
                }
            }
        }
    }, false);
}

Refresh.prototype.finishRefresh = function () {
    this.isRefresh = false;
    this.el.className = this.el.className + ' refresh';
    this.el.style.transform = "translateY(-0px)";
    this.refreshLayer.querySelector('span:last-child').innerHTML = '下拉刷新';
    this.refreshLayer.querySelector('span:first-child').innerHTML = '↓';
}

Refresh.prototype.finishLoadMore = function () {
    this.isLoadMore = false;
    this.loadMoreLayer.querySelector('span:last-child').innerHTML = '点击加载';
    this.loadMoreLayer.querySelector('span:first-child').innerHTML = '';
}

function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' '; //获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '); //将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '

    var removed = obj_class.replace(' ' + cls + ' ', ' '); //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, ''); //去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed; //替换原来的 class.
}