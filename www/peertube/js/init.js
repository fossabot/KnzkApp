function init() {
    if (!localStorage || !fetch) {
        show("cannot-use-ls");
    } else {
        if (localStorage.getItem('knzkapp_peertube_domain')) {
            inst_p = localStorage.getItem('knzkapp_peertube_domain');
            endpoint = "https://"+inst_p+"/api/v1";
            elemid("splitter-profile-name").innerText = inst_p;
            setTimeout(showVideos('-views', {title: 'トレンド'}), 500);
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
}

ons.ready(function() {
    if (ons.platform.isIPhoneX()) { // for iPhone X
        var html_tag = document.documentElement;
        html_tag.setAttribute('onsflag-iphonex-portrait', '1');
        html_tag.setAttribute('onsflag-iphonex-landscape', '1');
    }
    init();
});