chrome.devtools.panels.create('Protractor', 'icon48.png', 'panel.html', function (panel) {
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', chrome.runtime.getURL('/inject.js'), false);
    xhr.send();

    var script = xhr.responseText;
    
    if (script) {
        chrome.devtools.inspectedWindow.eval(script.toString());

        var interval;

        panel.onShown.addListener(function (o) {
            interval = window.setInterval(function () {
                chrome.devtools.inspectedWindow.eval('(function () { return window.protractor.logs; })()', function () {
                    if (!arguments[1])
                        o.update(arguments[0]);
                    else
                        chrome.devtools.inspectedWindow.eval(script.toString());
                });
            }, 300);
        });

        panel.onHidden.addListener(function () {
            if (interval)
                window.clearInterval(interval);
        });
    }
});
