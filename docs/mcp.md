# SiapAjar MCP Server & Security Architecture

The SiapAjar MCP (Model Context Protocol) server exposes application data and services to AI assistants (Hermes, VSCode extensions, Claude Code, etc.) over dual transports: JSON-RPC over `stdio` and **Streamable HTTP Transport** at `POST /mcp`.

---

## 1. Security & Authentication Architecture

- **Per-User API Keys**: Identity is strictly bound to per-user API keys stored as SHA-256 hashes in the `mcp_keys` database table.
- **Key Prefix & Format**: API keys use the `siapajar_mcp_` or `sk_mcp_` prefix followed by a secure hex string.
- **HTTP Transport Auth**: Supports standard `Authorization: Bearer <api_key>` headers over HTTP (`POST /mcp`). An `AsyncLocalStorage` context automatically binds the Bearer token to MCP tool execution contexts, making the `api_key` argument optional in JSON-RPC tool call payloads over HTTP.
- **RBAC (Role-Based Access Control)**: Every tool enforces role metadata (`admin`, `guru`, `kepala_sekolah`).
- **Tenant & Ownership Scoping**:
  - `admin`: Unconstrained system-wide access.
  - `kepala_sekolah`: Scope restricted to school data (`school_id`). Blocked from destructive tool operations.
  - `guru`: Scope restricted to resources created by/owned by the teacher (`user_id`).
- **Destructive Operation Confirmations**: All 13 resource delete tools + `siapajar_update_academic_year` require an explicit `confirm: true` parameter.
- **Rate Limiting & Protection**:
  - **HTTP Endpoint Rate Limiting**: Per-IP throttling of 60 requests/min and per-key throttling of 120 requests/min on `POST /mcp`.
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

## 3. Server Discovery & Metadata (`GET /.well-known/mcp`)

Clients can auto-discover endpoint capabilities by sending a GET request:

```bash
curl -X GET https://siapajar.farizrafiqi.dev/.well-known/mcp
```

---

## 4. Client Configuration Examples

### 4.1. Hermes (`.hermes/config.yaml`)

**HTTP Transport (Recommended):**
```yaml
mcp_servers:
  siapajar:
    url: "https://siapajar.farizrafiqi.dev/mcp"
    transport: "http"
    headers:
      Authorization: "Bearer siapajar_mcp_..."
```

**Stdio Transport:**
```yaml
mcpServers:
  siapajar:
    command: "node"
    args: ["ace", "mcp:serve"]
    env:
      SIAPAJAR_MCP_API_KEY: "siapajar_mcp_..."
      NODE_ENV: "development"
```

### 4.2. Claude Code CLI

**HTTP Transport (via CLI command):**
```bash
claude mcp add siapajar https://siapajar.farizrafiqi.dev/mcp --header "Authorization: Bearer siapajar_mcp_..."
```

**Config File (`~/.claude.json`):**
```json
{
  "mcpServers": {
    "siapajar": {
      "url": "https://siapajar.farizrafiqi.dev/mcp",
      "headers": {
        "Authorization": "Bearer siapajar_mcp_..."
      }
    }
  }
}
```

### 4.3. VSCode / Cursor / Claude Desktop

**HTTP Transport (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "siapajar-remote": {
      "url": "https://siapajar.farizrafiqi.dev/mcp",
      "headers": {
        "Authorization": "Bearer siapajar_mcp_..."
      }
    }
  }
}
```

### 4.4. Raw cURL / JSON-RPC Example

```bash
curl -X POST https://siapajar.farizrafiqi.dev/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer siapajar_mcp_..." \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "siapajar_health",
      "arguments": {}
    }
  }'
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
