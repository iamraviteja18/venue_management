'use client';

import { RecoilRoot } from 'recoil';

/* TYPES */

type RecoilProviderProps = {
  children?: React.ReactNode;
};

/* COMPONENT */

export const RecoilProvider = ({ children }: RecoilProviderProps) => (
  <RecoilRoot>{children}</RecoilRoot>
);
