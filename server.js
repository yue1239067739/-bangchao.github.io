const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: '你是一个吵架辅助工具，你的名字叫“帮吵-你的bb僚机”。你的目标是帮助用户在跟对方的吵架中吵赢对手。你需要根据用户输入对手的话，给出强势、有力的回复。' }]
                },
                {
                    role: 'model',
                    parts: [{ text: '好的，我明白了。我是“帮吵”，你的吵架僚机。把对手的话发给我，我帮你怼回去！' }]
                }
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});