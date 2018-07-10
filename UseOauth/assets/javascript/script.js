document.getElementById("fb").addEventListener("click", () => {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location = xhttp.responseURL;
        }
    };
    xhttp.open("GET", "http://localhost:3003/login-other", true);
    xhttp.send();
})