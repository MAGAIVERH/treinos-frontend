import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const BLOCKED_HEADERS = new Set([
  'host',
  'content-length',
  'connection',
  'transfer-encoding',
]);

function copyHeaders(from: Headers): Headers {
  const headers = new Headers();
  from.forEach((value, key) => {
    if (!BLOCKED_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

async function proxyRequest(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${API_URL}${path}${search}`;

  const body =
    request.method !== 'GET' && request.method !== 'HEAD'
      ? await request.text()
      : undefined;

  const response = await fetch(url, {
    method: request.method,
    headers: copyHeaders(request.headers),
    body,
    redirect: 'manual',
  });

  const nextResponse = new NextResponse(
    response.status === 204 || response.status === 304 ? null : response.body,
    { status: response.status },
  );

  response.headers.forEach((value, key) => {
    if (!BLOCKED_HEADERS.has(key.toLowerCase())) {
      nextResponse.headers.set(key, value);
    }
  });

  return nextResponse;
}

export const GET = proxyRequest;
export const POST = proxyRequest;
