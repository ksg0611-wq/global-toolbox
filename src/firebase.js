import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Vite 환경 변수에서 안전하게 Firebase 설정을 읽어옵니다.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth;
let db;

try {
  // 빌드 환경(ReactSnap)이거나 API 키가 비정상적일 때 하드 크래시 방어
  const isBuildEnv = (typeof navigator !== 'undefined' && /ReactSnap/i.test(navigator.userAgent)) || !firebaseConfig.apiKey;
  
  if (isBuildEnv) {
    console.warn('Firebase initialization skipped or mocked during static build phase.');
    app = {};
    auth = {}; // 필요한 최소한의 모킹 객체
    db = {};
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error('Gracefully handled Firebase init error during build:', error);
  app = {};
  auth = {};
  db = {};
}

// 다른 컴포넌트에서 가져다 쓸 수 있도록 인증(Auth) 및 데이터베이스(Firestore) 객체를 내보냅니다.
export { app, auth, db };
