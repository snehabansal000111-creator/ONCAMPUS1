import type { RoadmapItem } from "@/types";

export const RoadmapContent: Record<string, RoadmapItem> = {
  // Software Engineer Roadmap
  "r1-swe": {
    id: "r1",
    title: "Master Git & GitHub version control",
    category: "Tools",
    status: "upcoming",
    description:
      "Learn the fundamental version control system used by every professional developer. Master branching, merging, commits, and collaboration workflows.",
    whyItMatters:
      "Every company uses Git for code management. Understanding version control is essential for working in teams, tracking changes, and managing project history.",
    conceptsToLearn: [
      "Git basics: init, add, commit, push, pull",
      "Branching and merging strategies",
      "Pull requests and code review",
      "Resolving merge conflicts",
      "GitHub workflows and collaboration",
      ".gitignore and Git best practices",
    ],
    learningObjectives: [
      "Create and manage local and remote repositories",
      "Work with branches for feature development",
      "Collaborate with team members through pull requests",
      "Resolve merge conflicts confidently",
      "Write meaningful commit messages",
    ],
    estimatedDuration: "1-2 weeks",
    difficulty: "beginner",
    prerequisites: [],
    miniProject: {
      title: "Collaborative GitHub Project",
      description: "Create a repository with multiple branches, practice merging, and simulate team collaboration",
      steps: [
        "Initialize a Git repository and push to GitHub",
        "Create feature branches for different tasks",
        "Make commits with descriptive messages",
        "Create pull requests with detailed descriptions",
        "Review and merge pull requests",
        "Resolve a merge conflict between branches",
      ],
    },
    practiceTasks: [
      { task: "Create and switch between 5 different branches", difficulty: "easy" },
      { task: "Merge branches with and without conflicts", difficulty: "medium" },
      { task: "Rebase branches instead of merge", difficulty: "hard" },
      { task: "Use cherry-pick to move specific commits", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "Git & GitHub Crash Course",
        type: "video",
        url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
        description: "Complete introduction to Git and GitHub by Traversy Media",
      },
      {
        title: "Pro Git Book",
        type: "book",
        url: "https://git-scm.com/book/en/v2",
        description: "Comprehensive and free official Git documentation",
      },
      {
        title: "GitHub Learning Lab",
        type: "interactive",
        url: "https://github.com/skills",
        description: "Interactive GitHub learning modules",
      },
      {
        title: "Atlassian Git Tutorials",
        type: "tutorial",
        url: "https://www.atlassian.com/git/tutorials",
        description: "In-depth Git tutorials covering all aspects",
      },
    ],
    completionChecklist: [
      "✓ Set up Git locally and created first repository",
      "✓ Pushed code to GitHub successfully",
      "✓ Created and merged at least 3 feature branches",
      "✓ Resolved a merge conflict",
      "✓ Created a pull request and reviewed code",
      "✓ Understood and practiced Git workflow",
    ],
  },

  "r2-swe": {
    id: "r2",
    title: "JavaScript/TypeScript Fundamentals",
    category: "Core",
    status: "upcoming",
    description:
      "Master the core language features of JavaScript and learn TypeScript for type-safe development. This is the foundation for modern web development.",
    whyItMatters:
      "JavaScript powers the web. 95% of websites use JavaScript. TypeScript adds type safety and catches errors early. Together, they're essential for professional web development.",
    conceptsToLearn: [
      "Variables, data types, and operators",
      "Functions, closures, and scope",
      "Objects, arrays, and prototypes",
      "Async/await, Promises, and callbacks",
      "ES6+ features (arrow functions, destructuring, spread operator)",
      "TypeScript types, interfaces, and generics",
      "Error handling and debugging",
    ],
    learningObjectives: [
      "Write clean, readable JavaScript code",
      "Understand and use async programming",
      "Use TypeScript for type safety",
      "Debug JavaScript effectively",
      "Master modern ES6+ syntax",
    ],
    estimatedDuration: "3-4 weeks",
    difficulty: "beginner",
    prerequisites: [],
    miniProject: {
      title: "Todo App with TypeScript",
      description: "Build a todo application with TypeScript that manages tasks in memory",
      steps: [
        "Create interfaces for Todo and TodoApp",
        "Implement add, delete, and update functions",
        "Add filtering by status (completed/pending)",
        "Use async operations for simulated API calls",
        "Add error handling for invalid inputs",
        "Write unit tests for your functions",
      ],
    },
    practiceTasks: [
      { task: "Create 10 functions demonstrating different JS concepts", difficulty: "easy" },
      { task: "Refactor callback-based code to use async/await", difficulty: "medium" },
      { task: "Write generic TypeScript types for common patterns", difficulty: "hard" },
      { task: "Debug complex closure and scope issues", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "JavaScript Basics",
        type: "video",
        url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        description: "Complete JavaScript fundamentals course",
      },
      {
        title: "TypeScript Handbook",
        type: "documentation",
        url: "https://www.typescriptlang.org/docs/",
        description: "Official TypeScript documentation",
      },
      {
        title: "MDN JavaScript Guide",
        type: "documentation",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        description: "Comprehensive JavaScript reference by Mozilla",
      },
      {
        title: "Scrimba JavaScript Course",
        type: "interactive",
        url: "https://scrimba.com/learn/learnjavascript",
        description: "Interactive JavaScript learning platform",
      },
    ],
    completionChecklist: [
      "✓ Completed 20+ coding exercises covering all topics",
      "✓ Understand closures, scope, and this binding",
      "✓ Can write async code with Promises and async/await",
      "✓ Created TypeScript interfaces and types",
      "✓ Built and tested the Todo app",
      "✓ Can debug JavaScript code using browser DevTools",
    ],
  },

  "r3-swe": {
    id: "r3",
    title: "React Fundamentals",
    category: "Core",
    status: "upcoming",
    description:
      "Learn React, the most popular JavaScript library for building user interfaces. Master components, hooks, and state management.",
    whyItMatters:
      "React is used by 40%+ of professional developers. It powers Facebook, Netflix, Airbnb, and thousands of other companies. Essential skill for frontend development.",
    conceptsToLearn: [
      "JSX and component structure",
      "Props and state",
      "React hooks (useState, useEffect, useContext)",
      "Event handling and forms",
      "Conditional rendering and lists",
      "Component lifecycle",
      "Performance optimization (React.memo, useMemo)",
    ],
    learningObjectives: [
      "Build reusable React components",
      "Manage component state with hooks",
      "Handle user interactions and forms",
      "Fetch data and manage side effects",
      "Optimize component performance",
      "Pass data between components",
    ],
    estimatedDuration: "4-5 weeks",
    difficulty: "intermediate",
    prerequisites: ["JavaScript/TypeScript Fundamentals"],
    miniProject: {
      title: "Recipe Search App",
      description: "Build a React app that searches and displays recipes with filters and favorites",
      steps: [
        "Create components: SearchBar, RecipeCard, RecipeList",
        "Use useState for search input and filtered results",
        "Use useEffect to fetch recipes from an API",
        "Add filtering by cuisine and difficulty",
        "Implement add/remove favorites with local state",
        "Add loading and error states",
      ],
    },
    practiceTasks: [
      { task: "Create 5 reusable components with proper prop typing", difficulty: "easy" },
      { task: "Build a form with controlled inputs and validation", difficulty: "medium" },
      { task: "Implement custom hooks for shared logic", difficulty: "hard" },
      { task: "Optimize component rendering to prevent unnecessary re-renders", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "React Official Tutorial",
        type: "interactive",
        url: "https://react.dev/learn",
        description: "Interactive React learning by the React team",
      },
      {
        title: "React Course for Beginners",
        type: "video",
        url: "https://www.youtube.com/watch?v=bMknfKXIFil",
        description: "Complete React course covering fundamentals to advanced",
      },
      {
        title: "React Docs",
        type: "documentation",
        url: "https://react.dev",
        description: "Official React documentation",
      },
      {
        title: "Scrimba React Course",
        type: "interactive",
        url: "https://scrimba.com/learn/learnreact",
        description: "Interactive React learning platform",
      },
    ],
    completionChecklist: [
      "✓ Built 3+ complete React applications",
      "✓ Mastered useState, useEffect, and custom hooks",
      "✓ Can manage complex form state",
      "✓ Implemented conditional rendering and lists",
      "✓ Fetched data from APIs and handled errors",
      "✓ Optimized component performance",
    ],
  },

  "r4-swe": {
    id: "r4",
    title: "Backend: Node.js/Express",
    category: "Core",
    status: "upcoming",
    description:
      "Learn server-side development with Node.js and Express. Build REST APIs, handle requests, and manage databases.",
    whyItMatters:
      "Every web application needs a backend. Node.js is one of the most popular backend technologies. Understanding server-side code is crucial for full-stack development.",
    conceptsToLearn: [
      "Node.js fundamentals and npm",
      "Express.js and routing",
      "Middleware and error handling",
      "Request/response handling",
      "Authentication and authorization",
      "Building REST APIs",
      "Environment variables and configuration",
    ],
    learningObjectives: [
      "Set up and configure an Express server",
      "Create REST API endpoints",
      "Handle different HTTP methods (GET, POST, PUT, DELETE)",
      "Implement middleware for authentication",
      "Handle errors gracefully",
      "Understand and implement RESTful principles",
    ],
    estimatedDuration: "3-4 weeks",
    difficulty: "intermediate",
    prerequisites: ["JavaScript/TypeScript Fundamentals"],
    miniProject: {
      title: "Blog API with Authentication",
      description: "Build a REST API for a blogging platform with user authentication and CRUD operations",
      steps: [
        "Set up Express server with middleware",
        "Create routes for users (signup, login, profile)",
        "Implement JWT authentication",
        "Create CRUD endpoints for blog posts",
        "Add validation and error handling",
        "Write integration tests for all endpoints",
      ],
    },
    practiceTasks: [
      { task: "Create 5 different REST endpoints with different HTTP methods", difficulty: "easy" },
      { task: "Implement JWT authentication middleware", difficulty: "medium" },
      { task: "Add request validation and error handling", difficulty: "medium" },
      { task: "Write integration tests for your API", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "Node.js and Express Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        description: "Complete Node.js and Express course",
      },
      {
        title: "Express.js Official Guide",
        type: "documentation",
        url: "https://expressjs.com/",
        description: "Official Express documentation",
      },
      {
        title: "RESTful API Design",
        type: "tutorial",
        url: "https://restfulapi.net/",
        description: "Comprehensive guide to RESTful API design principles",
      },
      {
        title: "Node.js Best Practices",
        type: "article",
        url: "https://github.com/goldbergyoni/nodebestpractices",
        description: "Comprehensive list of Node.js best practices",
      },
    ],
    completionChecklist: [
      "✓ Created a working Express server",
      "✓ Implemented all CRUD operations in REST API",
      "✓ Added JWT authentication",
      "✓ Wrote validation for all inputs",
      "✓ Handled errors gracefully",
      "✓ Tested all endpoints with Postman or similar",
    ],
  },

  "r5-swe": {
    id: "r5",
    title: "Database Design: SQL & MongoDB",
    category: "Core",
    status: "upcoming",
    description:
      "Master both relational (SQL) and document (MongoDB) databases. Understand data modeling, queries, and optimization.",
    whyItMatters:
      "Data is at the heart of every application. Understanding both SQL and NoSQL databases makes you a better developer. Most companies use both depending on use case.",
    conceptsToLearn: [
      "SQL fundamentals: SELECT, INSERT, UPDATE, DELETE",
      "Database design and normalization",
      "Joins, indexes, and query optimization",
      "Transactions and ACID properties",
      "MongoDB basics and document structure",
      "CRUD operations in MongoDB",
      "Transactions in both SQL and NoSQL",
    ],
    learningObjectives: [
      "Design efficient database schemas",
      "Write optimized SQL queries",
      "Understand and use MongoDB effectively",
      "Optimize database performance",
      "Choose between SQL and NoSQL appropriately",
      "Implement transactions and data consistency",
    ],
    estimatedDuration: "3-4 weeks",
    difficulty: "intermediate",
    prerequisites: ["JavaScript/TypeScript Fundamentals"],
    miniProject: {
      title: "E-commerce Database Design",
      description: "Design and implement a database for an e-commerce platform with both SQL and NoSQL",
      steps: [
        "Design SQL schema for users, products, orders, payments",
        "Create relationships and implement constraints",
        "Write complex queries for reports and analytics",
        "Design MongoDB collections for product catalog",
        "Implement MongoDB aggregation pipeline",
        "Compare performance of both approaches",
      ],
    },
    practiceTasks: [
      { task: "Write 10 SQL queries of varying complexity", difficulty: "easy" },
      { task: "Optimize slow SQL queries using indexes", difficulty: "medium" },
      { task: "Design a normalized database schema from requirements", difficulty: "medium" },
      { task: "Implement transactions across multiple collections", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "SQL Tutorial",
        type: "interactive",
        url: "https://www.w3schools.com/sql/",
        description: "Interactive SQL tutorial with examples",
      },
      {
        title: "MongoDB University",
        type: "tutorial",
        url: "https://university.mongodb.com/",
        description: "Free MongoDB courses and certifications",
      },
      {
        title: "Database Design Course",
        type: "video",
        url: "https://www.youtube.com/watch?v=UrYLlod7XA8",
        description: "Complete database design fundamentals",
      },
      {
        title: "PostgreSQL Documentation",
        type: "documentation",
        url: "https://www.postgresql.org/docs/",
        description: "Official PostgreSQL documentation",
      },
    ],
    completionChecklist: [
      "✓ Designed a normalized SQL schema",
      "✓ Wrote complex queries with joins and aggregations",
      "✓ Set up proper indexes and optimized queries",
      "✓ Created MongoDB collections and documents",
      "✓ Used aggregation pipelines in MongoDB",
      "✓ Compared SQL and NoSQL for different scenarios",
    ],
  },

  "r6-swe": {
    id: "r6",
    title: "Data Structures & Algorithms",
    category: "Interview Prep",
    status: "upcoming",
    description:
      "Learn essential data structures (arrays, linked lists, trees, graphs) and algorithms (sorting, searching, dynamic programming) needed for technical interviews.",
    whyItMatters:
      "Every company tests DSA in technical interviews. Understanding DSA is critical for solving complex problems efficiently. It directly impacts code performance at scale.",
    conceptsToLearn: [
      "Arrays, strings, and linked lists",
      "Stacks, queues, and heaps",
      "Trees and graphs",
      "Hash tables and hash maps",
      "Sorting algorithms: QuickSort, MergeSort, HeapSort",
      "Searching algorithms: BFS, DFS, Binary Search",
      "Dynamic programming and recursion",
    ],
    learningObjectives: [
      "Understand time and space complexity (Big O)",
      "Implement all major data structures",
      "Solve 100+ LeetCode problems",
      "Recognize patterns in interview questions",
      "Write optimal solutions for given problems",
      "Explain algorithmic choices during interviews",
    ],
    estimatedDuration: "6-8 weeks",
    difficulty: "advanced",
    prerequisites: ["JavaScript/TypeScript Fundamentals"],
    miniProject: {
      title: "Graph Algorithms Visualizer",
      description: "Build an interactive tool to visualize BFS, DFS, Dijkstra, and A* algorithms",
      steps: [
        "Create data structures for graphs (adjacency list, matrix)",
        "Implement BFS and DFS algorithms",
        "Implement Dijkstra and A* pathfinding",
        "Create visual representation of graph traversal",
        "Add interactive controls to build custom graphs",
        "Show step-by-step visualization of algorithms",
      ],
    },
    practiceTasks: [
      { task: "Solve 20 Easy level LeetCode problems", difficulty: "easy" },
      { task: "Solve 30 Medium level problems covering all data structures", difficulty: "medium" },
      { task: "Solve 20 Hard problems including DP and graph problems", difficulty: "hard" },
      { task: "Optimize an O(n²) solution to O(n log n) or O(n)", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "LeetCode DSA Problems",
        type: "interactive",
        url: "https://leetcode.com/",
        description: "Thousands of coding problems with solutions",
      },
      {
        title: "Neetcode DSA Course",
        type: "video",
        url: "https://www.youtube.com/c/NeetCode/featured",
        description: "DSA explanations and solutions for interview prep",
      },
      {
        title: "Big O Cheat Sheet",
        type: "documentation",
        url: "https://www.bigocheatsheet.com/",
        description: "Visual guide to Big O complexity",
      },
      {
        title: "InterviewBit DSA",
        type: "interactive",
        url: "https://www.interviewbit.com/courses/programming/",
        description: "Structured DSA learning with interview questions",
      },
    ],
    completionChecklist: [
      "✓ Solved 50+ LeetCode problems",
      "✓ Implemented all major data structures from scratch",
      "✓ Understand and can calculate Big O complexity",
      "✓ Can solve medium-hard problems without hints",
      "✓ Can explain algorithm choices and trade-offs",
      "✓ Know common patterns for different problem types",
    ],
  },

  "r7-swe": {
    id: "r7",
    title: "System Design & Scalability",
    category: "Interview Prep",
    status: "upcoming",
    description:
      "Learn how to design large-scale systems. Understand scalability, load balancing, caching, databases at scale, and microservices architecture.",
    whyItMatters:
      "Senior and staff positions expect system design knowledge. Understanding how to build systems that serve millions of users is crucial for career growth.",
    conceptsToLearn: [
      "Scalability principles (vertical vs horizontal)",
      "Load balancing and reverse proxies",
      "Caching strategies (CDN, Redis, memcached)",
      "Database scalability: sharding, replication",
      "Message queues and event-driven architecture",
      "Microservices vs monoliths",
      "Monitoring, logging, and debugging at scale",
    ],
    learningObjectives: [
      "Design systems that handle millions of users",
      "Understand trade-offs between different architectures",
      "Identify bottlenecks and optimize systems",
      "Design fault-tolerant systems",
      "Make technology choices justified by requirements",
      "Communicate system design clearly in interviews",
    ],
    estimatedDuration: "6-8 weeks",
    difficulty: "advanced",
    prerequisites: ["Database Design: SQL & MongoDB", "Backend: Node.js/Express"],
    miniProject: {
      title: "Design a Twitter-Like System",
      description: "Design the architecture for a social media platform handling millions of users",
      steps: [
        "Design the database schema for users, tweets, followers",
        "Choose caching strategy for feed generation",
        "Design API endpoints and request flows",
        "Plan horizontal scaling approach",
        "Design load balancing and failover",
        "Create architecture diagram with all components",
      ],
    },
    practiceTasks: [
      { task: "Design 5 different systems (URL shortener, chat, video platform, etc.)", difficulty: "medium" },
      { task: "Estimate capacity for a given system (QPS, storage)", difficulty: "medium" },
      { task: "Choose appropriate technologies for given requirements", difficulty: "hard" },
      { task: "Design a system with specific constraints (low latency, high availability)", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "System Design Primer",
        type: "documentation",
        url: "https://github.com/donnemartin/system-design-primer",
        description: "Comprehensive guide to system design with examples",
      },
      {
        title: "System Design Interview Course",
        type: "video",
        url: "https://www.youtube.com/watch?v=q0KGYwNbMJ0",
        description: "Complete system design interview preparation",
      },
      {
        title: "Grokking System Design",
        type: "tutorial",
        url: "https://www.educative.io/courses/grokking-the-system-design-interview",
        description: "Structured system design course",
      },
      {
        title: "System Design Case Studies",
        type: "article",
        url: "https://github.com/checkcheckzz/system-design-interview",
        description: "Real system design case studies and solutions",
      },
    ],
    completionChecklist: [
      "✓ Designed 5+ systems from scratch",
      "✓ Can estimate capacity and performance",
      "✓ Understand trade-offs in design decisions",
      "✓ Know how to handle scale challenges",
      "✓ Can communicate design clearly with diagrams",
      "✓ Considered security, reliability, and maintainability",
    ],
  },

  "r8-swe": {
    id: "r8",
    title: "Build 3 Full-Stack Projects",
    category: "Project",
    status: "upcoming",
    description:
      "Build complete end-to-end applications combining frontend (React), backend (Node.js), and database. Apply everything you've learned.",
    whyItMatters:
      "Portfolio projects demonstrate your ability to build real applications. Employers want to see projects you've built. Fullstack projects show you can handle the entire stack.",
    conceptsToLearn: [
      "Frontend-backend integration",
      "API integration from React",
      "Authentication and authorization",
      "Database migrations and seeding",
      "Deployment and DevOps basics",
      "Testing (unit and integration tests)",
      "Git workflow and collaboration",
    ],
    learningObjectives: [
      "Plan and execute a fullstack project",
      "Integrate frontend and backend seamlessly",
      "Deploy applications to production",
      "Write tests for critical functionality",
      "Handle real-world edge cases",
      "Create impressive portfolio projects",
    ],
    estimatedDuration: "8-12 weeks",
    difficulty: "advanced",
    prerequisites: [
      "React Fundamentals",
      "Backend: Node.js/Express",
      "Database Design: SQL & MongoDB",
    ],
    miniProject: {
      title: "Three Full-Stack Applications",
      description: "Build three progressively complex fullstack applications",
      steps: [
        "Project 1: Todo App with user auth and persistent storage",
        "Project 2: E-commerce platform with products, cart, orders",
        "Project 3: Social media platform with feeds, comments, real-time updates",
        "Deploy all three projects to production",
        "Write tests for all projects",
        "Document projects for your portfolio",
      ],
    },
    practiceTasks: [
      { task: "Build a simple fullstack CRUD app", difficulty: "easy" },
      { task: "Add authentication and authorization", difficulty: "medium" },
      { task: "Implement real-time features with WebSockets", difficulty: "hard" },
      { task: "Deploy to production with proper monitoring", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "MERN Stack Tutorial",
        type: "video",
        url: "https://www.youtube.com/watch?v=98BzS5Oz5E4",
        description: "Complete MERN (MongoDB, Express, React, Node) stack tutorial",
      },
      {
        title: "Fullstack Project Ideas",
        type: "documentation",
        url: "https://github.com/tuvtran/project-based-learning",
        description: "Curated list of fullstack project ideas with tutorials",
      },
      {
        title: "Deployment Guide",
        type: "tutorial",
        url: "https://www.heroku.com/",
        description: "Deploy your fullstack apps easily with Heroku",
      },
      {
        title: "Testing JavaScript",
        type: "tutorial",
        url: "https://testingjavascript.com/",
        description: "Complete guide to testing JavaScript applications",
      },
    ],
    completionChecklist: [
      "✓ Built 3 complete fullstack applications",
      "✓ All projects include frontend and backend",
      "✓ Implemented user authentication",
      "✓ Projects are deployed and accessible online",
      "✓ Code is well-documented and on GitHub",
      "✓ Projects demonstrate different concepts and technologies",
    ],
  },

  "r9-swe": {
    id: "r9",
    title: "Contribute to Open Source",
    category: "Community",
    status: "upcoming",
    description:
      "Contribute to real open-source projects. Learn collaborative development, code review, and best practices from experienced developers.",
    whyItMatters:
      "Open source contributions boost your portfolio and resume. You learn from experienced developers, understand production codebases, and build your reputation in the tech community.",
    conceptsToLearn: [
      "Finding issues and understanding requirements",
      "Setting up open-source projects locally",
      "Following contribution guidelines",
      "Writing high-quality code for review",
      "Receiving and implementing feedback",
      "Documentation and testing standards",
      "Community interaction and communication",
    ],
    learningObjectives: [
      "Successfully contribute to multiple projects",
      "Write code that meets project standards",
      "Understand larger codebases",
      "Improve code review skills",
      "Build professional relationships",
      "Learn industry best practices",
    ],
    estimatedDuration: "Ongoing (6-8 weeks for first contribution)",
    difficulty: "intermediate",
    prerequisites: ["Master Git & GitHub version control"],
    miniProject: {
      title: "Contribute to 3 Open Source Projects",
      description: "Make meaningful contributions to different open-source projects",
      steps: [
        "Find projects using Goodfirstissue.dev or similar",
        "Choose beginner-friendly issues",
        "Read existing code and understand patterns",
        "Make your first contribution (bug fix or feature)",
        "Handle code review feedback professionally",
        "Complete at least 3 contributions to different projects",
      ],
    },
    practiceTasks: [
      { task: "Find an issue and understand the codebase", difficulty: "easy" },
      { task: "Fix a bug in an open-source project", difficulty: "medium" },
      { task: "Add a feature to an open-source project", difficulty: "medium" },
      { task: "Lead discussions and help other contributors", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "Good First Issue",
        type: "interactive",
        url: "https://goodfirstissue.dev/",
        description: "Find beginner-friendly open source issues",
      },
      {
        title: "First Timers Only",
        type: "interactive",
        url: "https://www.firsttimersonly.com/",
        description: "Open source projects welcoming first-time contributors",
      },
      {
        title: "How to Contribute to Open Source",
        type: "article",
        url: "https://opensource.guide/how-to-contribute/",
        description: "Comprehensive guide to contributing to open source",
      },
      {
        title: "GitHub Contributing Guide",
        type: "tutorial",
        url: "https://guides.github.com/activities/contributing-to-open-source/",
        description: "GitHub's official guide to open source contributions",
      },
    ],
    completionChecklist: [
      "✓ Contributed to at least 3 different projects",
      "✓ Had pull requests merged and code in production",
      "✓ Received and implemented code review feedback",
      "✓ Wrote tests for your contributions",
      "✓ Documented your changes appropriately",
      "✓ Learned from community and other contributors",
    ],
  },

  "r10-swe": {
    id: "r10",
    title: "LeetCode & Interview Preparation",
    category: "Interview Prep",
    status: "upcoming",
    description:
      "Intensive practice for technical interviews. Solve LeetCode problems, practice mock interviews, and prepare for company-specific rounds.",
    whyItMatters:
      "Technical interviews are the gateway to top tech companies. Consistent practice on LeetCode and mock interviews significantly increases your chances of success.",
    conceptsToLearn: [
      "Interview formats and expectations",
      "Two-pointer technique",
      "Sliding window problems",
      "Matrix and 2D array problems",
      "Tree and graph traversal patterns",
      "Dynamic programming patterns",
      "Interview communication and thinking aloud",
    ],
    learningObjectives: [
      "Solve LeetCode medium/hard problems confidently",
      "Think and communicate clearly during interviews",
      "Handle edge cases and optimize solutions",
      "Manage time effectively during interviews",
      "Prepare answers to behavioral questions",
      "Pass technical interviews at top companies",
    ],
    estimatedDuration: "8-12 weeks",
    difficulty: "advanced",
    prerequisites: ["Data Structures & Algorithms", "LeetCode problems"],
    miniProject: {
      title: "Complete Interview Preparation",
      description: "Comprehensive preparation for multiple technical interviews",
      steps: [
        "Solve 50+ LeetCode problems across all categories",
        "Do 10+ mock interviews with friends or platforms",
        "Prepare list of behavioral questions and answers",
        "Create a 30-second elevator pitch about yourself",
        "Prepare examples of challenging projects",
        "Practice system design interviews",
      ],
    },
    practiceTasks: [
      { task: "Solve 10 medium problems under 45 minutes", difficulty: "medium" },
      { task: "Do a mock interview and get feedback", difficulty: "medium" },
      { task: "Optimize a solution with space and time constraints", difficulty: "hard" },
      { task: "Solve a hard problem with multiple approaches", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "Blind 75 LeetCode Problems",
        type: "interactive",
        url: "https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-6261ba2e",
        description: "Curated list of 75 must-do LeetCode problems",
      },
      {
        title: "LeetCode Patterns",
        type: "documentation",
        url: "https://seanprashad.com/leetcode-patterns/",
        description: "LeetCode problems organized by patterns",
      },
      {
        title: "Mock Interview Practice",
        type: "interactive",
        url: "https://interviewing.io/",
        description: "Practice real mock interviews with engineers",
      },
      {
        title: "Behavioral Interview Guide",
        type: "article",
        url: "https://www.amazon.com/Cracking-Coding-Interview-Programing-Questions/dp/0984782850",
        description: "Complete interview guide including behavioral questions",
      },
    ],
    completionChecklist: [
      "✓ Solved 100+ LeetCode problems",
      "✓ Can solve medium problems in 30-45 minutes",
      "✓ Completed 10+ mock interviews",
      "✓ Have prepared answers for behavioral questions",
      "✓ Can explain time and space complexity clearly",
      "✓ Feel confident in technical interviews",
    ],
  },

  // Data Scientist Roadmap
  "r1-ds": {
    id: "r1",
    title: "Python Fundamentals & OOP",
    category: "Core",
    status: "upcoming",
    description:
      "Master Python, the most popular language for data science. Learn syntax, data structures, and object-oriented programming.",
    whyItMatters:
      "Python dominates data science. 90% of data scientists use Python. Its simple syntax and powerful libraries make it perfect for data analysis and machine learning.",
    conceptsToLearn: [
      "Variables, data types, and operators",
      "Functions and decorators",
      "Lists, dictionaries, sets, and tuples",
      "Classes and object-oriented programming",
      "Error handling and exceptions",
      "File I/O and working with files",
      "List comprehensions and lambda functions",
    ],
    learningObjectives: [
      "Write clean, readable Python code",
      "Understand OOP principles",
      "Use Python data structures effectively",
      "Write reusable functions and classes",
      "Debug Python code efficiently",
      "Work with files and data",
    ],
    estimatedDuration: "2-3 weeks",
    difficulty: "beginner",
    prerequisites: [],
    miniProject: {
      title: "Student Grade Management System",
      description: "Build a system to manage student data and calculate grades using OOP",
      steps: [
        "Create Student and Course classes",
        "Implement grade calculation and statistics",
        "Use lists and dictionaries to manage data",
        "Add file I/O to save/load student data",
        "Implement error handling for invalid inputs",
        "Create a simple CLI interface",
      ],
    },
    practiceTasks: [
      { task: "Create 5 classes with inheritance relationships", difficulty: "easy" },
      { task: "Use decorators and lambda functions", difficulty: "medium" },
      { task: "Work with CSV and JSON files", difficulty: "medium" },
      { task: "Build a complex data processing pipeline", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "Python for Everybody",
        type: "video",
        url: "https://www.youtube.com/playlist?list=PLlRFEj9H3Oj7Oj3ndcEY7gxXcPpuyXc61",
        description: "Complete Python course from basics to advanced",
      },
      {
        title: "Python Official Documentation",
        type: "documentation",
        url: "https://docs.python.org/3/",
        description: "Official Python documentation",
      },
      {
        title: "Real Python Tutorials",
        type: "tutorial",
        url: "https://realpython.com/",
        description: "High-quality Python tutorials on all topics",
      },
      {
        title: "Codecademy Python Course",
        type: "interactive",
        url: "https://www.codecademy.com/learn/learn-python-3",
        description: "Interactive Python learning",
      },
    ],
    completionChecklist: [
      "✓ Completed 20+ coding exercises",
      "✓ Created 3+ classes with proper OOP design",
      "✓ Can handle files and exceptions properly",
      "✓ Understand list comprehensions and functional programming",
      "✓ Built the grade management project",
      "✓ Comfortable with Python syntax and conventions",
    ],
  },

  "r2-ds": {
    id: "r2",
    title: "SQL & Database Querying",
    category: "Core",
    status: "upcoming",
    description:
      "Master SQL for data extraction and analysis. Learn to write complex queries to extract insights from databases.",
    whyItMatters:
      "Most data in the world lives in databases. SQL is essential for accessing and preparing data for analysis.",
    conceptsToLearn: [
      "SELECT, WHERE, and basic queries",
      "JOINs: INNER, LEFT, RIGHT, FULL",
      "GROUP BY, HAVING, and aggregations",
      "Subqueries and CTEs",
      "Window functions and ranking",
      "Query optimization and indexes",
      "Data manipulation: INSERT, UPDATE, DELETE",
    ],
    learningObjectives: [
      "Write complex SQL queries to extract data",
      "Understand and use different types of joins",
      "Perform data aggregation and grouping",
      "Optimize queries for performance",
      "Prepare data for analysis efficiently",
    ],
    estimatedDuration: "2-3 weeks",
    difficulty: "beginner",
    prerequisites: ["Python Fundamentals & OOP"],
    miniProject: {
      title: "Sales Analysis Dashboard Queries",
      description: "Write SQL queries to analyze sales data and create reports",
      steps: [
        "Create queries for sales by product category",
        "Analyze customer purchase patterns",
        "Find top customers and repeat purchase rates",
        "Calculate month-over-month growth",
        "Create cohort analysis queries",
        "Optimize slow-running queries",
      ],
    },
    practiceTasks: [
      { task: "Write 10 queries using different types of JOINs", difficulty: "easy" },
      { task: "Create aggregation queries with GROUP BY and HAVING", difficulty: "medium" },
      { task: "Write complex subqueries and CTEs", difficulty: "medium" },
      { task: "Optimize queries using indexes and EXPLAIN", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "SQL Tutorial",
        type: "interactive",
        url: "https://www.w3schools.com/sql/",
        description: "Interactive SQL tutorial with examples",
      },
      {
        title: "Mode Analytics SQL Tutorial",
        type: "tutorial",
        url: "https://mode.com/sql-tutorial/",
        description: "Comprehensive SQL tutorial with interactive examples",
      },
      {
        title: "LeetCode SQL Problems",
        type: "interactive",
        url: "https://leetcode.com/problemset/database/",
        description: "Practice SQL with real interview questions",
      },
      {
        title: "PostgreSQL Documentation",
        type: "documentation",
        url: "https://www.postgresql.org/docs/",
        description: "Official PostgreSQL documentation and reference",
      },
    ],
    completionChecklist: [
      "✓ Wrote 30+ SQL queries of varying complexity",
      "✓ Mastered all types of JOINs",
      "✓ Can aggregate and analyze data effectively",
      "✓ Used window functions for advanced analysis",
      "✓ Optimized queries for performance",
      "✓ Completed the sales analysis project",
    ],
  },

  "r3-ds": {
    id: "r3",
    title: "NumPy & Pandas for Data Manipulation",
    category: "Libraries",
    status: "upcoming",
    description:
      "Learn the core Python libraries for data manipulation. Master NumPy arrays and Pandas DataFrames for efficient data processing.",
    whyItMatters:
      "NumPy and Pandas are used in 99% of data science projects. They're essential for preparing and cleaning data efficiently.",
    conceptsToLearn: [
      "NumPy arrays and operations",
      "Array slicing, indexing, and broadcasting",
      "Pandas Series and DataFrames",
      "Data cleaning: handling missing values",
      "Merging and joining DataFrames",
      "Groupby and aggregation operations",
      "Time series data manipulation",
    ],
    learningObjectives: [
      "Work efficiently with NumPy arrays",
      "Create and manipulate Pandas DataFrames",
      "Clean and preprocess data effectively",
      "Perform exploratory data analysis",
      "Merge and combine multiple datasets",
      "Handle missing and invalid data",
    ],
    estimatedDuration: "3-4 weeks",
    difficulty: "beginner",
    prerequisites: ["Python Fundamentals & OOP"],
    miniProject: {
      title: "Airbnb Data Analysis",
      description: "Clean, analyze, and visualize Airbnb listing data",
      steps: [
        "Load and explore Airbnb dataset",
        "Handle missing values and outliers",
        "Merge multiple data sources",
        "Create new features from existing data",
        "Analyze listings by neighborhood",
        "Generate summary statistics and insights",
      ],
    },
    practiceTasks: [
      { task: "Create and manipulate NumPy arrays with various operations", difficulty: "easy" },
      { task: "Create and clean Pandas DataFrames", difficulty: "medium" },
      { task: "Perform advanced groupby and aggregations", difficulty: "medium" },
      { task: "Handle complex data merging scenarios", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "NumPy Tutorial",
        type: "tutorial",
        url: "https://numpy.org/doc/stable/user/basics.html",
        description: "Official NumPy documentation and tutorial",
      },
      {
        title: "Pandas Documentation",
        type: "documentation",
        url: "https://pandas.pydata.org/docs/",
        description: "Official Pandas documentation",
      },
      {
        title: "Data Cleaning with Pandas",
        type: "video",
        url: "https://www.youtube.com/watch?v=5rNu16O3YNE",
        description: "Video tutorial on data cleaning with Pandas",
      },
      {
        title: "Real Python Pandas Guide",
        type: "article",
        url: "https://realpython.com/learning-paths/pandas-data-science/",
        description: "Comprehensive Pandas learning guide",
      },
    ],
    completionChecklist: [
      "✓ Comfortable with NumPy arrays and operations",
      "✓ Can create and manipulate DataFrames efficiently",
      "✓ Handle missing values and outliers",
      "✓ Merge and combine datasets",
      "✓ Perform complex groupby and aggregations",
      "✓ Completed data analysis project",
    ],
  },

  "r4-ds": {
    id: "r4",
    title: "Data Visualization: Matplotlib & Seaborn",
    category: "Libraries",
    status: "upcoming",
    description:
      "Learn to create compelling visualizations. Matplotlib for detailed control, Seaborn for statistical graphics.",
    whyItMatters:
      "A picture is worth a thousand words. Data visualization is crucial for communicating insights to non-technical stakeholders.",
    conceptsToLearn: [
      "Matplotlib basics: figures, axes, plots",
      "Different plot types: line, bar, scatter, histogram",
      "Seaborn for statistical visualization",
      "Color schemes and aesthetics",
      "Multi-plot figures and subplots",
      "Customization and styling",
      "Interactive visualizations",
    ],
    learningObjectives: [
      "Create publication-quality visualizations",
      "Choose appropriate plot types for data",
      "Customize and style visualizations",
      "Create dashboards with multiple plots",
      "Effectively communicate data insights visually",
    ],
    estimatedDuration: "2-3 weeks",
    difficulty: "beginner",
    prerequisites: ["NumPy & Pandas for Data Manipulation"],
    miniProject: {
      title: "Sales Dashboard Visualization",
      description: "Create multiple visualizations for sales data analysis",
      steps: [
        "Create time series plots of sales trends",
        "Visualize product category performance",
        "Create heatmaps for correlation analysis",
        "Build distribution plots for customer analysis",
        "Combine multiple plots in a dashboard",
        "Style and customize visualizations",
      ],
    },
    practiceTasks: [
      { task: "Create 10 different types of plots", difficulty: "easy" },
      { task: "Create complex multi-plot figures", difficulty: "medium" },
      { task: "Create publication-quality visualizations", difficulty: "hard" },
      { task: "Build an interactive dashboard", difficulty: "hard" },
    ],
    freeResources: [
      {
        title: "Matplotlib Tutorial",
        type: "documentation",
        url: "https://matplotlib.org/stable/tutorials/index.html",
        description: "Official Matplotlib tutorial",
      },
      {
        title: "Seaborn Tutorial",
        type: "tutorial",
        url: "https://seaborn.pydata.org/tutorial.html",
        description: "Official Seaborn tutorial and documentation",
      },
      {
        title: "Data Visualization with Matplotlib",
        type: "video",
        url: "https://www.youtube.com/watch?v=wB9c0dVkMQo",
        description: "Comprehensive Matplotlib tutorial video",
      },
      {
        title: "Storytelling with Data Visualization",
        type: "book",
        url: "https://www.storytellingwithdata.com/",
        description: "Best practices for data storytelling and visualization",
      },
    ],
    completionChecklist: [
      "✓ Created 20+ different types of visualizations",
      "✓ Understand when to use which plot type",
      "✓ Customize colors, styles, and themes",
      "✓ Created multi-plot dashboards",
      "✓ Made publication-quality visualizations",
      "✓ Completed sales dashboard project",
    ],
  },
};


export function getRoadmapItemContent(itemId: string): Partial<RoadmapItem> | null {
  return RoadmapContent[itemId] || null;
}

export function enrichRoadmapItemWithGoal(
  item: RoadmapItem,
  goal: string
): RoadmapItem {
  // Determine role suffix for content lookup
  const goalToRole: Record<string, string> = {
    "Software Engineer": "swe",
    "Data Scientist": "ds",
    "Product Manager": "pm",
    "Designer": "design",
    "Not sure yet": "explore",
  };

  const role = goalToRole[goal] || "swe";
  const contentKey = `${item.id}-${role}`;

  const content = RoadmapContent[contentKey];
  if (content) {
    return {
      ...item,
      ...content,
    };
  }

  // Fallback: try to enrich with basic content if available
  return enrichWithBasicContent(item, goal);
}

function enrichWithBasicContent(item: RoadmapItem, goal: string): RoadmapItem {
  // Provide sensible defaults for items without full content
  const defaultContent: Record<string, Partial<RoadmapItem>> = {
    // Software Engineer items
    "JavaScript/TypeScript": {
      description: "Master JavaScript and TypeScript for modern web development",
      whyItMatters:
        "JavaScript is the language of the web. TypeScript adds type safety for large projects.",
      difficulty: "beginner",
      estimatedDuration: "3-4 weeks",
      prerequisites: [],
    },
    "React": {
      description: "Learn React, the most popular frontend library",
      whyItMatters:
        "React is used by most modern web companies. Essential for frontend development.",
      difficulty: "intermediate",
      estimatedDuration: "4-5 weeks",
      prerequisites: ["JavaScript/TypeScript"],
    },
    "Node.js": {
      description: "Build server-side applications with Node.js",
      whyItMatters: "Node.js powers the backend of many web applications.",
      difficulty: "intermediate",
      estimatedDuration: "3-4 weeks",
      prerequisites: ["JavaScript/TypeScript"],
    },
    // Data Scientist items
    "Python": {
      description: "Master Python for data science and machine learning",
      whyItMatters: "Python is the #1 language for data science and ML.",
      difficulty: "beginner",
      estimatedDuration: "2-3 weeks",
      prerequisites: [],
    },
    "NumPy & Pandas": {
      description: "Learn data manipulation with NumPy and Pandas",
      whyItMatters: "Essential libraries for data processing and analysis.",
      difficulty: "beginner",
      estimatedDuration: "2 weeks",
      prerequisites: ["Python"],
    },
    "Machine Learning": {
      description: "Learn supervised and unsupervised machine learning",
      whyItMatters: "ML is the core of data science work.",
      difficulty: "advanced",
      estimatedDuration: "6-8 weeks",
      prerequisites: ["Python", "Statistics"],
    },
  };

  const contentKey = Object.keys(defaultContent).find(
    (key) =>
      item.title.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(item.title.toLowerCase())
  );

  if (contentKey && defaultContent[contentKey]) {
    return {
      ...item,
      ...defaultContent[contentKey],
    };
  }

  return item;
}
