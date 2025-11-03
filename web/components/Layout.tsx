import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-brand-600" />
            <span className="text-lg font-semibold">Insyd Collections</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link className="hover:text-brand-600" href="/payments">Payments</Link>
            <Link className="hover:text-brand-600" href="/payments/new">New Payment</Link>
            <Link className="hover:text-brand-600" href="/reminders">Reminders</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" onClick={() => setDark((v) => !v)}>{dark ? 'Light' : 'Dark'}</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        {children}
      </main>
    </div>
  );
}


