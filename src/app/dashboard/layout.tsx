import { redirect } from 'next/navigation';
import React from 'react';

import { getCookieUser } from '@/lib/auth';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCookieUser();

  if (!user) {
    redirect('/login');
  }

  return children;
}
