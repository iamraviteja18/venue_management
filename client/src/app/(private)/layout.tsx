import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { PrivateNavigation } from '@/components/navigations';

/* TYPES */

type PrivateLayoutProps = {
  children: React.ReactNode;
};

/* COMPONENT */

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  // State
  const cookieStore = cookies();

  const hasAuthToken = cookieStore.has('access_token');
  if (!hasAuthToken) redirect('/login');

  return (
    <>
      <PrivateNavigation />
      <main style={{ width: '100%', maxHeight: '100vh', overflowY: 'auto' }}>
        {children}
      </main>
    </>
  );
};

export default PrivateLayout;
