toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

async function fetchDisplayFeedbacks() {
    console.log('dom content loaded')
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${Math.floor(Math.random() * 99) + 1}/comments`);
        if (!response.ok) {
            throw new Error(`Что-то пошло не так: ${response.status} - ${response.statusText}`);
        }
        console.log("response is 200")
        response.json().then(json => {
            for (const jsonElement of json) {
                addFeedback(jsonElement.name, jsonElement.email, jsonElement.body)
            }
        })
    } catch (err) {
        console.log(err)
        createErrorMsg(err);
    } finally {
        clearScreen();
        showFeedbacks();
    }


}

window.addEventListener('DOMContentLoaded', fetchDisplayFeedbacks);

function saveJson(json) {
    Object.keys(json)
        .map(key => {
            console.log(json[key])
            return key
        })
        .forEach(key => addFeedback(json[key].name, json[key].email, json[key].body))
}

function createErrorMsg(err) {
    toastr["error"](err, "Что то пошло не так")
    const errMsg = document.createElement("div")

    errMsg.innerHTML = `Что то пошло не так
                        <div id='errorMsg'>Подробнее
                            <div id='errorMsgDetails' class='hidden'>${err}</div>
                        </div>`
    errMsg.addEventListener("click", showErrMsgDetails)
    document.getElementsByClassName("formWrapper").item(0).appendChild(errMsg)
    console.log("Что то пошло не так:" + err)
}

function showErrMsgDetails() {
    const err = document.getElementById("errorMsgDetails");
    err.classList.remove('hidden')

}

console.log("fetchend")