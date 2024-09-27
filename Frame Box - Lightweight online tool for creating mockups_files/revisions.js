(function($, undefined){
    $(document).ready(function($) {
        $("#more-revisions").click(function(){
            $.ajax({
                url: REVISIONS_FULL_LIST_URL,
                success: function(data) {
                    $('#REVISIONS').html(data);
                }
            });
        });
        
    });
})(jQuery);