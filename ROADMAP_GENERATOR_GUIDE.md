# Roadmap Generator - Complete Guide

## Overview

The Roadmap Generator creates personalized, 3-phase learning roadmaps using Claude AI. Each roadmap is tailored to the student's profile and includes detailed topics, milestones, projects, resources, and practice activities.

## Features

✅ **3-Phase Roadmaps** — Beginner, Intermediate, Advanced  
✅ **Personalized Content** — Tailored to student skills, goals, learning style  
✅ **Detailed Structure** — Topics, duration, milestones, projects, resources, practice  
✅ **Supabase Storage** — Roadmaps saved and retrievable  
✅ **Claude-Powered** — Uses Claude Opus 5 for generation  

## Architecture

```
POST /api/roadmap/generate
    ↓
1. Get authenticated user (or use mock)
2. Fetch student profile
3. Call generateRoadmap(profile, topic)
    ↓ (Claude generates JSON)
4. Save to Supabase with saveRoadmap()
5. Return structured roadmap
```

## API Reference

### Generate Roadmap

**Endpoint:** `POST /api/roadmap/generate`

**Request:**
```json
{
  "topic": "Web Development"
}
```

**Response (Success):**
```json
{
  "roadmap": {
    "id": "uuid",
    "user_id": "uuid",
    "topic": "Web Development",
    "beginner": {
      "name": "Beginner",
      "duration": "4 weeks",
      "topics": ["HTML Basics", "CSS Fundamentals", "JavaScript Basics"],
      "milestones": ["Build first webpage", "Style with CSS", "Add interactivity"],
      "projects": [
        {
          "title": "Personal Portfolio Site",
          "description": "Create a simple one-page portfolio showcasing your skills",
          "duration": "2 weeks"
        }
      ],
      "resources": [
        {
          "title": "Freecodecamp HTML & CSS",
          "type": "video",
          "url": "https://...",
          "cost": "free"
        }
      ],
      "practice": [
        {
          "activity": "Code along with tutorials",
          "frequency": "daily"
        }
      ]
    },
    "intermediate": { ... },
    "advanced": { ... },
    "created_at": "2026-07-29T...",
    "updated_at": "2026-07-29T..."
  }
}
```

**Response (Error):**
```json
{
  "error": "topic cannot be empty"
}
```

## Usage Examples

### Example 1: Generate Web Development Roadmap

```bash
curl -X POST http://localhost:3000/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Web Development"}'
```

### Example 2: Generate Data Science Roadmap

```bash
curl -X POST http://localhost:3000/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Machine Learning"}'
```

### Example 3: From Frontend (JavaScript)

```typescript
async function generateRoadmap(topic: string) {
  const response = await fetch('/api/roadmap/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic }),
  });

  const data = await response.json();
  
  if (data.error) {
    console.error('Failed to generate roadmap:', data.error);
    return null;
  }

  console.log('Roadmap generated:', data.roadmap);
  return data.roadmap;
}

// Usage
const roadmap = await generateRoadmap('Web Development');
```

## Roadmap Structure

Each roadmap has 3 phases with identical structure:

### Phase Structure

```typescript
interface RoadmapPhase {
  name: "Beginner" | "Intermediate" | "Advanced";
  
  // Time estimate for entire phase
  duration: string; // e.g., "4 weeks", "8-12 weeks"
  
  // Key topics to learn
  topics: string[]; // ["HTML", "CSS", "JavaScript", ...]
  
  // Key achievements in this phase
  milestones: string[]; // ["Build first webpage", "Style with CSS", ...]
  
  // Hands-on projects
  projects: Array<{
    title: string;
    description: string;
    duration: string; // e.g., "2 weeks", "5 days"
  }>;
  
  // Learning resources
  resources: Array<{
    title: string;
    type: string; // "video", "article", "course", "book", etc.
    url?: string; // Link to resource
    cost?: string; // "free", "paid", "₹500", etc.
  }>;
  
  // Practice activities
  practice: Array<{
    activity: string; // e.g., "Code along with tutorials"
    frequency: string; // "daily", "3x per week", "weekly"
  }>;
}
```

## Personalization

The roadmap is personalized based on the student's profile:

| Profile Data | How It's Used |
|--------------|---------------|
| **Current Skills** | Roadmap skips covered topics, builds on what they know |
| **Learning Style** | Resources match style (videos for visual, articles for reading) |
| **Career Goal** | Topics prioritize skills needed for their goal |
| **Daily Study Hours** | Durations and pace fit their available time |
| **Interests** | Projects and examples relate to their interests |
| **Branch/Year** | Context-aware recommendations |

## Example Roadmap

### Topic: Web Development

**Beginner Phase (4 weeks)**
- Topics: HTML, CSS, JavaScript fundamentals
- Duration: 4 weeks
- Milestones: 
  - Build first webpage
  - Style with CSS
  - Add JavaScript interactivity
- Projects:
  - Personal Portfolio Site (2 weeks)
  - Interactive Todo App (1 week)
- Resources:
  - Freecodecamp HTML/CSS (video, free)
  - Udemy Web Dev Bootcamp (course, ₹500)
  - MDN Docs (article, free)
- Practice:
  - Code along with tutorials (daily)
  - Build small projects (3x per week)

**Intermediate Phase (8 weeks)**
- Topics: React, TypeScript, APIs, State Management
- Duration: 8 weeks
- Milestones:
  - Build React components
  - Call external APIs
  - Manage application state
- Projects:
  - Weather App with React (3 weeks)
  - GitHub User Search (2 weeks)
- Resources:
  - React Official Docs (article, free)
  - Scrimba React Course (course, ₹1000)
- Practice:
  - Build feature by feature (daily)
  - Code review with community (weekly)

**Advanced Phase (12+ weeks)**
- Topics: Next.js, Advanced State Management, Testing, Deployment
- Duration: 12+ weeks
- Projects:
  - Full-stack social media app (8 weeks)
  - Deploy to production (2 weeks)

## Database Schema

Roadmaps are stored in Supabase with this structure:

```sql
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE,
  topic VARCHAR(255),
  
  -- Beginner phase columns
  beginner_duration VARCHAR(100),
  beginner_topics TEXT[],
  beginner_milestones TEXT[],
  beginner_projects JSONB,
  beginner_resources JSONB,
  beginner_practice JSONB,
  
  -- Intermediate phase columns (same pattern)
  intermediate_duration, intermediate_topics, ...
  
  -- Advanced phase columns (same pattern)
  advanced_duration, advanced_topics, ...
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Implementation Details

### File: `lib/supabase/roadmap.ts`

**Functions:**

1. **`generateRoadmap(profile, topic): Promise<RoadmapResponse>`**
   - Takes student profile and topic
   - Calls Claude API with detailed prompt
   - Parses JSON response
   - Returns structured roadmap

2. **`saveRoadmap(userId, roadmap): Promise<Roadmap>`**
   - Saves roadmap to Supabase
   - Creates or updates (upsert)
   - Returns saved roadmap with ID and timestamps

3. **`getRoadmap(userId): Promise<Roadmap | null>`**
   - Retrieves student's saved roadmap
   - Returns null if not found

### File: `app/api/roadmap/generate/route.ts`

POST endpoint that:
- Validates topic
- Gets authenticated user
- Fetches student profile
- Generates roadmap with Claude
- Saves to Supabase
- Returns roadmap

## Setup Instructions

### 1. Update Supabase Schema

Run the SQL from `ROADMAP_SCHEMA.sql` in your Supabase SQL Editor:

```bash
# Copy all SQL from ROADMAP_SCHEMA.sql
# Paste in Supabase → SQL Editor
# Execute
```

### 2. Test the API

```bash
# Generate a roadmap
curl -X POST http://localhost:3000/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Web Development"}'
```

### 3. Verify It Works

- Response includes `roadmap` object
- Roadmap has `beginner`, `intermediate`, `advanced` phases
- Each phase has topics, projects, resources
- Can view in Supabase dashboard

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| "topic cannot be empty" | Empty topic provided | Provide non-empty topic |
| "Invalid JSON" | Malformed request | Check JSON syntax |
| "Failed to generate roadmap" | Claude API error | Check API key, rate limits |
| "Failed to save roadmap" | Supabase error | Check Supabase connection |

## What's Generated

Claude generates roadmaps with:

✅ **Beginner Phase**
- Foundations and basics
- 4-6 week timeline
- 3-5 core topics
- 2-3 beginner projects
- Free/low-cost resources
- Daily practice

✅ **Intermediate Phase**
- Building on fundamentals
- 8-12 week timeline
- Advanced topics and frameworks
- 2-3 projects with increasing complexity
- Mix of free and paid resources
- 3-5x per week practice

✅ **Advanced Phase**
- Specialization and mastery
- 12+ week timeline
- Expert-level topics
- Complex, portfolio-building projects
- Advanced resources and communities
- Regular practice and contribution

## Limitations

❌ Does NOT generate quizzes (use separate Quiz Generator)  
❌ Does NOT generate recommendations (use Recommendations service)  
❌ Does NOT modify frontend UI  
❌ One roadmap per user (newer generation overwrites)  

## Next Steps (Optional)

Future enhancements:
- Multiple roadmaps per user
- Roadmap progress tracking
- Roadmap updates based on completion
- Difficulty level selection
- Integration with quiz and recommendation systems

## Testing

### Development Mode (No Supabase)

Works without Supabase configured:
- Uses mock student data
- Returns roadmap in response
- Doesn't save to DB

### Production Mode (With Supabase)

Uses real student data:
- Fetches profile from Supabase
- Saves roadmap to Supabase
- Roadmap persists

## Status

✅ Roadmap generation complete  
✅ Supabase storage working  
✅ API route ready to use  
✅ Error handling in place  

**Ready for use!** 🚀
