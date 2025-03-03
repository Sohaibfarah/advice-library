'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PostCard } from '../../components/PostCard';
import { Post } from '../../lib/types';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setMessage('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url, bio')
        .eq('user_id', userData.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError);
        setMessage(`Fetch error: ${profileError.message}`);
      } else {
        setAvatarUrl(profileData?.avatar_url || null);
        setBio(profileData?.bio || '');
      }

      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('votes', { ascending: false });
      if (postError) console.error('Posts fetch error:', postError);
      setPosts(postData || []);

      setLoading(false);
    };
    fetchUserData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      setMessage('No file selected or user not logged in.');
      return;
    }

    setUploading(true);
    setMessage('');
    const file = e.target.files[0];
    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error: storageError, data: storageData } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      setMessage(`Storage upload error: ${storageError.message}`);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const newAvatarUrl = urlData.publicUrl;

    const { error: upsertError, data: upsertData } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, avatar_url: newAvatarUrl, bio: bio || '' }, { onConflict: 'user_id' })
      .select();

    if (upsertError) {
      console.error('Profile upsert error:', upsertError);
      setMessage(`Profile upsert error: ${upsertError.message}`);
    } else {
      setAvatarUrl(newAvatarUrl);
      setMessage('Profile image updated successfully!');
    }
    setUploading(false);
  };

  const handleBioUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setMessage('');
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, avatar_url: avatarUrl, bio }, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error('Bio upsert error:', error);
      setMessage(`Error saving bio: ${error.message}`);
    } else {
      setMessage('Bio updated successfully!');
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-700">Loading...</div>;
  if (!user) return <div className="p-4 text-center text-gray-700">{message}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Your Profile</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <img
              src={avatarUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-blue-200"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
            />
            {uploading && <p className="text-gray-600 mt-2 text-center">Uploading...</p>}
            <p className="text-gray-800 mt-4 text-center font-medium">Email: {user.email}</p>
            <form onSubmit={handleBioUpdate} className="mt-6">
              <label htmlFor="bio" className="block text-gray-700 font-semibold mb-2">Bio</label>
              <textarea
                id="bio"
                value={bio || ''}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                rows={4}
                placeholder="Tell us about yourself..."
              />
              <button
                type="submit"
                className="mt-3 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Bio
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-700">You haven’t posted any advice yet.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}