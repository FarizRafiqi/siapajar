# SiapAjar MCP Server & Security Architecture

The SiapAjar MCP (Model Context Protocol) server exposes application data and services to AI assistants (Hermes, VSCode extensions, Claude Code, etc.) over JSON-RPC over stdio.

---

## 1. Security & Authentication Architecture

- **Per-User API Keys**: Identity is strictly bound to per-user API keys stored as SHA-256 hashes in the `mcp_keys` database table. Global fallback-to-admin (`getEffectiveUser`) is completely removed.
- **Key Prefix & Format**: API keys use the `sk_mcp_` prefix followed by a 32-byte secure random hex string.
- **RBAC (Role-Based Access Control)**: Every tool enforces role metadata (`admin`, `guru`, `kepala_sekolah`).
- **Tenant & Ownership Scoping**:
  - `admin`: Unconstrained system-wide access.
  - `kepala_sekolah`: Scope restricted to school data (`school_id`). Blocked from destructive tool operations.
  - `guru`: Scope restricted to resources created by/owned by the teacher (`user_id`).
- **Destructive Operation Confirmations**: All 13 resource delete tools + `siapajar_update_academic_year` require an explicit `confirm: true` parameter.
- **AI Generation Rate Limiting**: All 9 AI generation tools are subject to a sliding window rate limit of **maximum 10 AI generation requests per 10 minutes per user**.

---

## 2. API Key Management (Ace CLI Commands)

### Issue API Key (`mcp:key:generate`)
```bash
node ace mcp:key:generate <user_id> --label="Hermes Desktop" [--scopes="documents,assessments"]
```
Outputs the raw API key **once**.

### Revoke API Key (`mcp:key:revoke`)
```bash
node ace mcp:key:revoke <id_or_prefix>
```
Soft-revokes the key by setting `revoked_at`.

---

## 3. Client Configuration Examples

### Hermes (`.hermes/config.yaml`)
```yaml
mcpServers:
  siapajar:
    command: "node"
    args: ["ace", "mcp:serve"]
    env:
      SIAPAJAR_MCP_API_KEY: "sk_mcp_..."
      NODE_ENV: "development"
```

### Claude Code / VSCode (`.mcp.json`)
```json
{
  "mcpServers": {
    "siapajar": {
      "command": "node",
      "args": ["ace", "mcp:serve"],
      "env": {
        "SIAPAJAR_MCP_API_KEY": "sk_mcp_...",
        "NODE_ENV": "development"
      }
    }
  }
}
```

---

## 4. RBAC Permission Matrix

| Tool Group / Name | Admin | Guru | Kepala Sekolah | Data Scope | Confirmation (`confirm: true`) |
|---|:---:|:---:|:---:|---|:---:|
| `siapajar_health` | ✅ | ✅ | ✅ | System | No |
| `siapajar_list_schools`, `get_school` | ✅ | ❌ | ✅ | School (`school_id`) | No |
| `siapajar_create_school`, `update_school` | ✅ | ❌ | ❌ | System | No |
| `siapajar_list_classes`, `get_class`, `create_class`, `update_class` | ✅ | ✅ | ✅ (list/get) | `school` / `own` | No |
| `siapajar_delete_class` | ✅ | ✅ (own) | ❌ | `own` | **YES** |
| `siapajar_list_students`, `get_student`, `create_student`, `update_student` | ✅ | ✅ | ✅ (list/get) | `school` / `own` | No |
| `siapajar_delete_student` | ✅ | ✅ (own) | ❌ | `own` | **YES** |
| `siapajar_list_subjects`, `create_subject`, `update_subject` | ✅ | ✅ | ✅ (list) | `school` / `own` | No |
| `siapajar_delete_subject` | ✅ | ✅ (own) | ❌ | `own` | **YES** |
| Academic Years & Semesters (`list`, `create`, `update_semester`) | ✅ | ❌ | ❌ | System | No |
| `siapajar_update_academic_year` | ✅ | ❌ | ❌ | System | **YES** |
| User Admin, Packages, Entitlements, AI Settings, AI Test Connection | ✅ | ❌ | ❌ | System | No |
| Document Tools (list/get/create/update for Protah, Promes, RPPM, RPPH, Modul Ajar, LKPD, Media) | ✅ | ✅ | ✅ | `school` / `own` | No |
| Document AI Generation (7 `generate_*` tools) | ✅ | ✅ | ✅ | `school` / `own` | Rate limited (10/10m) |
| Document Exports (DOCX, PDF, PPTX) | ✅ | ✅ | ✅ | `school` / `own` | No |
| Assessment & Report Tools (list/get/create/update for PAUD assessments, exams, report cards, scores) | ✅ | ✅ | ✅ | `school` / `own` | No |
| Assessment AI Generation (`generate_exam`, `generate_report_narratives`) | ✅ | ✅ | ✅ | `school` / `own` | Rate limited (10/10m) |
| Assessment Exports (DOCX, PDF, XLSX) | ✅ | ✅ | ✅ | `school` / `own` | No |
| Delete Tools (13 tools) | ✅ | ✅ (own) | ❌ | `own` | **YES** |
| `siapajar_seed_curriculum_presets` | ✅ | ❌ | ❌ | System | No |

---

## 5. Base64 Export Response Format

All document export tools return a JSON object with base64 payload:

```json
{
  "filename": "Modul_Ajar_Matematika.docx",
  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "content_base64": "UEsDBBTAAA..."
}
```
