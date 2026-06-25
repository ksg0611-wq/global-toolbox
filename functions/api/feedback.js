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

export async function onRequest(context) {
  const { request, env } = context;

  // OPTIONS request (CORS Preflight) 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return errorResponse('Method Not Allowed. Only POST is supported.', 405);
  }

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
