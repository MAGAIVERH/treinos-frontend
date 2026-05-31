import { cookies } from 'next/headers';
import { getServerTimezoneOffset } from '@/app/_lib/server-timezone';

const getBody = <T>(c: Response | Request): Promise<T> => {
  return c.json() as Promise<T>;
};

const getUrl = async (contextUrl: string): Promise<string> => {
  const newUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}${contextUrl}`);
  const tzOffset = await getServerTimezoneOffset();
  newUrl.searchParams.set('tzOffset', String(tzOffset));
  return newUrl.toString();
};

const getHeaders = async (headers?: HeadersInit): Promise<HeadersInit> => {
  const _cookies = await cookies();
  return {
    ...headers,
    cookie: _cookies.toString(),
  };
};

export const customFetch = async <T>(
  url: string,
  options: RequestInit,
): Promise<T> => {
  const requestUrl = await getUrl(url);
  const requestHeaders = await getHeaders(options.headers);

  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders,
    credentials: 'include',
  };

  const response = await fetch(requestUrl, requestInit);
  const data = await getBody<T>(response);

  return { status: response.status, data, headers: response.headers } as T;
};
