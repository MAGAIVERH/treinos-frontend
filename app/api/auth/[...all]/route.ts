import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function handler(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/auth', '/api/auth');
  const search = request.nextUrl.search;
  const url = `${API_URL}${path}${search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key !== 'host') headers.set(key, value);
  });

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    responseHeaders.set(key, value);
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
