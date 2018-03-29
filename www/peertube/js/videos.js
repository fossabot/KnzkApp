function showVideos(mode, option = {}, start = 0, reload) {
    if (mode) lastconf = {"mode": mode, "option": option};
    else {
        mode = lastconf["mode"];
        option = lastconf["option"];
    }

    fn.close();
    var reshtml = "", i = 0, get = "";
    if (option["local"]) get += "&filter=local";
    $(".video_list_more").addClass("invisible");
    fetch(endpoint+"/videos?start="+start+"&count=21&sort="+mode+get, {
        headers: {'content-type': 'application/json'},
        method: 'GET'
    }).then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            sendLog("PT_Error/showVideos", response.json);
            showtoast('cannot-load');
            return false;
        }
    }).then(function(json) {
        if (json["data"][0]) {
            if (start) reshtml += elemid("home_main").innerHTML;
            while (json["data"][i]) {
                reshtml += videoListBox(json["data"][i]);
                i++;
            }
            displayTime('update');
            elemid("home_title").innerText = option["title"];
            start = start+21;
            reshtml += "<button class='button button--large--quiet video_list_more' onclick='showVideos(null, null, "+start+")'>もっと読み込む...</button>";
            elemid("home_main").innerHTML = reshtml;
            if (reload) reload();
            initph();
        }
    });
}

function SearchKey() {
    if (window.event.keyCode==13) showVideos_search('-createdAt');
}

function showVideos_search(mode, option = {}, start = 0) {
    loadNav("search.html", null, true, true);
    var q = escapeHTML(elemid("nav-search").value);
    if (mode && option) lastconf_olist = {"mode": mode, "option": option};
    else {
        if (!mode) mode = lastconf_olist["mode"];
        if (!option) option = lastconf_olist["option"];
    }

    fn.close();
    var reshtml = "", i = 0, get = "";
    if (option["local"]) get += "&filter=local";
    get += "&search="+q;
    $(".video_list_more_s").addClass("invisible");
    fetch(endpoint+"/videos/search?start="+start+"&count=21&sort="+mode+get, {
        headers: {'content-type': 'application/json'},
        method: 'GET'
    }).then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            sendLog("PT_Error/search", response.json);
            showtoast('cannot-load');
            return false;
        }
    }).then(function(json) {
        if (json["data"]) {
            if (start) reshtml += elemid("search_main").innerHTML;
            while (json["data"][i]) {
                reshtml += videoListBox(json["data"][i]);
                i++;
            }
            displayTime('update');
            start = start+21;
            reshtml += "<button class='button button--large--quiet video_list_more_s' onclick='showVideos_search(null, null, "+start+")'>もっと読み込む...</button>";
            elemid("search_main").innerHTML = reshtml;
        }
    });
}

function changeSearchSort() {
    ons.openActionSheet({
        title: '並び替え',
        cancelable: true,
        buttons: [
            '投稿が新しい順',
            '再生回数が多い順',
            '動画時間が長い順',
            '評価が高い順',
            '名前順',
            {
                label: 'キャンセル',
                icon: 'md-close'
            }
        ]
    }).then(function (index) {
        if (index === 0) showVideos_search('-createdAt');
        else if (index === 1) showVideos_search('-views');
        else if (index === 2) showVideos_search('-duration');
        else if (index === 3) showVideos_search('-likes');
        else if (index === 4) showVideos_search('-name');
    });
}