# Tik-Track SaaS Roadmap — Usefulness First

This roadmap prioritises **perceived value per unit of effort**.
No bloat. No automation theatre. Insight over data volume.

---

## Phase 1 — Make the dashboard tell a story (highest ROI)

### 1. Snapshot deltas everywhere
**Problem:** Raw numbers feel dead without movement.  
**Solution:** Always show change vs previous snapshot.

- Views: `+123 (+18%)`
- Engagement: `↓ 0.7%`
- Completion: `↑ 6.2%`

> This turns logging into analytics.

---

### 2. “What should I do next?” panel
Add a small guidance box to the dashboard:

- “Add 6h snapshot for *Video X*”
- “You missed the 3h window for *Video Y*”
- “Video Z has a positive signal — consider follow-up content”

Powered entirely by existing snapshot + signal logic.

---

### 3. Performance bands (context without benchmarks)
Replace raw percentages with qualitative bands:

- Completion: **Low / Normal / Strong**
- Engagement: **Weak / Healthy / Excellent**

Bands are **relative to the creator’s own history**, not global TikTok stats.

---

## Phase 2 — Pattern recognition (where insight appears)

### 4. Hashtag effectiveness
Surface hashtag performance across all published videos:

- Avg views per hashtag
- Avg engagement per hashtag
- Signal rate per hashtag

Example insight:
> “Videos using **#devlife** perform 1.8× better for you.”

---

### 5. Video archetypes (manual, intentional)
Allow videos to declare a simple type:

- Talking head
- Tip
- Story
- Opinion
- Demo

Enable insights like:
- “Opinions outperform tips”
- “Talking head + <15s works best”

Manual tagging > unreliable automation.

---

### 6. Early-signal detector
Lean hard into early feedback.

Explicit labels:
- 🚀 Early breakout
- ⚠️ Underperforming
- 😐 Normal decay

Creators value *early clarity* more than precision.

---

## Phase 3 — Reflection & learning (stickiness)

### 7. Post-mortem mode
After 7 or 14 days, prompt reflection:

> “Why do you think this video performed this way?”

Store:
- Creator notes
- Final metrics

Over time this becomes a **personal content playbook**.

---

### 8. Weekly summary
Once per week (email or in-app):

- Best performing video
- Worst performing video
- One clear insight (e.g. “Completion rate trending up”)

Lightweight, high retention.

(in-app only for now, dont have mail server)

---

## Phase 4 — Monetisation-ready polish

### 9. Honest comparisons
Compare videos only at equivalent snapshot windows:

- 24h vs 24h
- 7d vs 7d

Avoid misleading lifetime graphs.

---

### 10. Exportable insights (not raw CSV)
Provide shareable summaries:

- Clean read-only links
- PDF performance snapshots

Designed for:
- coaches
- consultants
- serious creators

---

## What not to build (yet)

- ❌ TikTok API ingestion
- ❌ Competitor scraping
- ❌ AI predictions
- ❌ Growth-hack tooling
- ❌ Generic dashboards

These dilute the product before insight is proven.

---

## Success criteria

Tik-Track is “useful enough” once it can reliably answer **two or more**:

- “Did this video perform better than my normal?”
- “When should I check again?”
- “What pattern should I repeat?”
- “What should I stop doing?”

At that point, charging is justified.

---
