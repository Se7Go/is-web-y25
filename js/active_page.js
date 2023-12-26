let href = document.location.pathname.split("/").slice(-1)[0]
let list = document.querySelectorAll(".navigation_list .navigation_item .navigation_link")
console.log(list)
for (const elem of list) {
    if (elem.getAttribute("href")===href){
        console.log(href + " is active")
        elem.classList.add("active");
    }
}