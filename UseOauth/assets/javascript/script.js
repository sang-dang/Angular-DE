document.addEventListener(
    "DOMContentLoaded",
    function() {
        document.getElementsByClassName("facebook")[0].addEventListener("click", () => {
            document.getElementById("overlay").style.display = "none";
            document.getElementsByClassName("form-login")[0].style.display = "none";
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    window.location = xhttp.responseURL;
                }
            };
            xhttp.open("GET", "http://localhost:3003/login-other", true);
            xhttp.send();
        })
})