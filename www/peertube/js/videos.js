function showVideos(mode, option = {}) {
    fn.close();
    var reshtml = "", i = 0, get = "";
    if (option["local"]) get += "&filter=local";
    fetch(endpoint+"/videos?start=0&count=21&sort="+mode+get, {
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
            while (json["data"][i]) {
                reshtml += videoListBox(json["data"][i]);
                i++;
            }
            displayTime('update');
            document.getElementById("home_title").innerText = option["title"];
            document.getElementById("home_main").innerHTML = reshtml;
        }
    });
}