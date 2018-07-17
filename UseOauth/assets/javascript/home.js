document.addEventListener(
    "DOMContentLoaded",
    function() {
        let collapse = document.getElementsByClassName("collapse-menu");
        let dropdownVertical = document.getElementsByClassName("dropdown-left");
        let collapseMenu = document.getElementsByClassName("collapse-menu");
        let login = document.getElementsByClassName("login");
        let formLogin = document.getElementsByClassName("form-login");
        let icon_profile = document.getElementById("profile"); 

        collapse[0].addEventListener("click", function() {
            // collapse[0].style.display = "none";

            if (dropdownVertical[0].style.display == "block") {
                dropdownVertical[0].style.display = "none";
                collapseMenu[0].innerHTML =
                    "<i class='fas fa-align-justify'></i>";
            } else {
                dropdownVertical[0].style.display = "block";
                collapseMenu[0].innerHTML = "<i class='fas fa-times'></i>";
            }
        });

        login[0].addEventListener("click", function() {
            document.getElementById("overlay").style.display = "block";
            document.getElementsByClassName("form-login")[0].style.display = "block";
        });

        icon_profile.addEventListener("click", function() {
            document.getElementById("overlay").style.display = "block";
            document.getElementsByClassName("profile-form")[0].style.display = "block";
        });

        document.getElementById("overlay").addEventListener("click", function() {
            document.getElementById("overlay").style.display = "none";
            document.getElementsByClassName("form-login")[0].style.display = "none";
            document.getElementsByClassName("profile-form")[0].style.display = "none";    
        });
        
        document.getElementById("signin").addEventListener("click", function() {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "http://localhost:3003/login?", true);
            xhttp.setRequestHeader(
                "Content-type",
                "application/x-www-form-urlencoded"
            );
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 401) {
                    document.getElementsByClassName(
                        "error-text"
                    )[0].innerHTML = this.responseText;
                }
                if (this.readyState == 4 && this.status == 200) {
                    window.sessionStorage.Token = this.responseText;
                    setTimeout(function() {
                        xhttp.open("GET", "http://localhost:3003/admin");
                        xhttp.setRequestHeader(
                            "authorization",
                            window.sessionStorage.Token
                        );
                        xhttp.onreadystatechange = function() {
                            if (this.readyState == 4 && this.status == 200) {
                                document.getElementsByTagName(
                                    "body"
                                )[0].innerHTML = this.responseText;
                                formLogin[0].style.display = "none";
                            }
                        };
                        xhttp.send();
                    }, 200);
                }
            };
            xhttp.send("username=" + username + "&password=" + password);
        });
    },
    false
);
