document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all mode buttons
            modeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to the clicked button
            btn.classList.add('active');

            const instruction = btn.getAttribute('data-instruction');
            appendMessage(instruction, 'user');
            getBotResponse(instruction);
        });
    });

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            appendMessage(userMessage, 'user');
            userInput.value = '';
            getBotResponse(userMessage);
        }
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);

        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble');
        bubble.textContent = message;

        messageElement.appendChild(bubble);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });
            const data = await response.json();
            appendMessage(data.reply, 'bot');
        } catch (error) {
            console.error('Error:', error);
            appendMessage('哎呀，我的大脑短路了，请稍后再试。', 'bot');
        }
    }
});