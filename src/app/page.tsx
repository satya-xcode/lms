/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export default async function Home() {
  const session: any = await getServerSession(authOptions);

  if (session) {
    const role = session.user.role;
    if (role === 'admin') return redirect('/admin');
    if (role === 'manager') return redirect('/manager');
    if (role === 'staff') return redirect('/staff');
  }

  return redirect('/login');
}
