'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PostCard } from '../components/PostCard';
import { Post } from '../lib/types';

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
    <div className="flex flex-1 min-h-screen bg-gray-100">
      {/* Left Section: Empty (Navbar is now in layout) */}
      <aside className="w-1/4 p-4 bg-white border-r hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Advice</h2>
        <p className="text-gray-600">Form coming soon...</p>
      </aside>

      {/* Middle Section: Search Bar and Advice Feed */}
      <main className="w-full md:w-2/4 p-4 overflow-y-auto">
      <div className="sticky top-0 bg-gray-100 z-10 mb-6">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search for advice by topic..."
    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
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
      <aside className="w-1/4 p-4 bg-white border-l hidden md:block">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile & Discover</h2>
        <p className="text-gray-600">User info coming soon...</p>
      </aside>
    </div>
  );
}