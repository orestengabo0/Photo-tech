(function ($) {
    $(function(){
        $('.js-sc').click(function() {
            var c = $(this).parent();
            var n = c.parent();
            if(n.attr('data-logged-in')=='true') {
                $.ajax({
                    url: '/o/subscribe/',
                    dataType: "json",
                    data: {question: 1},
                    type: 'POST',
                    success: function () {
                        c.html('Thank You');
                        setTimeout(function() {
                            n.find('button').trigger('click');
                        }, 2000);
                    }
                })
            } else {
                c.html('Your email: <input type="text"><button class="js-se">Subscribe</button>');
                $('.js-se').click(function() {
                    var e = $(this).parent().find('input').val();
                    $.ajax({
                        url: '/o/subscribe/',
                        dataType: "json",
                        data: {email: e, question: 1},
                        type: 'POST',
                        success: function () {
                            c.html('Thank You');
                            setTimeout(function() {
                                n.find('button').trigger('click');
                            }, 2000);
                        }
                    });
                    return false;
                });
            }
            return false;
        });
    });
})(jQuery);
