function videoListBox(data) {
  if (!data["id"]) return "";
  var name = returnName(data);

  var img_src = "https://" + inst_p + data["thumbnailPath"];
  var reshtml = "<div class=\"videolistbox white\" onclick='showVideo(" + data["id"] + ")'>" +
    "<div class=\"flexbox left\"><img src=\"" + img_src + "\" class=\"thumbnail\"></div>" +
    "<div class=\"flexbox right\">" +
    "<b class=\"videoname\">" + escapeHTML(data["name"]) + "</b><br>" +
    "<span class=\"videodesc\"><ons-icon icon=\"fa-clock-o\"></ons-icon> <span class='date' data-time='" + data["createdAt"] + "'>" + displayTime('new', data['createdAt']) + "</span></span> - <span class=\"videodesc\"><ons-icon icon=\"fa-play\"></ons-icon> " + data["views"] + "回</span>" +
    "<div class=\"username cut\">" + name + "</div>" +
    "</div></div>\n";

  return reshtml;
}

function returnName(data) {
  var name = data["account"]["name"];
  if (data["account"]["host"] !== inst_p) name += "@" + data["account"]["host"];
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
    fetch(endpoint + "/videos/" + id, {
      headers: {'content-type': 'application/json'},
      method: 'GET'
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        sendLog("PT_Error/Video", response.json);
        showError("ネットワークエラー");
        return false;
      }
    }).then(function (json) {
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
          video.addEventListener("timeupdate", function () {
            elemid("VideoRange").value = this.currentTime / this.duration * 100;
            elemid("videoTime").innerText = generateTime(this.currentTime);
          }, false);
          video.addEventListener("ended", function () {
            changePlaying(0);
            openController();
          }, false);
          video.addEventListener("loadedmetadata", function () {
            setVideoheight();
          }, false);
          video.addEventListener("error", function () {
            showError("動画の読み込み中に不明なエラーが発生しました。Code:" + this.error.code);
          }, false);
          setTimeout(function () {
            openController();
            changePlaying(1);
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
  $(".VideoBox").addClass("VideoonPage");
  $("#BoxDesc").addClass("invisible");
  $("#DisplayBox > div").removeClass("toast");
  $("#DisplayBox .toast__message").removeClass("toast__message");
  $("#FlexBox").removeClass("FlexBox");
  setTimeout(function () {
    setVideoheight();
    renderComment(nowPlaying);
    elemid("videoPage_name").innerText = VideoData[nowPlaying]["name"];
    elemid("videoPage_time").innerText = displayTime('new', VideoData[nowPlaying]['createdAt']);
    elemid("videoPage_views").innerText = VideoData[nowPlaying]["views"];
    elemid("videoPage_channel").innerText = VideoData[nowPlaying]["channel"]["displayName"];
    elemid("videoPage_user").innerText = returnName(VideoData[nowPlaying]);
    elemid("videoPage_icon").src = "https://" + inst_p + VideoData[nowPlaying]['account']['avatar']['path'];
    elemid("videoPage_category").innerText = VideoData[nowPlaying]['category']['label'];
    elemid("videoPage_licence").innerText = VideoData[nowPlaying]['licence']['label'];
    elemid("videoPage_language").innerText = VideoData[nowPlaying]['language']['label'];
  }, 500);
}

function setVideoheight() {
  var video = $("#videomainbox > video");
  $(".VideoBackController").css({"height": (video.innerHeight()) + "px"});
  $("#VideoController > .toast").css({"height": (video.innerHeight()) + "px"});
  $("#videoPage").css({"padding-top": (video.innerHeight()) + "px"});
}

function backVideo() {
  $("body").removeClass("ons-ios-scroll ons-ios-scroll-fix");
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
  if (elemid("BoxDesc").className.indexOf("invisible") !== -1) {
    var i = 0;
    if (is_openController.length !== 0) i = is_openController.length;
    is_openController[i] = true;
    $("#VideoController").removeClass("invisible");
    setTimeout(function () {
      if (!is_openController[i + 1]) {
        $("#VideoController").addClass("invisible");
        is_openController = [];
      }
    }, 5000);
  }
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
    if (index === 0) changeRate();
  });
}

function changeRate() {
  var video = document.querySelector("#videomainbox > video");
  ons.openActionSheet({
    cancelable: true,
    buttons: [
      '2x',
      '1.5x',
      '1x',
      '0.5x',
      {
        label: 'キャンセル',
        icon: 'md-close'
      }
    ]
  }).then(function (index) {
    if (index === 0) video.playbackRate = 2;
    else if (index === 1) video.playbackRate = 1.5;
    else if (index === 2) video.playbackRate = 1.0;
    else if (index === 3) video.playbackRate = 0.5;
  });
}

function showError(text) {
  elemid("error_box").innerText = text;
  elemid("ErrorToast").show({animation: 'fall'});
  setTimeout(function () {
    elemid("ErrorToast").hide();
  }, 5000);
}