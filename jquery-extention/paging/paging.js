(function($, window, document) {
	// 定义分页类
	function Paging(element, options) {
		this.element = element;
		// 传入形参
		this.options = {
			pageNo: options.pageNo || 1,
			totalPage: options.totalPage,
			totalSize: options.totalSize,
			callback: options.callback
		};
		// 根据形参初始化分页html和css代码
		this.init();
	}
	// 对Paging的实例对象添加公共的属性和方法
	Paging.prototype = {
		constructor: Paging,
		init: function() {
			this.creatHtml();
			this.bindEvent();
		},
		creatHtml: function() {
			var me = this;
			var content = "";
			var current = me.options.pageNo;
			var total = me.options.totalPage;
            var totalNum = me.options.totalSize;
            
			content += '<nav class="blog-pagination" aria-label="Page navigation">' +
			    			'<ul class="pagination">';
			
			content += '<li class="page-item '+ (current == 1 ? 'disabled': '')+'">' +
							'<a class="page-link">上一页</a>' +
						'</li>';
			
			// 总页数 <= 7的时候
			if(total <= 7) {
				for(var i = 1; i <= total; i++) {
					content += '<li class="page-item '+ (i === current ? 'active' : '') + '">' +
                                    '<a class="page-link">' + i + '</a>' +
                                '</li>';
				}
			} else { // 总页数 > 7
				if(current <= 3) { // 当前页 <= 3
					for(var i = 1; i <= 7; i++) {
						content += '<li class="page-item '+ (i === current ? 'active' : '') + '">' +
                                        '<a class="page-link">' + i + '</a>' +
                                    '</li>';
					}
				} else { // 当前页 > 3
					for(var i = current - 3; i <= current - 1; i++) {
						content += '<li class="page-item">' +
                                        '<a class="page-link">' + i + '</a>' +
                                    '</li>';
					}
					
					content += '<li class="page-item active">' +
									'<a class="page-link">' + current + '</a>' +
								'</li>';
					
					for(var i = current + 1; i <= current + 3; i++) {
						content += '<li class="page-item">' +
                                        '<a class="page-link">' + i + '</a>' +
                                    '</li>';
					}
				}
			}
			content += '<li class="page-item '+ (current === total ? 'disabled': '')+'">' +
							'<a class="page-link">下一页</a>' +
						'</li>';
			content += '</ul>  </nav>';
			
			// content += "<span class='totalSize'> 共<span>"+totalNum+"</span>条记录 </span>";
			me.element.html(content);
		},
		//添加页面操作事件
		bindEvent: function() {
			var me = this;
			me.element.off('click', 'a');
			me.element.on('click', 'a', function() {
				var num = $(this).html();
				var id = $(this).attr("id");
				if(id == "prePage") {
					if(me.options.pageNo == 1) {
						me.options.pageNo = 1;
					} else {
						me.options.pageNo = +me.options.pageNo - 1;
					}
				} else if(id == "nextPage") {
					if(me.options.pageNo == me.options.totalPage) {
						me.options.pageNo = me.options.totalPage;
					} else {
						me.options.pageNo = +me.options.pageNo + 1;
					}
				} else if(id =="firstPage") {
					me.options.pageNo = 1;
				} else if(id =="lastPage") {
					me.options.pageNo = me.options.totalPage;
				}else{
					me.options.pageNo = +num;
				}
				me.creatHtml();
				if(me.options.callback) {
					me.options.callback(me.options.pageNo);
				}
			});
		}
	};
	//通过jQuery对象初始化分页对象
	$.fn.paging = function(options) {
		return new Paging($(this), options);
    };
})(jQuery, window, document);