/**
 * functions/api/youtube.js
 *
 * Cloudflare Pages Function — YouTube Data API v3 프록시
 *
 * 라우팅: /api/youtube?url=<youtube_url>&mode=video|channel
 *
 * 환경 변수 (Cloudflare Pages 대시보드에서 설정):
 *   YOUTUBE_API_KEY  — Google Cloud Console에서 발급한 YouTube Data API v3 키
 *
 * 지원 입력 형식:
 *   Video  : https://youtu.be/dQw4w9WgXcQ
 *            https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *            dQw4w9WgXcQ (ID 직접 입력)
 *   Channel: https://www.youtube.com/@MrBeast
 *            @MrBeast
 *            UCX6OQ3DkcsbYNE6H8uQQuVA (Channel ID 직접 입력)
 */

const YT_API = 'https://www.googleapis.com/youtube/v3';

/* ─── 유틸: YouTube Video ID 추출 ─────────────────────────────────────────── */
function extractVideoId(input) {
  // youtu.be/xxxxx
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/watch?v=xxxxx
  const longMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];

  // youtube.com/embed/xxxxx
  const embedMatch = input.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // shorts
  const shortsMatch = input.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // 11자 ID 직접 입력
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();

  return null;
}

/* ─── 유틸: CORS 허용 헤더 ────────────────────────────────────────────────── */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

/* ─── Video 분석 ──────────────────────────────────────────────────────────── */
async function fetchVideo(videoId, apiKey) {
  const url = new URL(`${YT_API}/videos`);
  url.searchParams.set('part', 'snippet,statistics,contentDetails');
  url.searchParams.set('id', videoId);
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `YouTube API error ${res.status}`);
  }

  const data = await res.json();
  if (!data.items?.length) {
    throw new Error('Video not found. Please check the URL or ID.');
  }

  const item = data.items[0];
  return {
    type:         'video',
    videoId:      item.id,
    title:        item.snippet?.title,
    channelTitle: item.snippet?.channelTitle,
    channelId:    item.snippet?.channelId,
    description:  item.snippet?.description,
    publishedAt:  item.snippet?.publishedAt,
    thumbnail:    item.snippet?.thumbnails?.maxres?.url
                ?? item.snippet?.thumbnails?.high?.url
                ?? item.snippet?.thumbnails?.default?.url,
    tags:         item.snippet?.tags ?? [],
    duration:     item.contentDetails?.duration,
    statistics: {
      viewCount:    Number(item.statistics?.viewCount    ?? 0),
      likeCount:    Number(item.statistics?.likeCount    ?? 0),
      commentCount: Number(item.statistics?.commentCount ?? 0),
      favoriteCount:Number(item.statistics?.favoriteCount?? 0),
    },
  };
}

/* ─── Channel 분석 ────────────────────────────────────────────────────────── */
async function fetchChannel(input, apiKey) {
  let channelId = null;

  // @handle 형식 또는 URL에서 @handle 추출
  const handleMatch = input.match(/@([\w.-]+)/);
  if (handleMatch) {
    // handle → channelId 변환 (search API)
    const searchUrl = new URL(`${YT_API}/search`);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('q', `@${handleMatch[1]}`);
    searchUrl.searchParams.set('type', 'channel');
    searchUrl.searchParams.set('maxResults', '1');
    searchUrl.searchParams.set('key', apiKey);

    const searchRes = await fetch(searchUrl.toString());
    if (!searchRes.ok) throw new Error(`YouTube API error ${searchRes.status}`);
    const searchData = await searchRes.json();
    channelId = searchData.items?.[0]?.id?.channelId ?? null;
  } else if (/^UC[\w-]{22}$/.test(input.trim())) {
    // UC로 시작하는 Channel ID 직접 입력
    channelId = input.trim();
  }

  if (!channelId) {
    throw new Error('Could not resolve channel. Try using a Channel ID (starts with UC...) or @handle.');
  }

  const url = new URL(`${YT_API}/channels`);
  url.searchParams.set('part', 'snippet,statistics,brandingSettings');
  url.searchParams.set('id', channelId);
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `YouTube API error ${res.status}`);
  }

  const data = await res.json();
  if (!data.items?.length) {
    throw new Error('Channel not found. Please check the URL or ID.');
  }

  const item = data.items[0];
  return {
    type:        'channel',
    channelId:   item.id,
    title:       item.snippet?.title,
    description: item.snippet?.description,
    customUrl:   item.snippet?.customUrl,
    country:     item.snippet?.country,
    publishedAt: item.snippet?.publishedAt,
    thumbnail:   item.snippet?.thumbnails?.high?.url
              ?? item.snippet?.thumbnails?.default?.url,
    statistics: {
      subscriberCount:      Number(item.statistics?.subscriberCount ?? 0),
      hiddenSubscriberCount:item.statistics?.hiddenSubscriberCount ?? false,
      videoCount:           Number(item.statistics?.videoCount ?? 0),
      viewCount:            Number(item.statistics?.viewCount  ?? 0),
    },
  };
}

/* ─── Pages Function 핸들러 ───────────────────────────────────────────────── */
export async function onRequest(context) {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  // API 키 존재 확인
  const apiKey = env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return errorResponse('Server configuration error: YouTube API key is missing.', 500);
  }

  const { searchParams } = new URL(request.url);
  const rawInput = searchParams.get('url') ?? searchParams.get('input') ?? '';
  const mode     = searchParams.get('mode') ?? 'video'; // 'video' | 'channel'

  if (!rawInput.trim()) {
    return errorResponse('Missing required parameter: url');
  }

  try {
    let result;

    if (mode === 'channel') {
      result = await fetchChannel(rawInput.trim(), apiKey);
    } else {
      // Video 모드
      const videoId = extractVideoId(rawInput.trim());
      if (!videoId) {
        return errorResponse('Could not extract a valid YouTube Video ID from the input.');
      }
      result = await fetchVideo(videoId, apiKey);
    }

    return jsonResponse(result);

  } catch (err) {
    return errorResponse(err.message ?? 'An unexpected error occurred.', 502);
  }
}
