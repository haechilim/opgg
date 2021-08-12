const POST_PER_PAGE = 10;

document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    const sort = getParameters().sort;

    selectedNewSortCategory(sort);
    selectedTopSortCategory(sort);

    request("/count", (result) => {
        drawPageButton(result[0].count);
        updateList();
    });
}

function updateList() {
    request("/list?limit=" + POST_PER_PAGE + "&offset=" + (getParameters().page - 1) * POST_PER_PAGE + "&sort=" + getParameters().sort, (posts) => {
        drawPosts(posts);
        bindEvents();
    });
}

function bindEvents() {
    document.getElementById("new").addEventListener("click", () => {
        location.href = "main.html?sort=new&page=1";
    });

    document.getElementById("top").addEventListener("click", () => {
        location.href = "main.html?sort=top&page=1";
    });

    document.getElementById("pageBefore").addEventListener("click", () => {
        location.href = "/main.html?page=" + (parseInt(getParameters().page) - 1);
    });

    document.getElementById("pageNext").addEventListener("click", () => {
        location.href = "/main.html?page=" + (parseInt(getParameters().page) + 1);
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

function drawPageButton(count) {
    const pageCount = getPageCount(count);
    const currentPage = getParameters().page;

    let html = "";

    for(let i = 1; i <= pageCount; i++) {
        let isCurrentPage = (i == currentPage);

        html += "<button class=\"pageButton " + (isCurrentPage ? "currentPage" : "") + "\" >" + (isCurrentPage ? i : "<a href=\"main.html?page=" + i + "\">" + i + "</a>") + "</button>";
    }

    document.getElementById("pageButtonContainer").innerHTML = html;

    showBeforeButton(currentPage != 1);
    showNextButton(currentPage != pageCount);
    console.log(pageCount);

    function showBeforeButton(visibility) {
        document.getElementById("pageBefore").style.visibility = visibility ? "visibility" : "hidden";
    }

    function showNextButton(visibility) {
        document.getElementById("pageNext").style.visibility = visibility ? "visibility" : "hidden";
    }
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
    return "<div class=\"post\">\n" +
    "            <div class=\"recommendationContainer\">\n" +
    "                <img class=\"image\" src=\"image/recommendation.png\"/>\n" +
    "                <div class=\"recommendation\">" + (post.like - post.dislike) + "</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"postInformation\">\n" +
    "                <div class=\"titleContainer\">\n" +
    "                    <div class=\"title\"><a href=\"contents.html?id=" + post.id + "\">" + post.title + "</a></div>\n" +
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

function getPageCount(postCount) {
    return Math.ceil(postCount / POST_PER_PAGE);
}

function getParameters() {
    let result = {};
    let part = parameterPart();
    let parameters = part.split("&");
    
    for(let i = 0; i < parameters.length; i++) {
        let tokens = parameters[i].split("=");
        
        if(tokens.length < 2) continue;
        
        result[tokens[0]] = tokens[1];
    }
    
    return result;
    
    function parameterPart() {
        let tokens = location.search.split("?");
        
        return tokens.length > 1 ? tokens[1] : "";
    }
}

function selectedNewSortCategory(sort) {
    document.getElementById("new").className = sort == "new" ? "newOn" : "new";
}

function selectedTopSortCategory(sort) {
    document.getElementById("top").className = sort == "top" ? "topOn" : "top";
}