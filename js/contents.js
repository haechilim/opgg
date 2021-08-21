import NetworkUtil from "./networkUtil.js";

class Contents {
    constructor() {
        this.id = NetworkUtil.getParameters().id;
        this.comments = document.querySelector(".writeContainer .writeComments");
    };

    init() {
        this.updateContents();
        this.updateComments();
    }
    
    updateContents() {
        NetworkUtil.request("/api/contents?id=" + this.id, "GET", "", (contents) => {
            this.drawContents(contents);
            this.resizeContentsContainer();
            this.bindEvents();
        });
    }

    updateComments() {
        NetworkUtil.request("/api/comments?id=" + this.id, "GET", "", comments => {
            this.drawComments(comments);
            this.updateCommentsCount();
        });
    }
    
    bindEvents() {
        window.addEventListener("resize", () => {
            this.resizeContentsContainer();
        });
    
        document.getElementById("editButton").addEventListener("click", () => location.href = "/write?id=" + this.id);

        this.comments.addEventListener("keyup", () => {
            document.querySelector(".writeContainer #length").innerHTML = this.comments.value.length;
        });

        document.querySelector(".writeContainer .writeCommentsFooter #write").addEventListener("click", () => {
            NetworkUtil.request("/api/writeComment", "POST", "id=" + this.id + "&contents=" + encodeURIComponent(this.comments.value), (json) => {
                if(json.success) {
                    this.comments.value = "";
                    this.updateComments();
                }
                else alert("댓글 작성에 실패하였습니다.");
            });
        });
    }
    
    resizeContentsContainer() {
        const contentsContainer = document.getElementById("contentsContainer");
    
        contentsContainer.style.height = "0px";
        contentsContainer.style.height = (contentsContainer.scrollHeight) + "px";
    }
    
    drawContents(contents) {
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
        "                    <li class=\"view paddingRight\">조회 " + this.numberFormat(contents.count) + "</li>\n" +
        "                    <li class=\"comment borderSide paddingSide\">댓글 " + this.numberFormat(contents.ccount) + "</li>\n" +
        "                    <li class=\"recommendation paddingLeft\">추천 " + this.numberFormat(contents.like - contents.dislike) + "</li>\n" +
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

    drawComments(comments) {
        let html = "";
        
        for(let i = 0; i < comments.length; i++) {
            let comment = comments[i];

            comment.contents = comment.contents.replace(/\n/gi, "<br>");
            comment.contents = comment.contents.replace(/ /gi, "&nbsp;");

            html += "<div class=\"mainComment\">\n" +
            "   <div class=\"recommendation\">\n" +
            "       <button class=\"button1\"></button>\n" +
            "       <span>" + (comment.like - comment.dislike) + "</span>\n" +
            "       <button class=\"button2\"></button>\n" +
            "   </div>\n" +
            "   <div class=\"main\">\n" +
            "       <ul class=\"infomations\">\n" +
            "           <li class=\"writer paddingRight\">\n" +
            "               <img class=\"level\" src=\"image/level.png\">\n" +
            "               <div class=\"name\">" + comment.name + "</div>\n" +
            "           </li>\n" +
            "           <li class=\"time borderLeft paddingLeft\">" + comment.dateTime + "</li>\n" +
            "       </ul>\n" +
            "   <div class=\"contents\">" + comment.contents + "</div>\n" +
            "       <ul class=\"footer\">\n" +
            "           <li class=\"declaration\">신고</li>\n" +
            "           <li class=\"writeCommentInComment\">답글 쓰기</li>\n" +
            "       </ul>\n" +
            "   </div>\n" +
            "</div>";
        }

        document.querySelector(".commentContainer .comment").innerHTML = html;
    }

    updateCommentsCount() {
        NetworkUtil.request("/api./commentsCount?id=" + this.id, "GET", "", count => {
            document.querySelector(".infomations .comment").innerHTML = "댓글 " + count;
            document.querySelector(".commentContainer .number").innerHTML = count;
        });
    }

    numberFormat(number) {
        return number.toLocaleString();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new Contents().init();
});