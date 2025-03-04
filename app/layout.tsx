'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css'; // Ensure only one import if globals.css handles fonts
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
    <nav className="w-max h-auto text-black p-1 flex flex-col justify-between">
      <div className="flex flex-col text-center items-center justify-center p-5">
        <Link href="/" className="text-2xl font-bold mb-8 block flex items-center justify-center gap-2">
             Advice Library
        </Link>
        <ul className="space-y-4 flex flex-col">
          <li>
            <Link
              href="/"
              className="flex justify-between bg-white text-black px-8 p-2 hover:bg-fuchsia-500 rounded-md cursor-pointer flex items-center gap-2"
            >
              <MdHome className="w-5 h-5" /> Home
            </Link>
          </li>
          <li>
            <Link
              href="/submit"
              className="flex justify-between bg-white text-black px-8 p-2 hover:bg-fuchsia-500 rounded-md cursor-pointer flex items-center gap-2"
            >
              <MdAddCircle className="w-5 h-5" /> New Advice
            </Link>
          </li>
          {user && (
            <li>
              <Link
                href="/profile"
                className="flex justify-between bg-white text-black px-8 p-2 hover:bg-fuchsia-500 rounded-md cursor-pointer items-center gap-2"
              >
                <MdPerson className="w-5 h-5" /> Profile
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="bg-red-600 p-5 rounded-md text-white">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full text-left hover:underline flex items-center justify-center gap-2"
          >
            <MdLogout className="w-5 h-5" /> Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="hover:underline flex items-center justify-center gap-2"
          >
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
      <body
        className="flex font-poppins"
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