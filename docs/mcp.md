# SiapAjar MCP Server

The SiapAjar MCP (Model Context Protocol) server exposes full application data and services to AI assistants (Claude Code, Hermes, etc.) over JSON-RPC over stdio.

## Architecture

- **Command**: `node ace mcp:serve` (AdonisJS Ace command).
- **Container**: Boots the complete AdonisJS application container, making Lucid ORM models, app services, queue services, and document export generators directly available to tool handlers.
- **Transport**: stdio (JSON-RPC 2.0 over stdin/stdout).
- **Auth**: API-key based auth on every tool. The key is read from `SIAPAJAR_MCP_API_KEY` at runtime. Every tool call requires a matching `api_key` string argument.
- **Document Exports**: Export tools (`siapajar_export_*`) return generated documents directly as base64-encoded strings with their MIME types (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/pdf`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`) and suggested filenames.

## Running

```bash
# Set your API key and launch via npm script
SIAPAJAR_MCP_API_KEY=your-secret-mcp-key npm run mcp:start

# Or run the Ace command directly:
SIAPAJAR_MCP_API_KEY=your-secret-mcp-key node ace mcp:serve
```

## Available Tools

All tools require the `api_key: string` argument matching `SIAPAJAR_MCP_API_KEY`.

### Health & Connectivity

| Tool | Description |
|---|---|
| `siapajar_health` | Ping database connection and return health & latency. |

### Group A: Data Master & Admin

| Tool | Description |
|---|---|
| `siapajar_list_schools` | List schools stored in SiapAjar. |
| `siapajar_get_school` | Get details and users of a specific school by ID. |
| `siapajar_create_school` | Create a new school. |
| `siapajar_update_school` | Update an existing school. |
| `siapajar_list_classes` | List classes with optional `user_id` or `academic_year_id` filters. |
| `siapajar_get_class` | Get class details, students, and academic year. |
| `siapajar_create_class` | Create a new class. |
| `siapajar_update_class` | Update class details. |
| `siapajar_delete_class` | Delete a class by ID. |
| `siapajar_list_students` | List students with optional `class_id` or search filter. |
| `siapajar_get_student` | Get student details by ID. |
| `siapajar_create_student` | Create a new student in a class. |
| `siapajar_add_student_to_class` | Add student to class (alias for create_student). |
| `siapajar_update_student` | Update student information. |
| `siapajar_delete_student` | Delete a student record. |
| `siapajar_remove_student_from_class` | Remove a student from a class. |
| `siapajar_list_subjects` | List subjects with optional `user_id` or `education_level`. |
| `siapajar_create_subject` | Create a new subject. |
| `siapajar_update_subject` | Update subject details. |
| `siapajar_delete_subject` | Delete a subject. |
| `siapajar_list_academic_years` | List academic years and semesters. |
| `siapajar_create_academic_year` | Create an academic year. |
| `siapajar_update_academic_year` | Update academic year status or name. |
| `siapajar_list_semesters` | List semesters by `academic_year_id`. |
| `siapajar_create_semester` | Create a semester. |
| `siapajar_update_semester` | Update semester status or name. |
| `siapajar_list_users` | List user accounts (Admin). |
| `siapajar_list_packages` | List subscription packages and feature entitlements. |
| `siapajar_get_package` | Get package details by ID. |
| `siapajar_list_entitlements` | List package entitlements. |
| `siapajar_get_ai_settings` | Get current AI settings (provider, authMode, model). |
| `siapajar_test_ai_connection` | Test connection to the AI provider and list available models. |

### Group B: Planning & Execution Documents

| Tool | Description |
|---|---|
| `siapajar_list_annual_plans` | List annual plans (Protah). |
| `siapajar_get_annual_plan` | Get annual plan details by ID. |
| `siapajar_create_annual_plan` | Create an annual plan. |
| `siapajar_update_annual_plan` | Update an annual plan. |
| `siapajar_delete_annual_plan` | Delete an annual plan. |
| `siapajar_generate_annual_plan` | Trigger AI generation for an annual plan. |
| `siapajar_export_annual_plan` | Export annual plan to DOCX (base64). |
| `siapajar_export_annual_plan_pdf` | Export annual plan to PDF (base64). |
| `siapajar_list_semester_plans` | List semester plans (Promes). |
| `siapajar_get_semester_plan` | Get semester plan details by ID. |
| `siapajar_create_semester_plan` | Create a semester plan. |
| `siapajar_update_semester_plan` | Update a semester plan. |
| `siapajar_delete_semester_plan` | Delete a semester plan. |
| `siapajar_generate_semester_plan` | Trigger AI generation for a semester plan. |
| `siapajar_export_semester_plan` | Export semester plan to DOCX (base64). |
| `siapajar_export_semester_plan_pdf` | Export semester plan to PDF (base64). |
| `siapajar_list_weekly_lesson_plans` | List weekly lesson plans (RPPM). |
| `siapajar_get_weekly_lesson_plan` | Get RPPM details by ID. |
| `siapajar_update_weekly_lesson_plan` | Update an RPPM document. |
| `siapajar_delete_weekly_lesson_plan` | Delete an RPPM document. |
| `siapajar_generate_weekly_lesson_plan` | Generate an RPPM document using AI. |
| `siapajar_export_weekly_lesson_plan` | Export RPPM to DOCX (base64). |
| `siapajar_export_weekly_lesson_plan_pdf` | Export RPPM to PDF (base64). |
| `siapajar_list_daily_lesson_plans` | List daily lesson plans (RPPH). |
| `siapajar_get_daily_lesson_plan` | Get RPPH details by ID. |
| `siapajar_update_daily_lesson_plan` | Update an RPPH document. |
| `siapajar_delete_daily_lesson_plan` | Delete an RPPH document. |
| `siapajar_generate_daily_lesson_plan` | Generate an RPPH document using AI. |
| `siapajar_export_daily_lesson_plan` | Export RPPH to DOCX (base64). |
| `siapajar_export_daily_lesson_plan_pdf` | Export RPPH to PDF (base64). |
| `siapajar_list_teaching_modules` | List teaching modules (Modul Ajar). |
| `siapajar_get_teaching_module` | Get teaching module details by ID. |
| `siapajar_create_teaching_module` | Create a teaching module. |
| `siapajar_update_teaching_module` | Update a teaching module. |
| `siapajar_delete_teaching_module` | Delete a teaching module. |
| `siapajar_generate_teaching_module` | Generate a teaching module using AI. |
| `siapajar_export_teaching_module` | Export teaching module to DOCX (base64). |
| `siapajar_export_teaching_module_pdf` | Export teaching module to PDF (base64). |
| `siapajar_list_lkpds` | List LKPD (Lembar Kerja Anak) documents. |
| `siapajar_get_lkpd` | Get LKPD details by ID. |
| `siapajar_delete_lkpd` | Delete an LKPD document. |
| `siapajar_generate_lkpd` | Generate an LKPD document using AI. |
| `siapajar_export_lkpd` | Export LKPD to DOCX (base64). |
| `siapajar_export_lkpd_pdf` | Export LKPD to PDF (base64). |
| `siapajar_list_media_modules` | List media modules (slides & loose parts guides). |
| `siapajar_get_media_module` | Get media module details by ID. |
| `siapajar_delete_media_module` | Delete a media module. |
| `siapajar_generate_media_module` | Generate a media module using AI. |
| `siapajar_export_media_module_pptx` | Export media module to PPTX (base64). |
| `siapajar_export_media_module_pdf` | Export media module to PDF (base64). |
| `siapajar_get_ai_job` | Poll status and result of a background AI generation job. |
| `siapajar_get_ai_jobs` | List background AI generation jobs. |

### Group C: Assessment & Report Cards (PAUD / SD Focus)

| Tool | Description |
|---|---|
| `siapajar_list_paud_assessments` | List PAUD assessments (ceklis, anekdot, karya, foto berseri). |
| `siapajar_get_paud_assessment` | Get PAUD assessment details by ID. |
| `siapajar_create_paud_assessment` | Create a PAUD assessment record. |
| `siapajar_update_paud_assessment` | Update a PAUD assessment. |
| `siapajar_delete_paud_assessment` | Delete a PAUD assessment. |
| `siapajar_export_paud_assessment` | Export PAUD assessment to DOCX (base64). |
| `siapajar_export_paud_assessment_pdf` | Export PAUD assessment to PDF (base64). |
| `siapajar_list_report_narratives` | List report narratives for students. |
| `siapajar_get_report_narrative` | Get report narrative by ID. |
| `siapajar_generate_report_narratives` | Trigger background job to generate narrative report drafts. |
| `siapajar_list_report_cards` | Get compiled class report cards (narrative or numeric). |
| `siapajar_get_report_card` | Get report card for a specific student. |
| `siapajar_export_report_card_pdf` | Export student report card to PDF (base64). |
| `siapajar_export_report_card_docx` | Export student report card to DOCX (base64). |
| `siapajar_list_exams` | List exams (soal ujian/ulangan). |
| `siapajar_get_exam` | Get exam details by ID. |
| `siapajar_create_exam` | Create an exam. |
| `siapajar_update_exam` | Update an exam. |
| `siapajar_delete_exam` | Delete an exam. |
| `siapajar_generate_exam` | Generate exam questions using AI. |
| `siapajar_export_exam` | Export exam to DOCX (base64). |
| `siapajar_export_exam_pdf` | Export exam to PDF (base64). |
| `siapajar_list_assessments` | List gradebook assessments. |
| `siapajar_get_assessment` | Get assessment details and student scores. |
| `siapajar_create_assessment` | Create an assessment entry for a class & subject. |
| `siapajar_update_assessment_scores` | Batch update student scores for an assessment. |
| `siapajar_delete_assessment` | Delete an assessment and its scores. |
| `siapajar_export_assessment` | Export assessment scores to Excel XLSX (base64). |
| `siapajar_export_assessment_docx` | Export assessment to DOCX (base64). |
| `siapajar_export_assessment_pdf` | Export assessment to PDF (base64). |

### Group D: Curriculum (PAUD Chain)

| Tool | Description |
|---|---|
| `siapajar_list_curriculum_cps` | List official Capaian Pembelajaran (CP) Fase Fondasi. |
| `siapajar_list_learning_objectives` | List Learning Objectives (TP) with optional `cp_id` filter. |
| `siapajar_list_learning_sequences` | List Learning Sequences (ATP) by `user_id`. |
| `siapajar_list_iktp_indicators` | List IKTP indicators with optional `learning_objective_id` filter. |
| `siapajar_seed_curriculum_presets` | Seed/refresh official PAUD curriculum presets (Admin). |

## Base64 Export Response Format

All document export tools return a JSON object with base64 payload:

```json
{
  "filename": "Modul_Ajar_Matematika.docx",
  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "content_base64": "UEsDBBTAAA..."
}
```

The AI assistant can decode `content_base64` or present the file directly to the user.

## Client Configuration Examples

### Claude Code (`claude_desktop_config.json` or `.mcp.json`)

```json
{
  "mcpServers": {
    "siapajar": {
      "command": "node",
      "args": ["/absolute/path/to/siapajar/node_modules/.bin/adonis", "mcp:serve"],
      "cwd": "/absolute/path/to/siapajar",
      "env": {
        "SIAPAJAR_MCP_API_KEY": "your-secret-mcp-key",
        "NODE_ENV": "development",
        "QUEUE_DRIVER": "sync"
      }
    }
  }
}
```

### Hermes (`.hermes/config.yml`)

```yaml
mcp_servers:
  - name: siapajar
    transport: stdio
    command: node
    args:
      - ace
      - mcp:serve
    cwd: /absolute/path/to/siapajar
    env:
      SIAPAJAR_MCP_API_KEY: "your-secret-mcp-key"
      NODE_ENV: "development"
      QUEUE_DRIVER: "sync"
```

## Smoke Test

Verify standard JSON-RPC interaction over stdio:

```bash
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"siapajar_health","arguments":{"api_key":"test-key"}}}' \
  | SIAPAJAR_MCP_API_KEY=test-key QUEUE_DRIVER=sync node ace mcp:serve
```
