'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PostCard } from '../components/PostCard';
import { Post } from '../lib/types';
import { MdSearch } from 'react-icons/md';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('votes', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(postsData || []);
        setFilteredPosts(postsData || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  if (loading) {
    return <div className="text-center p-4 text-gray-700">Loading...</div>;
  }

  return (
    <div className="flex justify-between min-h-screen ">
      {/* Left Section: Create Advice (Placeholder) */}
      {/* <aside className="w-1/3 p-4 bg-white border-r  md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Advice</h2>
        <p className="text-gray-600">Form coming soon...</p>
      </aside> */}

      {/* Middle Section: Advice Feed with Search */}
      <main className="w-full md:w-2/3 p-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-black mb-6 text-center font-poppins">Advice Library</h1>
        <div className="mb-6">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for advice by topic..."
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          
        </div>
        {filteredPosts.length === 0 ? (
          <p className="text-gray-700 text-center">
            {searchQuery ? 'No matching advice found.' : 'No advice yet—be the first to contribute!'}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Right Section: Profile/Discover (Placeholder) */}
      <aside className="w-1/3 p-4  border-l hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile & Discover</h2>
        <p className="text-gray-600">User info coming soon...</p>
      </aside>
    </div>
  );
}