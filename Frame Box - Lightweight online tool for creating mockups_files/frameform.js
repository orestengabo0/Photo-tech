function updateDaysToLive(select){
	var $id_days_to_live = $('#id_days_to_live');
	if ($('#id_expire').is(':checked')) {
		$id_days_to_live.removeAttr('disabled');
		if (select) $id_days_to_live.select();
	} else {
		$id_days_to_live.attr('disabled', 'disabled');
        $('#expire_note').remove();
        $('#id_days_to_live').val('∞');
	}
}

$(function(){
	updateDaysToLive(false);
    var expire_check = $('#id_expire');
	expire_check.change(function(){
        $(this).removeClass('defaulted');
		updateDaysToLive(true);
		$('#id_days_to_live').data('fixed', true).addClass('fixed');
		FLAG_CHANGED = true;
	});
	$('#id_days_to_live').focus(function(){
		$(this).data('fixed', true).addClass('fixed');
		FLAG_CHANGED = true;
	});
    if (expire_check.hasClass('defaulted')) {
        expire_check.parent().append('<div id="expire_note" class="small muted">will be unset on "Save"</div>')
    }
});
