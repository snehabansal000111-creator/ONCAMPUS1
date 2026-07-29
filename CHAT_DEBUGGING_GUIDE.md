# Chat Debugging Guide

## Error: "I couldn't reach the AI service — check your ANTHROPIC_API_KEY in .env.local"

This error occurs when the API route fails or returns an error. Follow these steps to fix it.

## Step 1: Check Your `.env.local` File

### Is `.env.local` Created?

```bash
# In project root, check if file exists
ls -la .env.local
```

If the file doesn't exist, create it:

```bash
cp .env.local.example .env.local
```

### Is It In the Right Location?

File should be at:
```
c:\Users\User\Desktop\Oc\ONCAMPUS1\.env.local
```

NOT in a subdirectory.

## Step 2: Check Your API Key

### Get Your API Key

1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Go to **API Keys**
4. Click **Create Key**
5. Copy the key (starts with `sk-ant-`)

### Add to `.env.local`

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- No quotes around the key
- No spaces
- Full key copied correctly
- Different from Supabase keys

### Verify It's Set

```bash
# Check the key is in the file
cat .env.local | grep ANTHROPIC_API_KEY
```

Should show:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Restart Dev Server

Your changes to `.env.local` require a server restart:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

**Important:** Changes to `.env.local` don't take effect until the server restarts.

## Step 4: Check Server Logs

Look at the terminal where `npm run dev` is running:

### If you see:
```
CRITICAL: ANTHROPIC_API_KEY is not set in environment variables
```

→ **Fix:** Add `ANTHROPIC_API_KEY` to `.env.local` and restart

### If you see:
```
Claude API call failed: 401 Unauthorized
```

→ **Fix:** Your API key is invalid or expired. Get a new one from console.anthropic.com

### If you see:
```
Claude API call failed: 429 Too Many Requests
```

→ **Fix:** You're hitting rate limits. Wait a moment and try again.

## Step 5: Test the API Directly

Test if the API works without the UI:

```bash
# Test the chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Success Response:
```json
{
  "reply": "Hi there! Based on your profile..."
}
```

### Error Response:
```json
{
  "error": "Invalid ANTHROPIC_API_KEY"
}
```

If you get an error response, it tells you what's wrong.

## Common Issues & Fixes

### Issue 1: "ANTHROPIC_API_KEY is not set"

**Cause:** Environment variable not found

**Fix:**
1. Open `.env.local`
2. Add: `ANTHROPIC_API_KEY=sk-ant-xxxxx`
3. Save file
4. Restart `npm run dev`
5. Wait 5 seconds for server to fully restart

### Issue 2: "401 Unauthorized"

**Cause:** API key is invalid

**Fix:**
1. Go to https://console.anthropic.com/
2. Delete the old key
3. Create a NEW key
4. Copy the full key (including `sk-ant-` prefix)
5. Update `.env.local`
6. Restart server

### Issue 3: "Invalid JSON in request body"

**Cause:** Frontend isn't sending message correctly

**Fix:** This is a frontend issue, not API key. Check browser console for errors.

### Issue 4: "Failed to get response from assistant. Please try again."

**Cause:** Generic error, usually from Supabase or unexpected exception

**Fix:**
1. Check server logs for detailed error
2. Check that Supabase is configured (if using real auth)
3. Check that `.env.local` has both `ANTHROPIC_API_KEY` and Supabase keys

## Complete `.env.local` Setup

Your `.env.local` should have:

```bash
# Claude API (Required for chat)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase (Required for profiles)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Testing Each API

**Test Claude API:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi"}'
```

Should get a response with `"reply"` field.

## Verification Checklist

- [ ] `.env.local` file exists
- [ ] `ANTHROPIC_API_KEY` is set (starts with `sk-ant-`)
- [ ] No spaces or quotes around the key
- [ ] Server restarted after updating `.env.local`
- [ ] Waited 5+ seconds for server to fully start
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Test API with curl works
- [ ] Chat interface shows response

## Still Not Working?

### Check Server Logs

When you run `npm run dev`, watch the terminal for errors:

1. Look for red/yellow errors
2. Note the exact error message
3. Search the error in this guide

### Example Server Log:

```
CRITICAL: ANTHROPIC_API_KEY is not set in environment variables
...
Claude API call failed: 401 Invalid API Key
...
Anthropic API error: Invalid ANTHROPIC_API_KEY
```

Each error tells you exactly what's wrong.

### Enable Debug Logging

Edit `.env.local` to add:

```bash
DEBUG=*
```

Then restart server for more detailed logs.

## Getting Help

If still stuck:

1. **Check the error message exactly** — Copy it verbatim
2. **Check server logs** — Look for "error" or "Error" in red
3. **Verify `.env.local`** — Use `cat .env.local` to see the contents
4. **Test API directly** — Use the curl command above
5. **Restart everything** — Stop server, restart, wait 5 seconds

## Quick Fixes (Try These First)

```bash
# 1. Make sure server is fully restarted
npm run dev
# Wait 5+ seconds, watch for "ready - started server on"

# 2. Clear browser cache
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

# 3. Hard refresh the page
# Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# 4. Test API directly
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# 5. Check .env.local exists and has key
cat .env.local
```

## Expected Behavior

### When working correctly:

1. Open assistant page
2. Type a question
3. See "..." loading indicator
4. Get personalized response in 2-3 seconds
5. Response uses your profile context

### When broken:

1. Type a question
2. See "..." loading
3. Get error message instead of response

## API Route Error Codes

| Code | Meaning | Fix |
|------|---------|-----|
| 400 | Invalid JSON or message | Check message format |
| 401 | Invalid API key | Check ANTHROPIC_API_KEY |
| 429 | Rate limited | Wait and retry |
| 500 | Server error | Check logs, restart |

---

**If none of these work, the issue is likely:**

1. **Missing or wrong API key** — Double-check at console.anthropic.com
2. **Server not restarted** — Stop and `npm run dev` again
3. **Syntax error in `.env.local`** — Check for spaces, quotes
4. **Wrong file location** — Must be project root, not subdirectory

**After fixing, always restart the server and wait for "ready" message in the terminal.**
