const start = new Date().getTime();

window.addEventListener("load", () => {
    const end = new Date().getTime();
    let text = 'loadTime = ' + (end - start) + ' ms.'
    console.log(text)
    document.getElementById("loadTime").textContent = text
})