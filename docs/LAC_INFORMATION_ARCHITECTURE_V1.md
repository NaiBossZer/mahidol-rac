# LAC Learning Center — Information Architecture v1

## Purpose

Phase 1 establishes the production information architecture before changing the visual navigation or rebuilding pages. The existing production features remain the implementation base; Figma Make remains a visual and content-structure reference.

## Experience model

```text
Discover → Explore → Understand → Connect → Apply → Sustainability
```

The homepage is the exhibition entrance and story layer. Detailed knowledge belongs to dedicated learning pages. Interactive games belong to a Learning Games area. Dashboard, Survey, Authentication, and Activity Administration remain utility/system areas.

## Primary information architecture

```text
LAC LEARNING CENTER
├── หน้าแรก
├── 01 ความรู้เรื่องครั่ง
│   ├── ครั่งคืออะไร
│   ├── ต้นกำเนิดครั่ง
│   ├── วงจรชีวิตครั่ง
│   ├── ระบบนิเวศ & ต้นพิงอาศัย
│   ├── ต้นไม้ที่ใช้เลี้ยงครั่ง
│   ├── ศัตรูครั่ง & การป้องกัน
│   └── การเพาะเลี้ยงครั่ง
├── 02 ครั่งในลำปาง
│   ├── ครั่งในจังหวัดลำปาง
│   ├── ฤดูกาล & การดูแล
│   └── ทางเลือกของเกษตรกร
├── 03 ครั่ง → ผลิตภัณฑ์
│   ├── จากครั่งดิบสู่ผลิตภัณฑ์
│   ├── ครั่งอยู่รอบตัวเรา
│   └── Product Innovation
├── 04 สิ่งแวดล้อม
│   ├── Carbon Footprint of Lac
│   ├── CFP vs CFO
│   ├── Life Cycle of Lac Product
│   ├── CFP Assessment
│   └── CFP → Net Zero
├── 05 ชุมชน & เครือข่าย
│   ├── ครั่งกับชุมชน
│   ├── Circular Economy
│   └── Learning Network
└── Learning Games
    ├── Sobprab Lac Lab
    └── Lac Bingo
```

## Utility / system routes

```text
/dashboard       Executive / operational dashboard
/survey          Public feedback / questionnaire
/login           Authentication entry
/admin/activity  Activity administration
```

These are intentionally outside the LAC knowledge hierarchy.

## Route policy

1. Use semantic, stable English slugs for URLs.
2. Keep Thai labels in the UI/navigation.
3. Do not create a route only to duplicate a homepage section; extract a section when it needs deep learning, sharing, or direct navigation.
4. Existing interactive implementations are preserved and moved conceptually before being rebuilt.
5. Do not introduce Supabase/Auth/RLS/CMS work in Phase 1.
6. Do not redesign the Mahidol institutional shell in Phase 1.

## Existing → target mapping

| Existing feature | Target role | Phase 1 decision |
|---|---|---|
| HomePage | Exhibition entrance / story | Keep as shell; reduce content responsibility later |
| HeroSection | Discovery | Keep |
| MediaSection | Physical Room Experience | Keep |
| LearningJourney | Learning path | Keep + connect to pages |
| LacLifeCycle | Knowledge: Life Cycle | Keep + extract into page |
| LampangLacMap | Lampang context | Keep + expand |
| LacProductJourney | Product transformation | Keep + extract into page |
| LacKnowledgeCards / Accordion | Knowledge index / deep content | Reposition into Knowledge architecture |
| ActivitySection | Community / activity | Keep; separate from knowledge hierarchy |
| SobprabLacLabGame | Learning Games | Move from Home |
| LacBingoGame | Learning Games | Move from Home |
| Dashboard | Utility | Keep |
| Survey | Utility | Keep |
| Auth / Login | Infrastructure | Defer |

## Phase 1 definition of done

- Information hierarchy is explicit.
- Every Content Master topic has a target home.
- Existing features have a target role.
- Games have a dedicated conceptual destination.
- Utility routes are separated from learning content.
- Phase 2 can implement navigation without inventing new content structure.
