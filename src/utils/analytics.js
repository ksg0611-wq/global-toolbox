/**
 * analytics.js
 *
 * GA4 이벤트 추적 유틸리티
 *
 * - window.gtag 가 존재할 때만 실행 (gtag.js 로드 전/차단 시 안전)
 * - try-catch 로 런타임 에러 격리
 *
 * 사용법:
 *   import { trackEvent } from '../../utils/analytics';
 *   trackEvent('button_click', { tool: 'password_generator' });
 */

/**
 * GA4 커스텀 이벤트를 안전하게 전송합니다.
 *
 * @param {string} eventName   - GA4 이벤트 이름 (snake_case 권장)
 * @param {Object} [eventParams] - 이벤트와 함께 전송할 파라미터 객체 (선택)
 */
export function trackEvent(eventName, eventParams = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
  } catch (err) {
    // GA4 추적 실패가 앱 동작에 영향을 주지 않도록 무음 처리
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Analytics] trackEvent failed:', eventName, err);
    }
  }
}

/**
 * 페이지뷰 이벤트를 수동으로 전송합니다 (SPA 라우팅 시 유용).
 *
 * @param {string} pagePath - 추적할 경로 (예: '/tools/password-generator')
 * @param {string} [pageTitle] - 추적할 페이지 제목
 */
export function trackPageView(pagePath, pageTitle) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path:  pagePath,
        page_title: pageTitle || document.title,
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Analytics] trackPageView failed:', pagePath, err);
    }
  }
}
