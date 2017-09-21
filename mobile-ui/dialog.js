$(function() {
    $.fn.extend({
        showModal: function() {
            // 默认显示遮罩层
            var overlayId = 'modal-overlay-' + Date.now();
            var that = this;
            var overlay = $('<div id="' + overlayId + '" class="modal-overlay"></div>');
            overlay.css({
                visibility: 'visible',
                opacity: 1
            });
            overlay.click(function() {
                $(this).remove();
                that.hide();
            });
            this.data('overlay', overlayId);
            this.before(overlay);
            this.show();
            this.css({
                "animation": 'action_translateY_in',
                "animation-duration": '0.5s',
                'animation-timing-function': 'ease',
                "animation-fill-mode": "forwards"
            });
        },
        closeModal: function() {
            this.css({
                "animation": 'action_translateY_out',
                "animation-duration": '0.5s',
                'animation-timing-function': 'ease',
                "animation-fill-mode": "backwards"
            });
            var that = this;
            var overlayId = this.data('overlay');
            var setInt_obj = setInterval(function() {
                that.hide();
                $('#' + overlayId).remove(); //移除遮罩
                clearInterval(setInt_obj);
            }, 0.5 * 1000);
        }
    });
    $.extend({
        alert: function(opts = {}) {
            if (opts.label) {
                var label = '<span class="title"><p>' + opts.label + '</p></span>';
            }
            var d = Date.now();

            var overlay = $('<div class="modal-overlay" style="visibility:visible;opacity:1; "></div>');
            $('body').append(overlay);

            var a = `<div class="modal dialog-modal action-dialog">
                        <div class="action-item">
                            ${label}
                        </div>
                        <div style="height:1px; background:RGBA(243, 243, 243, 1.00); width:100%;"></div>
                        <div class="action-btn">
                          <span id="${d + '_ok'}" style="color:#0894ec">确定</span>
                        </div>
                    </div>`;
            var aSel = $(a);
            $('body').append(aSel);
            aSel.css({
                "animation": 'action_translateY_in',
                "animation-duration": '0.5s',
                'animation-timing-function': 'ease',
                "animation-fill-mode": "forwards"
            });
            // 关闭alert
            $(`#${d+ '_ok'}`).click(function() {
                aSel.css({
                    "animation": 'action_translateY_out',
                    "animation-duration": '0.5s',
                    'animation-timing-function': 'ease',
                    "animation-fill-mode": "forwards"
                });

                var setInt_obj = setInterval(function() {
                    aSel.remove();
                    overlay.remove();
                    clearInterval(setInt_obj);
                }, 0.5 * 1000);

            });
        },
        confirm: function(opts = {}) {
            var overlay = $('<div class="modal-overlay" style="visibility:visible;opacity:1;"></div>');
            $('body').append(overlay);

            var d = Date.now();
            var c = `
            <div class="modal dialog-modal action-dialog">
                <div class="action-item">
                    <span class="title"><p>${opts.label ? opts.label : '提示'}</p></span>
                </div>
                <div style="height:1px; background:RGBA(243, 243, 243, 1.00); width:100%;"></div>
                <div class="action-btn" style="display:flex;display: flex;width: inherit;align-items: center;align-content: center;justify-content: space-around;">
                    <span id="${d + '_cancel'}" class="close" style="color:#0894ec">取消</span>
                    <span style="width:1px; background:RGBA(243, 243, 243, 1.00); height:25px;"></span>
                    <span id="${d + '_ok'}" class="close" style="color:#0894ec">确定</span>
                </div>
            </div>
            `;
            var cSel = $(c);
            $('body').append(cSel);

            cSel.css({
                "animation": 'action_translateY_in',
                "animation-duration": '0.5s',
                'animation-timing-function': 'ease',
                "animation-fill-mode": "forwards"
            });
            // 点击取消
            $(`#${d + '_cancel'}`).click(function() {
                cSel.css({
                    "animation": 'action_translateY_out',
                    "animation-duration": '0.5s',
                    'animation-timing-function': 'ease',
                    "animation-fill-mode": "forwards"
                });
                var setInt_obj = setInterval(function() {
                    cSel.remove();
                    overlay.remove();
                    clearInterval(setInt_obj);
                }, 0.5 * 1000);
            });
            // 点击确定
            $(`#${d + '_ok'}`).click(function() {
                cSel.css({
                    "animation": 'action_translateY_out',
                    "animation-duration": '0.5s',
                    'animation-timing-function': 'ease',
                    "animation-fill-mode": "forwards"
                });
                var setInt_obj = setInterval(function() {
                    aSel.remove();
                    overlay.remove();
                    clearInterval(setInt_obj);
                }, 0.5 * 1000);
                if (opts.okFunc) {
                    opts.okFunc();
                }
            });
        },
        showLoading: function(title = '加载中...') {
            var overlay = $('<div class="modal-overlay" style="visibility:visible;opacity:1;"></div>');
            overlay.css('background', 'rgba(0, 0, 0, 0.1)');
            $('body').append(overlay);

            var d = `
              <div class="loading" style="z-index:11600;">
                  <span><img src="loading.gif"><i class="fa fa-circle-o-notch spin-icon-loading spin-icon" style="font-size: 18px;"></i></span>
                  <span class="title" style="color:#ffffff;">${title}</span>
              </div>
            `;
            var dSel = $(d);
            $('body').append(dSel);
        },
        hideLoading: function() {
            $('body>.modal-overlay').remove();
            $('body>.loading').remove();
        },
        toast: function(opts = {}) {
            var e = `
              <div class="toast" style="z-index:11100; position: absolute;bottom: 20%;">
              ${opts.label}
              </div>
              `;
            var eSel = $(e);
            $('body').append(eSel);
            setTimeout(function() {
                eSel.remove();
            }, 2000);
        },
        actionSheets: function(opts = {}) {
            var overlay = $('<div class="modal-overlay" style="visibility:visible;opacity:1;"></div>');
            $('body').append(overlay);

            if (opts.buttons) {
                var bs = opts.buttons.map(function(item, index) {
                    return `
                      <div style="height:1px; background:#CFB9B9; width:100%;"/>
                      <span data-index="${index}" class="actions-modal-button">${item}</span>
                      `;
                });
            }
            var d = Date.now();
            var f = `
              <div class="modal actions-modal">
                <div class="actions-modal-group" style="margin: 0.4rem;background:rgba(243, 243, 243, 0.95);">
                    <span class="actions-modal-label">${opts.title ? opts.title : '请选择' }</span>
                    ${bs.join('')}
                </div>
                <div class="actions-modal-group" style="background: red; color: white;">
                    <span id="${d + '_cancel'}" class="actions-modal-button bg-danger">取消</span>
                </div>
              </div>
              `;
            var fSel = $(f);
            $('body').append(fSel);
            fSel.css({
                "animation": 'action_translateY_in',
                "animation-duration": '0.5s',
                'animation-timing-function': 'ease',
                "animation-fill-mode": "forwards"
            });
            // 选中某一项
            fSel.children('.actions-modal-group:first-child').children('.actions-modal-button').click(function() {
                fSel.css({
                    "animation": 'action_translateY_out',
                    "animation-duration": '0.5s',
                    'animation-timing-function': 'ease',
                    "animation-fill-mode": "forwards"
                });
                var setInt_obj = setInterval(function() {
                    fSel.remove();
                    overlay.remove();
                    clearInterval(setInt_obj);
                }, 0.5 * 1000);
                if (opts.selectFunc) {
                    opts.selectFunc($(this).data('index'));
                }
            });
            // 点击取消
            $(`#${d + '_cancel'}`).click(function() {
                fSel.css({
                    "animation": 'action_translateY_out',
                    "animation-duration": '0.5s',
                    'animation-timing-function': 'ease',
                    "animation-fill-mode": "forwards"
                });
                var setInt_obj = setInterval(function() { // 执行动画完成后，移除actionSheets
                    fSel.remove();
                    overlay.remove();
                    clearInterval(setInt_obj);
                }, 0.5 * 1000);
            });
        }
    });
});