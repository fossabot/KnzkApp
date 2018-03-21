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
    show('DisplayBox');
}