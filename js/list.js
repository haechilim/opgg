class List {
    static POST_PER_PAGE = 10;

    constructor() {
        this.sort = this.getParameters().sort;
        this.page = this.getParameters().page;

        if(this.sort == undefined) this.sort = "new";
        if(this.page == undefined) this.page = "1";
    }

    init() {
        this.selectedNewSortCategory();
        this.selectedTopSortCategory();
        
        this.request("/api/count", (result) => {
            console.log(result, this);
            this.drawPageButton(result[0].count);
            this.updateList();
        });
    }
    
    updateList() {
        this.request("/api/list?limit=" + List.POST_PER_PAGE + "&offset=" + (this.page - 1) * List.POST_PER_PAGE + "&sort=" + this.sort, (posts) => {
            this.drawPosts(posts);
            this.bindEvents();
        });
    }
    
    bindEvents() {
        document.getElementById("writeButton").addEventListener("click", () => {
            location.href = "/write";
        });
    
        document.getElementById("new").addEventListener("click", () => {
            location.href = "/?sort=new&page=1";
        });
    
        document.getElementById("top").addEventListener("click", () => {
            location.href = "/?sort=top&page=1";
        });
    
        document.getElementById("pageBefore").addEventListener("click", () => {
            location.href = "/?sort=" + this.sort + "&page=" + (parseInt(this.page) - 1);
        });
    
        document.getElementById("pageNext").addEventListener("click", () => {
            location.href = "/?sort=" + this.sort + "&page=" + (parseInt(this.page) + 1);
        });
    }
    
    request(url, callback) {
        let xmlHttpRequest = new XMLHttpRequest();
    
        xmlHttpRequest.addEventListener("load", () => {
            let json = JSON.parse(xmlHttpRequest.responseText);
            
            if(callback) callback(json);
        });
    
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.send();
    }
    
    drawPageButton(count) {
        const pageCount = this.getPageCount(count);
        const currentPage = this.page;
    
        let html = "";
    
        for(let i = 1; i <= pageCount; i++) {
            let isCurrentPage = (i == currentPage);
    
            html += "<button class=\"pageButton " + (isCurrentPage ? "currentPage" : "") + "\" >" + (isCurrentPage ? i : "<a href=\"?sort=" + this.sort + "&page=" + i + "\">" + i + "</a>") + "</button>";
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
    
    drawPosts(posts) {
        console.log(posts);
    
        let html = "";
    
        for(let i = 0; i < posts.length; i++) {
            html += this.getPostHtml(posts[i]);
        }
    
        document.querySelector(".list").innerHTML = html;
    }   
    
    getPostHtml(post) {
        return "<div class=\"post\">\n" +
        "            <div class=\"recommendationContainer\">\n" +
        "                <img class=\"image\" src=\"image/recommendation.png\"/>\n" +
        "                <div class=\"recommendation\">" + (post.like - post.dislike) + "</div>\n" +
        "            </div>\n" +
        "\n" +
        "            <div class=\"postInformation\">\n" +
        "                <div class=\"titleContainer\">\n" +
        "                    <div class=\"title\"><a href=\"contents?id=" + post.id + "\">" + post.title + "</a></div>\n" +
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
    
    getPageCount(postCount) {
        return Math.ceil(postCount / List.POST_PER_PAGE);
    }
    
    getParameters() {
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
    
    selectedNewSortCategory() {
        document.getElementById("new").className = this.sort == "new" ? "newOn" : "new";
    }
    
    selectedTopSortCategory() {
        document.getElementById("top").className = this.sort == "top" ? "topOn" : "top";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new List().init();
});

