# Living Archive — Community Layer Spec

**Document Status:** Design Spec / Implementation Brief  
**Version:** 1.0  
**Date:** March 2026  
**Reference:** `MUSEUM_ENHANCEMENT_PLAN.md` Phase C, `Tech-And-Experience-Recommendation.md` §5, `Community-Context.md`, `ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md`, `Mineral_Context.md`, `Foundation.md`

---

## Executive Summary

The Living Archive is a **moderated, coordinate-pinned community contribution layer** inside ZAMBIA UNTOLD. It is not an open wiki. It is a **curated sovereign archive** where every contribution is reviewed, epoch-tagged, and source-typed before it appears on the globe. The design goal: community ownership and CopperCloud name recognition **without compromising the museum's curatorial authority or aesthetic**.

**Brand name:** **Isibalo** — the community record that lives inside ZAMBIA UNTOLD. (Bemba/Nyanja: record, count.) Externally: "The Living Archive."

**Strategic rationale:** See `docs/Community-Context.md` Part 1. Community contributions can also feed the **Inganji** (folk tales) layer — see Community-Context Part 2.

---

## Part 1 — Design Principles

### 1.1 Hierarchy: Core vs. Community

| Layer | Content | Authority | Visual Treatment |
|-------|---------|-----------|------------------|
| **Core markers** | 6 curated exhibits (Kalambo, Kabwe, Twin Rivers, Ing'ombe Ilede, Kansanshi, Lusaka) | Built-in, unchanging | Full copper glow, primary marker size, full narrative panel |
| **Community pins** | User-contributed memories, photos, oral traditions | Moderated, approved | Softer amber glow, smaller, distinct badge |

**Rule:** Core markers always read as primary. Community pins always read as secondary but valued. They do not compete for attention; they complement.

### 1.2 Museum Feel Preservation

- **Typography:** Community contributions use the same font stacks (display, body, citation) as core exhibits. No "social media" or casual UI.
- **Color:** Community pins use amber (`#cc7722` / `--ochre-warm`) rather than copper (`#b87333`). Softer, warmer, distinct from core. No bright blues or greens.
- **Layout:** Community narrative panel uses the same structure as core exhibits (title → epoch → body → citation block) but with a **COMMUNITY CONTRIBUTION** badge and attribution notice.
- **Layers panel:** Community layer is a toggle: `[COMMUNITY ARCHIVE]` on/off. **Off by default** for first-time visitors. Discoverable, not intrusive.

### 1.3 What This Is Not

- **Not Wikipedia:** No open edits. No edit wars. Every contribution is reviewed.
- **Not social media:** No likes, comments, or viral mechanics. No algorithmic feed.
- **Not a crowdsourced map:** Contributions are curated by type (memory, oral tradition, photo, academic) and held to different standards.

---

## Part 2 — Submission Interface

### 2.1 Entry Point

- **"Add Your Memory"** button (or "Contribute to Isibalo") — anchored to the Layers panel or as a floating action when the community layer is enabled.
- **Coordinate selection:** Click on globe to pin, or type a place name. Coordinate auto-filled from map click.

### 2.2 Form Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **Title** | Text (max 80 chars) | Yes | Short, descriptive |
| **When** | Epoch selector | Yes | Drag scrubber to approximate date, or select zone: Deep Substrate / Migration / Copper Empire / Kingdom Age / Colonial / Sovereign |
| **Where** | Lat/lng (auto-filled) or place name | Yes | Must be Zambia or Zambia-relevant |
| **Type** | Select | Yes | Memory / Photograph / Oral Tradition / Family History / Academic / Other |
| **Source Region** | Select | Yes | Zambia / Southern Africa / Pan-African / Global (from existing `NarrativeSource.region`) |
| **Content** | Textarea (max 2,000 chars) | Yes | Plain text or structured. No HTML. |
| **Attachment** | Image upload (optional, 5MB max) | No | JPG, PNG. Stored for moderation display. |
| **Contributor** | Name (can be "Anonymous") + optional affiliation | Yes | Name required for attribution; "Anonymous" allowed |
| **Consent** | Checkbox | Yes | "I confirm this submission is my own knowledge or family oral tradition and I consent to it being displayed on ZAMBIA UNTOLD under Creative Commons Attribution" |

### 2.3 UX Constraints

- Form opens in a modal or slide-over panel — same visual language as NarrativePanel.
- Submission triggers a confirmation: "Thank you. Your contribution will be reviewed within 7 days."
- No inline editing after submit. Revisions only via moderation feedback.

---

## Part 3 — Moderation Philosophy

### 3.1 Inclusion Standard

| Submission Type | Standard |
|-----------------|----------|
| **Memory / Family History / Oral Tradition** | Sincere, coordinate-pinnable, not demonstrably false. No academic citation required. |
| **Photograph** | Authentic, captioned, contributor has rights. |
| **Academic** | Requires at least one supporting source (citation). |

**Principle:** Personal knowledge is valid without citations. Historical claims require corroboration. This distinction separates ZAMBIA UNTOLD from Wikipedia and from random social media.

### 3.2 Review Criteria

1. Is it coordinate-pinnable to Zambia or a Zambia-relevant location?
2. Is it epoch-assignable?
3. Does it add something not already in the museum?
4. Is there any reason to believe it's fabricated or harmful?

### 3.3 Moderation Actions

| Action | Outcome |
|--------|---------|
| **Approve** | Contribution appears on globe as community pin. Contributor notified. |
| **Request revision** | Contributor gets specific feedback. Resubmission possible. |
| **Decline** | Contributor gets respectful explanation. No public record. |

**Target:** 7-day review window. At launch volume: ~30 minutes weekly moderation.

---

## Part 4 — Globe Display Layer

### 4.1 Visual Differentiation

| Property | Core Marker | Community Pin |
|----------|-------------|---------------|
| **Size** | 1.0 (base) | 0.6–0.7 |
| **Color** | Marker-specific (e.g. copper, gold) | Amber (`--ochre-warm`) |
| **Glow** | Full copper glow | Softer, lower opacity |
| **Pulse** | Organic heartbeat when active | Subtle, slower pulse |

### 4.2 Interaction

- **Hover:** Tooltip shows contributor name, submission type, one-line preview.
- **Click:** Opens NarrativePanel-style panel with:
  - **COMMUNITY CONTRIBUTION** badge (top)
  - Title, epoch, zone
  - Body
  - Attribution: "Contributed by [Name] · [Type] · [Date approved]"
  - Consent notice: "Displayed under Creative Commons Attribution"
  - Optional: Evidence tab (if source provided)

### 4.3 Layer Toggle

- **Layers panel:** `[Community Archive]` checkbox. Off by default.
- **On:** Community pins render. "Add Your Memory" CTA visible.
- **Off:** No community pins. Museum feels like curated-only experience.

---

## Part 5 — Data Model

### 5.1 Contribution Schema (extends NarrativeSource)

```ts
type ContributionType =
  | "memory"
  | "photograph"
  | "oral_tradition"
  | "family_history"
  | "academic"
  | "other";

type ContributionStatus = "pending" | "approved" | "revision_requested" | "declined";

type ConfidenceLevel = "oral_history" | "family_memory" | "local_tradition" | "uncertain";

type CommunityContribution = {
  id: string;
  title: string;
  body: string;
  epoch: number;
  zone: DeepTimeZone;
  lat: number;
  lng: number;
  type: ContributionType;
  region: NarrativeSource["region"];
  confidenceLevel?: ConfidenceLevel;
  contributorName: string;
  contributorAffiliation?: string;
  isAnonymous: boolean;
  attachmentUrl?: string;
  attachmentCaption?: string;
  status: ContributionStatus;
  submittedAt: string; // ISO
  reviewedAt?: string;
  approvedBy?: string;
};
```

### 5.2 Integration with Existing Narrative

- Community narrative panel reuses `NarrativePanel` structure with a `mode: "community"` prop.
- `NarrativeBlock` type supports community content (paragraph, image, quote).
- Evidence tab: if `sources` provided, render; otherwise omit or show "Community contribution — no external sources."

---

## Part 6 — Contribution Feed

A simple sidebar or dedicated page (`/archive` or `/isibalo`) showing:

- **Recent approved contributions** in reverse chronological order
- **Card layout:** Title, contributor, type, epoch, one-line preview
- **Click:** Navigates to globe at that coordinate with panel open

**Purpose:** Shows prospective contributors the system is alive. Creates discovery for content geographically distant from current view.

**Placement:** Link in header or footer: "Community Archive" or "Isibalo".

---

## Part 7 — CopperCloud Community Building

### 7.1 Strategic Value

- Every contributor implicitly endorses the platform's premise: Zambia's history belongs to Zambia.
- When CopperCloud hosts ZAMBIA UNTOLD on sovereign infrastructure, the community that built the Living Archive becomes the community that can say: *we contributed to this, and it lives here*.
- Not a marketing funnel — genuine community ownership.

### 7.2 Branding

- **Isibalo** — internal/product name for the contribution system.
- **Living Archive** — external/institutional framing.
- Attribution: "ZAMBIA UNTOLD · Powered by CopperCloud" (or similar) in footer or about. Community contributions do not require CopperCloud branding unless contributor opts in.

---

## Part 8 — Technical Requirements

### 8.1 Backend

| Component | Option | Notes |
|-----------|--------|-------|
| **Database** | Supabase / Firebase / PlanetScale | Supabase fastest if already in stack (iDream CRM) |
| **Storage** | Supabase Storage / S3 | For image attachments |
| **Auth** | Optional for contributors | Submission can be anonymous; moderation needs auth |
| **Serverless** | Vercel Edge / Supabase Edge | Submit form, moderation queue API |

### 8.2 Frontend

- New component: `CommunityPin.tsx` (distinct from `GlobeMarker.tsx`)
- New component: `ContributionForm.tsx` (modal or slide-over)
- NarrativePanel: add `mode: "community"` branch
- LayersPanel: add `communityArchive: boolean` to `LayerVisibility`

### 8.3 Data Flow

1. User submits → API → DB (status: pending)
2. Moderator reviews → Approve/Revise/Decline → DB update
3. Approved contributions fetched by Globe → rendered as CommunityPins
4. Contribution feed fetches approved contributions, ordered by `reviewedAt` desc

---

## Part 9 — Launch Checklist

### 9.1 Pre-Launch

- [ ] **Seed contributions:** 5–10 contributions before opening publicly. Family stories, oral traditions, regional knowledge from trusted contacts.
- [ ] **Moderation capacity:** Decide who reviews (you, Joy, designated moderator). Set expectation: "Reviewed within 7 days."
- [ ] **Backend schema:** Designed and deployed. Supabase table + storage bucket.

### 9.2 Soft Launch

- Open contribution form to trusted inner circle: diaspora contacts, Zambian Embassy staff, Mufulira team.
- Early contributions seed the archive authentically.
- Public launch only after 5+ visible pins.

### 9.3 Success Criteria

- [ ] First community pin visible on globe
- [ ] Contribution form functional and discoverable
- [ ] Moderation queue operational
- [ ] Community layer toggle works (off by default)
- [ ] No regression: core museum experience unchanged

---

## Part 10 — Phase Placement

| Phase | Order | Living Archive Dependency |
|-------|-------|---------------------------|
| **Phase A** | 1 | None. Museum identity complete first. |
| **Phase D** | 2 | None. Split-screen ships before contributions. |
| **Phase C** | 3 | Living Archive = Phase C. |

**Recommendation:** Design backend schema now, in parallel with Phase A. Build the schema in one session. Soft-launch to inner circle before public launch.

---

## Appendix A — Visual Spec Summary

| Element | Spec |
|---------|------|
| Community pin color | `#cc7722` (ochre) |
| Community pin size | 60–70% of core marker |
| Community pin glow | `rgba(204, 119, 34, 0.4)` |
| Badge text | "COMMUNITY CONTRIBUTION" — 10px uppercase, tracking 0.18em |
| Attribution text | "Contributed by [Name] · [Type] · [Date]" — 11px, muted |

---

## Appendix B — Copy for Submission Form

**Title:** Add Your Memory to ZAMBIA UNTOLD

**Intro:** "Your family stories, photographs, and oral traditions belong in the Living Archive. Every contribution is reviewed by our team before it appears on the globe. Reviewed within 7 days."

**Consent:** "I confirm this submission is my own knowledge or family oral tradition and I consent to it being displayed on ZAMBIA UNTOLD under Creative Commons Attribution."

**Submit button:** "Submit for Review"

**Success message:** "Thank you. Your contribution will be reviewed within 7 days. You'll receive an email when it's approved."

---

## Appendix C — Supabase Schema (Content Architecture)

From `docs/ZAMBIA UNTOLD — Content Architecture  Community Layer, Folklore (Inganji), and Living Archive (Isibalo).md` Part 2. Use when implementing Phase C backend.

```sql
-- Contributions table
CREATE TABLE contributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  epoch_start INTEGER,
  epoch_end INTEGER,
  epoch_zone TEXT CHECK (epoch_zone IN (
    'DEEP EARTH', 'ANCIENT LIFE', 'HOMINID RISE', 'ZAMBIA DEEP',
    'COPPER EMPIRE', 'KINGDOM AGE', 'COLONIAL WOUND', 'UNFINISHED SOVEREIGN'
  )),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  place_name TEXT,
  contribution_type TEXT CHECK (contribution_type IN (
    'memory', 'photograph', 'oral_tradition',
    'family_history', 'academic', 'folk_tale', 'other'
  )),
  source_region TEXT CHECK (source_region IN (
    'zambia', 'southern_africa', 'pan_african', 'global'
  )),
  contributor_name TEXT,
  contributor_affiliation TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  attachment_url TEXT,
  confidence_level TEXT CHECK (confidence_level IN (
    'oral_history', 'family_memory', 'local_tradition', 'uncertain'
  )),
  consent_given BOOLEAN NOT NULL DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'revision_requested', 'declined'
  )),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Moderators table
CREATE TABLE moderators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  email TEXT UNIQUE NOT NULL,
  region_focus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Public reads approved only
CREATE POLICY "Read approved" ON contributions
  FOR SELECT USING (
    status = 'approved' OR
    auth.uid() IN (SELECT user_id FROM moderators)
  );

-- RLS: Authenticated users submit
CREATE POLICY "Submit contribution" ON contributions
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND consent_given = true
  );

-- RLS: Moderators update
CREATE POLICY "Moderate" ON contributions
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM moderators)
  );
```

### Seeding Strategy (Content Architecture)

Before public launch, seed 8 contributions from inner circle:

1. Lamba oral tradition about copper spirits — Copperbelt
2. Family memory from 1964 independence — Lusaka
3. Tonga elder's Nyami Nyami variant — Siavonga
4. Kuomboka attendance memory — Mongu
5. Bemba Chitimukulu clan story — Kasama
6. Copperbelt mine compound photograph — Kitwe
7. Chewa Gule Wamkulu witnessing — Eastern Province
8. Diaspora memory of learning Zambian history abroad — Global

### confidence_level (epistemic clarity)

Contributors or moderators set `confidence_level` so the system can answer "Is this verified history?" honestly. Display as "Community memory" or "Oral tradition" — not as academic fact.

| Value | Display | Use when |
|-------|---------|----------|
| `oral_history` | Oral tradition | Passed down verbally, no written source |
| `family_memory` | Family memory | Personal or family recollection |
| `local_tradition` | Local tradition | Widely known in a region/community |
| `uncertain` | Unverified | Source unclear or disputed |

---

*Document prepared for implementation. Living Archive = Phase C. Isibalo = community record brand.*
