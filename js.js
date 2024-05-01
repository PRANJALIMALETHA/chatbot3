const sendChatBtn = document.querySelector(".inputchat span");
let userMessage;
const chatinput = document.querySelector(".inputchat textarea");
const chatBox = document.querySelector(".chatbox");
const API_KEY = "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";

const createChatList = (mess, classname) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chatt", classname);
    let chatContent = classname === 'outgoing' ?
        `<p>${mess}</p>` :
        `<span class="fa-solid fa-robot"></span>
        <p>${mess}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingchatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingchatLi.querySelector("p");
    const requestOptions = {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": userMessage
                },
            ]
        })
    } 
    fetch(API_URL, requestOptions)
        .then((res => res.json()))
        .then((data) => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent = "Something went wrong!";
        })
        .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
}  
const handleChat = () => {
    userMessage = chatinput.value;
    if (!userMessage) return;

    const outgoingChatLi = createChatList(userMessage, 'outgoing');
    chatBox.append(outgoingChatLi);
    
    setTimeout(() => {
        const incomingChatLi = createChatList('Thinking.....', 'incoming');
        chatBox.append(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
        chatinput.value = "";
    }, 600);
}

sendChatBtn.onclick = () => {
    handleChat();
}
