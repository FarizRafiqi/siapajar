# Project Design & Development Guidelines (SiapAjar)

## UI & Design Aesthetics Preferences

1. **Action Buttons Consolidation (Dropdown Rule)**:
   - Always group secondary or multiple header action buttons (> 2 buttons) into a single clean `Aksi & Opsi ▾` dropdown popover menu instead of cluttering top toolbars with many horizontal buttons.

2. **High Text Contrast for Readability**:
   - Always use high-contrast text (`text-neutral-900`/`text-neutral-800` in light mode, `text-white`/`text-neutral-100` in dark mode). Avoid using dim or low-contrast gray text (`text-neutral-400`/`text-neutral-500`) for important titles, descriptions, badges, or labels.

3. **Text Sizing Standards**:
   - Ensure readable text sizing across all dashboard pages: minimum `text-sm` (14px) for body/descriptions, `text-base` (16px) for primary list content items (e.g. TP titles), and `text-xs` (12px) for badges/pills.

4. **Prevent Badge Line Wrapping**:
   - Always apply `shrink-0 whitespace-nowrap` on counter badges or status pills (e.g. `2 TP`) inside flex headers so they never break onto multiple lines.

5. **Conditional Description Toggles**:
   - Only render expand/collapse toggles ("Lihat Deskripsi Lengkap ▾") when description text length exceeds a reasonable threshold (> 150 characters).

6. **Clean Tour Popovers (Driver.js)**:
   - Keep guided tour step titles and descriptions crisp, professional, and free of unnecessary colored circle emojis.

7. **No Raw Emoji Icons Rule**:
   - Never use raw text emojis (e.g. 🗺️, 💡, 🚀, 📌, 🔵, 🟢, 📄) as UI icons or in headings/buttons. Always use proper SVG icon components from libraries such as `lucide-react` for a polished, professional UI.

8. **Balanced Font Weight Standard**:
   - Avoid overusing overly thick font weights (`font-extrabold`/`font-black`). Use `font-bold` sparingly for main page titles, `font-semibold` for buttons/tabs/subheadings, and `font-medium`/`font-normal` for body descriptions and cards to maintain an elegant visual hierarchy.

9. **No Raw Underscores in UI Labels / Badges**:
   - Never render raw database enum strings or keys containing underscores (e.g. `catatan_anekdot`, `foto_berseri`, `hasil_karya`) directly in UI badges or text labels. Always format them on the Frontend into clean, human-readable Title Case text (e.g. `Catatan Anekdot`, `Foto Berseri`, `Hasil Karya`).

10. **No Native Browser Dialogs (confirm/alert/prompt)**:
   - Never use native browser popups (`confirm()`, `alert()`, `prompt()`) for user interactions or deletion confirmations. Always use custom React modal components or toast notifications for a polished, seamless, and branded user experience.

11. **Back Navigation Alignment Standard (Left Alignment Rule)**:
   - Always place 'Back' buttons or parent navigation links (e.g. `← Kembali`, `← Kembali ke Paket Saya`) on the **LEFT side** of the page header (above or directly inline before the main title), NEVER on the far right. Reserve the right side of header bars exclusively for primary action triggers (e.g. `+ Tambah`, `Export`, `Filter`, `Aksi & Opsi ▾`).

12. **Document Layout & Export Standards (PDF & DOCX Standard Rule)**:
   - **Landscape Orientation for Matrix Tables**: Always default to landscape orientation (`layout: 'landscape'`) for wide curriculum matrices (CP, TP, ATP, IKTP) so tables have ample horizontal room.
   - **Strict Colon Alignment in Metadata/Kop**: Never pad colons `:` manually with space characters. Always calculate aligned column coordinates (in PDFKit) or use borderless grid tables (in DOCX) with distinct Label (width A), Colon `:` (width B), and Value (width C) columns so colons align in a perfectly straight vertical line.
   - **Descriptive Export Filenames**: Never use generic filenames like `Dokumen.pdf` or `export.docx`. Always name exported files descriptively, e.g. `Dokumen_CP_TP_ATP_[SatuanPendidikan].pdf` / `.docx`.
   - **Explicit Left Alignment for Headings**: Section titles and matrix headers must always be explicitly left-aligned, never floating or right-aligned.

13. **Metadata Label-Value Semantic Alignment (Compact Format Rule)**:
   - When document/form metadata labels combine multiple concepts with slashes (e.g. `KELOMPOK / USIA`, `SEMESTER / MINGGU`, `JENJANG / KELAS`), format the corresponding value symmetrically and concisely (e.g. `B1 / 5-6 Tahun`, `1 / 3`, `RA / B1`) instead of verbose redundant phrases (avoid `Kelompok B (5-6 Tahun) - Ibrahim`).

