document.addEventListener('DOMContentLoaded', function() {
    let collapse = document.getElementsByClassName("collapse-menu");
    let dropdownVertical = document.getElementsByClassName("dropdown-left");
    collapse[0].addEventListener("click", function() {
        // collapse[0].style.display = "none";

        if(dropdownVertical[0].style.display == "block") {dropdownVertical[0].style.display = "none"}
        else {dropdownVertical[0].style.display = "block"}
        
        console.log(dropdownVertical[0].style.display);
        
    })
},false)