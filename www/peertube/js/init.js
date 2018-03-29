function init() {
    if (!localStorage || !fetch) {
        show("cannot-use-ls");
    } else {
        if (localStorage.getItem('knzkapp_peertube_domain')) {
            inst_p = localStorage.getItem('knzkapp_peertube_domain');
            endpoint = "https://"+inst_p+"/api/v1";
            elemid("splitter-profile-name").innerText = inst_p;
            setTimeout(function () {
                showVideos('-views', {title: 'トレンド'});
            }, 500);
            initevent();
        } else {
            ons.notification.prompt('PeerTubeサーバーのドメインを入力してください。', {title: 'PeerTubeにアクセス'}).then(function (repcom) {
                if (repcom) {
                    fetch("https://"+repcom+"/api/v1/videos", {
                        headers: {'content-type': 'application/json'},
                        method: 'GET'
                    }).then(function(response) {
                        if(response.ok) {
                            return response.json();
                        } else {
                            sendLog("PTError/init", response.json);
                            throw new Error();
                        }
                    }).then(function(json) {
                        localStorage.setItem('knzkapp_peertube_domain', repcom);
                        console.log("OK:PT");
                        init();
                    }).catch(function(error) {
                        showError("ネットワークエラー");
                        show('error-domain');
                        console.log(error);
                    });
                } else {
                    show('error-domain');
                }
            });
        }
    }
}

function initevent() {
    document.addEventListener("change", function(event) {
        if (event.isPortrait !== undefined && NowPlaying) {
            setVideoheight();
        }
    }, false);
}

function initph() {
    var pullHook = document.getElementById('pull-hook');
    pullHook.addEventListener('changestate', function(event) {
        var message = '';
        switch (event.state) {
            case 'initial':
                message = '<ons-icon icon="fa-refresh"></ons-icon>';
                break;
            case 'preaction':
                message = '<ons-icon icon="fa-refresh"></ons-icon>';
                break;
            case 'action':
                message = '<span class="fa fa-spin"><span class="fa fa-spin"><ons-icon icon="fa-refresh"></ons-icon></span></span>';
                break;
        }
        pullHook.innerHTML = message;
    });

    pullHook.onAction = function(done) {
        showVideos(null, null, 0, done);
    };
}

ons.ready(function() {
    if (ons.platform.isIPhoneX()) { // for iPhone X
        var html_tag = document.documentElement;
        html_tag.setAttribute('onsflag-iphonex-portrait', '1');
        html_tag.setAttribute('onsflag-iphonex-landscape', '1');
    }
    init();
});