document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    updateContents();
}

function updateContents() {
    request("/contents?id=" + getParameters().id, (contents) => {
        console.log(contents[0]);
        drawContents(contents[0]);
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

function drawContents(contents) {
    document.querySelector(".mainContainer").innerHTML = "<div class=\"topContainer\">\n" +
    "            <h2 class=\"title\">" + contents.title + "</h2>\n" +
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
    "        <div class=\"contentsContainer\">" + contents.contents + "</div>\n" +
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