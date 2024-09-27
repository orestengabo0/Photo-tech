(function($) {
    var defaults = {delayHide: 200};
    var options;
    var tooltipClass = 'js-tooltip';
    var timeout = undefined;
    var lastElement = undefined;
    function removeTooltips() {
        $('.' + tooltipClass).remove();
        lastElement = undefined;
        if(timeout) {
            clearTimeout(timeout);
        }
    }
    $.fn.tooltip = function(content, params) {
        options = $.extend({}, defaults, options, params);
        $(this).hover(
            function() {
                if($(this)[0] === lastElement) {
                    if(timeout) {
                        clearTimeout(timeout);
                    }
                    return this;
                }
                removeTooltips();
                lastElement = $(this)[0];
                var posX = $(this).offset().left - $(window).scrollLeft();
                var posY = $(this).offset().top - $(window).scrollTop();
                var $tooltip = $('<div class="tooltip ' + tooltipClass + '"></div>')
                                .html(content).appendTo($('body'));
                $tooltip.css({top: posY - $tooltip.outerHeight() - 5, left: posX - $tooltip.outerWidth() + $(this).outerWidth() / 2 + 28});
            }, function() {
                timeout = setTimeout(function() {
                    removeTooltips();
                }, options.delayHide);
            }
        );
        $(document).on('mouseenter', '.' + tooltipClass + ', .' + tooltipClass + ' > *', function(obj) {
            if($(obj.relatedTarget).parents('.' + tooltipClass).length) return;
            if($(obj.target).parents('.' + tooltipClass).length) return;
            if(timeout) {
                clearTimeout(timeout);
            }
        });
        $(document).on('mouseout', '.' + tooltipClass + ', .' + tooltipClass + ' > *', function(obj) {
            if($(obj.relatedTarget).parents('.' + tooltipClass).length) return;
            timeout = setTimeout(function() {
                removeTooltips();
            }, options.delayHide);
        });
        $(window).scroll(function(){
            removeTooltips();
        });
        return this;
    }
})(jQuery);
