/**
 * src/utils/gemini.js
 *
 * Client utility to fetch from our serverless Gemini proxy (/api/gemini).
 * Simulates the GoogleGenerativeAI SDK response structure.
 */

export async function generateGeminiContent(promptText, options = {}) {
  const model = options.model || 'gemini-2.5-flash-lite';
  
  const payload = {
    model,
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  if (options.systemInstruction) {
    payload.systemInstruction = {
      parts: [
        {
          text: options.systemInstruction
        }
      ]
    };
  }

  if (options.generationConfig) {
    payload.generationConfig = options.generationConfig;
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData?.error?.message || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();

  // Return a structure compatible with the official SDK:
  // result = await generateGeminiContent(...)
  // response = await result.response (or result.response)
  // text = response.text()
  return {
    response: {
      text: () => {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text === undefined) {
          throw new Error('Invalid response format from Gemini API.');
        }
        return text;
      }
    }
  };
}
