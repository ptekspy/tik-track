# Tik-Track — Full Design Improvement Plan

This plan focuses on **clarity, perceived value, and trust** — not visual flair.
The goal is to make Tik-Track feel like a *thinking tool*, not a stats dashboard.

Principles:
- Calm > clever
- Insight > volume
- Guidance > raw data
- Opinionated > configurable

---

## 1. Global Design Principles (lock these in)

### 1.1 Visual hierarchy
Every page should answer, in order:
1. **What matters right now**
2. **What changed**
3. **What can I do next**

If a component doesn’t serve one of these, it’s noise.

---

### 1.2 Signal-first design
Signals are your differentiator.
They must be:
- visually distinct
- immediately scannable
- consistent everywhere

**Action**
- Standardise signal colours:
  - Green → positive
  - Amber → neutral
  - Red → negative
- Always pair colour with icon + text (accessibility).

---

### 1.3 Density discipline
You’re already doing this well.
Maintain:
- generous vertical spacing
- tight horizontal alignment
- no more than 3 visual weights per screen

---

## 2. Navigation & Layout

### 2.1 Active navigation state
**Problem:** Orientation is slightly unclear.

**Improvements**
- Highlight active route with:
  - accent colour
  - subtle underline or left border
- Persist highlight on sub-routes (e.g. video detail).

---

### 2.2 Page headers (standardise)
Every page should have:
- Page title
- One-line explanation (why this page exists)
- Optional primary action

Example:
> **Dashboard**  
> *An overview of how your recent videos are performing.*

---

## 3. Dashboard Improvements (Highest Impact)

### 3.1 Add a “Now” section
At the top of the dashboard:

**Section: “What needs attention”**
- Next snapshot due
- Missed snapshot
- Positive signal detected

This makes the dashboard **task-oriented**, not passive.

---

### 3.2 Video list readability
**Current:** Information is correct but visually flat.

**Improvements**
- Slight card separation or alternating row backgrounds
- Align numbers vertically (tables scan better than cards here)
- Reduce visual weight of secondary metrics (snapshots count).

---

### 3.3 Metric deltas (mandatory)
Every metric shown should optionally show:
- ↑ / ↓ indicator
- delta value
- tooltip explaining comparison window

No deltas = numbers feel meaningless.

---

### 3.4 Sorting & filtering controls
Add lightweight controls:
- Sort by: views, engagement, signal, newest
- Filter by: status

Keep them unobtrusive but persistent.

---

## 4. Video Detail Page

### 4.1 Page structure (recommended order)

1. **Video identity**
   - Title
   - Status
   - Archetype (future)
2. **Latest signal + summary**
3. **Key metrics (latest snapshot)**
4. **Snapshot timeline**
5. **Charts**
6. **Snapshot table**
7. **Notes / reflection**

This tells a story top-down.

---

### 4.2 Snapshot timeline polish
You already have strong logic here.

Improvements:
- Clear legend (completed / missed / upcoming)
- Tooltip per snapshot:
  - expected time
  - actual recorded time
- Subtle animation for “next recommended snapshot”.

---

### 4.3 Charts (keep them honest)
Charts should:
- default to same snapshot window comparisons
- avoid lifetime vs lifetime unless explicitly chosen
- have minimal gridlines

Add a caption under each chart:
> “Shows engagement at equivalent snapshot windows.”

This builds trust.

---

### 4.4 Notes & reflection UI
When added:
- Treat notes as first-class content
- Use a calm, editorial style
- Timestamp reflections

This differentiates Tik-Track from dashboards.

---

## 5. Snapshot Forms

### 5.1 Reduce intimidation
Snapshot forms are dense by nature.

Improvements:
- Group fields visually:
  - Views & reach
  - Engagement
  - Retention
- Grey out irrelevant fields when values are null
- Inline explanations (“Used to calculate engagement”).

---

### 5.2 Delta previews
When a previous snapshot exists:
- Show delta inline as you type
- Use muted colours (don’t shout).

This reinforces learning.

---

## 6. Hashtags Pages

### 6.1 Hashtag list table
Upgrade from management to insight:

Add columns:
- Avg views
- Avg engagement
- Signal rate

Add subtle sparklines (optional later).

---

### 6.2 Hashtag detail page
Structure:
1. Tag identity
2. Aggregate metrics
3. Performance trend
4. Videos using this tag

Include guidance text:
> “This tag appears in your top-performing videos.”

---

### 6.3 Merge UX clarity
Improve merge interaction:
- Clear explanation before action
- Confirmation summary (“X videos will be updated”)
- Undo safety note (even if manual).

---

## 7. Empty States & Onboarding

### 7.1 Empty states (very important)
Never show a blank page.

Examples:
- No videos → explain snapshots & workflow
- No hashtags → explain automatic creation
- No snapshots → explain timing & purpose

Use calm copy, not marketing tone.

---

### 7.2 First-time user guidance
Add subtle, dismissible hints:
- “Snapshots capture performance at key moments”
- “Signals help spot trends early”

No modals unless absolutely necessary.

---

## 8. Notifications (Design Considerations)

### 8.1 Notification language
Notifications should:
- be calm
- be specific
- never feel urgent unless truly missed

Good:
> “6h snapshot window is open for *Video X*.”

Bad:
> “You forgot to record analytics!”

---

### 8.2 In-app notification centre
Before push:
- Surface reminders inside the dashboard
- Let users trust the system before granting permissions.

---

## 9. Accessibility & Polish

### 9.1 Accessibility checks
- Colour contrast for signal states
- Keyboard navigation for tables/forms
- Focus states visible but subtle

---

### 9.2 Micro-interactions
Add only where they reinforce meaning:
- Snapshot added → brief confirmation
- Signal change → subtle highlight
- Page transitions → no animation unless necessary

---

## 10. Design Debt to Avoid

- ❌ Dark patterns for notifications
- ❌ Over-charting
- ❌ Global benchmarks without context
- ❌ “Growth hacks” language
- ❌ Competing visual metaphors

---

## Final North Star

Tik-Track should feel like:

> *A quiet, intelligent notebook that helps you understand what’s actually working — and why.*

If a design choice doesn’t support **thinking**, don’t add it.

---

If you want next:
- Component-level redesign checklist  
- Copywriting tone guide  
- PWA-specific UX for notification opt-in  
- Design token / spacing system audit  

Just say which one.
