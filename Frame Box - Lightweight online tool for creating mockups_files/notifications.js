(function($, undefined){
    $(document).ready(function($) {
        $('.js-notification-close').on('click', function(obj){
            var $notification = $(obj.target).parent();
            var nc = $.cookie('notifications_closed');
            if(nc) {
                nc = nc + ' ' + $notification.attr('pk');
            } else {
                nc = $notification.attr('pk') + '';
            }
            $.cookie('notifications_closed', nc);
            if($notification.attr('data-logged-in') == 'true') {
                $.post(NOTIFICATION_CLOSE_URL, {notification_pk: $notification.attr('pk')}, function(){
                    $notification.hide('blind', {}, 500);
                });
            } else {
                $notification.hide('blind', {}, 500);
            };
        });
    });
})(jQuery);
