# Roadmap Interactions Guide

## Overview

The roadmap is now fully interactive with real-time Firestore synchronization. Students can:
- Continue learning with one click
- Navigate between steps
- Expand/collapse details
- Mark items complete
- Track progress visually

## Available Interactions

### 1. **Continue Learning**
**Location:** Top card after progress overview
**What it does:**
- Finds the next unstarted (upcoming) step
- Starts learning on that step
- Jumps to that step in the detail view

**Behavior:**
- Only visible if there are upcoming steps remaining
- Disabled while updating
- Immediately updates Firestore

**Code:**
```typescript
const handleContinueLearning = async () => {
  const nextUpcoming = roadmap.find((item) => item.status === "upcoming");
  if (nextUpcoming) {
    await handleStartItem(nextUpcoming.id);
    const index = roadmap.findIndex((item) => item.id === nextUpcoming.id);
    setCurrentIndex(index);
  }
};
```

### 2. **Next Step**
**Location:** Top right of current step detail
**What it does:**
- Moves to the next item in the roadmap
- Does NOT change status (just viewing)
- Collapses expanded details

**Behavior:**
- Disabled on last step
- Instant navigation (no API call)
- Clears expanded timeline items

**Code:**
```typescript
const handleNextStep = () => {
  if (currentIndex < roadmap.length - 1) {
    setCurrentIndex(currentIndex + 1);
    setExpandedId(null);
  }
};
```

### 3. **Previous Step**
**Location:** Top right of current step detail
**What it does:**
- Moves to the previous item in the roadmap
- Does NOT change status (just viewing)
- Collapses expanded details

**Behavior:**
- Disabled on first step
- Instant navigation (no API call)
- Clears expanded timeline items

**Code:**
```typescript
const handlePrevStep = () => {
  if (currentIndex > 0) {
    setCurrentIndex(currentIndex - 1);
    setExpandedId(null);
  }
};
```

### 4. **Expand Details**
**Location:** Full Learning Path timeline section
**What it does:**
- Shows/hides detailed information for a roadmap item
- Displays description, difficulty, concepts, quick actions

**Behavior:**
- Click to toggle expand/collapse
- Can expand multiple items
- Shows: description, difficulty, concepts, and quick action buttons
- Arrow icon indicates state (ChevronDown/ChevronUp)

**Expanded Content:**
```
- Description
- Difficulty level
- Core concepts
- Quick action buttons (Start/Complete/View Full)
```

**Code:**
```typescript
<button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
  {/* Timeline item content */}
</button>

{expandedId === item.id && (
  <motion.div>
    {/* Expanded details */}
  </motion.div>
)}
```

### 5. **Collapse**
**Location:** Automatically when navigating, or manual via Expand
**What it does:**
- Closes expanded detail views
- Triggered automatically when:
  - Navigating to previous/next step
  - Clicking another item's expand button
  - Clicking the same button again

**Behavior:**
- Smooth animation (0.2s)
- Height/opacity transition
- Clears only the specific expanded item

### 6. **Mark Complete**
**Location:** Current step detail (bottom action buttons)
**What it does:**
- Changes item status from "in-progress" → "done"
- Updates Firestore immediately
- Updates UI with success state
- Triggers progress bar refresh

**Behavior:**
- Only shown if status is "in-progress"
- Disabled while updating
- Updates:
  - Status in Firestore
  - Progress bar at top
  - Timeline status badge
  - Item icon (circle → checkmark)
  - Item styling (color, strikethrough)

**Firestore Update:**
```
PUT /api/roadmap/{itemId}?userId={userId}&status=done
```

**Code:**
```typescript
const handleMarkComplete = async (itemId: string) => {
  setIsUpdating(true);
  try {
    await updateItemStatus(itemId, "done");
    // UI updates automatically via useRoadmap hook
  } finally {
    setIsUpdating(false);
  }
};
```

### 7. **Progress Bar**
**Location:** Top of page - "Overall Progress" card
**What it shows:**
- Visual representation of completed vs total steps
- Percentage completion
- Completed count (e.g., "3/10 steps completed")

**Updates:**
- Automatically when item is marked complete
- Real-time calculation from roadmap data
- Smooth visual update (no refresh needed)

**Formula:**
```
completedCount = roadmap.filter(item => item.status === "done").length
progressPercent = (completedCount / roadmap.length) * 100
```

**Visual:**
```
[███████░░░░░░░░░] 35%
3/10 steps completed
```

### 8. **Start Learning** (on Timeline)
**Location:** Timeline items - in expanded detail view or timeline item actions
**What it does:**
- Changes status from "upcoming" → "in-progress"
- Updates Firestore immediately
- Changes item styling and icon

**Behavior:**
- Only shown if status is "upcoming"
- Disabled while updating
- Updates immediately without navigation

---

## Real-time Firestore Sync

### Update Flow

```
User clicks action
    ↓
State updates (optimistic UI)
    ↓
API call to PUT /api/roadmap/{itemId}
    ↓
Firestore updates item status
    ↓
useRoadmap hook refetches
    ↓
UI re-renders with new data
```

### API Endpoint

**File:** `app/api/roadmap/[itemId]/route.ts`

**Method:** PUT

**Params:**
- `itemId`: The roadmap item ID (e.g., "r1", "r2")
- `userId`: Current user's Firebase UID (from query)
- `status`: New status ("upcoming", "in-progress", "done")

**Example:**
```
PUT /api/roadmap/r3?userId=abc123&status=done
```

**Response:**
```json
{
  "message": "Roadmap item updated",
  "itemId": "r3",
  "status": "done"
}
```

### Firestore Collections Updated

When an item status changes:

1. **`/roadmaps/{userId}/items/{itemId}`**
   - Updates item status
   - Updates parent roadmap updatedAt timestamp

2. **`/roadmapProgress/{userId}/items/{itemId}`**
   - Updates progress tracking
   - Sets completedAt timestamp (if done)
   - Sets startedAt timestamp (if in-progress)

---

## Current Step Detail View

The main detail view (center card) shows:

### Top Section
- Step counter (e.g., "Step 3 of 10")
- Status badge (upcoming/in-progress/done)
- Duration badge (if available)
- Title
- Difficulty level
- Previous/Next navigation buttons

### Main Content (if available)
- **Description:** What you'll learn
- **Why It Matters:** Business relevance
- **Concepts to Learn:** 6-8 key topics
- **Learning Objectives:** What you can do
- **Mini Project:** Hands-on practice with steps
- **Practice Tasks:** Exercises with difficulty levels
- **Free Resources:** Curated learning materials
- **Completion Checklist:** Verifiable outcomes

### Action Buttons
```
Upcoming item:
  [Start Learning]

In-Progress item:
  [Mark as Complete]

Completed item:
  (No action buttons)
```

---

## Full Learning Path Timeline

Shows all roadmap items with:

### Visual Indicators
- **Blue circle with gradient:** Current step (by index)
- **Green checkmark:** Completed items
- **Clock icon:** In-progress items
- **Empty circle:** Upcoming items

### Per-Item Actions
- **Click to expand:** Shows details
- **Expand shows:**
  - Description
  - Difficulty
  - Concepts
  - Quick action buttons (Start/Complete/View Full)
- **View Full:** Navigates to current step view

---

## State Management

### Local State
```typescript
const [expandedId, setExpandedId] = useState<string | null>(null);
const [currentIndex, setCurrentIndex] = useState(0);
const [isUpdating, setIsUpdating] = useState(false);
```

### Server State (from Firebase)
```typescript
const { roadmap, updateItemStatus } = useRoadmap(userId);
```

### Automatic Sync
- useRoadmap hook handles Firestore fetching
- Status updates trigger automatic refetch
- UI updates without manual refresh

---

## User Experience Flow

### First Visit
1. User logs in
2. Roadmap loads from Firestore
3. "Continue Learning" card shows
4. First upcoming step is highlighted
5. Progress bar shows current completion

### Starting a Step
1. Click "Continue Learning" or "Start" button
2. Status changes to "in-progress"
3. Item icon changes (circle → clock)
4. Badge updates (upcoming → in-progress)
5. Current step view updates if viewing this step

### Completing a Step
1. Click "Mark as Complete"
2. Status changes to "done"
3. Item icon changes (clock → checkmark)
4. Item text gets strikethrough
5. Progress bar increments
6. Completion count updates

### Navigating Steps
1. Use arrow buttons to go previous/next
2. Or click timeline items to expand
3. Or click "View Full" in expanded item
4. Current step detail updates instantly
5. No loading state (instant)

---

## Performance Considerations

### Optimizations
- ✅ Instant navigation (no API call)
- ✅ Optimistic UI updates (don't wait for server)
- ✅ Single API call per status change
- ✅ Minimal re-renders (React memo on components)
- ✅ Smooth animations (Framer Motion)

### API Calls
```
Only when:
✓ Mark complete
✓ Start learning
✓ Expand item (shows details)

Never:
✗ Navigation (prev/next)
✗ Expanding timeline
✗ Scrolling
```

---

## Error Handling

If an update fails:

```typescript
try {
  await updateItemStatus(itemId, "done");
} catch (error) {
  // Error from useRoadmap hook
  // UI shows error message
  // State reverts (no optimistic updates)
  console.error("Failed to update:", error);
}
```

**Error states:**
- Loading state shown with disabled buttons
- If API fails: error appears in roadmap
- User can retry by clicking action again

---

## Keyboard Shortcuts (Future)

Currently supported:
- None (can add arrow key navigation)

Potential additions:
- Arrow keys: Previous/Next step
- Space: Expand/Collapse
- Enter: Start/Complete
- Ctrl+S: Save (auto-saved)

---

## Browser Compatibility

Works on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

Requirements:
- JavaScript enabled
- Firestore access
- Modern CSS (Flexbox, CSS Grid)

---

## Testing Roadmap Interactions

### Manual Testing Checklist

**Setup:**
- [ ] Log in with valid account
- [ ] Have a roadmap in Firestore
- [ ] Check browser console for errors

**Continue Learning:**
- [ ] Click "Continue Learning" button
- [ ] Verify item status changes to "in-progress"
- [ ] Verify Firestore updates immediately
- [ ] Verify UI shows updated status

**Navigation:**
- [ ] Click Next button (→)
- [ ] Verify current step changes
- [ ] Click Previous button (←)
- [ ] Verify at first step (Previous disabled)
- [ ] Verify at last step (Next disabled)

**Expand/Collapse:**
- [ ] Click timeline item to expand
- [ ] Verify details show smoothly
- [ ] Click again to collapse
- [ ] Verify smooth animation
- [ ] Verify only one expanded at a time

**Mark Complete:**
- [ ] Start a step (status: in-progress)
- [ ] Click "Mark as Complete"
- [ ] Verify status updates to "done"
- [ ] Verify icon changes to checkmark
- [ ] Verify progress bar updates
- [ ] Verify Firestore updated

**Progress Bar:**
- [ ] Check initial progress
- [ ] Complete one step
- [ ] Verify progress bar updates
- [ ] Verify percentage updates
- [ ] Verify count updates

---

## Future Enhancements

Potential additions:
- [ ] Keyboard shortcuts
- [ ] Share progress
- [ ] Mentor feedback integration
- [ ] Estimated time remaining
- [ ] Difficulty based on performance
- [ ] Parallel learning paths
- [ ] Achievements/badges
- [ ] Peer progress comparison
