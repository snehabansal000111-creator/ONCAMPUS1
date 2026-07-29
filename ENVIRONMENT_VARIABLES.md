# Environment Variables Configuration Guide

## Overview

ONCampus requires several environment variables to function properly. This guide explains each variable and how to obtain them.

## Required Variables

### 1. Supabase Configuration

#### NEXT_PUBLIC_SUPABASE_URL
**Type:** URL string  
**Required:** Yes  
**Purpose:** Supabase project URL for client-side requests

**How to Get:**
1. Go to https://supabase.com
2. Create new project or select existing
3. Go to **Settings** → **API**
4. Copy the **Project URL** (format: `https://xxxxx.supabase.co`)

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdef123456.supabase.co
```

---

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
**Type:** JWT string  
**Required:** Yes  
**Purpose:** Anonymous public key for client-side Supabase access

**How to Get:**
1. Same location as above (Settings → API)
2. Under "Project API keys"
3. Copy the **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

**Example:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6InN1cGFiYXNlLWF1dCIsImV4cCI6MTk3Njc1MTMxOH0.FJL...
```

**Security Note:** This key is "public" but still restricted by Row-Level Security policies

---

#### SUPABASE_SERVICE_ROLE_KEY
**Type:** JWT string  
**Required:** Yes (for server-side operations)  
**Purpose:** Server-side key for administrative Supabase operations

**How to Get:**
1. Same location (Settings → API)
2. Under "Project API keys"
3. Copy the **service_role secret** key (longer than anon key)

**Example:**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImF1ZCI6InN1cGFiYXNlLWF1dCIsImV4cCI6MjEwNjQ4MDAwMH0.abcdef1234567890...
```

**Security Note:** Keep this secret! Never expose in frontend code.

---

### 2. Claude API Configuration

#### ANTHROPIC_API_KEY
**Type:** API key string  
**Required:** Yes  
**Purpose:** Authentication for Claude API calls

**How to Get:**
1. Go to https://console.anthropic.com
2. Sign in with your Anthropic account
3. Go to **API Keys** section
4. Click **Create Key**
5. Give it a name (e.g., "ONCampus Development")
6. Copy the generated key

**Example:**
```
ANTHROPIC_API_KEY=sk-ant-v0-1234567890abcdefghijklmnopqrstuvwxyz
```

**Format:** Always starts with `sk-ant-`

**Security Note:** Never commit this to version control. Use `.env.local` only.

---

### 3. Node Environment (Optional)

#### NODE_ENV
**Type:** String  
**Required:** No (defaults to development)  
**Purpose:** Sets the application environment

**Values:**
- `development` — Local development
- `production` — Production deployment
- `test` — Testing

**Example:**
```
NODE_ENV=development
```

---

## Complete .env.local Template

Create a `.env.local` file in the project root with the following template:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Claude API Configuration (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-v0-...

# Environment (OPTIONAL)
NODE_ENV=development
```

---

## Setup Checklist

### Step 1: Create Supabase Account
- [ ] Go to https://supabase.com
- [ ] Sign up or sign in
- [ ] Create new project
- [ ] Wait for project to initialize (2-3 minutes)

### Step 2: Get Supabase Keys
- [ ] Go to project Settings → API
- [ ] Copy `Project URL`
- [ ] Copy `anon public` key
- [ ] Copy `service_role secret` key

### Step 3: Create Claude API Account
- [ ] Go to https://console.anthropic.com
- [ ] Sign up or sign in
- [ ] Go to API Keys section
- [ ] Create new API key
- [ ] Copy the key

### Step 4: Create .env.local File
- [ ] Create `.env.local` in project root
- [ ] Add all 5 variables from template above
- [ ] Fill in actual values

### Step 5: Verify Setup
- [ ] Run `npm run dev`
- [ ] Check no errors in console
- [ ] Test API endpoints

---

## Verification

### Test Supabase Connection
```bash
curl -X GET \
  -H "apikey: YOUR_ANON_KEY" \
  "https://YOUR_PROJECT.supabase.co/rest/v1/student_profiles?select=*&limit=1"
```

Expected: List of profiles (empty if new project)

### Test Claude API
```bash
curl -X POST https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ANTHROPIC_KEY" \
  -d '{
    "model": "claude-opus-5",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

Expected: Claude's response in JSON format

### Test Integrated Setup
```bash
# Start dev server
npm run dev

# Test in another terminal
curl http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Expected: Personalized response from Claude

---

## Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"
**Cause:** Missing or incorrect Supabase URL  
**Fix:**
1. Check `.env.local` exists
2. Verify `NEXT_PUBLIC_SUPABASE_URL` line has correct value
3. Ensure no extra spaces or quotes
4. Restart dev server after changes

---

### Error: "Cannot read properties of undefined (reading 'from')"
**Cause:** Supabase client initialization failing  
**Fix:**
1. Verify all 3 Supabase keys are set
2. Check keys are not truncated
3. Ensure Supabase project is active
4. Check internet connection

---

### Error: "ANTHROPIC_API_KEY is not set"
**Cause:** Missing Claude API key  
**Fix:**
1. Verify `ANTHROPIC_API_KEY` in `.env.local`
2. Check key starts with `sk-ant-`
3. Ensure key hasn't expired
4. Create new key if needed

---

### Error: "401 Unauthorized" from Claude API
**Cause:** Invalid API key  
**Fix:**
1. Double-check key is correct
2. Verify no extra spaces before/after
3. Try creating new key in console
4. Check API key usage limits

---

### Error: "RLS policy violation"
**Cause:** Row-Level Security policy preventing access  
**Fix:**
1. Verify user is authenticated
2. Check user ID matches data owner
3. Verify RLS policies are set up
4. Check Supabase auth configuration

---

## Security Best Practices

### DO ✅
- [ ] Store keys in `.env.local` only
- [ ] Never commit `.env.local` to git
- [ ] Use service role key only on server
- [ ] Rotate keys periodically
- [ ] Keep .gitignore updated
- [ ] Use `.env.local` for local development

### DON'T ❌
- [ ] Expose API keys in frontend code
- [ ] Commit keys to version control
- [ ] Share keys in messages or emails
- [ ] Use production keys for testing
- [ ] Store keys in public repositories
- [ ] Print keys in logs

---

## .gitignore Configuration

Ensure these entries are in `.gitignore`:

```
# Environment variables
.env.local
.env.*.local
.env

# Dependencies
node_modules/
.pnp
.pnp.js

# Build
.next/
out/
build/
dist/

# Misc
.DS_Store
*.pem
```

---

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
ANTHROPIC_API_KEY=sk-ant-dev-key
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
ANTHROPIC_API_KEY=sk-ant-prod-key
```

### Testing
```bash
NODE_ENV=test
NEXT_PUBLIC_SUPABASE_URL=https://test-project.supabase.co
ANTHROPIC_API_KEY=sk-ant-test-key
```

---

## Deployment Configuration

### Vercel
1. Go to project Settings → Environment Variables
2. Add each variable for each environment (preview/production)
3. Redeploy after adding variables

### Docker
Pass environment variables at runtime:
```bash
docker run -e NEXT_PUBLIC_SUPABASE_URL=... \
           -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
           -e SUPABASE_SERVICE_ROLE_KEY=... \
           -e ANTHROPIC_API_KEY=... \
           your-app:latest
```

### GitHub Actions
Add secrets and use in workflow:
```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## Debugging Environment Setup

### Check Environment Variables Loaded
```javascript
// Add to pages/api/debug/env.ts (development only!)
export default function handler(req, res) {
  res.json({
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    anthropic_key: process.env.ANTHROPIC_API_KEY ? "✅ Set" : "❌ Missing",
  });
}
```

Visit http://localhost:3000/api/debug/env to check status

---

## FAQ

**Q: Can I use one Supabase project for development and production?**  
A: Not recommended. Use separate projects for isolation and safety.

**Q: What if I accidentally expose my API key?**  
A: Immediately rotate it in the service that issued it (Anthropic/Supabase console).

**Q: How often should I rotate keys?**  
A: Every 90 days for security, immediately if exposed.

**Q: Do I need all variables to start development?**  
A: Yes, all 5 are required for the platform to function.

**Q: Can I use the same keys across multiple projects?**  
A: Anon key and service role are project-specific. Each project needs its own keys.

**Q: Where do I store environment variables in production?**  
A: Use your hosting platform's secrets management (Vercel, AWS Secrets Manager, etc.).

---

## Quick Start Recap

1. **Get Supabase Keys** → https://supabase.com
2. **Get Claude API Key** → https://console.anthropic.com
3. **Create `.env.local`** with all 5 variables
4. **Run `npm install && npm run dev`**
5. **Test with curl or frontend**

That's it! All AI modules are ready to use.

---

**Version:** 1.0  
**Last Updated:** 2026-07-29  
**Status:** Production Ready
