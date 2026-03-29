import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}${search}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: request.headers,
    redirect: 'manual',
  });

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    nextResponse.headers.set(key, value);
  });

  return nextResponse;
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}${search}`;
  const body = await request.text();

  const response = await fetch(url, {
    method: 'POST',
    headers: request.headers,
    body,
    redirect: 'manual',
  });

  const nextResponse = new NextResponse(response.body, {
    status: response.status,
  });

  response.headers.forEach((value, key) => {
    nextResponse.headers.set(key, value);
  });

  return nextResponse;
}
