# 🌍 Supabase Setup for Worldwide Storage

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Create a new project

## Step 2: Create Database Table
1. Go to **Table Editor** in your Supabase dashboard
2. Click **"Create a new table"**
3. Table name: `wallets`
4. Add these columns:
   - `id` (int8, Primary Key, Auto-increment)
   - `twitter_handle` (text)
   - `wallet_address` (text, Unique)
   - `created_at` (timestamptz, Default: now())

## Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy your **Project URL** (looks like: `https://xyz.supabase.co`)
3. Copy your **anon public** key (starts with `eyJ...`)

## Step 4: Update Code
Replace these in your code:
- `https://your-project.supabase.co` → Your Project URL
- `your-anon-key` → Your anon public key

## Step 5: Enable RLS (Row Level Security)
1. Go to **Authentication** → **Policies**
2. Click **"New Policy"** for `wallets` table
3. Policy name: "Enable read access for all users"
4. Policy type: "SELECT"
5. Target roles: "anon"
6. Policy definition: `true`

## Step 6: Test
1. Deploy your site
2. Submit a wallet
3. Check Supabase dashboard → Table Editor → `wallets` table

## ✅ Result
- ✅ Worldwide submissions work
- ✅ Admin sees all submissions
- ✅ Data persists forever
- ✅ Free to use
