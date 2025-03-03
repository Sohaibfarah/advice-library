'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getUser().then(({ data }) => setUser(data.user || null));

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="w-64 h-screen bg-blue-600 text-white p-6 flex flex-col justify-between">
      <div>
        <Link href="/" className="text-2xl font-bold mb-8 block">Advice Library</Link>
        <ul className="space-y-4">
          <li>
            <Link href="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link href="/submit" className="hover:underline">Submit Advice</Link>
          </li>
          {user && (
            <li>
              <Link href="/profile" className="hover:underline">Profile</Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout} className="w-full text-left hover:underline">Logout</button>
        ) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}