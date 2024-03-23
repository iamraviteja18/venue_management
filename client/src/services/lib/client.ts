import { getCookie } from 'cookies-next';

import { encodeUrlParams } from './param-encoder';

/* TYPES */

interface ResponseType<R> extends Response {
  data?: R;
}

/* CLIENT */

export const createClientHttpClient = () => {
  const url = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_VERCEL_ENV === 'development'
      ? `http://${process.env.NEXT_PUBLIC_API_URL}/api`
      : `https://${process.env.NEXT_PUBLIC_API_URL}/api`
    : '';

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Credentials': 'true',
    'Upgrade-Insecure-Requests': '1',
  });

  const fetch = fetchFactory(url);

  return {
    get: <R = any>(
      path: string,
      options?: {
        params?: { [key: string]: any };
        config?: RequestInit;
      }
    ): Promise<ResponseType<R>> => {
      const parameterizedPath = encodeUrlParams(path, options?.params);

      return fetch<unknown, R>(parameterizedPath, {
        method: 'get',
        ...options?.config,
        headers,
      });
    },
    post: <D = any, R = any>(
      path: string,
      data?: D,
      options?: {
        config?: RequestInit;
      }
    ): Promise<ResponseType<R>> => {
      return fetch<D, R>(
        path,
        {
          method: 'post',
          ...options?.config,
          headers,
        },
        data
      );
    },
    put: <D = any, R = any>(
      path: string,
      data?: D,
      options?: {
        config?: RequestInit;
      }
    ): Promise<ResponseType<R>> => {
      return fetch<D, R>(
        path,
        {
          method: 'put',
          ...options?.config,
          headers,
        },
        data
      );
    },
    delete: <D = any, R = any>(
      path: string,
      options?: {
        data?: D;
        config?: RequestInit;
      }
    ): Promise<ResponseType<R>> => {
      return fetch<D, R>(
        path,
        {
          method: 'delete',
          ...options?.config,
          headers,
        },
        options?.data
      );
    },
  };
};

const fetchFactory = (url: string) => {
  return async <D = any, R = any>(
    path: string,
    config: RequestInit,
    data?: D
  ) => {
    const authCookie = getCookie('access_token');

    const headers = new Headers(config.headers);
    headers.set('Authorization', `Bearer ${authCookie}`);

    const input = `${url}${path}`;

    const res = (await fetch(input, {
      cache: 'no-store',
      ...config,
      headers,
      credentials: 'include',
      body: data ? JSON.stringify(data) : null,
    })) as ResponseType<R>;

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    res.data = (await res.json()) as R | undefined;
    return res;
  };
};
