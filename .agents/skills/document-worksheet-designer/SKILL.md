---
name: document-worksheet-designer
description: Comprehensive agent skill for PPTX presentations (presentation-creator, pitch-deck-creator), DOCX documents (docx-document-designer), and PDF exam worksheets (pdf-worksheet-designer) with TOON token optimization and Nano Banana visual line-art prompts.
---

# Document, Worksheet & PPT Designer Master-Skill

This master skill provides specialized agent workflows inspired by **Kimi AI Skills** (`presentation-creator`, `pitch-deck-creator`, `docx-document-designer`, `pdf-worksheet-designer`), incorporating **ATM (Amati, Tiru, Modifikasi)** principles specifically adapted for the **SiapAjar** platform (Kurikulum Merdeka PAUD/TK/RA & SD).

---

## 1. Framework Prompting GACTF

Every AI document/presentation request MUST follow the 5 GACTF core pillars:
1. **Goal**: Purpose of document (e.g. "Creating RA/TK PAS Cognitive Exam Paper" or "Media Ajar Visual Outline").
2. **Audience**: Target learners (Kids aged 4-6 & Early Childhood Teachers).
3. **Content**: Learning objectives / Capaian Pembelajaran Kurikulum Merdeka.
4. **Tone**: Kid-friendly, engaging, positive, educational.
5. **Format**: 3-Option MCQs (`a`, `b`, `c`), 2-Column Matching, or 5-Slide Narrative Visual Deck.

---

## 2. PPTX & Presentation Creator Skill (`presentation-creator` & `pitch-deck-creator`)

### A. Educational Slide Archetype System (5-8 Slides)
1. **Slide 1: Title & Hero Banner (`title`)**
   - Narrative title, sub-theme, and hero illustration prompt (`imagePrompt`).
2. **Slide 2: Concept Map & Agenda (`agenda`)**
   - 3-4 structured learning pillars with visual icons.
3. **Slide 3: Visual Concept Story (`concept_story`)**
   - Split 50% image prompt (`imagePrompt`), 50% concise text (max 3 lines) + Teacher Notes.
4. **Slide 4: Interactive Loose Parts Guide (`loose_parts`)**
   - Trigger question (HOTS for kids) + List of natural/recycled loose parts (batu, daun, balok, kancing, tutup botol).
5. **Slide 5: Reflection & Summary (`summary`)**
   - 3 key takeaways + Emotional check-in prompt.

### B. Nano Banana Visual Prompt Standard (`slide-visualizer`)
Format `imagePrompt`:
```
"Simple, cute, high-contrast black-and-white vector line art illustration for kids, [subject description], transparent white background, no text, no watermark, no logo, clean lines"
```

---

## 3. DOCX Document & Module Engine (`docx-document-designer`)

### Typography & Document Layout Standards (.docx):
- **Heading 1**: 18pt Bold (Emerald `#059669` / Navy `#1E3A8A`), 12pt space-before.
- **Heading 2**: 14pt Semi-bold, 8pt space-before.
- **Body Text**: 11pt Calibri / Inter, 1.15 line-spacing.
- **Callout Box**: Soft background tint (`#F0FDF4` / `#FEF3C7`) with 3pt solid left border.
- **Tables**: Solid accent header row + white bold text, zebra striping (`#F9FAFB`), cell padding min 6pt.

---

## 4. PDF & Worksheet Exam Engine (`pdf-worksheet-designer`)

### A. Kop Surat & Print Layout
- School logo left (`h-12 w-12`).
- Bold centered institution name (14pt-16pt), address line 1 & 2, phone, double underline border divider.
- 3-column assessment box (`Nilai | Paraf Guru | Paraf Orang Tua`).

### B. Question Rendering & TOON Rules
- **Multiple Choice (`multiple_choice`)**:
  - Text questions MUST render 3 distinct contextual text choices (`a. Nabi Adam   b. Nabi Nuh   c. Nabi Muhammad`).
  - NEVER force emoji counting objects (stars ⭐, fish 🐟) or numerical choices (`a. 4  b. 4  c. 4`) on text/religious questions.
- **Hubungkan Garis (`matching`)**:
  - Clean text pairs (`Nabi Nuh` ── `Kapal`). No emoji clutter.
- **Menebalkan (`tracing`)**:
  - Dotted border box with tracking font (`font-mono tracking-widest`). No choice boxes underneath.
- **Clean Print CSS**:
  - `@page { margin: 0; size: A4 portrait; }` to eliminate default browser URL & date strings.
  - `body { margin: 10mm 15mm !important; }`.
