var showPopover = function(target, id) {
    document
        .getElementById(id)
        .show(target);
};

var hidePopover = function(id) {
    document
        .getElementById(id)
        .hide();
};

window.fn = {};

window.fn.open = function() {
    var menu = document.getElementById('splitter-menu');
    menu.open();
};

function reset_nav() {
    var list = document.getElementById("music-form");
    var menu = document.getElementById("menu-list");
    var account_list = document.getElementById("account-list");
    list.style.display = "none";
    account_list.style.display = "none";
    menu.style.display = "block";
}

function load(page) {
    if (page != "home.html") {
        try {TL_websocket.close();} catch(e) {console.log("ws_close_error");}
    }
    loadNav(page, null, true);
}

function loadNav(page, mode, splitter, splitter_next) {
    var option;
    if (mode === "up") option = {animation:"lift"};
    else option = {animation:"slide"};

    if (splitter) {
        var menu = document.getElementById('splitter-menu');
        if (splitter_next) {
            document.querySelector('#navigator').bringPageTop(page, option).then(menu.close.bind(menu));
        } else {
            document.querySelector('#navigator').resetToPage(page, {animation:"none"}).then(menu.close.bind(menu));
        }
    } else {
        document.querySelector('#navigator').bringPageTop(page, option);
    }
}

function BackTab(mode) {
    var option;
    if (mode === "down") option = {animation:"lift"};
    else option = {animation:"slide"};

    document.querySelector('#navigator').popPage(option);
}

function displayTime(mode, time) {
    if (mode == 'new') {
        return new Date(time).toTwitterRelativeTime('ja');
    } else {
        var i = 0;
        var list = document.getElementsByClassName("date");
        while (list[i]) {
            list[i].innerHTML = displayTime('new', list[i].dataset.time);
            i++;
        }
    }
}

function opendial() {
    if (getConfig(1, 'dial') == 'toot') {
        loadNav('post.html', 'up');
    } else if (getConfig(1, 'dial') == 'alert') {
        openTL('alert_nav');
    } else if (getConfig(1, 'dial') == 'reload') {
        showTL(null, "dial");
    }
}

function showtoast(id) {
    document.getElementById(id).show();
    setTimeout(function () { //3秒くらい
        document.getElementById(id).hide();
    }, 2000);
}

function t_text(text) {
    var i = 0, emoji = "", replacetext = "";

    if (getConfig(1, 'joke') == 1) {
        text = text.replace(/。/g , "、それと便座カバー。");
        text = text.replace(/toot/g , "awoo");
        text = text.replace(/TOOT/g , "AWOO");
        text = text.replace(/(神崎|おにいさん)/g , "<span style='color: red'>$1</span>");
        text = text.replace(/あんのたん/g , "<span class='fav-active'>$1</span>");
        text = text.replace(/(ごちうさ|ご注文はうさぎですか？)/g , "あぁ^～心がぴょんぴょんするんじゃぁ^～");
        text = text.replace(/35億/g , "5000兆円");
        text = text.replace(/がっこうぐらし/g , "【窓割れてね？】");
        text = text.replace(/(ニート|無職|ノージョブ|自宅警備員)/g , "【部屋に閉じこもって生きていればそれでいいの？】");
    }

    if (!getConfig(1, 'no_custom_emoji')) {
        while (emoji_num_a[i]) {
            emoji = ":" + emoji_num_a[i] + ":";

            replacetext = "<img draggable=\"false\" class=\"emojione\" src=\""+emoji_list[emoji_num_a[i]]+"\" />";
            text = text.replace(new RegExp(emoji,"g"),replacetext);
            i++;
        }
        text = text.replace(/:@([a-zA-Z0-9_].*):/g , "<img class=\"emojione\" src=\""+getUserEmoji($1)+"\" />");
        var userEmoji;
        if (userEmoji = text.match(/:@([a-zA-Z0-9_].*):/g)) {

        }
    }

    //読み仮名 from theboss.tech
    //参考: https://github.com/theboss/mastodon/commit/f14da9bf85298000c4882e604b3d1eda8c99d0ee
    text = text.replace(/[\|｜]?([^\|｜《]+?)《([^》]+?)》/g, '<ruby><rb>$1</rb><rt>$2</rt></ruby>');

    //text = emojione.toImage(text);
    text = twemoji.parse(text);
    return text;
}

function show(id) {
    document.getElementById(id).show();
}

function hide(id) {
    document.getElementById(id).hide();
}

function openURL(url) {
    var mode = getConfig(1, 'url_open');
    if (ons.isWebView() && !mode) {
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
        if (mode == "Inapp") {
            window.open(url, "_blank");
        } else {
            window.open(url, "_system");
        }
    }
}

function getParam(val) {
    var data_s = {}, data = val.substring(1).split('&'), data_ex, value, key;
    for(var i = 0; i < data.length; i++) {
        data_ex = value = key = null;
        data_ex = data[i].search(/=/);
        value = data[i].slice(data[i].indexOf('=', 0) + 1);
        if(data_ex != -1)
            key = data[i].slice(0, data_ex);
        if(key) data_s[key] = decodeURIComponent(value);
    }
    return data_s;
}

function escapeHTML(text) {
    text = text.replace(/"/g , "&quot;");
    text = text.replace(/'/g , "&#39;");
    text = text.replace(/&/g , "&amp;");
    text = text.replace(/</g , "&lt;");
    text = text.replace(/>/g , "&gt;");

    return text;
}