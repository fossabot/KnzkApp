function videoListBox(data) {
    if (!data["id"]) return "";
    var name = returnName(data);

    var img_src = "https://"+inst_p+data["thumbnailPath"];
    var reshtml = "<div class=\"videolistbox white\" onclick='showVideo("+data["id"]+")'>" +
        "<div class=\"flexbox left\"><img src=\""+img_src+"\" class=\"thumbnail\"></div>" +
        "<div class=\"flexbox right\">" +
        "<b class=\"videoname\">"+escapeHTML(data["name"])+"</b><br>" +
        "<span class=\"videodesc\"><ons-icon icon=\"fa-clock-o\"></ons-icon> <span class='date' data-time='"+data["createdAt"]+"'>"+displayTime('new', data['createdAt'])+"</span></span> - <span class=\"videodesc\"><ons-icon icon=\"fa-play\"></ons-icon> "+data["views"]+"回</span>" +
        "<div class=\"username cut\">"+name+"</div>" +
        "</div></div>\n";

    return reshtml;
}

function returnName(data) {
    var name = data["account"]["name"];
    if (data["account"]["host"] !== inst_p) name += "@"+data["account"]["host"];
    if (data["account"]["name"] !== data["account"]["displayName"]) name = data["account"]["displayName"] + "(" + name + ")";

    return name;
}

function showVideo(id) {
    if (nowPlaying === id) {
        openVideo(id);
    } else {
        if (nowPlaying) {
            $("#videomainbox").empty();
            document.getElementById("videoname").innerText = "";
        } else {
            $("#VideoController").addClass("invisible");
            elemid("VideoController").show({animation: 'fall'});
        }
        show('DisplayBox');
        fetch(endpoint+"/videos/"+id, {
            headers: {'content-type': 'application/json'},
            method: 'GET'
        }).then(function(response) {
            if(response.ok) {
                return response.json();
            } else {
                sendLog("PT_Error/Video", response.json);
                showtoast('cannot-load');
                return false;
            }
        }).then(function(json) {
            if (json["id"]) {
                VideoData[id] = json;
                var client = new WebTorrent();
                client.add(json['files']['0']['torrentUrl'], function (torrent) {
                    var file = torrent.files.find(function (file) {
                        return file.name;
                    });
                    file.appendTo('#videomainbox');
                    elemid("videoname").innerText = json["name"];
                    document.querySelector("#videomainbox > video").controls = false;
                    elemid("VideoBox_Play").className = "fa fa-fw fa-2x black fa-pause";
                    nowPlaying = id;
                    openVideo();
                })
            }
        });
    }
}

function openVideo() {
    fn.close();
    loadNav('video.html', "up");
    var video = $("#videomainbox > video");
    $(".VideoBox").addClass("VideoonPage");
    $("#BoxDesc").addClass("invisible");
    $("#DisplayBox > div").removeClass("toast");
    $("#DisplayBox .toast__message").removeClass("toast__message");
    $("#FlexBox").removeClass("FlexBox");
    $("#VideoController").removeClass("invisible");
    setTimeout(function () {
        elemid("videoPage_name").innerText = VideoData[nowPlaying]["name"];
        elemid("videoPage_time").innerText = displayTime('new', VideoData[nowPlaying]['createdAt']);
        elemid("videoPage_views").innerText = VideoData[nowPlaying]["views"];
        elemid("videoPage_channel").innerText = VideoData[nowPlaying]["channel"]["displayName"];
        elemid("videoPage_user").innerText = returnName(VideoData[nowPlaying]);
        elemid("videoPage_icon").src = "https://"+inst_p+VideoData[nowPlaying]['account']['avatar']['path'];
        $(".VideoBackController").css({"height": (video.innerHeight()) + "px"});
        $("#VideoController > .toast").css({"height": (video.innerHeight()) + "px"});
    }, 500);
}

function backVideo() {
    $(".VideoBox").removeClass("VideoonPage");
    $("#BoxDesc").removeClass("invisible");
    $("#DisplayBox > div").addClass("toast");
    $("#DisplayBox .toast__message").addClass("toast__message");
    $("#FlexBox").addClass("FlexBox");
    $("#VideoController").addClass("invisible");
    BackTab('down');
}

function changePlaying(iconobj) {
    var video = document.querySelector("#videomainbox > video");
    iconobj.removeClass("fa-play fa-pause");
    if (video.paused) { //停止中
        video.play();
        iconobj.addClass("fa-pause");
    } else { //再生中
        video.pause();
        iconobj.addClass("fa-play");
    }
    return video.paused;
}