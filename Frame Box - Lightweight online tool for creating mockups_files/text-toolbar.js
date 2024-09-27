(function($) {
    $.fn.textToolbar = function(options) {
        var STYLES = { // opt to class mapping
            'bold': 'text-bold',
            'italic': 'text-italic',
            'underline': 'text-underline',
        };

        var STYLE_KEYS = [ // names of text style in proper order
            'bold', 'italic', 'underline'
        ];

        var STYLE_CLASSES = { // reverse mapping class -> opts
            'text-bold': 'bold',
            'text-italic': 'italic',
            'text-underline': 'underline',
        };

        var ALIGNS = { // opt to class mapping
            'left': 'text-left',
            'right': 'text-right',
            'center': 'text-center'
        };

        var ALIGN_CLASSES = { // reverse mapping class -> opts
            'text-left': 'left',
            'text-right': 'right',
            'text-center': 'center'
        };

        var ALIGN_KEYS = [ // names of text align in proper order
            'left', 'center', 'right'
        ];

        var defaults = {
            bold: false,
            italic: false,
            underline: false,
            align: 'left',
            change: null,
            unit: null
        };

        function getClasses(opts) {
            var classes = {'add': [], 'remove': []};
            for (var o in opts) {
                if (o == 'align') {
                    var align = opts[o];
                    for (var a in ALIGNS)
                        if (a == align)
                            classes.add.push(ALIGNS[a])
                        else
                            classes.remove.push(ALIGNS[a])
                } else {
                    if (o in STYLES)
                        if (opts[o])
                            classes.add.push(STYLES[o])
                        else
                            classes.remove.push(STYLES[o])
                }
            }
            return classes;
        }

        function parseClasses(elem) {
            var parsed_opts = {};
            var classes;
            var attr = elem.attr('class');
            if (attr) {
                classes = attr.split(/\s+/);
            } else {
                classes = []
            }
            for (var i = 0; i < classes.length; i++) {
                var c = classes[i];
                if (c in STYLE_CLASSES) {
                    parsed_opts[STYLE_CLASSES[c]] = true;
                };
                if (c in ALIGN_CLASSES) {
                    parsed_opts.align = ALIGN_CLASSES[c]
                };
            }
            return parsed_opts;
        }

        var opts = $.extend(defaults, parseClasses(this));
        var clean_opts = {};

        for (var o in options) {
            if ((o == 'align') && (options[o] in ALIGNS))
                clean_opts[o] = options[o];
            if (o in STYLES) {
                if (options[o]) clean_opts[o] = true
                else clean_opts[o] = false;
            }
            if (o == 'change') clean_opts[o] = options[o];
            if (o == 'unit') $.extend(clean_opts, parseClasses(options[o]));
        }

        opts = $.extend(opts, clean_opts);
        // Trigger to update textarea
        if (opts.change) opts.change(opts, getClasses(opts));

        var that = this;

        //this.addClass('ui-widget-content');
        this.css('background-color', '#fff');

        var style_buttons = $('<div>');
        var align_buttons = $('<div>');

        for (var i = 0; i < STYLE_KEYS.length; i++) {
            var k = STYLE_KEYS[i];

            var btn = $('<input>').attr({
                    'type': 'checkbox',
                    'id': 'btn-' + k,
                    'checked': opts[k]
                })
                .data('style', k)
                .click(function(){
                    var $this = $(this);
                    var style = $this.data('style');
                    opts[style] = $this.is(':checked');
                    if (opts.change) opts.change(opts, getClasses(opts));
                });
            var label = $('<label>')
                        .attr({
                            'for': 'btn-' + k
                        })
                        .html(k)
            $('<div>').append(btn).append(label).appendTo(style_buttons);
        }

        for (var i = 0; i < ALIGN_KEYS.length; i++) {
            var k = ALIGN_KEYS[i];
            $('<div>')
                .append(
                    $('<input>')
                        .attr({
                            'type': 'radio',
                            'id': 'btn-' + k,
                            'name': 'align-radio',
                            'checked': opts['align'] == k
                        })
                        .data('align', k)
                        .click(function(){
                            opts['align'] = $(this).data('align');
                            if (opts.change) opts.change(opts, getClasses(opts));
                        })
                )
                .append(
                    $('<label>')
                        .attr({
                            'for': 'btn-' + k
                        })
                        .html(k)
                )
                .appendTo(align_buttons);
        }


        $('<p>Style</p>').appendTo(this);
        style_buttons.appendTo(this);
        $('<p>Align</p>').appendTo(this);
        align_buttons.appendTo(this);

        return this;
    }
})(jQuery);
