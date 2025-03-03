'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function Navbar() {
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
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">Advice Library</Link>
        <div className="flex gap-4">
          <Link href="/submit" className="hover:underline">Submit Advice</Link>
          {user ? (
            <>
              <Link href="/profile" className="hover:underline">Profile</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <Link href="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}