ZAMBIA UNTOLD
Technical & Experience Recommendations
Phase A–C Readiness Strategy

Document Purpose

This document consolidates technical, content, and experience recommendations for the ZAMBIA UNTOLD Atlas Museum based on the current repository state and development trajectory.

The goal is to preserve the strengths of the current architecture while preparing the platform for the next major capability layers:

Phase A completion (museum core)

Phase B (audio immersion)

Phase C (Living Archive / Isibalo)

Phase C2 (Folk Tales / Inganji)

The guiding principle is disciplined growth without architectural overreach.

1. Architectural Strengths (Preserve These)

The current system demonstrates several decisions that are strategically correct for this stage and should be preserved.

1.1 Custom Globe Architecture (No Cesium)

Current Approach

React Three Fiber + Three.js custom sphere.

Why this is correct

Cesium introduces:

heavy tile streaming

dependency on centralized services

large payload sizes

unnecessary complexity for curated museum content

Your custom globe provides:

full control of assets

small bundle size

deterministic rendering

offline caching compatibility

Recommendation

Remain on Three.js + R3F WebGL renderer.

Do not migrate to WebGPU at this stage.

WebGPU only becomes relevant if the platform later renders:

massive point clouds

satellite datasets

real-time geospatial simulations.

1.2 Offline-First Philosophy

Your system already demonstrates a strong local-first architecture.

Evidence:

system fonts instead of remote fonts

PWA service worker

static JSON content

local asset textures

minimal runtime APIs

This produces several benefits:

• resilience in unstable connectivity
• instant reload performance
• demonstration reliability
• sovereignty alignment

This design is especially valuable when demonstrating the platform in Zambian institutional environments where connectivity may fluctuate.

Recommendation

Elevate this philosophy in documentation:

Design Principles

• Offline-first architecture
• Minimal external dependencies
• Sovereign data ownership
• Evidence-based historical record
• Community knowledge integration

These are not technical quirks — they are strategic differentiators.

1.3 Layer-Based Scene Architecture

The current component structure is highly extensible.

Example modules:

ZambeziLayer
KatangaFormationLayer
ProvinceHighlight
LusakaParticleSwarm

This establishes a visual grammar of historical layers.

Future layers can plug into this pattern:

• migration paths
• trade routes
• rainfall cycles
• cultural regions
• archaeological sites
• folklore markers

Recommendation

Formalize the concept internally:

Scene Layer Contract

Every layer must define:

• activation epoch
• geographic scope
• visual primitive
• narrative relationship

This prevents the globe from becoming chaotic as content grows.

1.4 Content-Driven Architecture

The platform uses static structured content rather than runtime APIs.

markers.ts
narratives.ts
contextualEpochCards.ts

Advantages:

• deterministic builds
• easy archiving
• high performance
• low operational cost

This pattern is ideal for digital museum systems, which prioritize permanence over dynamic APIs.

Recommendation

Preserve this model through Phase A and Phase B.

Phase C (community archive) can introduce a backend without replacing the static core.

2. Recommended Documentation Improvements

The README is strong but can be improved for developer clarity.

2.1 Add Quick Start

Before the Tech Stack section.

Example:

Quick Start

Requirements
Node.js 18+

Install
npm install

Run Development Server
npm run dev

Build Production
npm run build

This reduces contributor friction.

2.2 Clarify Deployment Model

The README currently mentions static export but also includes npm run start.

Clarify which deployment model is used:

Option A – Static export (recommended for museums)

output: export

Option B – Next.js server deployment

Choose one and document it clearly.

2.3 Show Core Data Schemas

Add examples of the primary data structures.

Example:

Marker {
id
lat
lng
epoch
narrativeId
}

Narrative {
id
title
body
sources[]
}

NarrativeSource {
type
citation
url
}

This signals academic rigor and helps collaborators add content.

2.4 Add Contributor Guide

Explain how to add a new exhibit:

Add marker in data/markers.ts

Add narrative in data/narratives.ts

Add evidence sources

Optional visual layer

3. Visual Experience Enhancements

The current UI is elegant and museum-like. The following enhancements can strengthen clarity and immersion.

3.1 Improve Narrative Panel Readability

Current design is elegant but slightly low contrast.

Adjust:

• slightly larger body text
• increased line height
• subtle contrast increase

Goal: maintain the museum aesthetic while improving readability.

3.2 Transform “Layers” Into Curatorial Controls

The current dropdown is functional but underutilized.

Consider framing layers as curatorial modes.

Examples:

Exhibit Layers

Core Exhibit
Community Archive
Folk Tales
Evidence Mode

This reinforces the museum metaphor.

3.3 Introduce Marker Taxonomy

Different knowledge layers should use distinct marker styles.

Example:

Core Exhibit
• copper glow markers

Community Archive
• amber glow markers

Folklore
• spiral glyph markers

Geological Substrate
• stone/earth markers

This visual language prevents confusion as content grows.

4. Content Expansion Strategy

The museum will succeed primarily through depth of content.

The next priority should be expanding exhibits.

4.1 Grow From 6 Markers to ~25

Recommended early additions:

Geology
• Broken Hill deposit
• Kansanshi mine

Trade Routes
• Swahili coast trade links
• Copperbelt rail corridors

Kingdoms
• Luba connections
• Lozi kingdom expansion

Colonial Era
• Kariba Dam construction
• Northern Rhodesia administration

Liberation
• Kaunda independence movement

4.2 Strengthen Evidence Layer

Each narrative should ideally include:

• academic citation
• archival source
• optional oral tradition reference

This will help institutional credibility.

5. Phase C – Living Archive (Isibalo)

Phase C introduces community contributions.

Key requirements:

Submission Form

Fields:

• Title
• Location
• Epoch
• Contribution type
• Narrative text
• Photo attachment
• Contributor name

Moderation Queue

Review criteria:

• Zambia relevance
• coordinate accuracy
• sincerity / authenticity
• absence of harmful content

Display Layer

Community contributions appear as a distinct marker type.

This ensures community knowledge enriches the museum without diluting curatorial authority.

6. Phase C2 – Folk Tales Layer (Inganji)

This layer introduces mythology and oral traditions.

These stories connect the museum to identity and cultural memory.

Story Formats
Illustrated Story Cards

4–6 panels per story.

Uses generative art + curated text.

Globe Animation (Flagship Stories)

Examples:

Nyami Nyami
Kuomboka ceremony

Short 60–90 second sequences tied to coordinates.

Ambient Narrative Mode

For contemplative stories:

text progression

atmospheric sound

dark background

Cultural Review Requirement

All folklore content must undergo cultural review before publication.

AI-generated stories must never bypass this step.

7. What Should NOT Be Added Yet

To maintain development discipline, avoid introducing these prematurely:

WebGPU renderer
CRDT synchronization
Wasm SQLite databases
complex agent pipelines

These technologies become relevant only if scale demands them.

The current architecture is already well suited for Phase A–C.

8. Strategic Positioning

The platform now represents four knowledge layers:

Layer Purpose
Historical Record curated narratives
Community Archive living memories
Folk Tales oral traditions
Geological Substrate deep time context

Together they form a digital atlas of Zambian identity.

Not a tourism site.
Not a government portal.
Not an academic database.

A sovereign digital museum.

Final Recommendation

The current build is beautifully constrained.

Do not over-engineer it.

Focus on:

Completing the museum experience

Expanding curated content

Launching the Living Archive

Introducing folklore storytelling

The architecture is already strong enough to support all of these.

What will determine the platform’s impact now is content richness and narrative depth, not new infrastructure.
