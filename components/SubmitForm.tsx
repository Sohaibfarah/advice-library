'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export function SubmitForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    for_who: '',
    why_it_works: '',
    where_it_works: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please log in to submit advice.');
      router.push('/login');
      return;
    }

    setLoading(true);
    setMessage('');

    const postData = { ...formData, votes: 0, user_id: user.id };
    const { error } = await supabase.from('posts').insert([postData]);

    setLoading(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Advice submitted successfully!');
      setFormData({ title: '', description: '', steps: '', for_who: '', why_it_works: '', where_it_works: '' });
      router.push('/');
    }
  };

  // Form UI remains the same...

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 font-semibold">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-gray-700 font-semibold">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          rows={3}
          placeholder="Explain the problem and solution..."
          required
        />
      </div>
      <div>
        <label htmlFor="steps" className="block text-gray-700 font-semibold">Steps</label>
        <textarea
          id="steps"
          name="steps"
          value={formData.steps}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          rows={4}
          required
        />
      </div>
      <div>
        <label htmlFor="for_who" className="block text-gray-700 font-semibold">For Who</label>
        <input
          type="text"
          id="for_who"
          name="for_who"
          value={formData.for_who}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="why_it_works" className="block text-gray-700 font-semibold">Why It Works</label>
        <input
          type="text"
          id="why_it_works"
          name="why_it_works"
          value={formData.why_it_works}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <div>
        <label htmlFor="where_it_works" className="block text-gray-700 font-semibold">Where It Works</label>
        <input
          type="text"
          id="where_it_works"
          name="where_it_works"
          value={formData.where_it_works}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Submitting...' : 'Submit Advice'}
      </button>
      {message && <p className={`mt-2 ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
    </form>
  );
};