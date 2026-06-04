/**
 * config.js
 *
 * 📌 전역 설정값 중앙 관리 파일
 *
 * 배포 환경별 API URL 변경 방법:
 *   - 로컬 개발:  VITE_API_BASE_URL 환경 변수 미설정 시 localhost:8787 사용
 *   - 프로덕션:   frontend/.env.production 에 아래 변수 추가
 *                 VITE_API_BASE_URL=https://global-toolbox-backend.your-id.workers.dev
 */

// Vite 환경 변수가 있으면 사용, 없으면 로컬 개발 서버 주소로 fallback
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';
