document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    updateContents();
}

function updateContents() {
    request("/api/contents?id=" + getParameters().id, (contents) => {
        drawContents(contents[0]);
        resizeContentsContainer();
        bindEvents();
    });
}

function bindEvents() {
    window.addEventListener("resize", () => {
        resizeContentsContainer();
    });

    document.getElementById("editButton").addEventListener("click", () => location.href = "/write?id=" + getParameters().id);
}

function resizeContentsContainer() {
    const contentsContainer = document.getElementById("contentsContainer");

    contentsContainer.style.height = "0px";
    contentsContainer.style.height = (contentsContainer.scrollHeight) + "px";
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

function drawContents(contents) {
    contents.contents = contents.contents.replace(/\n/gi, "<br>");
    contents.contents = contents.contents.replace(/ /gi, "&nbsp;");

    document.querySelector(".mainContainer").innerHTML = "<div class=\"topContainer\">\n" +
    "        <div class=\"titleBar\">" +
    "            <h2 class=\"title\">" + contents.title + "</h2>\n" +
    "            <div>\n" +
    "                <button id=\"editButton\" class=\"editButton\">수정</button>\n" +
    "                <button id=\"deleteButton\" class=\"deleteButton\">삭제</button>\n" +
    "            </div>\n" +
    "        </div>" +
    "\n" +
    "            <div class=\"postInfomationContainer\">\n" +
    "                <ul class=\"infomations\">\n" +
    "                    <li class=\"type paddingRight\">" + contents.category + "</li>\n" +
    "                    <li class=\"time borderSide paddingSide\">" + contents.dateTime + "</li>\n" +
    "                    <li class=\"writer paddingLeft\">\n" +
    "                        <img class=\"level\" src=\"image/level.png\">\n" +
    "                        <div class=\"name\">" + contents.mname + "</div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <ul class=\"infomations\">\n" +
    "                    <li class=\"view paddingRight\">조회 " + numberFormat(contents.count) + "</li>\n" +
    "                    <li class=\"comment borderSide paddingSide\">댓글 " + numberFormat(contents.ccount) + "</li>\n" +
    "                    <li class=\"recommendation paddingLeft\">추천 " + numberFormat(contents.like - contents.dislike) + "</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <p readonly id=\"contentsContainer\" class=\"contentsContainer\">" + contents.contents + "</p>\n" +
    "\n" +
    "        <div class=\"recommendationContainer\">\n" +
    "            <button class=\"recommendation\">" + contents.like + "</button>\n" +
    "            <button class=\"decommendation\">" + contents.dislike + "</button>\n" +
    "            <button class=\"ward\"></button>\n" +
    "        </div>";
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

function numberFormat(number) {
    return number.toLocaleString();
}