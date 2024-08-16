
const responseForm = document.getElementById("response-form");
const responseInputField = document.getElementById("response-field");
const chatBox = document.getElementById("chat-box")

const socket = io();

socket.on("connect", () => {});

function pageScroll() {
    window.scrollBy(0,1);
    // scrolldelay = setTimeout(pageScroll,10);
}

socket.on("response", (v) => {
    console.log(v);
    chatBox.appendChild(buildSelfMessage(v.response), 'other')
    pageScroll();
})
socket.on("food_menu", (v) => {
    console.log(v);
    chatBox.appendChild(buildSelfMessage(v.response), 'other')
    pageScroll();
})

responseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("request", responseInputField.value)
    chatBox.appendChild(buildSelfMessage(`${responseInputField.value}`), 'self')
    pageScroll();
})


// New Message Element
function createMessageContainer(type) {
    const child = document.createElement("li")
    child.setAttribute('class', type);
    return child;
}
function createMessageTextContainer() {
    const messageTextContainer = document.createElement("div")
    messageTextContainer.setAttribute("class", "msg")
    return messageTextContainer;
}

function buildSelfMessage(message, type) {
    const child = createMessageContainer(type);
    const messageTextContainer = createMessageTextContainer()
    const messageText = document.createElement("p")

    messageTextContainer.appendChild(messageText);
    messageText.innerHTML = message;

    child.appendChild(messageTextContainer)

    responseInputField.value = "";

    return child;
}

