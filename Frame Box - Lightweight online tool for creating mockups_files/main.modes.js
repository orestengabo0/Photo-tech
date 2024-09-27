var COMMENT_EXPLANATION_WAS_HIDDEN = false;
var COMMENT_ADD_EXPLANATION_WAS_HIDDEN = false;

function previewModeOn() {
    if (MODE === "PREVIEW") return;

    $(PR_SELECTOR).hide();
    $(TB_SELECTOR).hide();
    $(REV_SELECTOR).hide();
    $(NOTIFICATIONS_SELECTOR).hide();
    $('#COMMENT').hide();
    $('#SAVE_COMMENTS_BUTTON').hide();
    if (!COMMENT_EXPLANATION_WAS_HIDDEN) {
        $('#comment-explanation').css('display', 'block');
    }
    $('#comment-add-explanation').css('display', 'none');
    /* show mode switcher */
    var $headerbuttons = $('.headerbuttons');
    if(IS_OWNER) {
        if(!$('#FULLSCREENMODE').length) {
            $('<div/>').attr('id', 'FULLSCREENMODE').text('Fullscreen mode')
                    .appendTo($headerbuttons).on('click', function() {
                        fullscreenModeOn();
                    });
        } else {
            $('#FULLSCREENMODE').show();
        }
    }

    if( IS_OWNER || ((!IS_OWNER) && (!IS_READONLY) && (!IS_PRIVATE)) ) {
        if(!$('#COPYFRAME').length) {
            $('<div/>').attr('id', 'COPYFRAME').text('Copy frame')
                    .appendTo($headerbuttons);
            $('#COPYFRAME').attr('onclick', 'copyFrame();');
        } else {
            $('#COPYFRAME').show();
        }
    } else {
        if(!$('#COPYFRAME').length) {
            $('<div/>').attr('id', 'COPYFRAME').text('Copy frame')
                    .appendTo($headerbuttons);
            $('#COPYFRAME').attr('class', 'disabled');
        } else {
            $('#COPYFRAME').show();
        }
    }

    $('#frameresize').css('display', 'none');
    $('#width_input').attr('disabled', 'true');
    $('#height_input').attr('disabled', 'true');

    if (USER_IS_PREMIUM) {
        $(WS_SELECTOR).resizable({ disabled: true });
        $(WS_SELECTOR).removeClass('ui-state-disabled');
    }

    $('.' + WS_ACCEPT_CLS).draggable('disable');

    BUFFER['selected utins'] = [];
    $.each($(WS_SELECTOR + ' .' + SELECTED_CLASS), function (index, unit) {
        unselectUnit(unit);
        BUFFER['selected utins'].push($(unit).attr(UNIT_ID_ATTR));
    });
    var selector = WS_UNIT_CLS;
    if (MODE === "COMMENT") {
        $.each($(".COMMENT_UNIT"), function (index, unit){
            if (isCommentOwner($(unit))) {
                $(unit).draggable('destroy');
            }
        });
    }
    $(".COMMENT_UNIT").css('display', 'block');
    $(".COMMENT_UNIT").css(PREVIEW_COMMENT_UNIT_CSS);

    if (MODE === "EDIT") {
        $.each($('.' + WS_UNIT_CLS), function (index, unit) {
            $(unit).css(PREVIEW_UNIT_CSS).draggable('destroy')
                .find('.glass').css({width: 0, height: 0});
        });
    }

    if (!FRAME_BACKGROUND) $(WS_SELECTOR).css('background-image', 'none');
    $('#EDIT_MODE').removeClass('MODE_ON');
    $('#PREVIEW_MODE').addClass('MODE_ON');
    $(DELETE_BTN_SELECTOR).button('disable');
    $(COPY_BTN_SELECTOR).button('disable');
    $(PASTE_BTN_SELECTOR).button('disable');
    $(DROP_BTN_SELECTOR).button('disable');
    $(UP_BTN_SELECTOR).button('disable');
    unselectableText(false);
    MODE = "PREVIEW";
}

function editModeOn() {
    if (MODE === "EDIT") return;
    MODE = "EDIT";

    $(PR_SELECTOR).show();
    $(TB_SELECTOR).show();
    $(REV_SELECTOR).show();
    $(NOTIFICATIONS_SELECTOR).show();

    $('#SHOWTOOLBOXES').hide();
    $('#FULLSCREENMODE').hide();
    $('#COPYFRAME').hide();
    $('#COMMENT').hide();
    $('#SAVE_COMMENTS_BUTTON').hide();

    $('#frameresize').css('display', 'block');
    $('#width_input').removeAttr('disabled');
    $('#height_input').removeAttr('disabled');
    $('.COMMENT_UNIT').css('display', 'none');
    $('#comment-explanation').css('display', 'none');
    $('#comment-add-explanation').css('display', 'none');

    if (!FRAME_BACKGROUND) initGrid();
    $.each($('.' + WS_UNIT_CLS), function (index, unit) {
        $(unit).css(UNIT_CSS)
            .draggable({
                containment: WS_SELECTOR,
                drag: dragProcess,
                start: startDragProcess,
                grid: [GRID_CELL_SIZE, GRID_CELL_SIZE]
            });
        childResize(unit);
    });

    if (USER_IS_PREMIUM) {
        $(WS_SELECTOR).resizable({disabled: false});
    }

    $.each(BUFFER['selected utins'], function (index, id) {
        var unit = $('.' + WS_UNIT_CLS + '[' + UNIT_ID_ATTR + '=' + id + ']');
        selectUnit(unit, true);
    });
    delete BUFFER['selected utins'];

    $('.' + WS_ACCEPT_CLS).draggable('enable');
    // Disable drag&drop for "coming soon" tools
    $('.' + WS_ACCEPT_CLS + '.' + COMMING_SOON_CLS).draggable('disable');

    if (BUFFER['copied utins']) $(PASTE_BTN_SELECTOR).button('enable');
    unselectableText(true);
    $(".COMMENT_UNIT").removeClass("SELECTED");
}

function commentModeOn() {
    if (MODE === "COMMENT") return;

    $(PR_SELECTOR).hide();
    $(TB_SELECTOR).hide();
    $(REV_SELECTOR).hide();
    $(NOTIFICATIONS_SELECTOR).hide();
    $('#SHOWTOOLBOXES').hide();
    $('#FULLSCREENMODE').hide();
    $('#COPYFRAME').hide();
    $('.COMMENT_UNIT').css('display', 'block');
    $('#comment-explanation').css('display', 'none');
    if (!COMMENT_ADD_EXPLANATION_WAS_HIDDEN) {
        $('#comment-add-explanation').css('display', 'block');
    }

    $('#COMMENT').show();
    $('#SAVE_COMMENTS_BUTTON').show();
    // $('.UNIT').resizable({ destroy: true });
    $('#frameresize').css('display', 'none');
    $('#width_input').attr('disabled', 'true');
    $('#height_input').attr('disabled', 'true');

    if (USER_IS_PREMIUM) {
        $(WS_SELECTOR).resizable({ disabled: true });
        $(WS_SELECTOR).removeClass('ui-state-disabled');
    }

    $(".COMMENT_UNIT").css({
        background: "none",
        filter: 'alpha(opacity=100)',
        opacity: '1'
    });

    $.each($('.COMMENT_UNIT'), function (index, unit) {
        unit = $(unit);
        unit.css(UNIT_CSS);
        if (isCommentOwner(unit)) {
            unit.draggable({
                containment: WS_SELECTOR,
                drag: dragProcess,
                start: startDragProcess,
                grid: [GRID_CELL_SIZE, GRID_CELL_SIZE]
            });
        } else {
            unit.css({cursor: 'default'});
        }
    });

    $('.' + WS_ACCEPT_CLS).not().draggable('disable');
    $("#COMMENT").draggable('enable');

    BUFFER['selected utins'] = [];
    $.each($(WS_SELECTOR + ' .' + SELECTED_CLASS).not(".COMMENT_UNIT"), function (index, unit) {
        unselectUnit(unit);
        BUFFER['selected utins'].push($(unit).attr(UNIT_ID_ATTR));
    });
    if (MODE === "EDIT") {
        $.each($('.' + WS_UNIT_CLS).not(".COMMENT_UNIT"), function (index, unit) {
            $(unit).css(PREVIEW_UNIT_CSS).draggable('destroy')
                .find('.glass').css({width: 0, height: 0});
        });
    }
    if (!FRAME_BACKGROUND) $(WS_SELECTOR).css('background-image', 'none');
    $(DELETE_BTN_SELECTOR).button('disable');
    $(COPY_BTN_SELECTOR).button('disable');
    $(PASTE_BTN_SELECTOR).button('disable');
    $(DROP_BTN_SELECTOR).button('disable');
    $(UP_BTN_SELECTOR).button('disable');

    unselectableText(true);
    MODE = "COMMENT";
}


function closeFullscreen(event){
    if (event === false || event.which == 27) {
        $('body').removeClass('fullscreen');
        $('#pageheader').show();
        $('.footer').show();
        $('.fullscreen-close').remove();
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

}
function fullscreenModeOn() {
    $('#pageheader').hide();
    $('.footer').hide();
    $('body').addClass('fullscreen');
    $('<span/>').html('&times;').addClass('fullscreen-close')
    .appendTo($('body')).on('click', function(){
        closeFullscreen(false);
    });
    $(window).keyup(closeFullscreen);
    /* fullscreen */
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
}

$(document).ready(function() {
    $(".mode-select").val('EDIT MODE');

    $(".mode-select").change(function(){
        selected = $(".mode-select option:selected").text();
        if (selected == 'EDIT MODE') {
            editModeOn();
        }
        if (selected == 'PREVIEW MODE') {
            previewModeOn();
        }
        if (selected == 'COMMENT MODE') {
            commentModeOn();
        }
    });

    $("#hide-comment-explanation").click(function (){

        $('#comment-explanation').css('display', 'none');
        COMMENT_EXPLANATION_WAS_HIDDEN = true;
    });

    $("#hide-comment-add-explanation").click(function (){

        $('#comment-add-explanation').css('display', 'none');
        COMMENT_ADD_EXPLANATION_WAS_HIDDEN = true;
    });

});