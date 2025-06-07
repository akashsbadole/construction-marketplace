# Database Setup Guide

## Quick Setup with Supabase

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready (2-3 minutes)

### 2. Get Project Credentials
1. Go to Project Settings > API
2. Copy the following:
   - Project URL
   - Anon public key
   - Service role key (keep this secret)

### 3. Update Environment Variables
Update your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Run Database Schema
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the content from `lib/supabase/schema.sql`
3. Click "Run" to execute the schema

### 5. Enable Row Level Security Policies
Add these policies in the SQL Editor:

```sql
-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Public read access for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Public read access for published products
CREATE POLICY "Published products are viewable by everyone" ON products
  FOR SELECT USING (status = 'published' AND visibility = 'public');

-- Vendors can manage their own products
CREATE POLICY "Vendors can manage their own products" ON products
  FOR ALL USING (vendor_id IN (
    SELECT id FROM vendors WHERE user_id = auth.uid()
  ));

-- Public read access for approved contractors
CREATE POLICY "Approved contractors are viewable by everyone" ON contractors
  FOR SELECT USING (status = 'approved');

-- Contractors can manage their own profile
CREATE POLICY "Contractors can manage their own profile" ON contractors
  FOR ALL USING (user_id = auth.uid());

-- Public read access for published projects
CREATE POLICY "Published projects are viewable by everyone" ON projects
  FOR SELECT USING (status = 'published');

-- Users can manage their own projects
CREATE POLICY "Users can manage their own projects" ON projects
  FOR ALL USING (customer_id = auth.uid());

-- Public read access for reviews
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- Users can create reviews
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

### 6. Set up Storage (Optional)
For file uploads, set up Supabase Storage:

1. Go to Storage in Supabase Dashboard
2. Create buckets:
   - `project-images` (for regular project images)
   - `project-360` (for 360° images)
   - `documents` (for project documents)
   - `avatars` (for user avatars)

3. Set up storage policies:
```sql
-- Allow public read access to images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('project-images', 'project-360', 'avatars'));

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Alternative: Local PostgreSQL Setup

If you prefer to use a local PostgreSQL database:

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Create Database
```sql
CREATE DATABASE buildconnect;
CREATE USER buildconnect_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE buildconnect TO buildconnect_user;
```

### 3. Update Environment
```env
DATABASE_URL=postgresql://buildconnect_user:your_password@localhost:5432/buildconnect
```

### 4. Run Migrations
```bash
# If using Prisma (alternative)
npx prisma migrate dev

# Or run the SQL schema directly
psql -d buildconnect -f lib/supabase/schema.sql
```

## Seed Data (Optional)

To add some sample data for testing:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Construction Materials', 'construction-materials', 'Basic construction materials', 1),
('Tools & Equipment', 'tools-equipment', 'Construction tools and equipment', 2),
('Electrical', 'electrical', 'Electrical components and fixtures', 3),
('Plumbing', 'plumbing', 'Plumbing materials and fixtures', 4);

-- Insert sample users (you'll need to handle auth separately)
INSERT INTO users (email, first_name, last_name, role) VALUES
('contractor@example.com', 'John', 'Contractor', 'contractor'),
('vendor@example.com', 'Jane', 'Vendor', 'vendor'),
('customer@example.com', 'Bob', 'Customer', 'customer');
```

## Verification

To verify your setup:

1. **Check Tables**: Ensure all tables are created
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

2. **Test Connection**: Run the Next.js app and check for database connection errors

3. **Test Queries**: Try basic operations through the app interface

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check your environment variables
2. **Permission Denied**: Ensure RLS policies are set correctly
3. **Schema Error**: Make sure all extensions are enabled
4. **File Upload Issues**: Check storage bucket configuration

### Enable Extensions:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- if using location features
```

## Security Notes

1. **Never expose service role key** in client-side code
2. **Use RLS policies** to protect sensitive data
3. **Validate all inputs** on both client and server side
4. **Use HTTPS** in production
5. **Regularly backup** your database

Your database is now ready for the construction marketplace application!
