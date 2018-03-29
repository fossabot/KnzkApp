function CommentBox(data) {
    if (!data["id"]) return "";
    var name = returnName(data);
    var avatar = "https://"+inst_p+data['account']['avatar']['path'];
    var reshtml = "<div class=\"comment\">\n" +
        "<div class=\"icon\"><img src=\""+avatar+"\"></div>\n" +
        "<div class=\"main\"><b>"+name+"</b><br>"+data['text']+"</div>\n" +
        "</div>\n";

    return reshtml;
}

function renderComment(id, start = 0) {
    var reshtml = "", i = 0;
    $(".comment_list_more_s").addClass("invisible");
    fetch(endpoint+"/videos/"+id+"/comment-threads?start="+start+"&count=20&sort=-createdAt", {
        headers: {'content-type': 'application/json'},
        method: 'GET'
    }).then(function(response) {
        if(response.ok) {
            return response.json();
        } else {
            sendLog("PT_Error/rendercomment", response.json);
            showtoast('cannot-load');
            return false;
        }
    }).then(function(json) {
        if (json["data"]) {
            if (start) reshtml += elemid("comment").innerHTML;
            while (json["data"][i]) {
                reshtml += CommentBox(json["data"][i]);
                i++;
            }
            displayTime('update');
            start = start+20;
            reshtml += "<button class='button button--large--quiet comment_list_more_s' onclick='renderComment("+id+", "+start+")'>コメントをもっと読み込む...</button>";
            elemid("comment").innerHTML = reshtml;
        }
    });
}