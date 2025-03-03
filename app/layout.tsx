'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../app/globals.css';
import { MdHome, MdAddCircle, MdPerson, MdLogout, MdLogin } from 'react-icons/md';

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
    <nav className="w-64 h-screen bg-blue-600/80 text-white p-6 flex flex-col justify-between">
      <div>
        <Link href="/" className="text-2xl font-bold mb-8 block flex items-center gap-2">
          <MdHome className="w-6 h-6" /> Advice Library
        </Link>
        <ul className="space-y-4">
          <li>
            <Link href="/" className="flex items-center gap-2 hover:underline">
              <MdHome className="w-5 h-5" /> Home
            </Link>
          </li>
          <li>
            <Link href="/submit" className="flex items-center gap-2 hover:underline">
              <MdAddCircle className="w-5 h-5" /> Submit Advice
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/profile" className="flex items-center gap-2 hover:underline">
                <MdPerson className="w-5 h-5" /> Profile
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 hover:underline"
          >
            <MdLogout className="w-5 h-5" /> Logout
          </button>
        ) : (
          <Link href="/login" className="flex items-center gap-2 hover:underline">
            <MdLogin className="w-5 h-5" /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* No need for <link> if using globals.css */}
      </head>
      <body
        className="flex min-h-screen"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}