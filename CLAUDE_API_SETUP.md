# Claude API Integration

## Overview

The Anthropic Claude API is fully integrated into the ONCampus backend. The API key is stored securely server-side and never exposed to the frontend.

## Architecture

### Server-Side Components

**`lib/claude.ts`**
- Initializes Anthropic client with environment-validated API key
- Validates API key at module load time (crashes if missing)
- `askAssistant()` function with proper error handling
- Custom `AnthropicError` class for specific error mapping
- Uses `claude-opus-5` model
- Max tokens: 1024

**`app/api/chat/route.ts`**
- POST endpoint at `/api/chat`
- Request validation: ensures `message` field is present and non-empty
- Response types properly defined (TypeScript)
- Detailed error responses with appropriate HTTP status codes
- Error categorization:
  - 400: Invalid request
  - 401: Invalid API key
  - 429: Rate limited
  - 500: Server error

### Frontend (No Changes)

**`app/dashboard/assistant/page.tsx`**
- Already calls `/api/chat` with `{ message: string }`
- Handles responses with fallback error message
- Loading states and error handling in place

## Setup Instructions

### 1. Set Environment Variable

Create `.env.local` with:

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get your API key from: https://console.anthropic.com/

### 2. Run Development Server

```bash
npm run dev
```

### 3. Test API Integration

Navigate to: http://localhost:3000/dashboard/assistant

Send a message - you should receive a response from Claude API.

## Error Handling

| Scenario | Response | Status |
|----------|----------|--------|
| Missing API key | Server crash at startup | N/A |
| Invalid JSON body | `{ error: "Invalid JSON in request body" }` | 400 |
| Empty message | `{ error: "message cannot be empty" }` | 400 |
| Invalid API key | `{ error: "Invalid ANTHROPIC_API_KEY" }` | 401 |
| Rate limited | `{ error: "Rate limited by Claude API" }` | 429 |
| API error | `{ error: "<specific error>" }` | 500 |
| Unexpected error | `{ error: "Failed to get response..." }` | 500 |

## API Key Security

✅ **Server-side only**: API key is in `lib/claude.ts`, which is only imported on the server
✅ **Environment validation**: Checked at module load time
✅ **Never in frontend**: No API key or sensitive info sent to browser
✅ **Error logging**: API errors logged server-side only

## Type Safety

- TypeScript strict mode enabled
- Request/response types defined
- Custom error class for better error handling
- All functions have explicit return types

## Current State

- API integration: **Complete**
- Error handling: **Complete**
- TypeScript types: **Complete**
- Security: **Complete**
- Environment setup: **Ready**

## Next Steps (Not Implemented)

- Real Supabase integration (user profiles, persistence)
- AI feature implementation (roadmap generation, quizzes, etc.)
- Real user authentication
