(function () {
    window.protractor = {};
    window.protractor.logs = [];

    Event.prototype.stopPropagation = function () { };

    document.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() != 'canvas')
            log(selector(e.target), 'click()');
    });

    document.addEventListener('mousedown', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas')
            action = 'action().mousedown({x: ' + e.clientX.toString() + ', y:' + e.clientY.toString() + '})';
    });

    document.addEventListener('mousemove', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && action)
            action += '.mousemove({x: ' + e.clientX.toString() + ', y:' + e.clientY.toString() + '})';
    });

    document.addEventListener('mouseup', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && action)
            log(selector(e.target), action + '.mouseup({x: ' + e.clientX.toString() + ', y:' + e.clientY.toString() + '}).perform()');
    });

    document.addEventListener('touchstart', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && e.targetTouches && e.targetTouches.length > 0)
            action = 'touchActions().down(' + e.targetTouches[0].clientX.toFixed(0) + ', ' + e.targetTouches[0].clientY.toFixed(0) + ')';
    });

    document.addEventListener('touchmove', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && e.targetTouches && e.targetTouches.length > 0 && action)
            action += '.move(' + e.targetTouches[0].clientX.toFixed(0) + ', ' + e.targetTouches[0].clientY.toFixed(0) + ')';
    });

    document.addEventListener('touchend', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && action)
            if (e.targetTouches && e.targetTouches.length > 0)
                log(selector(e.target), action + '.up(' + e.targetTouches[0].clientX.toFixed(0) + ', ' + e.targetTouches[0].clientY.toFixed(0) + ').perform()');
            else
                log(selector(e.target), action + '.perform()');
    });

    document.addEventListener('change', function (e) {
        if (e.target.tagName.toLowerCase() == 'input' && ['text', 'number'].indexOf(e.target.getAttribute('type').toLowerCase()) != -1)
            log(selector(e.target), 'clear().sendKeys("' + e.target.value + '");');
        else if (e.target.tagName.toLowerCase() == 'textarea')
            log(selector(e.target), 'clear().sendKeys("' + e.target.value + '");');
    });

    var url = window.location.hash;
    var action = '';

    var selector = function (target) {
        var query = '';

        if (target == document)
            query = 'body';
        else if (['canvas'].indexOf(target.tagName.toLowerCase()) != -1)
            query = target.tagName.toLowerCase();
        else if (['translate'].indexOf(target.tagName.toLowerCase()) != -1)
            query = selector(target.parentNode);
        else {
            var attr = ['ng-model', 'ng-href', 'href', 'name', 'aria-label', 'class'].reduce(function (a, b) { return a || (target.getAttribute(b) ? b : null); }, null);
            if (attr)
                query = target.tagName.toLowerCase() + '[' + attr + '="' + target.getAttribute(attr) + '"]';
            else
                query = target.tagName.toLowerCase();
        }

        query = query.replace(/\s/g, ' ');

        if (document.querySelectorAll(query).length > 1 && target.parentNode)
            query = selector(target.parentNode) + '>' + query;

        return query;
    };

    var log = function (selector, action) {
        if (url != window.location.hash)
            window.protractor.logs.push('// URL: ' + window.location.hash);

        url = window.location.hash;

        window.protractor.logs.push('element(by.css(\'' + selector + '\')' + '.' + action + ';');
    };

    return window.protractor.logs;
})();
