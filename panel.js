document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#copy').addEventListener('click', function () {
        var code = document.createRange();
        code.selectNode(document.querySelector('code'));
        window.getSelection().addRange(code);
        
        try {
            if (document.execCommand('copy'))
                document.querySelector('#message').innerText = 'Copied to the clipboard on ' + (new Date()).toLocaleString();
            else
                document.querySelector('#message').innerText = 'Problem copying test script to the clipboard.';
        } 
        catch (e) {
            document.querySelector('#message').innerText = 'Problem copying test script to the clipboard.';
        }
        
        window.getSelection().removeAllRanges();
    }, false);

    document.querySelector('#clear').addEventListener('click', function () {
        chrome.devtools.inspectedWindow.eval('(function () { window.protractor.logs = []; })()');
        update([]);
        document.querySelector('#message').innerText = '';
    }, false);
    
    document.querySelector('code').addEventListener('focus', function () {
        editing = true;
    }, false);

    document.querySelector('code').addEventListener('blur', function () {
        chrome.devtools.inspectedWindow.eval('(function () { window.protractor.logs = ' + JSON.stringify(document.querySelector('code').innerText.split('\n')) + '; })()');
        editing = false;
    }, false);
}, false);

var editing = false;

function update(logs) {
    if (!editing) {
        var code = document.querySelector('code');
        if (code)
            code.innerText = logs.join('\n');
            
        Prism.highlightAll();
            
        if (logs && logs.length > 0) {
            document.querySelector('#copy').style.display = '';
            document.querySelector('#clear').style.display = '';
        }
        else {
            document.querySelector('#copy').style.display = 'none';
            document.querySelector('#clear').style.display = 'none';
        }
    }
}
