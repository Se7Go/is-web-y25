toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-left",
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

const storagePrefix = "feedback_";
const countItemsKey = "countFeedbacks"

if (localStorage.getItem(countItemsKey) == null)
    localStorage.setItem(countItemsKey, 0)

function getFeedbacks() {
    return Object.keys(localStorage)
        .filter(key => key.startsWith(storagePrefix))
        .sort((key1, key2) => {
            let k1 = key1.split(storagePrefix)[1].split("_")[0]
            let k2 = key2.split(storagePrefix)[1].split("_")[0]
            console.log(key1 + " " + k1)
            return k2 - k1;
        })
        .map(key => localStorage.getItem(key))
    // return feedbacks;
}

function feedbackExistsByEmail(email) {
    return getFeedbacks().findIndex((jsonString) => JSON.parse(jsonString).email === email) !== -1
}

function addFeedback(name, email, feedback) {
    const stringJson = JSON.stringify({"name": name, "email": email, "feedback": feedback})
    localStorage.setItem(storagePrefix + localStorage.getItem(countItemsKey) + "_" + email, stringJson)
    localStorage.setItem(countItemsKey, Number(localStorage.getItem(countItemsKey)) + 1)
    return stringJson
}

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
            e instanceof DOMException &&
            // everything except Firefox
            (e.code === 22 ||
                e.code === 1014 ||
                e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            storage &&
            storage.length !== 0
        );
    }
}

function createFeedbackFromJsonString(feedback) {
    let feedbackJson = JSON.parse(feedback)
    const feedbck = document.createElement('div');
    feedbck.id = "createdFeedback" + feedbackJson.email
    feedbck.classList.add("createdFeedback")
    feedbck.setAttribute("data-aos", "zoom-in")
    let feedbackName = document.createElement('div')
    feedbackName.classList.add("createdFeedbackName")
    feedbackName.innerText = feedbackJson.name
    let feedbackEmail = document.createElement('div')
    feedbackEmail.classList.add("createdFeedbackEmail")
    feedbackEmail.innerText = feedbackJson.email
    let feedbackFeedback = document.createElement('div')
    feedbackFeedback.classList.add("createdFeedbackFeedback")
    feedbackFeedback.innerText = feedbackJson.feedback
    feedbck.appendChild(feedbackName)
    feedbck.appendChild(feedbackEmail)
    feedbck.appendChild(feedbackFeedback)
    return feedbck
}

function onSubmit() {
    console.log("submitted")
    if (storageAvailable("localStorage")) {
        console.log("yes localStorage =)")
    } else {
        console.log("no localStorage =(")
    }
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
    if (!(name && email && feedback)) {
        toastr["warning"]("All fields required", "Cannot add feedback")
        return;
    }
    if (feedbackExistsByEmail(email)) {
        toastr["error"]("Feedback with this email already exists", "Cannot add feedback")
        return;
    }
    addFeedback(name, email, feedback)
    clearScreen()
    showFeedbacks()
}

function clearScreen() {
    document.getElementById("feedbackList").innerHTML = '';
}

function showFeedbacks() {
    const feedbackList = document.getElementById("feedbackList")
    for (const feedbackItem of getFeedbacks()) {
        let htmlFeedback = createFeedbackFromJsonString(feedbackItem)
        feedbackList.appendChild(htmlFeedback)
    }

    AOS.init({
        duration: 1200,
    });
}

function clear() {
    localStorage.clear()
    clearScreen()
}


document.getElementById("submitButton").addEventListener("click", onSubmit, false)
document.getElementById("clearButton").addEventListener("click", clear, false)
