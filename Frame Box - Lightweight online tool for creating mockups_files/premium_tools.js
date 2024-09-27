var INVITE_USER_BTN_SELECTOR = '#INVITE_USER';

function initPremiumTools() {
    /* allow to invite other users for premium users */
    if(USER_FEATURES.indexOf('CAN_INVITE_OTHER_USERS_TO_PROJECT') == -1) {
        $(INVITE_USER_BTN_SELECTOR).button('disable').tooltip(
            $(INVITE_USER_BTN_SELECTOR).prev('span').html()
        );
    } else {
        $(INVITE_USER_BTN_SELECTOR).colorbox({onComplete: function() {
            var url = $(this).attr('href');
            var $invite_input = $('#inviteUser');
            var $invite_form = $invite_input.parents('form');
            var $invite_button = $invite_form.find('input[type=submit]');
            var $invite_success = $invite_form.prevAll('.invite-user-success');
            var $invite_error = $invite_form.prevAll('.invite-user-error');
            $invite_input.autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: url,
                        dataType: "json",
                        type: 'GET',
                        data: {
                            suggest: request.term,
                            project_id: project_id
                        },
                        success: function(data) {
                            response($.map(data, function(item) {
                                return {
                                    label: item.username + ' [' + item.email + ']',
                                    value: item.username
                                };
                            }));
                        }
                    });
                },
                minLength: 2,
                open: function() {
                    $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
                },
                close: function() {
                    $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
                }
            });
            $invite_form.on('submit', function() {
                var username = $invite_input.val();
                if(!username.length) return false;
                $.ajax({
                    url: url,
                    dataType: "json",
                    type: 'POST',
                    data: {
                        username: username,
                        project_id: project_id
                    },
                    success: function(data) {
                        if(data['success']) {
                            $invite_form.remove();
                            $invite_error.hide();
                            $invite_success.show();
                        } else {
                            $invite_error.show();
                        }
                    },
                    error: function() {
                        $invite_error.show();
                    },
                    beforeSend: function() {
                        $invite_button.attr('disabled', true);
                    },
                    complete: function() {
                        $invite_button.attr('disabled', false);
                    }
                });
                return false;
            });
        }});
    }
}


function initUserStatus(callback) {
    $.get("/s/usercheck/", function(response) {
            window.USER_FEATURES = response[0] || [];
            window.USER_IS_LOGGED_IN = response[1];
            initPremiumTools();
            callback();
        }, "json");
}