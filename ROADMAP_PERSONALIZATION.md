# Roadmap Personalization Algorithm

## Overview

Every student receives a **unique, personalized roadmap** based on their onboarding answers. No hardcoded data, no one-size-fits-all templates.

## Personalization Factors

The algorithm uses 8 factors from the user's profile:

| Factor | Source | Impact |
|--------|--------|--------|
| **Career Goal** | Onboarding step 4 | Determines base roadmap (10-12 core items) |
| **Branch/Major** | Onboarding step 1 | Customizes tech stack for their discipline |
| **Skills** | Onboarding step 2 | Skips fundamentals they already know |
| **Interests** | Onboarding step 3 | Injects project ideas matching interests |
| **Learning Style** | Onboarding step 5 | Reorders items (visual/reading/hands-on/mixed) |
| **Daily Study Hours** | Onboarding step 6 | Adjusts roadmap density/pacing |
| **Monthly Budget** | Onboarding step 6 | Future: suggest free vs paid resources |
| **Semester/Year** | Profile (optional) | Future: adjust by academic level |

---

## Algorithm Steps

### Step 1: Get Base Roadmap (Career Goal)

Different goal = Different roadmap:

```
"Software Engineer"     → 10 items (DSA, System Design, Full-Stack)
"Data Scientist"        → 10 items (ML, Statistics, Python)
"Product Manager"       → 10 items (Strategy, Analytics, Leadership)
"Designer"              → 10 items (UI/UX, Design Systems, Figma)
"Not sure yet"          → 8 items (Exploratory across domains)
```

### Step 2: Personalize by Branch

**Computer Science** → Python/JavaScript focused  
**Electronics** → C/Embedded Systems focused  
**Mechanical** → CAD + Python  
**Civil** → AutoCAD + Python  
**Other** → Versatile approach

**Example transformation:**
```
Before: "JavaScript Fundamentals"
After:  "JavaScript Fundamentals for Computer Science"
```

### Step 3: Personalize by Interests

Injects project ideas based on selected interests:

```javascript
"Web Dev"     → "Build a Responsive Web App"
"AI/ML"       → "Build an ML-powered Application"
"Robotics"    → "Robotics Project with Python"
"Finance"     → "Build a Stock Analysis Tool"
"Design"      → "Design a Complete App UI"
"Content"     → "Build a Content Management System"
"Gaming"      → "Build a Simple Game"
"Product"     → "Design & Build a Product"
```

**Example transformation:**
```
Before: "Build 3 Full-Stack Projects"
After:  "Build 3 Full-Stack Projects: Build a Web App in Web Dev area"
```

### Step 4: Personalize by Learning Style

Reorders items based on preferred learning mode:

**Visual Learners** → Keep as-is (balanced approach)  
**Reading/Articles** → Keep as-is (documentations emphasized)  
**Hands-on/Projects** → Move projects earlier in roadmap  
**Mixed** → Keep balanced approach

**Example transformation:**
```
ORIGINAL:
1. Git Fundamentals
2. JavaScript Fundamentals
3. React Fundamentals
4. Backend (Node.js)
5. Databases
6. DSA
7. System Design
8. Full-Stack Projects     ← Moved up for hands-on learners
9. Open Source
10. Interview Prep

AFTER HANDS-ON REORDER:
1. Git Fundamentals
2. JavaScript Fundamentals
3. React Fundamentals
4. Full-Stack Projects     ← Now position 4
5. Backend (Node.js)
6. Databases
7. DSA
8. System Design
9. Open Source
10. Interview Prep
```

### Step 5: Personalize by Skill Level

**If they already know JavaScript:**
```
Before: "JavaScript/TypeScript Fundamentals"
After:  "Advanced JavaScript & ES6+"
```

**If they already know Python:**
```
Before: "Python Fundamentals & OOP"
After:  "Advanced Python & Design Patterns"
```

### Step 6: Adjust by Daily Study Hours

**Less than 2 hours/day:**
- Reduce roadmap to ~7 items (70% of full)
- Focus on core competencies only
- Skip advanced specialization

**2-4 hours/day:**
- Keep full 10 items
- Balanced pace

**More than 4 hours/day:**
- Add "Advanced Topics & Specialization"
- More in-depth learning
- Add stretch goals

**Example:**
```
ORIGINAL: 10 items (fit 2-4 hours/day)

1 hour/day:  6-7 items (reduced)
2-4 h/day:   10 items (full)
5+ h/day:    10 items + Advanced specialization
```

---

## Example Personalization Output

### Student A: Riya
- Goal: Software Engineer
- Branch: Computer Science
- Skills: [Python, JavaScript]
- Interests: [Web Dev, AI/ML]
- Learning Style: Hands-on
- Daily Hours: 3

**Roadmap:**
```
1. Master Git & GitHub version control (Tools)
2. Advanced JavaScript & ES6+ (Core) ← Already knows JS
3. React or Vue.js Fundamentals (Core)
4. Build 3 Full-Stack Projects: Web App in Web Dev (Project) ← Hands-on earlier, interest injected
5. Backend: Node.js/Express (Core)
6. Database Design: SQL & MongoDB (Core)
7. Data Structures & Algorithms (Interview Prep)
8. System Design & Scalability (Interview Prep)
9. Contribute to Open Source (Community)
10. LeetCode & Interview Preparation (Interview Prep)
```

### Student B: Arjun
- Goal: Data Scientist
- Branch: Electronics
- Skills: [Excel]
- Interests: [Finance, AI/ML]
- Learning Style: Visual
- Daily Hours: 5+

**Roadmap:**
```
1. Python Fundamentals & OOP (Core)
2. SQL & Database Querying (Core)
3. NumPy & Pandas for Data Manipulation (Libraries)
4. Data Visualization: Matplotlib & Seaborn (Libraries)
5. Statistics & Probability Fundamentals (Math)
6. Supervised Learning: Regression & Classification (ML)
7. Unsupervised Learning: Clustering & Dimensionality Reduction (ML)
8. Deep Learning & Neural Networks (ML)
9. Build 3 End-to-End ML Projects: Stock Analysis Tool (Project) ← Interest injected
10. Data Science Interview Preparation (Interview Prep)
11. Advanced Topics & Specialization (Advanced) ← Extra due to 5+ hours/day
```

### Student C: Sneha
- Goal: Product Manager
- Branch: Computer Science
- Skills: [Python, JavaScript, Excel]
- Interests: [Product, Design]
- Learning Style: Reading
- Daily Hours: 1.5

**Roadmap:**
```
1. Product Management Fundamentals (Core)
2. User Research & User Interviews (Research)
3. Product Strategy & Vision (Core)
4. Metrics, Analytics & KPIs (Analytics)
5. SQL & Data Analysis for PMs (Technical)
6. Build a Product Case Study: Launch a Small Product (Project) ← Interest, reduced items due to 1.5h
7. Cross-functional Leadership (Leadership)
← Limited to 7 items due to <2 hours/day
```

---

## Firestore Data Structure

```json
{
  "roadmaps": {
    "{userId}": {
      "userId": "xyz",
      "goal": "Software Engineer",
      "branch": "Computer Science",
      "items": [
        {
          "id": "r1",
          "title": "Master Git & GitHub version control",
          "category": "Tools",
          "status": "upcoming"
        }
      ],
      "createdAt": Timestamp,
      "updatedAt": Timestamp,
      "personalizationFactors": {
        "skills": ["Python", "JavaScript"],
        "interests": ["Web Dev", "AI/ML"],
        "learningStyle": "hands-on",
        "dailyStudyHours": 3
      }
    }
  }
}
```

---

## API Integration

### Generate Personalized Roadmap

```bash
POST /api/roadmap
{
  "userId": "xyz123"
}
```

**Process:**
1. Fetch user profile from `/profiles/{userId}`
2. Extract all 8 personalization factors
3. Run through personalization algorithm
4. Save generated roadmap to `/roadmaps/{userId}`
5. Return personalized items

**Response:**
```json
{
  "message": "Roadmap generated and saved",
  "roadmap": [
    {
      "id": "r1",
      "title": "Master Git & GitHub version control",
      "category": "Tools",
      "status": "upcoming"
    }
  ]
}
```

---

## Key Properties

✅ **Every student gets a different roadmap**
- Different goal → different base items
- Different skills → different emphasis
- Different interests → different projects
- Different learning style → different order
- Different pace → different density

✅ **No hardcoded data**
- Base templates in code (generated content)
- Personal data from Firestore (profile)
- Algorithm logic in service (personalization)

✅ **Fully persistent**
- Saved to Firestore `/roadmaps/{userId}`
- Progress tracked in `/roadmapProgress/{userId}/items/`
- Restored after login via Firestore
- No localStorage dependency

✅ **Extensible**
- Add semester/year personaliza tion
- Add budget-based resource filtering
- Add weak-subject prioritization
- Add prerequisite management

---

## Code Locations

- **Personalization Algorithm:** `lib/roadmap-service.ts` - `generatePersonalizedRoadmap()`
- **API Endpoint:** `app/api/roadmap/route.ts` - `POST /api/roadmap`
- **Service Functions:** `lib/roadmap-service.ts`
- **Client Hook:** `hooks/useRoadmap.ts` - `useRoadmap(userId)`
- **API Client:** `lib/roadmap-client.ts` - `roadmapAPI.generateRoadmap()`

---

## Testing Personalization

Create test users with different profiles:

```typescript
// Test Case 1: Engineer with hands-on style
User1: goal="SWE", learningStyle="hands-on", interests=["Web Dev"], hours=4
Expected: Projects moved up, Web Dev emphasized

// Test Case 2: Data Scientist with limited time
User2: goal="Data Scientist", hours=1.5
Expected: Only 6-7 core items, no advanced specialization

// Test Case 3: PM with finance interest
User3: goal="Product Manager", interests=["Finance"]
Expected: Finance-relevant projects injected
```

Each generates a completely different roadmap from Firestore.
