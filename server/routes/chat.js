const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
const API_KEY = process.env.DASHSCOPE_API_KEY;

if (!API_KEY) {
    console.error('DASHSCOPE_API_KEY not found in environment variables');
    process.exit(1);
}

// Configure CORS headers
router.use((req, res, next) => {
    const allowedOrigins = [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'https://office-plus.netlify.app'
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Store chat history per session
const sessionMessages = new Map();
const maxHistory = 10;

router.post('/', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;

        if (!message) {
            console.error('No message provided');
            return res.status(400).json({ error: 'No message provided' });
        }

        // Get or initialize session messages
        let messages = sessionMessages.get(sessionId) || [];
        messages.push({ role: 'user', content: message });

        // Keep history within limits
        if (messages.length > maxHistory * 2) {
            messages = messages.slice(-maxHistory * 2);
        }
        sessionMessages.set(sessionId, messages);

        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'X-DashScope-SSE': 'enable'
            },
            body: JSON.stringify({
                model: 'qwen-max-0428',
                input: {
                    messages
                },
                parameters: {
                    result_format: 'message',
                    stream: true,
                    temperature: 0.8
                }
            })
        });

        if (!response.ok) {
            throw new Error(`DashScope API error: ${response.status}`);
        }

        const reader = response.body;
        reader.on('readable', () => {
            let chunk;
            while (null !== (chunk = reader.read())) {
                const lines = chunk.toString().split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.output?.choices?.[0]?.message?.content) {
                                res.write(`data: ${JSON.stringify({
                                    content: data.output.choices[0].message.content
                                })}\n\n`);
                            }
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }
        });

        reader.on('end', () => {
            res.end();
        });

    } catch (error) {
        console.error('Error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

module.exports = router;
