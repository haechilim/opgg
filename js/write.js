document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    bindEvents();
}

function bindEvents() {
    document.getElementById("cencle").addEventListener("click", () => {
        location.href = document.referrer;
    })
}