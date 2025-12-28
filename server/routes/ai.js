const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authenticateToken } = require('../middleware/auth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use a model that supports JSON mode
// Use a model that supports JSON mode
// Use a model that supports JSON mode
const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
});

router.post('/hint', authenticateToken, async (req, res) => {
    console.log("AI Request received.");

    const { code, language, problemTitle, problemDescription } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Code is required" });
    }

    try {
        // Hint doesn't strictly need JSON mode, but we can just use text mode for this one by getting a standard model instance if needed,
        // OR just parse the response. But for hints, we usually want plain text. 
        // Let's use a separate model instance for text-only generation if we want to avoid JSON constraint, 
        // OR just tell it to return a JSON object with a "hint" field.
        // For simplicity, let's keep the hint endpoint returning JSON { hint: "..." }

        const prompt = `
        You are a helpful Computer Science Tutor for a high school APCS exam.
        The student is solving the problem: "${problemTitle}".
        
        Problem Description:
        ${problemDescription.substring(0, 500)}... (truncated)

        Current Student Code (${language}):
        ${code}

        Task:
        Provide a helpful HINT to guide the student. 
        - Do NOT give the full solution.
        - Do NOT write the code for them.
        - Point out syntax errors, logic flaws, or edge cases they might have missed.
        - Be concise (max 3 sentences).
        
        Output JSON: { "hint": "Your hint here" }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Even with JSON mode, we should parse it to be safe
        const data = JSON.parse(text);
        res.json(data);

    } catch (error) {
        console.error("Gemini API Error Details:", error);
        if (error.status === 429) {
            return res.status(429).json({ error: "AI is busy (Rate Limit). Please wait 1 minute." });
        }
        // Fallback if JSON parse fails or other error
        res.status(500).json({ error: "Failed to generate hint." });
    }
});

router.post('/generate-question', authenticateToken, async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    try {
        const prompt = `
        Generate 1 APCS (Advanced Placement Computer Science) concept question about "${topic}".
        
        Output STRICT JSON format matching this schema:
        {
          "title": "Short Title",
          "content": "Question description... code dump if needed...",
          "code_snippet": "int func(int n) { ... }",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answer_index": 0,
          "explanation": "Why A is correct..."
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        console.error("AI Gen Error:", error);
        if (error.status === 429) {
            return res.status(429).json({ error: "AI Rate Limit. Wait 1 min." });
        }
        res.status(500).json({ error: "Failed to generate question." });
    }
});

router.post('/generate-implementation', authenticateToken, async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    try {
        const prompt = `
        Generate 1 APCS (Advanced Placement Computer Science) coding problem about "${topic}".
        
        Output STRICT JSON format matching this schema:
        {
          "title": "Problem Title",
          "description": "# Problem Description\\nWrite a program...\\n\\n## Input\\n...\\n\\n## Output\\n...",
          "test_cases": [
            { "input": "1 2", "output": "3", "is_sample": true },
            { "input": "10 20", "output": "30", "is_sample": false },
            { "input": "-5 5", "output": "0", "is_sample": false }
          ]
        }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        console.error("AI Gen Implementation Error:", error);
        if (error.status === 429) {
            return res.status(429).json({ error: "AI Rate Limit. Wait 1 min." });
        }
        res.status(500).json({ error: "Failed to generate problem." });
    }
});

module.exports = router;
