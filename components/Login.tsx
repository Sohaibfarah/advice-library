'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password }); // Log input
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('Login response:', { data, error }); // Log response
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Logged in successfully!');
      router.push('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup attempt:', { email, password }); // Log input
    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log('Signup response:', { data, error }); // Log response
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Sign up successful! Check your email to confirm.');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login or Sign Up</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
          <button
            type="button"
            onClick={handleSignup}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Sign Up
          </button>
        </div>
        {message && <p className={`mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
      </form>
    </div>
  );
}