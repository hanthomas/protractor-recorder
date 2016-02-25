(function () {
    window.protractor = {};
    window.protractor.logs = [];
    window.protractor.ignoreSynchronization = false;

    Event.prototype.stopPropagation = function () { };

    var url = '';
    var time = null;
    var mouse = [];

    document.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() != 'canvas')
            log('element(by.css(\'' + selector(e.target).replace(/\\\"/g, '\\\\\\"') + '\'))' + '.click();');
    });

    document.addEventListener('mousedown', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas')
            mouse = [e];
    });

    document.addEventListener('mousemove', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && mouse && mouse.length > 0)
            mouse.push(e);
    });

    document.addEventListener('mouseup', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && mouse && mouse.length > 0 && mouse[0].target == e.target) {
            if (mouse.reduce(function (a, b) { return a.clientX - b.clientX; }, mouse[0]) <= 1 && mouse.reduce(function (a, b) { return a.clientY - b.clientY; }, mouse[0]) <= 1)
                log('browser.driver.actions().mouseMove(element(by.css(\'' + selector(mouse[0].target).replace(/\\\"/g, '\\\\\\"') + '\')), {x: ' + mouse[0].clientX.toString() + ', y:' + mouse[0].clientY.toString() + '}).click().perform();');
            else
                log('browser.driver.actions().mouseMove(element(by.css(\'' + selector(mouse[0].target).replace(/\\\"/g, '\\\\\\"') + '\')), {x: ' + mouse[0].clientX.toString() + ', y:' + mouse[0].clientY.toString() + '}).mouseDown()' + mouse.reduce(function (a, b, i) { return i > 0 ? a + '.mouseMove({x: ' + (b.clientX - mouse[i - 1].clientX).toString() + ', y:' + (b.clientY - mouse[i - 1].clientY).toString() + '})' : ''; }, '') + '.mouseUp().perform();');
        }
    });

    document.addEventListener('touchstart', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && e.targetTouches && e.targetTouches.length > 0)
            mouse = [{ target: e.target, clientX: Math.floor(e.targetTouches[0].clientX), clientY: Math.floor(e.targetTouches[0].clientY) }];
    });

    document.addEventListener('touchmove', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && e.targetTouches && e.targetTouches.length > 0 && mouse && mouse.length > 0)
            mouse.push({ target: e.target, clientX: Math.floor(e.targetTouches[0].clientX), clientY: Math.floor(e.targetTouches[0].clientY) });
    });

    document.addEventListener('touchend', function (e) {
        if (e.target.tagName.toLowerCase() == 'canvas' && mouse && mouse.length > 0 && mouse[0].target == e.target) {
            if (mouse.reduce(function (a, b) { return a.clientX - b.clientX; }, mouse[0]) <= 1 && mouse.reduce(function (a, b) { return a.clientY - b.clientY; }, mouse[0]) <= 1)
                log('browser.driver.actions().mouseMove(element(by.css(\'' + selector(mouse[0].target).replace(/\\\"/g, '\\\\\\"') + '\')), {x: ' + mouse[0].clientX.toString() + ', y:' + mouse[0].clientY.toString() + '}).click().perform();');
            else
                log('browser.driver.actions().mouseMove(element(by.css(\'' + selector(mouse[0].target).replace(/\\\"/g, '\\\\\\"') + '\')), {x: ' + mouse[0].clientX.toString() + ', y:' + mouse[0].clientY.toString() + '}).mouseDown()' + mouse.reduce(function (a, b, i) { return i > 0 ? a + '.mouseMove({x: ' + (b.clientX - mouse[i - 1].clientX).toString() + ', y:' + (b.clientY - mouse[i - 1].clientY).toString() + '})' : ''; }, '') + '.mouseUp().perform();');
        }
    });

    document.addEventListener('change', function (e) {
        if (e.target.tagName.toLowerCase() == 'input' && ['text', 'number'].indexOf(e.target.getAttribute('type').toLowerCase()) != -1)
            log('element(by.css(\'' + selector(e.target).replace(/\\\"/g, '\\\\\\"') + '\'))' + '.clear().sendKeys(\'' + e.target.value + '\');');
        else if (e.target.tagName.toLowerCase() == 'textarea')
            log('element(by.css(\'' + selector(e.target).replace(/\\\"/g, '\\\\\\"') + '\'))' + '.clear().sendKeys(\'' + e.target.value + '\');');
    });

    var selector = function (target) {
        var query = '';

        if (target == document)
            query = 'body';
        else {
            var attr = ['ng-model', 'ng-href', 'name', 'aria-label'].reduce(function (a, b) { return a || (target.getAttribute(b) ? b : null); }, null);
            if (attr)
                query = target.tagName.toLowerCase() + '[' + attr + '="' + target.getAttribute(attr).replace(/\\/g, '\\\\').replace(/\'/g, '\\\'').replace(/\"/g, '\\"').replace(/\0/g, '\\0') + '"]';
            else
                query = target.tagName.toLowerCase();

            var nodes = target.parentNode.querySelectorAll(query);
            if (nodes && nodes.length > 1)
                query += ':nth-of-type(' + (Array.prototype.slice.call(nodes).indexOf(target) + 1).toString() + ')';

            query = query.replace(/\s/g, ' ');
        }

        if (document.querySelectorAll(query).length > 1 && target.parentNode)
            query = selector(target.parentNode) + '>' + query;

        return query;
    };
    
    var log = function (action) {
        if (window.protractor.logs.length == 0)
            window.protractor.logs.push('browser.driver.manage().window().setSize(' + window.outerWidth + ', ' + window.outerHeight + ');');
        
        if (window.protractor.ignoreSynchronization && time)
            window.protractor.logs.push('browser.sleep(' + (new Date() - time).toString() + ');');

        time = new Date();
        
        if (!url || url != window.location.hash)
            window.protractor.logs.push('// URL: ' + window.location.hash);

        url = window.location.hash;

        window.protractor.logs.push(action);
    };
    
    return window.protractor.logs;
})();
