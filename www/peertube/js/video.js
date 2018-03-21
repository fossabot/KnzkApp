function videoListBox(data) {
    if (!data["id"]) return "";
    var name = data["account"]["name"];
    if (data["account"]["host"] !== inst_p) name += "@"+data["account"]["host"];
    if (data["account"]["name"] !== data["account"]["displayName"]) name = data["account"]["displayName"] + "(" + name + ")";

    var img_src = "https://"+inst_p+data["thumbnailPath"];
    var reshtml = "<div class=\"videolistbox\" onclick='showVideo("+data["id"]+")'>" +
        "<div class=\"flexbox left\"><img src=\""+img_src+"\" class=\"thumbnail\"></div>" +
        "<div class=\"flexbox right\">" +
        "<b class=\"videoname\">"+escapeHTML(data["name"])+"</b><br>" +
        "<span class=\"videodesc\"><ons-icon icon=\"fa-clock-o\"></ons-icon> <span class='date' data-time='"+data["createdAt"]+"'>"+displayTime('new', data['createdAt'])+"</span></span> - <span class=\"videodesc\"><ons-icon icon=\"fa-play\"></ons-icon> "+data["views"]+"回</span>" +
        "<div class=\"username cut\">"+name+"</div>" +
        "</div></div>\n";

    return reshtml;
}

function showVideo(id) {
    if (nowPlaying === id) {
        openVideo(id);
    } else {
        if (nowPlaying) {
            $("#videomainbox").empty();
            document.getElementById("videoname").innerText = "";
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
                    document.getElementById("videoname").innerText = json["name"];
                    nowPlaying = id;
                    openVideo();
                })
            }
        });
    }
}

function openVideo() {
    loadNav('video.html', "up");
    $("#videomainbox > video").addClass("VideoonPage");
    $("#BoxDesc").addClass("invisible");
    $("#DisplayBox > div").removeClass("toast");
    setTimeout(function () {

    }, 500);
}

function backVideo() {
    $("#videomainbox > video").removeClass("VideoonPage");
    $("#BoxDesc").removeClass("invisible");
    $("#DisplayBox > div").addClass("toast");
    BackTab('down');
}