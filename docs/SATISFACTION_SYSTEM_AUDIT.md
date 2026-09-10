# Phase 7 — Satisfaction Assessment System Audit

> Audit scope: UI Developer / Survey Audit
> Status: **AUDIT BASELINE — no production UI/data-flow changes applied in this audit commit**
> Repository: `NaiBossZer/mahidol-rac`

## 1. Objective

ยกระดับระบบประเมินความพึงพอใจจากแบบสอบถาม + dashboard เดิม ให้เป็นระบบที่ตอบโจทย์ผู้บริหารมากขึ้น โดยเพิ่ม 3 แกนหลัก:

1. **Admin System** — ผู้ดูแลสามารถจัดการกิจกรรม/ข้อมูลกิจกรรม และควบคุมสิทธิ์ได้
2. **Event-level Filtering** — Dashboard ต้องระบุได้ว่าแบบประเมินมาจากกิจกรรม/ครั้งใด ไม่ใช่กรองเพียงปี/เดือน/กลุ่มผู้ตอบ
3. **Activity Visual Evidence** — นำภาพกิจกรรมที่ Admin จัดการมาแสดงบน Dashboard เพื่อให้ผู้บริหารเห็นบริบทของผลประเมิน

พร้อมปรับ UX/UI ของแบบสอบถามและ Dashboard ให้เป็น executive information system มากกว่า report ที่แสดงตัวเลขเพียงอย่างเดียว

---

## 2. Current Architecture Snapshot

### Existing routes

- `/survey` — แบบประเมินสาธารณะ
- `/dashboard` — Dashboard ต้องเข้าสู่ระบบ
- `/admin/activity` — Activity Admin ต้องผ่าน `AdminRoute`

ปัจจุบันระบบมี Activity Admin อยู่แล้ว และ route ถูกครอบด้วย `AdminRoute`; จึงควร **ต่อยอดของเดิม** มากกว่าสร้าง Admin module ใหม่แยกชุด

### Current activity model

`Activity` มี:

- `id`
- `title`
- `date`
- `category`
- `coverImage`
- `images[]`
- `objective`
- `keyActivities[]`
- `outcomes`
- `participants`
- `status`
- `createdAt`
- `updatedAt`

Activity repository รองรับ Supabase และ fallback localStorage; image repository ใช้ Supabase Storage bucket `activity-images` เมื่อ Supabase ถูกตั้งค่า

**Audit conclusion:** โครงสร้างนี้เป็นฐานที่ดีสำหรับการนำภาพกิจกรรมมาใช้ใน Dashboard

---

## 3. Questionnaire Audit

แบบสอบถามปัจจุบันมี 4 ตอนและ Likert 1–5 รวม **14 ตัวชี้วัด**:

- ตอนที่ 2 พิธีเปิด: 5 ข้อ
- ตอนที่ 3 ห้องการเรียนรู้ครั่งครบวงจร: 5 ข้อ
- ตอนที่ 4 ผลที่ได้รับ: 4 ข้อ

ข้อมูลทั่วไปประกอบด้วยอายุ สังกัด การเข้าร่วมกิจกรรมก่อนหน้า และช่องทางที่รับทราบข่าวสาร

### Strengths

- Validation ของคะแนน Likert มีอยู่ครบทั้ง 14 ข้อ
- โครงสร้างคำถามแยกตามหมวดชัดเจน
- `QUESTION_MAP` ช่วยให้ Dashboard map คำถามกับหมวดได้
- มี PDPA consent screen ก่อนเข้าสู่แบบสอบถาม

### Findings

**CRITICAL — Submission reliability**

Survey ส่งข้อมูลไป Google Apps Script ด้วย `GET + no-cors` แล้วเปลี่ยน state เป็น submitted เมื่อ `fetch()` resolve ซึ่ง frontend ไม่สามารถตรวจสอบ response body/status จริงได้ จึงมีความเสี่ยงที่ UI แจ้งสำเร็จทั้งที่ backend ไม่ได้บันทึกข้อมูล

**HIGH — Event identity missing**

Payload ของแบบประเมินปัจจุบันยังไม่มี field ที่ระบุ `activityId`/`eventId` อย่างเป็นระบบ ทำให้ Dashboard ไม่สามารถตอบคำถามสำคัญว่า “กิจกรรมครั้งไหนได้คะแนนเท่าไร” ได้อย่าง reliable

**HIGH — Data contract**

Survey ใช้ Google Apps Script URL หนึ่งชุด ขณะที่ Dashboard อ่านจาก Google Apps Script URL อีกชุด ต้องตรวจสอบให้ชัดเจนว่าทั้งสอง endpoint อยู่บน dataset เดียวกัน หากไม่ใช่จะเกิด data fragmentation

**MEDIUM — Runtime validation**

`SurveyResponse` ฝั่ง Dashboard เปิด dynamic keys (`[key: string]`) จึงยืดหยุ่น แต่ไม่มี runtime schema validation สำหรับ timestamp, affiliation และคะแนน 1–5

**MEDIUM — Consent audit trail**

หน้าจอมีการแสดงข้อความ PDPA และให้กดยอมรับ แต่ยังต้องกำหนด data contract ว่า consent ถูกบันทึกเป็น field หรือ audit event หรือไม่

---

## 4. Dashboard Audit

### Current filters

- ปี
- เดือน
- ช่วงอายุ
- สังกัด

### Current KPI / analysis

- จำนวนผู้ตอบ
- คะแนนเฉลี่ยรวม
- ข้อคะแนนสูงสุด
- ข้อที่ควรพัฒนา
- คะแนนแยกหมวด
- affiliation breakdown
- feedback classification

### Findings

**CRITICAL — No event-level filter**

Dashboard ยังไม่มีตัวกรอง `กิจกรรม / ครั้ง` จึงไม่สามารถแยกผลประเมินระหว่างพิธีเปิดครั้งต่าง ๆ หรือกิจกรรมในอนาคตได้

**HIGH — KPI methodology**

`grandAvgPercent` เป็นค่าเฉลี่ยของค่าเฉลี่ยรายข้อ แล้วหารด้วย 5 หากจำนวนคำตอบที่ valid ต่อข้อไม่เท่ากัน ค่า KPI อาจไม่ใช่ค่าเฉลี่ยรวมแบบ weighted/response-level ที่ผู้บริหารคาดหวัง จึงต้องกำหนด metric definition ให้ชัดเจนก่อน production

**MEDIUM — Feedback classification**

ปัจจุบันเป็น keyword/rule-based classification ไม่ใช่ AI sentiment analysis ควรใช้ชื่อใน UI เช่น “วิเคราะห์ข้อเสนอแนะเบื้องต้น” และไม่ควรสื่อว่าเป็น AI จนกว่าจะมี model/algorithm จริง

**MEDIUM — Data freshness wording**

UI ใช้คำว่า “เชื่อมต่อสด (LIVE)” แต่ implementation เป็น fetch-on-load/refresh จาก endpoint ไม่ใช่ realtime subscription ควรปรับ wording เป็น “อัปเดตล่าสุด” หรือ “เชื่อมต่อข้อมูล” เพื่อไม่ overclaim

**MEDIUM — Missing event context**

แม้ Activity Admin มี `coverImage` และ `images[]` แล้ว แต่ Dashboard ยังไม่ได้ join activity metadata กับ survey result

---

## 5. Proposed Target Data Model

เป้าหมายคือทำให้ survey response มี event identity ที่ stable:

```text
activities
  id
  title
  date
  category
  cover_image
  images[]
  status

survey_responses
  id
  activity_id        -> activities.id
  submitted_at
  age_group
  affiliation
  ever_joined
  channels
  p2_location
  ...
  p4_future_return
  feedback
  pdpa_consent
```

### Rule

`activity_id` ต้องเป็น canonical identifier และไม่ควรใช้ชื่อกิจกรรมเป็น key เพราะชื่ออาจถูกแก้ไขได้

### UI consequence

แบบสอบถามควรได้รับ context เช่น:

`/survey?activity=<uuid>`

หรือใช้ route ที่สร้างจาก Admin เช่น:

`/survey/<activityId>`

สำหรับกิจกรรมแต่ละครั้ง

ผู้ตอบจะเห็นชื่อกิจกรรม + วันที่ และระบบบันทึก `activity_id` โดยไม่ให้ผู้ตอบกรอกเอง

---

## 6. Admin System — Target

เนื่องจากมี Activity Admin อยู่แล้ว ให้พัฒนาเป็น **Survey & Activity Administration** โดยใช้ระบบ Auth เดิม

### Admin capabilities

#### A. Activity Management

- เพิ่มกิจกรรม
- แก้ไขกิจกรรม
- draft/published
- วันที่/ชื่อ/หมวดหมู่
- วัตถุประสงค์
- กิจกรรมสำคัญ
- ผลลัพธ์
- ผู้เข้าร่วม
- upload ภาพหลายภาพ
- ตั้งภาพปก

#### B. Survey Management

เพิ่มข้อมูล survey configuration ต่อ activity:

- เปิด/ปิดแบบประเมิน
- สร้าง survey link/QR
- ดูจำนวน responses
- ดูวันที่เปิด/ปิด
- กำหนดข้อความต้อนรับ
- preview questionnaire

#### C. Admin dashboard

ควรมีหน้าเดียวที่เห็น:

```text
ADMIN
├── Activities
│   ├── Upcoming
│   ├── Published
│   └── Draft
├── Surveys
│   ├── Active
│   ├── Closed
│   └── Response count
├── Media
│   └── Activity gallery
└── Access / Role
```

---

## 7. Event-level Filtering — Target UX

ตัวกรองใหม่ควรเรียงลำดับตามความหมายของข้อมูล:

```text
[กิจกรรม/ครั้ง ▼] [ปี ▼] [เดือน ▼] [ช่วงอายุ ▼] [สังกัด ▼]
```

เมื่อเลือกกิจกรรม:

- filter survey responses ด้วย `activity_id`
- เปลี่ยน Header ของ Dashboard ให้แสดงชื่อกิจกรรม
- แสดงวันที่กิจกรรม
- แสดงภาพปกกิจกรรม
- แสดง response count ของกิจกรรมนั้น
- KPI ทั้งหมด recalculated จาก event scope

### Recommended behavior

`กิจกรรม/ครั้ง = ALL` → Executive overview ทุกกิจกรรม

`กิจกรรม/ครั้ง = Activity A` → Event report ของ Activity A

### Important

ปี/เดือนควรเป็น secondary filters ไม่ใช่ substitute สำหรับ activity identity

---

## 8. Activity Photos on Dashboard

เพิ่ม Executive Activity Context panel ด้านบนของ Dashboard:

```text
┌──────────────────────────────────────────────────────┐
│ [Activity Cover]   ห้องการเรียนรู้ครั่งครบวงจร       │
│                    21 สิงหาคม 2569                   │
│                    ผู้เข้าร่วม: ...                   │
│                    [ดูภาพกิจกรรม]                     │
└──────────────────────────────────────────────────────┘
```

เมื่อมีหลายภาพ:

- cover image เป็นภาพหลัก
- gallery 3–5 thumbnails
- click เพื่อเปิด lightbox
- ใช้ภาพจาก `activity-images`
- ถ้า activity ไม่มีรูป ให้ใช้ neutral placeholder ไม่ใช้ broken image

### Executive principle

ภาพไม่ควรเป็น decoration อย่างเดียว แต่ต้องทำหน้าที่เป็น **evidence/context** ว่า “ผลประเมินนี้เกิดจากกิจกรรมอะไร”

---

## 9. Recommended Dashboard Information Architecture

### Level 1 — Executive Summary

1. Activity context + cover image
2. จำนวนผู้ตอบ
3. Satisfaction Score
4. High Satisfaction %
5. Feedback count
6. Date / activity

### Level 2 — Satisfaction

- คะแนนตามหมวด
- คะแนนรายข้อ
- Top strengths
- Improvement opportunities

### Level 3 — Audience

- อายุ
- สังกัด
- การเข้าร่วมเดิม
- ช่องทางรับข่าวสาร

### Level 4 — Voice of Participant

- positive
- follow-up
- urgent
- topic
- latest feedback

### Level 5 — Action

เพิ่มส่วน “ประเด็นที่ควรดำเนินการ” ที่สรุปจากคะแนนต่ำ + feedback เพื่อให้ผู้บริหารเห็น next action ไม่ใช่เพียงตัวเลข

---

## 10. Questionnaire UX Redesign Direction

ไม่ควรเพิ่มคำถามจำนวนมากใน Phase แรก เพราะ 14 Likert items เป็นชุดที่ใช้งานได้อยู่แล้ว

สิ่งที่ควรปรับก่อน:

- แสดงชื่อกิจกรรมและวันที่แบบ dynamic
- progress indicator เช่น `ขั้นตอน 2 จาก 4`
- group question cards ให้ชัด
- mobile-first radio/scale controls
- required state ที่มองเห็นชัด
- error summary ก่อน submit
- ป้องกัน double submit
- success state แสดงชื่อกิจกรรมที่ประเมิน
- บันทึก `activity_id` และ `pdpa_consent`

---

## 11. Background Visual Direction

เสนอเปลี่ยนจาก background เดียวแบบ generic ไปเป็น **Editorial Exhibition Background** ที่สื่อ “ครั่ง + การเรียนรู้ + มหาวิทยาลัย”

### Concept A — Lac Learning Atmosphere (recommended)

ภาพพื้นหลังแนวนอน 16:9:

- macro texture ของครั่งธรรมชาติแบบ abstract
- โทนแดงเข้ม / burgundy / warm brown
- มีแสงทองบาง ๆ
- silhouette/texture ของวัสดุธรรมชาติแบบไม่รบกวนข้อความ
- vignette บริเวณกลางภาพเพื่อรองรับ card overlay
- ไม่มีตัวหนังสือในภาพ
- ไม่มีโลโก้ในภาพ เพื่อให้ responsive และนำกลับมาใช้ได้

เหมาะกับ:

- Survey landing
- Survey success
- Dashboard hero

### Concept B — Learning Exhibition

ภาพพื้นที่เรียนรู้/นิทรรศการแบบ soft-focus มีวัสดุครั่งหรือชิ้นงานเป็น foreground และมีพื้นที่ว่างด้านหนึ่งสำหรับข้อความ

### Concept C — Executive Minimal

abstract shellac texture + subtle architectural grid + warm light โดยลดรายละเอียดให้มากที่สุด เหมาะกับ Dashboard ผู้บริหาร

**Recommendation:** ใช้ A เป็น shared brand background และใช้ C สำหรับ Dashboard hero เพื่อให้ dashboard ดูเป็น executive มากกว่า game UI

---

## 12. Priority Matrix

| Priority | Finding / Work | Status |
|---|---|---|
| P0 | เชื่อม Survey กับ Activity ID | Planned |
| P0 | ตรวจสอบ/รวม Data Contract ระหว่าง Survey และ Dashboard | Planned |
| P0 | แก้ submission reliability ของ `no-cors` flow | Planned |
| P0 | เพิ่ม Event filter | Planned |
| P0 | Join Activity metadata + survey response | Planned |
| P1 | Activity photo context บน Dashboard | Planned |
| P1 | Survey/Admin configuration | Planned |
| P1 | Dashboard executive redesign | Planned |
| P1 | KPI methodology | Planned |
| P2 | Feedback classification refinement | Planned |
| P2 | Background visual redesign | Planned |
| P2 | Export/reporting | Future |

---

## 13. Recommended Phase 7 Execution Order

```text
7.1 AUDIT BASELINE                 ← current
       ↓
7.2 DATA CONTRACT + ACTIVITY ID
       ↓
7.3 SURVEY SUBMISSION RELIABILITY
       ↓
7.4 ADMIN SURVEY/ACTIVITY CONTROL
       ↓
7.5 EVENT FILTER + ACTIVITY CONTEXT
       ↓
7.6 DASHBOARD EXECUTIVE UI
       ↓
7.7 PHOTO / GALLERY INTEGRATION
       ↓
7.8 KPI + FEEDBACK ANALYTICS
       ↓
7.9 QA / ACCESSIBILITY / PRODUCTION
```

ไม่ควรเริ่มจาก background ก่อน เพราะ background เป็น presentation layer ขณะที่ event identity และ data contract เป็น foundation

---

## 14. Acceptance Criteria

### Survey

- [ ] ผู้ตอบเข้าผ่าน activity-specific link ได้
- [ ] `activity_id` ถูกบันทึกทุก response
- [ ] PDPA consent ถูกบันทึกตาม data contract
- [ ] submit success ต้องอิงผลลัพธ์ที่ตรวจสอบได้
- [ ] duplicate/double-submit handling ถูกกำหนด

### Admin

- [ ] Admin จัดการกิจกรรมได้
- [ ] Admin publish/unpublish ได้
- [ ] Admin upload/delete/reorder images ได้
- [ ] Admin เปิด/ปิด survey ต่อ activity ได้
- [ ] Admin สร้าง survey link/QR ต่อ activity ได้

### Dashboard

- [ ] เลือกกิจกรรมรายครั้งได้
- [ ] ทุก KPI เปลี่ยนตาม activity filter
- [ ] แสดงชื่อ + วันที่กิจกรรม
- [ ] แสดง cover image/gallery
- [ ] มี fallback เมื่อไม่มีภาพ
- [ ] executive view เข้าใจได้โดยไม่ต้องอ่าน raw data

### Security

- [ ] Admin operations อยู่หลัง authenticated role guard
- [ ] Supabase RLS จำกัด write operations ตาม role policy
- [ ] public survey ไม่สามารถแก้ activity data
- [ ] public dashboard data เปิดเผยเฉพาะข้อมูลที่ออกแบบให้ public/authorized เท่านั้น

---

## 15. Audit Conclusion

ระบบปัจจุบันมี foundation ที่ดี โดยเฉพาะ Activity Admin + Supabase Storage + Auth Guard แต่ **Survey และ Activity ยังไม่ถูกเชื่อมกันด้วย canonical event identity** ซึ่งเป็น gap สำคัญที่สุดสำหรับ requirement ใหม่

ดังนั้น Phase 7 ควรเปลี่ยนแนวคิดจาก:

> `Survey → Google Sheet → Dashboard`

เป็น:

> `Activity → Activity-specific Survey → Response → Event Analytics → Executive Dashboard`

และใช้ Activity Admin เป็น source of truth สำหรับชื่อกิจกรรม วันที่ และภาพกิจกรรม

**Next implementation target:** `7.2 DATA CONTRACT + ACTIVITY ID` ก่อนปรับ visual dashboard และ background
