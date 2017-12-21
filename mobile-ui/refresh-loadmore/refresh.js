$(function() {
    $.fn.extend({
        refresh: function(refreshFunc, loadMoreFunc) {
            var that = this;
            var startMoveY = 0;
            var endMoveY = 0;
            var refreshDistance = 56; //this.children('.refresh-layer:first-child').height();
            var isRefresh = false;

            var $refreshLayer = $(this.children('.refresh-layer')[0]);
            var $refreshContainer = $(this.parent('.refresh-container')[0]);
            var $loadMoreLayer = $(this.children('.loadmore-layer')[0]);

            $loadMoreLayer.click(function() {
                $(this).children('span:last').html('加载中...');
                $(this).children('span:first').html('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                if(loadMoreFunc) {
                    loadMoreFunc(that);
                }
            });

            this.on('touchstart', function(e) {
                $(this).removeClass('refresh'); // 滑动开始时，移除移动动画
                if ($(this).offset().top >= 0) { // 说明已经在最顶端了
                    isRefresh = true;
                    startMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
                } else {
                    isRefresh = false;
                }
            }).on('touchmove', function(e) {
                var $this = $(this);
                if (isRefresh) {
                    endMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
                    if (endMoveY > startMoveY) { // 说明开始向下移动
                        $this.css('transform', 'translateY(' + (endMoveY - startMoveY) + 'px)');
                        if (endMoveY - startMoveY > refreshDistance) {
                            $refreshLayer.children('span:first').html('↑');
                            $refreshLayer.children('span:last').html('释放刷新');
                        } else { // 改变箭头方向
                            $refreshLayer.children('span:first').html('↓');
                            $refreshLayer.children('span:last').html('下拉刷新');
                        }
                    }
                } else {
                    if ($this.offset().top >= 0) { // 不是刷新状态时，判断是否下拉到顶部，如果是，那么进入下拉状态
                        isRefresh = true;
                        startMoveY = e.targetTouches[0].pageY; // 记录开始move时的触点（Y方向）
                    } else {
                        isRefresh = false;
                    }
                }
            }).on('touchend', function(e) {
                if (isRefresh) {
                    if (endMoveY > startMoveY) { // 说明是向下移动的
                        if (endMoveY - startMoveY >= refreshDistance) { // 如果移动超过refreshDistance的高度后,进入刷新状态
                            $(this).addClass('refresh').css('transform', 'translateY('+ refreshDistance +'px)');
                            $refreshLayer.children('span:last').html('加载中...');
                            $refreshLayer.children('span:first').html('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                            if (refreshFunc) { // 开始刷新
                                refreshFunc(that);
                            }
                        } else { // 否则重置
                            $(this).addClass('refresh').css('transform', 'translateY(-0px)');
                        }
                    }
                } else { // 加载更多
                    if(Math.abs($loadMoreLayer.offset().top -  $refreshContainer.height())  < 1) {
                        $loadMoreLayer.children('span:last').html('加载中...');
                        $loadMoreLayer.children('span:first').html('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                        if(loadMoreFunc) {
                            loadMoreFunc(that);
                        }
                    }
                }
            });
        },
        finishRefresh: function() {
            var $refreshLayer = $(this.children('.refresh-layer')[0]);
            this.addClass('refresh').css('transform', 'translateY(-0px)'); //复原
            $refreshLayer.children('span:last').html('下拉刷新');
            $refreshLayer.children('span:first').html('↓');
        },
        finishLoadMore: function() {
            var $loadMoreLayer = $(this.children('.loadmore-layer')[0]);
            $loadMoreLayer.children('span:last').html('点击加载');
            $loadMoreLayer.children('span:first').html('');
        }
    });
});