import NetworkUtil from "./networkUtil.js";

class Contents {
    constructor() {
        this.parentId;
        this.sort = "top";
        this.id = NetworkUtil.getParameters().id;
        this.comments = document.querySelector(".writeContainer .writeComments");
        this.topButton = document.querySelector(".commentContainer .sortTypesContainer .top");
        this.newButton = document.querySelector(".commentContainer .sortTypesContainer .new");
    };

    init() {
        this.updateContents();
        this.updateSortButton();
    }
    
    updateContents() {
        NetworkUtil.request("/api/contents?id=" + this.id, "GET", "", (contents) => {
            this.drawContents(contents);
            this.resizeContentsContainer();
        });
    }

    updateComments() {
        NetworkUtil.request("/api/comments?id=" + this.id + "&sort=" + this.sort, "GET", "", comments => {
            this.drawComments(comments);
            this.updateCommentsCount();
        });
    }

    updateSortButton() {
        this.updateSortButtonColor();
        this.updateComments();
    }

    updateSortButtonColor() {
        const sortTop = this.sort == "top";

        this.topButton.style.color = sortTop ? "#16ae81" : "#000000";
        this.newButton.style.color = sortTop ? "#000000" : "#16ae81";
        this.topButton.style.borderBottomColor = sortTop ? "#16ae81" : "#ffffff";
        this.newButton.style.borderBottomColor = sortTop ? "#ffffff" : "#16ae81";
    }
    
    bindEvents() {
        window.addEventListener("resize", () => {
            this.resizeContentsContainer();
        });
    
        document.querySelector(".mainContainer .topContainer .titleBar #editButton").addEventListener("click", () => location.href = "/write?id=" + this.id);

        document.querySelector(".mainContainer .topContainer .titleBar #deleteButton").addEventListener("click", () => {
            NetworkUtil.request("/api/deletePost?id=" + this.id, "GET", "", (json) => {
                if(json.success) location.href = "/?sort=new&page=1";
                else alert("????????? ????????? ?????????????????????.");
            });
        });

        document.querySelector(".mainContainer .recommendationContainer .recommendation").addEventListener("click", () => {
            NetworkUtil.request("/api/like?id=" + this.id, "GET", "", (json) => {
                if(json.success) this.updateContents();
            });
        });

        document.querySelector(".mainContainer .recommendationContainer .decommendation").addEventListener("click", () => {
            NetworkUtil.request("/api/dislike?id=" + this.id, "GET", "", (json) => {
                if(json.success) this.updateContents();
            });
        });

        this.comments.addEventListener("keyup", () => document.querySelector(".writeContainer #length").innerHTML = this.comments.value.length);

        document.querySelector(".writeContainer .writeCommentsFooter #write").addEventListener("click", () => {
            if(this.comments.value == "") {
                alert("????????? ??????????????????.")
                return;
            }

            NetworkUtil.request("/api/writeComment", "POST", "id=" + this.id + "&contents=" + encodeURIComponent(this.comments.value), (json) => {
                if(json.success) {
                    this.comments.value = "";
                    this.updateComments();
                }
                else alert("?????? ????????? ?????????????????????.");
            });
        });

        this.topButton.addEventListener("click", () => {
            this.sort = "top";
            this.updateSortButton();
        });

        this.newButton.addEventListener("click", () => {
            this.sort = "new";
            this.updateSortButton();
        });
    }

    commentEvent() {
        document.querySelectorAll(".mainComment .footer .writeCommentInComment").forEach(element => {
            element.addEventListener("click", () => {
                let id = element.id;

                if(this.parentId != undefined) document.getElementById("writeContainer" + this.parentId).innerHTML = "";

                this.parentId = id.substr(13, id.length);

                document.getElementById("writeContainer" + this.parentId).innerHTML = "<div class=\"writeContainer\">\n" +
                "   <textarea id=\"writeComments" + this.parentId + "\" class=\"writeComments\" placeholder=\"????????? ????????? ??????, ????????? ????????? ??????????????? ????????? ???????????? ???????????? ????????? ?????? ?????? ????????? ?????? ??? ????????????.\" maxlength=\"1000\"></textarea>\n" +
                "   <div class=\"writeCommentsFooter\">\n" +
                "       <label class=\"insertPhotoLabel\" for=\"insertPhoto\">??????</label>\n" +
                "       <input class=\"insertPhoto\" type=\"file\">\n" +
                "       <span class=\"length\">(<span id=\"length" + this.parentId + "\">0</span>/1000)</span>\n" +
                "       <button id=\"write" + this.parentId + "\" class=\"write\">??????</button>\n" +
                "   </div>\n" +
                "</div>";

                const comments = document.querySelector("#writeComments" + this.parentId);

                comments.addEventListener("keyup", () => document.querySelector(".writeContainer #length" + this.parentId).innerHTML = comments.value.length);

                document.querySelector(".writeCommentsFooter #write" + this.parentId).addEventListener("click", () => {
                    if(comments.value == "") {
                        alert("????????? ??????????????????.");
                        return;
                    }

                    NetworkUtil.request("/api/writeCommentInComment", "POST", "id=" + this.id + "&parentId=" + this.parentId + "&contents=" + encodeURIComponent(comments.value), (json) => {
                        if(json.success) {
                            comments.value = "";
                            this.updateComments();
                        }
                        else alert("????????? ????????? ?????????????????????.");
                    });
                });
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
        "                <button id=\"editButton\" class=\"editButton\">??????</button>\n" +
        "                <button id=\"deleteButton\" class=\"deleteButton\">??????</button>\n" +
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
        "                    <li class=\"view paddingRight\">?????? " + this.numberFormat(contents.count) + "</li>\n" +
        "                    <li class=\"comment borderSide paddingSide\">?????? " + this.numberFormat(contents.ccount) + "</li>\n" +
        "                    <li class=\"recommendation paddingLeft\">?????? " + this.numberFormat(contents.like - contents.dislike) + "</li>\n" +
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

        this.bindEvents();
    }

    drawComments(comments) {
        let html = "";
        
        for(let i = 0; i < comments.length; i++) {
            const comment = comments[i];

            comment.contents = comment.contents.replace(/\n/gi, "<br>");
            comment.contents = comment.contents.replace(/ /gi, "&nbsp;");

            if(comment.parentId != 0) continue

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
            "           <li class=\"declaration\">??????</li>\n" +
            "           <li id=\"commentButton" + comment.id + "\" class=\"writeCommentInComment\">?????? ??????</li>\n" +
            "       </ul>\n" +
            "   </div>\n" +
            "</div>" +
            "<div id=\"writeContainer" + comment.id + "\" class=\"commentInComment\"></div>";

            for(let j = 0; j < comments.length; j++) {
                const commentInComment = comments[j];

                if(commentInComment.parentId == comment.id) {
                    html += "<div class=\"commentInComment\">\n" +
                    "   <div class=\"main\">\n" +
                    "       <ul class=\"infomations\">\n" +
                    "           <li class=\"writer paddingRight\">\n" +
                    "               <img class=\"level\" src=\"image/level.png\">\n" +
                    "               <div class=\"name\">" + commentInComment.name + "</div>\n" +
                    "           </li>\n" +
                    "           <li class=\"time borderLeft paddingLeft\">" + commentInComment.dateTime + "</li>\n" +
                    "       </ul>\n" +
                    "       <div class=\"contents\">" + commentInComment.contents + "</div>\n" +
                    "       <ul class=\"footer\">\n" +
                    "           <li class=\"declaration\">??????</li>\n" +
                    "       </ul>\n" +
                    "   </div>\n" +
                    "</div>";
                }
            }
        }

        document.querySelector(".commentContainer .comment").innerHTML = html;

        this.commentEvent();
    }

    updateCommentsCount() {
        NetworkUtil.request("/api/commentsCount?id=" + this.id, "GET", "", count => {
            document.querySelector(".infomations .comment").innerHTML = "?????? " + count;
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