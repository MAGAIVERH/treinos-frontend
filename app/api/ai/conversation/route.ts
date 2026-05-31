import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BLOCKED_REQUEST_HEADERS = new Set([
  'host',
  'content-length',
  'connection',
  'transfer-encoding',
]);

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { error: 'API URL is not configured' },
      { status: 500 },
    );
  }

  const url = `${API_URL}/ai/conversation`;

  const requestHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase())) {
      requestHeaders.set(key, value);
    }
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: requestHeaders,
  });

  const setCookies = response.headers.getSetCookie?.() ?? [];
  const body =
    response.status === 204 || response.status === 304
      ? null
      : await response.text();

  const nextResponse = new NextResponse(body, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      nextResponse.headers.set(key, value);
    }
  });

  setCookies.forEach((cookie) => {
    nextResponse.headers.append('set-cookie', cookie);
  });

  return nextResponse;
}
