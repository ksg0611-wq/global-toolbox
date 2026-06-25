/**
 * errorHelper.js
 * 
 * Central helper to parse and format API errors into user-friendly messages.
 */

export function getFriendlyErrorMessage(error) {
  if (!error) return '';

  // Extract the string message from error object
  const message = typeof error === 'string' ? error : (error.message || '');
  const lowerMessage = message.toLowerCase();

  // Check for quota exceeded / rate limit / resource exhausted errors (429)
  if (
    lowerMessage.includes('429') ||
    lowerMessage.includes('quota exceeded') ||
    lowerMessage.includes('limit') ||
    lowerMessage.includes('resource_exhausted') ||
    lowerMessage.includes('exhausted')
  ) {
    return `현재 일시적으로 서비스 사용량이 급증하여 AI 응답이 지연되고 있습니다. 약 30초~1분 후 다시 시도해 주시면 감사하겠습니다.\n\n⚠️ High traffic detected. Our free tier API quota has been temporarily reached. Please wait about 30 seconds and click generate again.`;
  }

  // Return original message for other errors
  return message;
}
