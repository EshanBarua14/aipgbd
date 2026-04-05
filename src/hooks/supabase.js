// Supabase client + all database operations
// Falls back to localStorage gracefully if Supabase is not configured

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = process.env.REACT_APP_SUPABASE_URL  || '';
const SUPABASE_KEY  = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const HAS_SUPABASE  = SUPABASE_URL.startsWith('https://') && SUPABASE_KEY.length > 20;

export const supabase = HAS_SUPABASE ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
export const isSupabaseReady = HAS_SUPABASE;

// ── SQL to run once in Supabase SQL editor ─────────────────────────────────
// Paste this into supabase.com > SQL Editor > New query > Run:
/*
create table if not exists site_config (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists inquiries (
  id text primary key,
  name text, company text, email text, phone text,
  message text, package text,
  status text default 'new',
  note text,
  created_at timestamptz default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  title_bn text,
  excerpt text, excerpt_bn text,
  content text, content_bn text,
  cover_url text,
  category text default 'General',
  published boolean default false,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists portfolio_cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client text, category text,
  challenge text, solution text, results text,
  video_url text, cover_url text,
  gallery jsonb default '[]',
  metrics jsonb default '[]',
  published boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS but allow all for anon (adjust for production)
alter table site_config    enable row level security;
alter table inquiries      enable row level security;
alter table blog_posts     enable row level security;
alter table portfolio_cases enable row level security;

create policy "public read"  on site_config     for select using (true);
create policy "public write" on site_config     for all    using (true);
create policy "public read"  on inquiries       for select using (true);
create policy "public write" on inquiries       for all    using (true);
create policy "public read"  on blog_posts      for select using (true);
create policy "public write" on blog_posts      for all    using (true);
create policy "public read"  on portfolio_cases for select using (true);
create policy "public write" on portfolio_cases for all    using (true);
*/

// ── Config ─────────────────────────────────────────────────────────────────
export async function dbGetConfig() {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('site_config').select('data').eq('id','main').single();
    return data?.data || null;
  } catch { return null; }
}

export async function dbSaveConfig(config) {
  if (!supabase) return false;
  try {
    await supabase.from('site_config').upsert({ id: 'main', data: config, updated_at: new Date().toISOString() });
    return true;
  } catch { return false; }
}

// ── Inquiries ───────────────────────────────────────────────────────────────
export async function dbSaveInquiry(record) {
  if (!supabase) return false;
  try {
    await supabase.from('inquiries').insert({
      id: record.id, name: record.name, company: record.company,
      email: record.email, phone: record.phone,
      message: record.message, package: record.package,
      status: 'new', created_at: record.createdAt,
    });
    return true;
  } catch { return false; }
}

export async function dbGetInquiries() {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch { return null; }
}

export async function dbUpdateInquiry(id, updates) {
  if (!supabase) return;
  try { await supabase.from('inquiries').update(updates).eq('id', id); } catch {}
}

export async function dbDeleteInquiry(id) {
  if (!supabase) return;
  try { await supabase.from('inquiries').delete().eq('id', id); } catch {}
}

// ── Blog ────────────────────────────────────────────────────────────────────
export async function dbGetPosts(publishedOnly = true) {
  if (!supabase) return null;
  try {
    let q = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (publishedOnly) q = q.eq('published', true);
    const { data } = await q;
    return data || [];
  } catch { return null; }
}

export async function dbGetPost(slug) {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    return data || null;
  } catch { return null; }
}

export async function dbSavePost(post) {
  if (!supabase) return false;
  try {
    if (post.id) {
      await supabase.from('blog_posts').update({ ...post, updated_at: new Date().toISOString() }).eq('id', post.id);
    } else {
      await supabase.from('blog_posts').insert({ ...post, updated_at: new Date().toISOString() });
    }
    return true;
  } catch { return false; }
}

export async function dbDeletePost(id) {
  if (!supabase) return;
  try { await supabase.from('blog_posts').delete().eq('id', id); } catch {}
}

export async function dbIncrementPostViews(slug) {
  if (!supabase) return;
  try { await supabase.rpc('increment_post_views', { post_slug: slug }); } catch {}
}

// ── Portfolio cases ─────────────────────────────────────────────────────────
export async function dbGetCases() {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('portfolio_cases').select('*').eq('published', true).order('created_at', { ascending: false });
    return data || [];
  } catch { return null; }
}

export async function dbGetCase(slug) {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from('portfolio_cases').select('*').eq('slug', slug).single();
    return data || null;
  } catch { return null; }
}

export async function dbSaveCase(item) {
  if (!supabase) return false;
  try {
    if (item.id) {
      await supabase.from('portfolio_cases').update(item).eq('id', item.id);
    } else {
      await supabase.from('portfolio_cases').insert(item);
    }
    return true;
  } catch { return false; }
}

export async function dbDeleteCase(id) {
  if (!supabase) return;
  try { await supabase.from('portfolio_cases').delete().eq('id', id); } catch {}
}
