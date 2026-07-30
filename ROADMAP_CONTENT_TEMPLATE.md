# Roadmap Content Template

Use this template to create new detailed roadmap items.

## Template

```typescript
"r{N}-{role}": {
  id: "r{N}",
  title: "Clear, Action-Oriented Title",
  category: "Tools|Core|Libraries|Project|Interview Prep|Community|Research|Leadership|Analytics|Design|Technical",
  status: "upcoming",
  
  // 1. DESCRIPTION (2-3 sentences)
  description:
    "Concise overview of what students will learn. What is this topic and why is it a distinct skill?",
  
  // 2. WHY IT MATTERS (Business/career relevance)
  whyItMatters:
    "Why should students care? What career opportunities, job market demand, or business impact? Avoid being generic.",
  
  // 3. CONCEPTS TO LEARN (6-8 core topics)
  conceptsToLearn: [
    "Specific concept 1: with details",
    "Specific concept 2: with details",
    "Specific concept 3: with details",
    "Specific concept 4: with details",
    "Specific concept 5: with details",
    "Specific concept 6: with details",
  ],
  
  // 4. LEARNING OBJECTIVES (5-6 things they can DO)
  learningObjectives: [
    "Build/create/write/implement specific thing X",
    "Understand and explain concept Y",
    "Debug and fix issues with Z",
    "Design systems that handle scenario A",
    "Choose appropriate technology for use case B",
    "Communicate and defend decisions",
  ],
  
  // 5. ESTIMATED DURATION
  // Must be realistic for estimated difficulty
  // Easy: 1-2 weeks
  // Intermediate: 2-4 weeks
  // Advanced: 4-8 weeks
  estimatedDuration: "2-3 weeks",
  
  // 6. DIFFICULTY
  // beginner: No prerequisites, foundational
  // intermediate: Builds on basics
  // advanced: Complex, challenging
  difficulty: "beginner" | "intermediate" | "advanced",
  
  // 7. PREREQUISITES (Only ESSENTIAL ones)
  // If no prerequisites, use empty array
  prerequisites: [
    "Topic A",
    "Topic B",
  ],
  
  // 8. MINI PROJECT
  // Focused on THIS topic only
  // Takes 3-7 days
  // Produces portfolio artifact
  miniProject: {
    title: "Descriptive Project Name",
    description: "2-3 sentences about what students build and why",
    steps: [
      "Specific, achievable step 1",
      "Specific, achievable step 2",
      "Specific, achievable step 3",
      "Specific, achievable step 4",
      "Specific, achievable step 5",
      "Specific, achievable step 6",
    ],
  },
  
  // 9. PRACTICE TASKS
  // 4-5 tasks, progressing easy → medium → hard
  practiceTasks: [
    { task: "Specific, measurable easy task", difficulty: "easy" },
    { task: "Specific, measurable medium task", difficulty: "medium" },
    { task: "Specific, measurable hard task", difficulty: "hard" },
    { task: "Specific, measurable hard task 2", difficulty: "hard" },
  ],
  
  // 10. FREE LEARNING RESOURCES
  // 4-5 high-quality resources
  // Types: documentation, video, tutorial, article, interactive, book
  freeResources: [
    {
      title: "Resource 1 Name",
      type: "documentation", // or "video", "tutorial", "article", "interactive", "book"
      url: "https://example.com",
      description: "What this resource teaches and how it helps",
    },
    {
      title: "Resource 2 Name",
      type: "video",
      url: "https://example.com",
      description: "Focus area and how it helps students",
    },
    {
      title: "Resource 3 Name",
      type: "interactive",
      url: "https://example.com",
      description: "Practice opportunities and what concepts it covers",
    },
    {
      title: "Resource 4 Name",
      type: "article",
      url: "https://example.com",
      description: "Deep dive into specific advanced concepts",
    },
  ],
  
  // 11. COMPLETION CHECKLIST
  // 6-8 specific, verifiable checkpoints
  // Not generic ("learned the topic"), but specific outcomes
  completionChecklist: [
    "✓ Specific achievement 1 (e.g., Built X from scratch)",
    "✓ Specific achievement 2 (e.g., Can debug Y)",
    "✓ Specific achievement 3 (e.g., Understand how Z works)",
    "✓ Specific achievement 4 (e.g., Completed the project)",
    "✓ Specific achievement 5 (e.g., Know best practices)",
    "✓ Specific achievement 6 (e.g., Comfortable with common patterns)",
  ],
}
```

## Quality Checklist

Before adding content, verify:

- [ ] **Title** is action-oriented, specific, not generic
- [ ] **Description** clearly states what is taught (2-3 sentences max)
- [ ] **Why It Matters** focuses on career/business value (not generic)
- [ ] **Concepts** are specific, not vague (6-8 items)
- [ ] **Learning Objectives** are measurable actions (can verify completion)
- [ ] **Duration** is realistic for complexity
- [ ] **Difficulty** matches content depth (beginner→intermediate→advanced)
- [ ] **Prerequisites** are truly essential (not "nice to have")
- [ ] **Project** is:
  - [ ] Focused on THIS topic (not fullstack)
  - [ ] Completable in 3-7 days
  - [ ] Produces portfolio artifact
  - [ ] Has 5-6 clear steps
- [ ] **Tasks** progress from easy → medium → hard
- [ ] **Resources** are:
  - [ ] Free (no paywalls)
  - [ ] High quality (not outdated)
  - [ ] Curated (not overwhelming list)
  - [ ] Diverse (docs + videos + interactive + articles)
- [ ] **Checklist** items are:
  - [ ] Specific, not generic
  - [ ] Verifiable (student can check themselves)
  - [ ] Aligned with learning objectives

## Examples

### ✅ Good Concept (Specific)
```
"Implement recursive functions for tree traversal"
"Understand JavaScript async/await and Promise chains"
"Use PostgreSQL window functions for analytics"
```

### ❌ Bad Concept (Vague)
```
"Learn recursion"
"JavaScript basics"
"Database fundamentals"
```

---

### ✅ Good Learning Objective
```
"Write and test asynchronous code using async/await patterns"
"Debug closure and scope issues in JavaScript"
"Design database schemas with proper normalization"
```

### ❌ Bad Learning Objective
```
"Understand JavaScript"
"Learn about databases"
"Know asynchronous programming"
```

---

### ✅ Good Mini Project
```
"Build a Todo App with user authentication"
- Allows users to sign up and log in
- Users can create, edit, delete todos
- Todos persist across page refreshes
- User can only see their own todos
- Deployed to production
```

### ❌ Bad Mini Project
```
"Build something to practice this skill"
"Make a project that uses this topic"
```

---

### ✅ Good Resource
```
{
  title: "The Complete Docker Course",
  type: "video",
  url: "https://www.youtube.com/...",
  description: "3-hour tutorial covering Docker fundamentals, containerization, images, and Kubernetes deployment"
}
```

### ❌ Bad Resource
```
{
  title: "Docker stuff",
  type: "video",
  url: "https://www.youtube.com/...",
  description: "Learn Docker"
}
```

---

### ✅ Good Checklist Items
```
"✓ Built a complete REST API with 5+ endpoints"
"✓ Implemented JWT authentication and verified tokens work"
"✓ Wrote tests achieving 80%+ code coverage"
"✓ Deployed to production and it's accessible online"
"✓ Can debug API requests using Postman"
```

### ❌ Bad Checklist Items
```
"✓ Learned Express"
"✓ Understood REST APIs"
"✓ Know about authentication"
```

## Adding to Roadmap Content

**File location:** `lib/roadmap-content.ts`

**Steps:**
1. Create new object with key `"r{N}-{role}"`
2. Follow template above
3. Verify quality checklist items
4. Update `goalToRole` mapping if new role
5. Run `npm run build` to ensure no type errors
6. Verify in preview that content displays correctly

**Build command:**
```bash
npm run build
```

Should see: `✓ Compiled successfully`

## Coverage Goals

| Goal | Status | Coverage |
|------|--------|----------|
| Software Engineer | ✅ Complete | 10/10 items with detailed content |
| Data Scientist | 🚧 In Progress | 4/10 items with detailed content |
| Product Manager | ⏳ Pending | 0/10 items (fallback enrichment) |
| Designer | ⏳ Pending | 0/10 items (fallback enrichment) |
| Not Sure Yet | ⏳ Pending | 0/8 items (fallback enrichment) |

## Priority: What to Add Next

1. **Data Scientist (r5-r10):** Statistics, ML, Deep Learning, Projects
2. **Product Manager (r1-r10):** Full content for PM roadmap
3. **Designer (r1-r10):** Full content for design roadmap
4. **Not Sure Yet (r1-r8):** Content for exploratory path
