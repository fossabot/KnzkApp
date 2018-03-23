function openURL(url) {
    if (ons.isWebView()) {
        SafariViewController.isAvailable(function (available) {
            if (available) {
                SafariViewController.show({
                        url: url
                    },
                    // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
                    function(result) {
                        if (result.event === 'opened') {
                            console.log('opened');
                        } else if (result.event === 'loaded') {
                            console.log('loaded');
                        } else if (result.event === 'closed') {
                            console.log('closed');
                        }
                    },
                    function(msg) {
                        console.log("KO: " + msg);
                    });
            } else {
                window.open(url, "_system");
            }
        });
    } else {
        window.open(url, "_system");
    }
}

function elemid(id) {
    return document.getElementById(id);
}