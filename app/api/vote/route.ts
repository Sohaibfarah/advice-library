import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request: Request) {
  const { postId, increment } = await request.json();

  if (!postId || typeof increment !== 'number') {
    return NextResponse.json({ error: 'Invalid postId or increment' }, { status: 400 });
  }

  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('votes')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: fetchError?.message || 'Post not found' }, { status: 500 });
  }

  const newVotes = post.votes + increment;

  const { data, error } = await supabase
    .from('posts')
    .update({ votes: newVotes })
    .eq('id', postId)
    .select('votes')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ votes: data.votes });
}