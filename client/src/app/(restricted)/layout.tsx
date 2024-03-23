import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/* TYPES */

type RestrictedLayoutProps = {
  children: React.ReactNode;
};

/* COMPONENT */

const RestrictedLayout = ({ children }: RestrictedLayoutProps) => {
  // State
  const cookieStore = cookies();

  const hasAuthToken = cookieStore.has('access_token');
  if (hasAuthToken) redirect('/dashboard');

  return children;
};

export default RestrictedLayout;
