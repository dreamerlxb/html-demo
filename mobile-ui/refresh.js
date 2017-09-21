$(function() {
    $.fn.extend({
        refresh: function(refreshFunc) {
            var that = this;
            var startMoveY = 0;
            var endMoveY = 0;
            var refreshLayerH = this.children('.refresh-layer:first-child').height();
            var isRefresh = false;
            $(this).css({
                overflow: 'scroll',
                transform: 'translateY(-' + refreshLayerH + 'px)'
            });
            this.on('touchstart', function(e) {
                if ($(this).offset().top >= 0) { // 说明已经在最顶端了
                    isRefresh = true;
                    startMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
                } else {
                    isRefresh = false;
                }
            }).on('touchmove', function(e) {
                if (isRefresh) {
                    endMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
                    if (endMoveY > startMoveY) { // 说明开始向下移动
                        $(this).css('transform', 'translateY(' + (endMoveY - startMoveY - refreshLayerH) + 'px)');
                        if (endMoveY - startMoveY > refreshLayerH) {
                            $(this).children('.refresh-layer').children('span:first').html('↑');
                            $(this).children('.refresh-layer').children('span:last').html('释放刷新');
                        } else { // 改变箭头方向
                            $(this).children('.refresh-layer').children('span:first').html('↓');
                            $(this).children('.refresh-layer').children('span:last').html('下拉刷新');
                        }
                    }
                } else {
                    if ($(this).offset().top >= 0) { // 不是刷新状态时，判断是否下拉到顶部，如果是，那么进入下拉状态
                        isRefresh = true;
                        startMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
                    } else {
                        isRefresh = false;
                    }
                }
            }).on('touchend', function(e) {
                if (isRefresh) {
                    if (endMoveY > startMoveY) { // 说明是向下移动的
                        if (endMoveY - startMoveY >= refreshLayerH) { // 如果移动超过refresh-layer的高度后,进入刷新状态
                            $(this).css('transform', 'translateY(0px)');
                            $(this).children('.refresh-layer').children('span:last').html('加载中...');
                            $(this).children('.refresh-layer').children('span:first').html('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                            if (refreshFunc) { // 开始刷新
                                refreshFunc(that);
                            }
                        } else { // 否则重置
                            $(this).css('transform', 'translateY(-' + refreshLayerH + 'px)');
                        }
                    }
                }
            });
        },
        finishRefresh: function() {
            var refreshLayerH = this.children('.refresh-layer:first-child').height();
            this.css('transform', 'translateY(-' + refreshLayerH + 'px)'); //复原
            this.children('.refresh-layer').children('span:last').html('下拉刷新');
            this.children('.refresh-layer').children('span:first').html('↓');
        }
    });
});