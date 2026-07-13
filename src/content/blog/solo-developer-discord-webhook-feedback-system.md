---
title: "1인 개발자를 위한 무료 디스코드 웹훅 피드백 시스템 구축기"
description: "DB나 어드민 페이지 없이 1인 개발자가 무료로 고객 피드백과 에러 로그를 수집하는 방법. Discord Webhook과 Cloudflare Functions를 활용한 아키텍처를 소개합니다."
date: "2026-07-13"
author: "SungGeun Kim"
tags: ["Discord Webhook", "Cloudflare Functions", "Feedback System", "Indie Maker", "Serverless"]
slug: "solo-developer-discord-webhook-feedback-system"
---

## 1인 개발자에게 피드백 시스템이란?

사용자의 피드백과 사이트 내에서 발생하는 에러 로그를 수집하는 것은 프로덕트 개선에 필수적입니다. 하지만 1인 메이커 입장에서는 피드백 저장을 위한 데이터베이스를 구축하고, 이를 확인하기 위한 어드민(Admin) 페이지까지 따로 만드는 것은 리소스 낭비가 될 수 있습니다. 

그래서 저는 평소 가장 많이 확인하는 메신저인 **디스코드(Discord)**를 활용하여, 별도의 비용과 관리 포인트 없이 즉각적으로 피드백을 받아볼 수 있는 웹훅(Webhook) 시스템을 구축했습니다.

## Discord Webhook 생성 방법

디스코드 웹훅을 만드는 과정은 매우 간단합니다.

1. 알림을 받을 디스코드 서버 내에 채널(예: `#feedback-logs`)을 만듭니다.
2. 채널 설정(톱니바퀴 아이콘) > **연동(Integrations)** > **웹훅(Webhooks)** 메뉴로 이동합니다.
3. '새 웹훅 만들기'를 클릭하고, 이름을 지정한 뒤 **웹훅 URL 복사** 버튼을 누릅니다. (이 URL은 절대 외부에 노출되어서는 안 됩니다.)

## Cloudflare Functions와 연동하기 (코드 예제)

프론트엔드에서 곧바로 디스코드 웹훅 URL로 POST 요청을 보내면 보안 문제가 발생합니다. 따라서 중간에 백엔드 역할을 해줄 서버리스 함수가 필요합니다. 저는 Cloudflare Pages와 결합하기 좋은 **Cloudflare Functions (Workers)**를 사용했습니다.

아래는 `functions/api/feedback.js`의 간단한 구현 예제입니다.

```javascript
// 환경 변수(env)에 저장된 FEEDBACK_WEBHOOK_URL을 사용합니다.
export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { name, email, message, type } = data;

    const embed = {
      title: `새로운 ${type === 'bug' ? '버그 리포트 🐛' : '피드백 💡'}`,
      color: type === 'bug' ? 16711680 : 3447003, // Red for bugs, Blue for feedback
      fields: [
        { name: '이름', value: name || '익명', inline: true },
        { name: '이메일', value: email || '없음', inline: true },
        { name: '메시지', value: message }
      ],
      timestamp: new Date().toISOString()
    };

    const response = await fetch(env.FEEDBACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!response.ok) {
      throw new Error('Discord Webhook 전송 실패');
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
```

프론트엔드에서는 폼 제출 시 `/api/feedback` 엔드포인트로 데이터를 보내기만 하면 됩니다.

## 시스템의 장점과 아키텍처 관점의 인사이트

이 시스템을 도입하고 나서 얻은 가장 큰 장점은 **즉각적인 반응성**과 **무료**라는 점입니다. 사용자가 툴을 사용하다가 버그 리포트를 남기면 즉시 핸드폰 디스코드 알림이 울려 신속하게 대응할 수 있었습니다. 

DB 서버 유지보수나 어드민 페이지 관리가 필요 없고, 트래픽에 맞춰 자동으로 스케일링되는 Cloudflare의 엣지 네트워크를 100% 활용한다는 점에서, 빠른 실행력과 민첩함을 요구하는 1인 개발 환경에 최적화된 아키텍처입니다. 피드백 수집이 고민이시라면 당장 도입해 보시기를 권장합니다!
