/**
 * functions/api/feedback.js
 *
 * Cloudflare Pages Function — AI Tool Feedback Webhook Proxy
 *
 * Routing: POST /api/feedback
 *
 * Environment variables:
 *   FEEDBACK_WEBHOOK_URL — Webhook URL (Discord, Slack, etc.) to post logs to
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

// IP별 요청 타임스탬프 기록을 관리하기 위한 글로벌 인메모리 Map
const ipRequestHistory = new Map();

export async function onRequest(context) {
  const { request, env } = context;

  // OPTIONS request (CORS Preflight) 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return errorResponse('Method Not Allowed. Only POST is supported.', 405);
  }

  // IP 기반 Rate Limiting (동일 IP당 분당 최대 5회 제한)
  const clientIp = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  let requestTimestamps = ipRequestHistory.get(clientIp) || [];
  
  // 1분 이상 지난 오래된 기록 필터링
  requestTimestamps = requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);

  if (requestTimestamps.length >= 5) {
    return jsonResponse({ error: "Too many requests. Please try again after a minute." }, 429);
  }

  // 새로운 요청 타임스탬프 기록 및 맵 업데이트
  requestTimestamps.push(now);
  ipRequestHistory.set(clientIp, requestTimestamps);

  // Get webhook URL from environment variables
  const webhookUrl = env.FEEDBACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return errorResponse('Server configuration error: Webhook URL is missing.', 500);
  }

  try {
    const body = await request.json();
    const { toolName, feedbackType } = body;

    if (!toolName || !feedbackType) {
      return errorResponse('Missing required fields: toolName and feedbackType.', 400);
    }

    if (feedbackType !== 'up' && feedbackType !== 'down') {
      return errorResponse('Invalid feedbackType. Must be either "up" or "down".', 400);
    }

    // Construct standard payload for Slack, Discord or teams
    const payload = {
      text: `[Feedback] Tool: ${toolName} | Feedback: ${feedbackType === 'up' ? '👍 (Helpful)' : '👎 (Not Helpful)'}`,
      content: `### 📢 New Feedback Received\n- **Tool:** \`${toolName}\`\n- **Feedback:** ${feedbackType === 'up' ? '👍 (Helpful)' : '👎 (Not Helpful)'}\n- **Timestamp:** \`${new Date().toISOString()}\``
    };

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      return jsonResponse({ success: false, error: `Webhook error: ${errorText}` }, webhookResponse.status);
    }

    return jsonResponse({ success: true, message: 'Feedback sent successfully.' });

  } catch (err) {
    return errorResponse(err.message || 'An unexpected error occurred.', 500);
  }
}
