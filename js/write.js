document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    if(getParameters().id) {
        request("/contents?id=" + getParameters().id, "", (contents) => {
            redrawPage(contents[0]);
        });
    }
    bindEvents();
}

function bindEvents() {
    document.getElementById("cencle").addEventListener("click", () => {
        history.back();
    });

    document.getElementById("write").addEventListener("click", () => {
        const id = getParameters().id;
        const category = document.getElementById("category").value.trim();
        const title = document.getElementById("title").value.trim();
        const link = document.getElementById("link").value.trim();
        const contents = document.getElementById("contents").value.trim();

        if(checkValidation(title, contents)) {
            if(id) {
                request("/edit", "id=" + id + "&category=" + category + "&title=" + encodeURIComponent(title) +"&link=" + link + "&contents=" + encodeURIComponent(contents), (json) => {
                    if(json.success) location.href = "contents.html?id=" + id;
                    else alert("글 수정에 실패하였습니다.");
                });
            }
            else {
                request("/write", "category=" + category + "&title=" + encodeURIComponent(title) +"&link=" + link + "&contents=" + encodeURIComponent(contents), (json) => {
                    if(json.success) location.href = "main.html?sort=new&page=1";
                    else alert("새 글 작성에 실패하였습니다.");
                });
            }
        }
    });
}

function request(url, send, callback) {
    let xmlHttpRequest = new XMLHttpRequest();

    xmlHttpRequest.addEventListener("load", () => {
        let json = JSON.parse(xmlHttpRequest.responseText);
        
		if(callback) callback(json);
	});

	xmlHttpRequest.open("POST", url, true);
    xmlHttpRequest.send(send);
    console.log(send);
}

function redrawPage(contents) {
    const category = [ "OP.GG 기획", "유저 뉴스", "팁과 노하우", "자유", "유머", "영상", "유저 찾기", "사건 사고", "팬 아트" ];
    let value = 1;

    for(let i = 0; i < category.length; i++) {
        if(category[i] == contents.category) value = i + 1;
    }

    document.getElementById("text").innerHTML = "글 수정";
    document.getElementById("category").value = value;
    document.getElementById("title").value = contents.title;
    document.getElementById("contents").value = contents.contents;
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

function checkValidation(title, contents) {
    if(title == "") {
        alert("제목을 입력해주세요.");
        return false;
    }
    else if(contents == "") {
        alert("내용을 입력해주세요.");
        return false;
    }
    else return true;
}