# Roadmap Backend Implementation

## Overview

The Roadmap Backend stores personalized learning roadmaps in Firebase Firestore with progress tracking. No mock data, no localStorage, no hardcoded values.

## Firestore Structure

### Collection 1: `/roadmaps/{userId}`

Stores the user's personalized roadmap.

```json
{
  "userId": "USER_UID",
  "goal": "Software Engineer",
  "branch": "Computer Science",
  "items": [
    {
      "id": "r1",
      "title": "Master Git & GitHub",
      "category": "Tools",
      "status": "upcoming"
    },
    {
      "id": "r2",
      "title": "JavaScript/TypeScript Fundamentals",
      "category": "Core",
      "status": "upcoming"
    }
  ],
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

**Fields:**
- `userId` (string): User's Firebase UID
- `goal` (string): User's career goal from onboarding
- `branch` (string): User's branch from onboarding
- `items` (array): Array of RoadmapItem objects
- `createdAt` (Timestamp): When roadmap was created
- `updatedAt` (Timestamp): Last update time

### Collection 2: `/roadmapProgress/{userId}/items/{itemId}`

Tracks progress on individual roadmap items.

```json
{
  "userId": "USER_UID",
  "itemId": "r1",
  "itemTitle": "Master Git & GitHub",
  "status": "in-progress",
  "completedAt": "Timestamp|null",
  "startedAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

**Fields:**
- `userId` (string): User's Firebase UID
- `itemId` (string): Roadmap item ID
- `itemTitle` (string): Item title (for quick reference)
- `status` (string): "done" | "in-progress" | "upcoming"
- `completedAt` (Timestamp | null): When item was completed
- `startedAt` (Timestamp): When user started item
- `updatedAt` (Timestamp): Last status change

## API Endpoints

### 1. GET `/api/roadmap?userId={userId}`

**Fetch user's roadmap from Firestore**

```bash
GET /api/roadmap?userId=xyz123
```

**Response:**
```json
{
  "roadmap": [
    {
      "id": "r1",
      "title": "Master Git & GitHub",
      "category": "Tools",
      "status": "upcoming"
    }
  ]
}
```

**Error (404):**
```json
{
  "error": "Roadmap not found for user"
}
```

### 2. POST `/api/roadmap`

**Generate personalized roadmap and save to Firestore**

The roadmap is generated based on user's profile:
- Goal (Software Engineer, Data Scientist, Product Manager, Designer)
- Branch (Computer Science, Electronics, etc.)
- Skills (extracted from profile)

```bash
POST /api/roadmap
Content-Type: application/json

{
  "userId": "xyz123"
}
```

**Response:**
```json
{
  "message": "Roadmap generated and saved",
  "roadmap": [
    {
      "id": "r1",
      "title": "Master Git & GitHub",
      "category": "Tools",
      "status": "upcoming"
    }
  ]
}
```

**Process:**
1. Fetch user's profile from `/profiles/{userId}`
2. Extract goal, branch, skills
3. Generate roadmap based on goal template
4. Save to `/roadmaps/{userId}`
5. Initialize progress for each item in `/roadmapProgress/{userId}/items/`

### 3. PUT `/api/roadmap/{itemId}?userId={userId}&status={status}`

**Update roadmap item status**

```bash
PUT /api/roadmap/r1?userId=xyz123&status=in-progress
```

**Status values:** "done" | "in-progress" | "upcoming"

**Response:**
```json
{
  "message": "Roadmap item updated",
  "itemId": "r1",
  "status": "in-progress"
}
```

**Updates:**
1. Updates item in `/roadmaps/{userId}/items/`
2. Updates progress in `/roadmapProgress/{userId}/items/{itemId}`
3. Sets `completedAt` timestamp if status is "done"
4. Sets `startedAt` timestamp if status changes to "in-progress"

### 4. GET `/api/roadmap/progress?userId={userId}`

**Get all progress items for user**

```bash
GET /api/roadmap/progress?userId=xyz123
```

**Response:**
```json
{
  "progress": [
    {
      "userId": "xyz123",
      "itemId": "r1",
      "itemTitle": "Master Git & GitHub",
      "status": "upcoming",
      "completedAt": null,
      "startedAt": "2026-07-29T...",
      "updatedAt": "2026-07-29T..."
    }
  ],
  "count": 10
}
```

### 5. GET `/api/roadmap/{itemId}/progress?userId={userId}`

**Get progress for specific item**

```bash
GET /api/roadmap/r1/progress?userId=xyz123
```

**Response:**
```json
{
  "progress": {
    "userId": "xyz123",
    "itemId": "r1",
    "itemTitle": "Master Git & GitHub",
    "status": "upcoming",
    "completedAt": null,
    "startedAt": "2026-07-29T...",
    "updatedAt": "2026-07-29T..."
  }
}
```

## Service Functions

### `lib/roadmap-service.ts`

**generatePersonalizedRoadmap(userId, userProfile)**
- Takes user goal, branch, skills
- Returns appropriate roadmap template (10+ items)
- 5 different goal templates: Software Engineer, Data Scientist, Product Manager, Designer, Not sure yet
- All items start with status "upcoming"

**saveRoadmap(userId, items, userProfile)**
- Saves roadmap to `/roadmaps/{userId}`
- Initializes progress tracking for each item
- Sets createdAt and updatedAt timestamps

**getUserRoadmap(userId)**
- Fetches roadmap from Firestore
- Returns null if not found
- Returns array of RoadmapItem objects

**updateItemStatus(userId, itemId, status)**
- Updates item status in roadmap
- Updates corresponding progress tracking
- Sets completion timestamps

**getUserProgress(userId)**
- Fetches all progress items for user
- Returns array of progress objects

## Client-side Integration

### `lib/roadmap-client.ts`

API client for frontend consumption:

```typescript
// Fetch roadmap
const roadmap = await roadmapAPI.getRoadmap(userId);

// Generate roadmap (first time setup)
const newRoadmap = await roadmapAPI.generateRoadmap(userId);

// Update item status
await roadmapAPI.updateItemStatus(userId, itemId, "done");

// Get progress
const progress = await roadmapAPI.getProgress(userId);
```

### `hooks/useRoadmap.ts`

React hook for components:

```typescript
const { roadmap, loading, error, updateItemStatus, generateRoadmap } = useRoadmap(userId);

// Update item
await updateItemStatus("r1", "in-progress");

// Generate new roadmap
await generateRoadmap();
```

## Data Flow

### First Time User (Onboarding)

1. User completes onboarding → Profile saved to `/profiles/{userId}`
2. Frontend calls `POST /api/roadmap` with userId
3. Backend fetches user profile
4. Generates personalized roadmap based on goal
5. Saves to `/roadmaps/{userId}`
6. Initializes progress tracking
7. Returns roadmap to frontend

### Returning User (After Login)

1. Frontend calls `GET /api/roadmap?userId={userId}`
2. Backend fetches from Firestore
3. Frontend displays with saved progress
4. User can update status with `PUT /api/roadmap/{itemId}`
5. Progress is persisted to Firestore

## No Mock Data

- ✅ Roadmap templates are in code (not mock data)
- ✅ User's actual roadmap stored in Firestore
- ✅ Progress stored in Firestore
- ✅ No localStorage usage
- ✅ Restores after login via Firestore

## Security Rules (Future)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /roadmaps/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /roadmapProgress/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Usage in UI Components

The frontend can use `useRoadmap(userId)` hook to:
1. Fetch roadmap on mount
2. Update item status
3. Handle loading/error states
4. Generate new roadmap if needed

**Example:**
```typescript
const { roadmap, loading, updateItemStatus } = useRoadmap(user?.uid);

const handleMarkDone = async (itemId) => {
  await updateItemStatus(itemId, "done");
};
```

UI components stay the same - they just use the hook instead of mock data.
