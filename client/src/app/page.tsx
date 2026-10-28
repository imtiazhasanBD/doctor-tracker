import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RootPage() {
  const cookieStore = await cookies();
  const hasAuth = cookieStore.has('dt_token') || cookieStore.has('dt_auth');

  if (hasAuth) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
