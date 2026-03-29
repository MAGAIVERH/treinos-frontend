import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const BLOCKED_REQUEST_HEADERS = new Set([
  'host',
  'content-length',
  'connection',
  'transfer-encoding',
]);

async function proxyRequest(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${API_URL}${path}${search}`;

  const requestHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase())) {
      requestHeaders.set(key, value);
    }
  });

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

  const response = await fetch(url, {
    method: request.method,
    headers: requestHeaders,
    body,
    redirect: 'manual',
  });

  // Coleta todos os Set-Cookie separadamente
  const setCookies = response.headers.getSetCookie?.() ?? [];

  const nextResponse = new NextResponse(
    response.status === 204 || response.status === 304 ? null : response.body,
    { status: response.status },
  );

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') {
      nextResponse.headers.set(key, value);
    }
  });

  // Adiciona cada cookie individualmente
  setCookies.forEach((cookie) => {
    nextResponse.headers.append('set-cookie', cookie);
  });

  return nextResponse;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
