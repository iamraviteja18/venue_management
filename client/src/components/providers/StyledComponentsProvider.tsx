'use client';

import { useServerInsertedHTML } from 'next/navigation';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

/* TYPES */

type StyledComponentsProviderProps = {
  children: React.ReactNode;
};

/* COMPONENT */

const globalCache = createCache();

export const StyledComponentsProvider = ({
  children,
}: StyledComponentsProviderProps) => {
  const cache = typeof window === 'undefined' ? createCache() : globalCache;

  useServerInsertedHTML(() => (
    <style
      id='antd'
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};
