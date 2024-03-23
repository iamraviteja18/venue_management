import { Inter } from 'next/font/google';

import { ConfigProvider } from 'antd';

import {
  AuthProvider,
  RecoilProvider,
  SocketProvider,
  StyledComponentsProvider,
  ToasterProvider,
} from '@/components/providers';

import '@/styles/globals.css';
import { PrimaryTheme } from '@/styles/themes';

/* TYPES */

type RootLayoutProps = {
  children: React.ReactNode;
};

/* COMPONENT */

export const metadata = {
  title: 'EMS',
};

const inter = Inter({ subsets: ['latin'] });

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang='en'>
    <body className={inter.className}>
      <ToasterProvider />
      <RecoilProvider>
        <StyledComponentsProvider>
          <SocketProvider>
            <AuthProvider />
            <ConfigProvider theme={PrimaryTheme}>{children}</ConfigProvider>
          </SocketProvider>
        </StyledComponentsProvider>
      </RecoilProvider>
    </body>
  </html>
);

export default RootLayout;
