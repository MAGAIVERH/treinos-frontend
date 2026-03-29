import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  const url = `${API_URL}/ai/`;
  const body = await request.text();

  const requestHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!['host', 'content-length', 'connection'].includes(key.toLowerCase())) {
      requestHeaders.set(key, value);
    }
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body,
  });

  const setCookies = response.headers.getSetCookie?.() ?? [];

  const nextResponse = new NextResponse(response.body, {
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
