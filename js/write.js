import Util from "./networkUtil.js";

class Write {
    constructor() {
        this.id = Util.getParameters().id;
    }

    init() {
        this.requestContents();
        this.bindEvents();
    }
    
    bindEvents() {
        document.getElementById("cencle").addEventListener("click", () => {
            history.back();
        });
    
        document.getElementById("write").addEventListener("click", () => {
            const category = document.getElementById("category").value.trim();
            const title = document.getElementById("title").value.trim();
            const link = document.getElementById("link").value.trim();
            const contents = document.getElementById("contents").value.trim();
    
            if(this.checkValidation(title, contents)) {
                if(this.id) {
                    Util.request("/api/edit", "POST", "id=" + this.id + "&category=" + category + "&title=" + encodeURIComponent(title) +"&link=" + link + "&contents=" + encodeURIComponent(contents), (json) => {
                        if(json.success) location.href = "/contents?id=" + this.id;
                        else alert("글 수정에 실패하였습니다.");
                    });
                }
                else {
                    Util.request("/api/write", "POST", "category=" + category + "&title=" + encodeURIComponent(title) +"&link=" + link + "&contents=" + encodeURIComponent(contents), (json) => {
                        if(json.success) location.href = "/?sort=new&page=1";
                        else alert("새 글 작성에 실패하였습니다.");
                    });
                }
            }
        });
    }

    requestContents() {
        if(this.id) {
            Util.request("/api/contents?id=" + this.id, "GET", "", (contents) => {
                this.redrawPage(contents);
            });
        }
    }
    
    redrawPage(contents) {
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
    
    checkValidation(title, contents) {
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
}

document.addEventListener("DOMContentLoaded", function() {
    new Write().init();
});

