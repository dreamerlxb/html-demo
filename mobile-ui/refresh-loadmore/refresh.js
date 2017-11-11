$(function() {
    $.fn.extend({
        refresh: function(refreshFunc, loadMoreFunc) {
            var that = this;
            var startMoveY = 0;
            var endMoveY = 0;
            var refreshDistance = 56; //this.children('.refresh-layer:first-child').height();
            var isRefresh = false;
            this.children('.loadmore-layer').click(function() {
                console.log('====AA====', this);
                $(this).children('span:last').html('加载中...');
                $(this).children('span:first').html('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                if(loadMoreFunc) {
                    loadMoreFunc(that);
                }
            });

            // var viewH = $this.height(), //可见高度  
            // contentH = $this.get(0).scrollHeight,//内容高度  
            // scrollTop = $this.scrollTop(); //滚动高度 
            var content = this.children('.refresh-content')[0];
            console.log('viewH', $(content).height());
            console.log('contentH', $(content).get(0).scrollHeight);
            console.log('scrollTop', $(content).scrollTop());

            this.on('touchstart', function(e) {
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
                            $this.children('.refresh-layer').children('span:first').html('↑');
                            $this.children('.refresh-layer').children('span:last').html('释放刷新');
                        } else { // 改变箭头方向
                            $this.children('.refresh-layer').children('span:first').html('↓');
                            $this.children('.refresh-layer').children('span:last').html('下拉刷新');
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
                console.log("endMoveY = ", endMoveY);
            }).on('touchend', function(e) {
                if (isRefresh) {
                    if (endMoveY > startMoveY) { // 说明是向下移动的
                        if (endMoveY - startMoveY >= refreshDistance) { // 如果移动超过refreshDistance的高度后,进入刷新状态
                            $(this).css('transform', 'translateY('+ refreshDistance +'px)');
                            $(this).children('.refresh-layer').children('span:last').html('加载中...');
                            $(this).children('.refresh-layer').children('span:first').html('<i class="fa fa-circle-o-notch spin-icon-load" style="font-size: 18px;"></i>');
                            if (refreshFunc) { // 开始刷新
                                refreshFunc(that);
                            }
                        } else { // 否则重置
                            $(this).css('transform', 'translateY(-0px)');
                        }
                    }
                }
            });
            this.scroll(function() {
                var $this = $(this);
                var viewH = $this.height(), //可见高度  
                contentH = $this.get(0).scrollHeight,//内容高度  
                scrollTop = $this.scrollTop(); //滚动高度 

                console.log('viewH', viewH);
                console.log('contentH', contentH);
                console.log('scrollTop', scrollTop);
                if(scrollTop/(contentH -viewH) >= 0.95) { //到达底部100px时,加载新内容  
                    console.log("load more");
                }  
            });
        },
        finishRefresh: function() {
            this.css('transform', 'translateY(-0px)'); //复原
            this.children('.refresh-layer').children('span:last').html('下拉刷新');
            this.children('.refresh-layer').children('span:first').html('↓');
        },
        finishLoadMore: function() {
            this.children('.loadmore-layer').children('span:last').html('点击加载');
            this.children('.loadmore-layer').children('span:first').html('');
        }
    });
});