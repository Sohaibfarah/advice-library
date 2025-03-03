'use client';

import { useState } from 'react';
import { Post } from '../lib/types';

export function PostCard({ post }: { post: Post }) {
  const [vote, setVote] = useState(post.votes);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (loading || upvoted) return;

    setLoading(true);
    const increment = 1;
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, increment }),
      });

      if (!response.ok) throw new Error('Failed to upvote');

      const { votes: newVotes } = await response.json();
      setVote(newVotes);
      setUpvoted(true);
      setDownvoted(false);
    } catch (error) {
      console.error('Upvote error:', error);
      setVote(post.votes); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  const handleDownvote = async () => {
    if (loading || downvoted) return;

    setLoading(true);
    const increment = -1;
    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, increment }),
      });

      if (!response.ok) throw new Error('Failed to downvote');

      const { votes: newVotes } = await response.json();
      setVote(newVotes);
      setDownvoted(true);
      setUpvoted(false);
    } catch (error) {
      console.error('Downvote error:', error);
      setVote(post.votes); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex border rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Voting Column */}
      <div className="flex flex-col items-center w-16 mr-4">
        <button
          onClick={handleUpvote}
          disabled={loading || upvoted}
          className={`focus:outline-none ${upvoted ? 'text-orange-500' : 'text-gray-500 hover:text-orange-500'} disabled:text-gray-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={upvoted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <span className="text-lg font-semibold text-gray-800">{vote}</span>
        <button
          onClick={handleDownvote}
          disabled={loading || downvoted}
          className={`focus:outline-none ${downvoted ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'} disabled:text-gray-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={downvoted ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content Column */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 mb-3">{post.description || 'No description provided.'}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="group relative">
            <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded cursor-pointer">
              Steps
            </span>
            <div className="absolute hidden group-hover:block bg-green-100 text-green-800 p-2 rounded shadow-lg mt-1 z-10 max-w-xs">
              {post.steps}
            </div>
          </div>
          <div className="group relative">
            <span className="inline-block px-2 py-1 bg-blue-200 text-blue-800 text-sm font-semibold rounded cursor-pointer">
              For Who
            </span>
            <div className="absolute hidden group-hover:block bg-blue-100 text-blue-800 p-2 rounded shadow-lg mt-1 z-10 max-w-xs">
              {post.for_who}
            </div>
          </div>
          <div className="group relative">
            <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-sm font-semibold rounded cursor-pointer">
              Why It Works
            </span>
            <div className="absolute hidden group-hover:block bg-yellow-100 text-yellow-800 p-2 rounded shadow-lg mt-1 z-10 max-w-xs">
              {post.why_it_works}
            </div>
          </div>
          <div className="group relative">
            <span className="inline-block px-2 py-1 bg-purple-200 text-purple-800 text-sm font-semibold rounded cursor-pointer">
              Where It Works
            </span>
            <div className="absolute hidden group-hover:block bg-purple-100 text-purple-800 p-2 rounded shadow-lg mt-1 z-10 max-w-xs">
              {post.where_it_works}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Posted on {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown'}
        </p>
      </div>
    </div>
  );
}