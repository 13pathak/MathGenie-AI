
export const generateQuiz = async (config, params) => {
    const { apiKey, baseUrl, modelName } = config;
    const { topics, difficulty, count } = params;

    if (!apiKey) throw new Error("API Key is missing");

    const prompt = `
    Generate ${count} unique math word problems.
    Topics: ${topics.join(', ')}.
    Difficulty Level: ${difficulty}.
    
    Constraint: Return the output as a STRICT JSON array (no markdown code blocks, just raw JSON).
    Structure: Array of objects, each having:
    - 'id': unique string or number
    - 'question': string (the word problem)
    - 'answer': string (the final answer key)
    - 'logic': string (step-by-step solution using Markdown and LaTeX for math)

    Ensure the LaTeX is formatted correctly for 'react-markdown' and 'rehype-katex' (e.g., $...$ for inline, $$...$$ for block).
  `;

    const isGemini = baseUrl.includes('googleapis.com');

    try {
        let data;

        if (isGemini) {
            // Gemini API Structure
            const url = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error?.message || `API Error: ${response.statusText}`);
            }

            data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("No content returned from API");

            return parseResponse(text);

        } else {
            // OpenAI Compatible Structure (OpenAI, Groq, DeepSeek, etc.)
            // Normalize URL (remove trailing slash)
            const cleanUrl = baseUrl.replace(/\/$/, '');
            const url = `${cleanUrl}/chat/completions`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        { role: "system", content: "You are a helpful math teacher. Output strictly valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error?.message || `API Error: ${response.statusText}`);
            }

            data = await response.json();
            const text = data.choices?.[0]?.message?.content;
            if (!text) throw new Error("No content returned from API");

            return parseResponse(text);
        }

    } catch (error) {
        console.error("Quiz Generation Failed:", error);
        throw error;
    }
};

function parseResponse(text) {
    // Clean up markdown code blocks if present (```json ... ```)
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
        const json = JSON.parse(cleaned);
        if (!Array.isArray(json)) throw new Error("Response is not an array");
        return json;
    } catch (e) {
        console.error("JSON Parse Error:", e);
        throw new Error("Failed to parse API response. The AI did not return valid JSON.");
    }
}
