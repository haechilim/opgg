document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    updateList();
}

function bindEvents() {
    document.querySelectorAll(".list .post").forEach((element) => {
        element.addEventListener("click", () => {
            location.href = "/contents.html?id=" + element.id;
        });
    });
}

function updateList() {
    request("/list?limit=10&offset=0", (posts) => {
        drawPosts(posts);
        bindEvents();
    });
}

function request(url, callback) {
    let xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.addEventListener("load", () => {
        let json = JSON.parse(xmlHttpRequest.responseText);
        
		if(callback) callback(json);
	});

	xmlHttpRequest.open("GET", url, true);
	xmlHttpRequest.send();
}

function drawPosts(posts) {
    console.log(posts);

    let html = "";

    for(let i = 0; i < posts.length; i++) {
        html += getPostHtml(posts[i]);
    }

    document.querySelector(".list").innerHTML = html;
}

function getPostHtml(post) {
    return "<div class=\"post\" id=\"" + post.id + "\">\n" +
    "            <div class=\"recommendationContainer\">\n" +
    "                <img class=\"image\" src=\"image/recommendation.png\"/>\n" +
    "                <div class=\"recommendation\">" + (post.like - post.dislike) + "</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"postInformation\">\n" +
    "                <div class=\"titleContainer\">\n" +
    "                    <div class=\"title\">" + post.title + "</div>\n" +
    "                    <div class=\"comment\">[" + post.ccount + "]</div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"writerContainer\">\n" +
    "                    <div class=\"type\">" + post.category + "</div>\n" +
    "                    <div class=\"time\">" + post.dateTime + "</div>\n" +
    "                    <div class=\"writer\">\n" +
    "                        <img class=\"image\" src=\"image/level.png\">\n" +
    "                        <div class=\"name\">" + post.mname + "</div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>"
}