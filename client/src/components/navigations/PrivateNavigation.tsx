'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Menu } from 'antd';
import { deleteCookie, getCookie } from 'cookies-next';
import { MdOutlineSpaceDashboard } from 'react-icons/md';
import type { MenuProps } from 'antd';
import { PiTentBold } from 'react-icons/pi';
import { getCookieDomain } from '@/services/lib/utils';

/* COMPONENT */

export const PrivateNavigation = () => {
  // State
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = useState(pathname);

  // Lifecycle
  useEffect(() => {
    setPage(pathname);
  }, [pathname]);

  // Handlers
  const onClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    deleteCookie('access_token', {
      domain: getCookieDomain(),
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    deleteCookie('refresh_token', {
      domain: getCookieDomain(),
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    router.push('/login');
  };

  return (
    <Menu
      onClick={onClick}
      items={[
        {
          key: '/dashboard',
          icon: <MdOutlineSpaceDashboard />,
          label: <Link href='/dashboard'>Dashboard</Link>,
        },
        {
          key: '/venues',
          icon: <PiTentBold />,
          label: <Link href='/venues'>Venues</Link>,
        },
        {
          key: 'spacer',
          disabled: true,
          style: {
            marginTop: 'auto',
            display: 'hidden',
          },
        },
        {
          key: 'logout',
          label: 'Logout',
        },
      ]}
      mode='inline'
      selectedKeys={[page]}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: 256,
        padding: '1rem 0.5rem',
      }}
    />
  );
};
