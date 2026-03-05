import { useState } from "react";

const posts = [
  {
    id: 1,
    number: "01",
    tag: "ARCHAEOLOGY",
    headline: "Before the Pyramid. Before the Wheel. Before Homo Sapiens.",
    subhead: "The oldest engineered structure in human history isn't in Egypt. It isn't in Mesopotamia. It's in Zambia.",
    body: `476,000 years ago — before our species even existed — a hominin at Kalambo Falls picked up two logs, notched them together, and built something.

Not a tool. A structure. Interlocking timber, deliberately shaped.

Archaeologists confirmed this in 2023. The discovery rewrote the timeline of human engineering by hundreds of thousands of years.

The builder was likely Homo heidelbergensis — a predecessor to both Homo sapiens and Neanderthals. They had no language as we know it. No agriculture. No civilization by any modern definition.

And yet: they built.

That site — Kalambo Falls, on Zambia's border with Tanzania — is a UNESCO World Heritage candidate. It is one of the most important archaeological locations on Earth.

Most Zambians have never heard of it.

Most of the world hasn't either.

That changes now.

#ZambiaUntold #Africa #Archaeology #HumanOrigins #Zambia`,
    hook: "Before the Pyramid. Before the Wheel. Before Homo Sapiens.",
    platform: "LinkedIn",
    charCount: 892,
    engagementAngle: "Claim-reversal hook — challenges a deeply held assumption in the first line",
    cta: "Share if you didn't know this. Most people don't.",
    color: "#8B4513",
    accent: "#D4A856"
  },
  {
    id: 2,
    number: "02",
    tag: "PALEOANTHROPOLOGY",
    headline: "The Face of Our Ancestor Was Found in Zambia. And Then Forgotten.",
    subhead: "In 1921, a miner in Kabwe discovered one of the most complete pre-human skulls ever found on Earth. Almost no one knows his name, or where the skull is now.",
    body: `In 1921, a Swiss miner named Tom Zwiglaar was digging in Broken Hill — now Kabwe, Zambia — when he uncovered a skull.

It was 299,000 years old.

It belonged to Homo heidelbergensis — a species that stood between Homo erectus and us. One of the most direct ancestors in our evolutionary chain.

The skull is among the most complete hominin fossils ever discovered, anywhere on Earth.

The British colonial government sent it to London. It's still there. At the Natural History Museum. Behind glass. In a country that had nothing to do with its creation.

Zambia has never had it back.

Here's what gets me: this skull — found in Zambian soil, by Zambian mining labor — represents one of the most significant moments in the story of what it means to be human.

And when you look at who gets to hold that story, who gets to curate it, who profits from it academically and institutionally —

— it's not Zambia.

Repatriation is a debate for another post. Today, I just want you to know: the face of our ancestor was found here. In the Copperbelt.

#ZambiaUntold #Zambia #Africa #HumanEvolution #Repatriation`,
    hook: "The Face of Our Ancestor Was Found in Zambia. And Then Forgotten.",
    platform: "LinkedIn",
    charCount: 1021,
    engagementAngle: "Injustice narrative — combines discovery with colonial extraction. Highly shareable.",
    cta: "Drop a 🔥 if you think this belongs in Zambia.",
    color: "#5C3317",
    accent: "#C97B3A"
  },
  {
    id: 3,
    number: "03",
    tag: "HUMAN CONSCIOUSNESS",
    headline: "The First Artist Lived in Zambia. 400,000 Years Ago.",
    subhead: "Before cave paintings in France. Before any art we typically call 'ancient.' A hominin in what is now Zambia picked up red ochre — and made meaning.",
    body: `At a site called Twin Rivers Kopje, near Lusaka, archaeologists found evidence of ochre — red pigment — being collected and processed.

400,000 years ago.

This is among the earliest evidence of symbolic thought in human evolutionary history. Not using a tool to eat. Not building shelter to survive. Collecting red pigment — for meaning. For identity. For expression.

The emergence of symbolic consciousness — the ability to represent the world beyond its literal surface — is considered one of the most significant cognitive leaps in our species' history. It's the leap that eventually led to language, religion, art, music, and everything we call civilization.

That leap may have taken its first steps in Zambia.

Think about that the next time someone asks whether Africa "has history."

Zambia doesn't just have history. Zambia may be where human consciousness began.

#ZambiaUntold #Zambia #Africa #Anthropology #HumanHistory`,
    hook: "The First Artist Lived in Zambia. 400,000 Years Ago.",
    platform: "LinkedIn",
    charCount: 873,
    engagementAngle: "Consciousness/identity angle — speaks directly to African intellectual dignity",
    cta: "Which of these 'Did You Know' facts surprised you most? Comment below.",
    color: "#6B3A2A",
    accent: "#E8962E"
  },
  {
    id: 4,
    number: "04",
    tag: "MEDIEVAL TRADE",
    headline: "While Europe Had the Dark Ages, Zambia Had a Global Trade City.",
    subhead: "Between the 14th and 17th centuries, a city on the Zambezi River traded gold, copper, and ivory with Arab, Swahili, and Portuguese merchants. Most history books have never mentioned it.",
    body: `Ing'ombe Ilede.

Say that name out loud. Remember it.

Between the 14th and 17th centuries — while much of Europe was rebuilding after the plague, while feudalism defined daily life, while the Renaissance was just beginning — there was a thriving commercial city on the banks of the Zambezi River in what is now Zambia.

Elite burials at Ing'ombe Ilede contained:
— Copper cross-ingots (Zambia's standardized currency)
— Gold
— Ivory
— Exotic glass beads from the Indian Ocean trade networks
— Cloth

This was not an isolated village. This was a node in a transcontinental supply chain that stretched from the Zambian interior to the Swahili coast, connecting Arab, Portuguese, and Asian merchants.

Zambia was not peripheral to global trade.

Zambia was in the center of it.

The reason you don't know this is not because it didn't happen. It's because the history that was taught — the history that was chosen — didn't include it.

That's what we're changing.

#ZambiaUntold #Zambia #AfricanHistory #MedievalTrade #Decolonize`,
    hook: "While Europe Had the Dark Ages, Zambia Had a Global Trade City.",
    platform: "LinkedIn",
    charCount: 1043,
    engagementAngle: "Comparative/reversal — directly challenges the 'Africa had no history' narrative",
    cta: "Tag someone who needs to know about Ing'ombe Ilede.",
    color: "#4A3728",
    accent: "#B87333"
  },
  {
    id: 5,
    number: "05",
    tag: "ECONOMIC HISTORY",
    headline: "Zambia Invented Copper Currency in the 12th Century. Then Was Told It Had No Economy.",
    subhead: "By the 12th century, Zambian communities were mining copper at Kansanshi and standardizing it as tradeable currency. This was monetary innovation — centuries before European contact.",
    body: `Kansanshi Mine. Northwestern Province, Zambia.

Today, it's one of the largest copper mines on the continent, operated by First Quantum Minerals.

But 900 years ago — in the 12th century — the people of that region were already mining copper. Not just extracting it. Standardizing it. Shaping it into cross-ingots of specific sizes and weights that could be traded across vast distances.

This is the definition of monetary innovation.

They invented an early form of currency. Indigenous. Sovereign. Self-determined.

Fast forward to the colonial era. The British South Africa Company arrives. The same copper — in the same ground — is suddenly "discovered." Zambian labor mines it. British companies profit from it. Zambian miners live in compounds, paid wages set by a foreign state.

The resource didn't change. The power structure did.

Here's what I want you to carry with you:

Zambia's relationship with copper is not a colonial story that started in the 1900s. It is a 1,200-year story of sophisticated resource management, trade infrastructure, and economic organization.

We didn't need to be taught how to use copper. We invented the use of it.

#ZambiaUntold #Zambia #Copper #AfricanEconomy #Decolonize`,
    hook: "Zambia Invented Copper Currency in the 12th Century. Then Was Told It Had No Economy.",
    platform: "LinkedIn",
    charCount: 1098,
    engagementAngle: "Economic sovereignty narrative — connects historical fact to present-day resource politics",
    cta: "Share this with anyone building in Zambia. Context is infrastructure.",
    color: "#3D2B1F",
    accent: "#B87333"
  },
  {
    id: 6,
    number: "06",
    tag: "LIBERATION",
    headline: "The Nonviolent Revolution That Freed a Nation — And the World Never Heard of It.",
    subhead: "In 1961, Zambia's independence movement launched a sophisticated civil disobedience campaign so effective it forced Britain to the negotiating table. It was called Cha-cha-cha. You've probably never heard of it.",
    body: `In 1961, Kenneth Kaunda and the United National Independence Party launched a campaign they called "Cha-cha-cha."

It wasn't named after a dance by accident. It was rhythm. It was coordination. It was a signal.

The campaign organized boycotts of colonial stores. Strikes in the mines. Roadblocks. Mass civil disobedience coordinated across a territory the size of Texas — without smartphones, without social media, without modern logistics.

Women were central to it. Julia Chikamoneka organized grassroots protests in the streets of Lusaka. Nakatindi Nganga became a political pioneer for women in government through her role in the movement.

The campaign worked. Britain came to the table. Three years later — on October 24, 1964 — Zambia was free.

Most people know Ghandi. Most people know King. Most people know Mandela.

Almost nobody outside Zambia knows about Cha-cha-cha — a campaign of nonviolent resistance that used rhythm, coordination, and collective sacrifice to end colonial rule in one of Africa's most resource-rich territories.

The playbook existed. The courage existed. The victory happened.

It just wasn't added to the global curriculum.

Until now.

#ZambiaUntold #Zambia #Independence #AfricanHistory #CivilRights`,
    hook: "The Nonviolent Revolution That Freed a Nation — And the World Never Heard of It.",
    platform: "LinkedIn",
    charCount: 1089,
    engagementAngle: "Hero narrative — positions Zambia alongside global civil rights canon",
    cta: "October 24 is Zambia's Independence Day. Mark it this year.",
    color: "#2D1F17",
    accent: "#C8851A"
  }
];

const ventureMeta = {
  name: "ZAMBIA UNTOLD",
  tagline: "The history you were never taught.",
  seriesName: "Did You Know: Zambia",
  cadence: "3x/week",
  primaryPlatform: "LinkedIn",
  secondaryPlatforms: ["Instagram (visual card)", "X/Twitter (thread format)"],
  totalSeries: "6-post pilot",
  launchAnchor: "Zambia Independence Day — October 24"
};

export default function ZambiaUntold() {
  const [activePost, setActivePost] = useState(0);
  const [view, setView] = useState("series"); // series | post | strategy

  const post = posts[activePost];

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0F0B08",
      minHeight: "100vh",
      color: "#F0E6D3",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #3A2E24",
        padding: "24px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, #1A1008 0%, #0F0B08 100%)"
      }}>
        <div>
          <div style={{
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "0.18em",
            color: "#B87333",
            fontFamily: "'Georgia', serif"
          }}>ZAMBIA UNTOLD</div>
          <div style={{
            fontSize: "11px",
            letterSpacing: "0.22em",
            color: "#7A6550",
            marginTop: "2px",
            textTransform: "uppercase"
          }}>The history you were never taught</div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {["series", "post", "strategy"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 18px",
              background: view === v ? "#B87333" : "transparent",
              border: `1px solid ${view === v ? "#B87333" : "#3A2E24"}`,
              color: view === v ? "#0F0B08" : "#7A6550",
              borderRadius: "2px",
              cursor: "pointer",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'Georgia', serif",
              fontWeight: view === v ? "700" : "400"
            }}>
              {v === "series" ? "All Posts" : v === "post" ? "Post View" : "Strategy"}
            </button>
          ))}
        </div>
      </div>

      {/* Series View */}
      {view === "series" && (
        <div style={{ padding: "40px" }}>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#B87333", textTransform: "uppercase", marginBottom: "8px" }}>
              Pilot Series · {ventureMeta.totalSeries}
            </div>
            <div style={{ fontSize: "28px", lineHeight: "1.2", color: "#F0E6D3", maxWidth: "600px" }}>
              Did You Know: Zambia
            </div>
            <div style={{ fontSize: "14px", color: "#7A6550", marginTop: "8px", lineHeight: "1.6" }}>
              Six posts. Six world-firsts. One nation that the curriculum left out.
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
            {posts.map((p, i) => (
              <div key={p.id} onClick={() => { setActivePost(i); setView("post"); }}
                style={{
                  background: "#161008",
                  border: "1px solid #2A1E14",
                  padding: "28px 24px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#B87333";
                  e.currentTarget.style.background = "#1C1208";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#2A1E14";
                  e.currentTarget.style.background = "#161008";
                }}
              >
                <div style={{ position: "absolute", top: "0", right: "0", width: "3px", height: "100%", background: p.accent, opacity: 0.6 }} />
                <div style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  color: "#2A1E14",
                  lineHeight: "1",
                  marginBottom: "12px",
                  letterSpacing: "-0.02em"
                }}>{p.number}</div>
                <div style={{
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: p.accent,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  fontFamily: "'Georgia', serif"
                }}>{p.tag}</div>
                <div style={{ fontSize: "15px", lineHeight: "1.35", color: "#D4C4A8", fontWeight: "600" }}>
                  {p.headline}
                </div>
                <div style={{ fontSize: "12px", color: "#5A4A38", marginTop: "16px", letterSpacing: "0.08em" }}>
                  {p.charCount} chars · {p.platform}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post View */}
      {view === "post" && (
        <div style={{ display: "flex", height: "calc(100vh - 77px)" }}>
          {/* Left nav */}
          <div style={{ width: "200px", borderRight: "1px solid #2A1E14", padding: "24px 0", flexShrink: 0 }}>
            {posts.map((p, i) => (
              <div key={p.id} onClick={() => setActivePost(i)}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  borderLeft: i === activePost ? `3px solid ${p.accent}` : "3px solid transparent",
                  background: i === activePost ? "#1C1208" : "transparent"
                }}>
                <div style={{ fontSize: "11px", color: i === activePost ? posts[i].accent : "#5A4A38", letterSpacing: "0.1em" }}>
                  Post {p.number}
                </div>
                <div style={{ fontSize: "12px", color: i === activePost ? "#D4C4A8" : "#4A3A28", marginTop: "4px", lineHeight: "1.3" }}>
                  {p.tag}
                </div>
              </div>
            ))}
          </div>

          {/* Post content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "40px 48px" }}>
            <div style={{ maxWidth: "680px" }}>

              {/* Platform badge */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px", alignItems: "center" }}>
                <div style={{
                  padding: "4px 12px",
                  background: "#0A66C2",
                  borderRadius: "2px",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  color: "white",
                  textTransform: "uppercase"
                }}>LinkedIn</div>
                <div style={{ fontSize: "11px", color: "#5A4A38" }}>{post.charCount} characters</div>
                <div style={{ fontSize: "11px", color: "#5A4A38" }}>· Post {post.number} of 6</div>
              </div>

              {/* Hook */}
              <div style={{
                fontSize: "24px",
                fontWeight: "700",
                lineHeight: "1.2",
                color: "#F0E6D3",
                marginBottom: "16px",
                borderLeft: `4px solid ${post.accent}`,
                paddingLeft: "20px"
              }}>
                {post.headline}
              </div>

              {/* Subhead */}
              <div style={{
                fontSize: "15px",
                lineHeight: "1.6",
                color: "#9A8470",
                marginBottom: "28px",
                fontStyle: "italic"
              }}>
                {post.subhead}
              </div>

              {/* Divider */}
              <div style={{ width: "40px", height: "2px", background: post.accent, marginBottom: "28px" }} />

              {/* Body copy */}
              <div style={{
                fontSize: "15px",
                lineHeight: "1.8",
                color: "#C4B49A",
                whiteSpace: "pre-wrap",
                background: "#161008",
                padding: "28px",
                border: "1px solid #2A1E14",
                borderRadius: "2px"
              }}>
                {post.body}
              </div>

              {/* CTA */}
              <div style={{
                marginTop: "20px",
                padding: "16px 20px",
                background: "#1A1208",
                border: `1px solid ${post.accent}`,
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: post.accent, textTransform: "uppercase", flexShrink: 0 }}>CTA</div>
                <div style={{ fontSize: "14px", color: "#D4C4A8" }}>{post.cta}</div>
              </div>

              {/* Strategy note */}
              <div style={{
                marginTop: "12px",
                padding: "16px 20px",
                background: "#111",
                border: "1px solid #2A1E14",
                borderRadius: "2px",
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "0.15em", color: "#5A4A38", textTransform: "uppercase", marginBottom: "6px" }}>Engagement Logic</div>
                <div style={{ fontSize: "13px", color: "#7A6550", lineHeight: "1.6" }}>{post.engagementAngle}</div>
              </div>

              {/* Cross-platform note */}
              <div style={{ marginTop: "28px", borderTop: "1px solid #2A1E14", paddingTop: "24px" }}>
                <div style={{ fontSize: "11px", letterSpacing: "0.15em", color: "#5A4A38", textTransform: "uppercase", marginBottom: "12px" }}>Platform Adaptation</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { platform: "Instagram", note: "Pull the hook line as overlay text on an ochre/copper visual. Story format with swipe-through for the key facts." },
                    { platform: "X / Twitter", note: "Thread format: hook as first tweet, each fact paragraph as a separate tweet, end with CTA + hashtags." }
                  ].map(({ platform, note }) => (
                    <div key={platform} style={{ padding: "14px", background: "#161008", border: "1px solid #2A1E14", borderRadius: "2px" }}>
                      <div style={{ fontSize: "11px", color: post.accent, letterSpacing: "0.1em", marginBottom: "6px" }}>{platform}</div>
                      <div style={{ fontSize: "12px", color: "#6A5A44", lineHeight: "1.5" }}>{note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strategy View */}
      {view === "strategy" && (
        <div style={{ padding: "40px", maxWidth: "860px" }}>
          <div style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#B87333", textTransform: "uppercase", marginBottom: "8px" }}>
            Standalone Venture · Rail 1 Strategy Brief
          </div>
          <div style={{ fontSize: "26px", lineHeight: "1.2", color: "#F0E6D3", marginBottom: "32px" }}>
            ZAMBIA UNTOLD — Series Strategy
          </div>

          {[
            {
              label: "VENTURE IDENTITY",
              items: [
                ["Name", "ZAMBIA UNTOLD"],
                ["Tagline", '"The history you were never taught"'],
                ["Pilot Series", "Did You Know: Zambia — 6-post pilot"],
                ["Primary Platform", "LinkedIn (diaspora, DFI, institutional audiences)"],
                ["Secondary", "Instagram (visual) · X/Twitter (thread format)"],
                ["Cadence", "3x per week → 2-week pilot completion"],
                ["Launch Anchor", "Zambia Independence Day — October 24, 2026"]
              ]
            },
            {
              label: "THE SIX WORLD-FIRSTS",
              items: [
                ["Post 01", "Kalambo Falls — 476,000-year-old wooden structure (oldest in history)"],
                ["Post 02", "Kabwe Skull — Homo heidelbergensis, 299,000 years old, in London"],
                ["Post 03", "Twin Rivers Ochre — earliest symbolic thought, 400,000 years ago"],
                ["Post 04", "Ing'ombe Ilede — medieval Indian Ocean trade city on the Zambezi"],
                ["Post 05", "Kansanshi Copper Currency — 12th century monetary innovation"],
                ["Post 06", "Cha-cha-cha — nonviolent revolution that freed Zambia, unknown globally"]
              ]
            },
            {
              label: "AUDIENCE SEGMENTATION",
              items: [
                ["Primary", "Zambian diaspora (UK, US, Canada) — identity resonance, shareability"],
                ["Secondary", "African policy/finance professionals — intellectual credibility"],
                ["Tertiary", "Global history/archaeology enthusiasts — organic discovery"],
                ["Institutional", "DFIs, embassies, universities — soft power + curriculum interest"]
              ]
            },
            {
              label: "RAILS 2 & 3 — SEQUENCING",
              items: [
                ["Rail 2 trigger", "After 3 posts — if engagement validates, commission the interactive timeline app"],
                ["Rail 2 format", '"The Zambia You Weren\'t Taught" — web-based comparative history timeline'],
                ["Rail 2 milestone", "Live by Zambia Independence Day (Oct 24) as public launch"],
                ["Rail 3 trigger", "After institutional interest surfaces — pitch Smart Zambia Institute + Northrise"],
                ["Rail 3 frame", "Zambia's history, like Zambia's data, should not live on foreign servers"],
                ["Rail 3 asset", "CopperCloud as the infrastructure layer for sovereign cultural heritage"]
              ]
            },
            {
              label: "COPPERCLOUD NARRATIVE BRIDGE",
              items: [
                ["The arc", "476,000 years ago: Homo heidelbergensis built the first structure in Zambian soil"],
                ["", "2025: CopperCloud is building the next generation of Zambian infrastructure"],
                ["Brand line", '"Ancient builders. Modern builders. Same soil."'],
                ["Usage", "Author bio, about page, pitch decks — not in posts (keep series standalone)"],
                ["Strategic value", "Every ZAMBIA UNTOLD post builds Mabs' personal brand as a sovereignty thinker"]
              ]
            }
          ].map(section => (
            <div key={section.label} style={{ marginBottom: "28px" }}>
              <div style={{
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "#B87333",
                textTransform: "uppercase",
                marginBottom: "12px",
                paddingBottom: "8px",
                borderBottom: "1px solid #2A1E14"
              }}>{section.label}</div>
              {section.items.map(([k, v], i) => (
                <div key={i} style={{ display: "flex", gap: "20px", marginBottom: "8px" }}>
                  <div style={{ fontSize: "12px", color: "#5A4A38", width: "140px", flexShrink: 0, lineHeight: "1.5" }}>{k}</div>
                  <div style={{ fontSize: "13px", color: "#C4B49A", lineHeight: "1.5" }}>{v}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
