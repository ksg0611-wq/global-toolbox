/**
 * functions/api/gemini.js
 *
 * Cloudflare Pages Function — Gemini API 프록시
 *
 * 라우팅: POST /api/gemini
 *
 * 환경 변수 (Cloudflare Pages 대시보드 및 .dev.vars 에 설정):
 *   GEMINI_API_KEY — Google AI Studio에서 발급받은 Gemini API 키
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: CORS_HEADERS,
  });
}

function errorResponse(message, status = 400) {
  return jsonResponse({ error: { message } }, status);
}

export async function onRequest(context) {
  const { request, env } = context;

  // OPTIONS 요청 (CORS Preflight) 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return errorResponse('Method Not Allowed. Only POST is supported.', 405);
  }

  // API 키 확인
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return errorResponse('Server configuration error: Gemini API key is missing.', 500);
  }

  try {
    const body = await request.json();
    const model = body.model || 'gemini-2.5-flash-lite';

    // Google Gemini API 요청 바디 구성
    const googlePayload = {
      contents: body.contents,
    };

    if (body.systemInstruction) {
      googlePayload.systemInstruction = body.systemInstruction;
    }
    if (body.generationConfig) {
      googlePayload.generationConfig = body.generationConfig;
    }
    if (body.safetySettings) {
      googlePayload.safetySettings = body.safetySettings;
    }

    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(googleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googlePayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        errorJson = { error: { message: errorText } };
      }
      return jsonResponse(errorJson, response.status);
    }

    const data = await response.json();
    return jsonResponse(data);

  } catch (err) {
    return errorResponse(err.message || 'An unexpected error occurred.', 500);
  }
}
