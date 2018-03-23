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
                    var video = document.querySelector("#videomainbox > video");
                    video.controls = false;
                    elemid("VideoBox_Play").className = "fa fa-fw fa-2x black fa-pause";
                    nowPlaying = id;
                    openVideo();
                    video.addEventListener("timeupdate", function() {
                        elemid("VideoRange").value = this.currentTime / this.duration * 100;
                        elemid("videoTime").innerText = generateTime(this.currentTime);
                    }, false);
                    video.addEventListener("ended", function() {
                        changePlaying(0);
                        openController();
                    }, false);
                    setTimeout(function () {
                        openController();
                    }, 500);
                })
            }
        });
    }
}

function generateTime(time) {
    var text = "", m = parseInt(time / 60), s = parseInt(time % 60);
    text += m < 10 ? "0" + m : m;
    text += ":";
    text += s < 10 ? "0" + s : s;
    return text;
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
    setTimeout(function () {
        $("#VideoController").addClass("invisible");
    }, 50);
    BackTab('down');
}

function changePlaying(force) { //force: 1で強制的に再生
    var video = document.querySelector("#videomainbox > video");
    var iconobj = [$('#VideoBox_Play'), $('#VideoControllerBox_Play')];
    iconobj[0].removeClass("fa-play fa-pause");
    iconobj[1].removeClass("fa-play fa-pause");
    if ((video.paused && force === undefined) || force === 1) { //停止中
        video.play();
        iconobj[0].addClass("fa-pause");
        iconobj[1].addClass("fa-pause");
    } else { //再生中
        video.pause();
        iconobj[0].addClass("fa-play");
        iconobj[1].addClass("fa-play");
    }
    return video.paused;
}

function changeTime(time) {
    var video = document.querySelector("#videomainbox > video");
    video.currentTime = video.currentTime + time;
}

function changeTimeAbsolute(time) {
    openController();
    var video = document.querySelector("#videomainbox > video");
    video.currentTime = time * video.duration / 100;
}

function openController() {
    var i = 0;
    if (is_openController.length !== 0) i = is_openController.length;
    is_openController[i] = true;
    $("#VideoController").removeClass("invisible");
    setTimeout(function () {
        if (!is_openController[i+1]) {
            $("#VideoController").addClass("invisible");
            is_openController = [];
        }
    }, 5000);
}

function OpenMenu() {
    ons.openActionSheet({
        cancelable: true,
        buttons: [
            '速度',
            '画質',
            {
                label: '通報',
                modifier: 'destructive'
            },
            {
                label: 'キャンセル',
                icon: 'md-close'
            }
        ]
    }).then(function (index) {

    });
}