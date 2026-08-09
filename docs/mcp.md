# SiapAjar MCP Server

The SiapAjar MCP (Model Context Protocol) server exposes read-only application
data to AI assistants over the standard stdio transport defined by the MCP
specification.

## Architecture

- **Transport**: stdio (JSON-RPC 2.0 over stdin/stdout).
- **Auth**: API-key, passed as the `api_key` argument on every tool call.
  The server reads `SIAPAJAR_MCP_API_KEY` from the environment at startup.
- **Data access**: direct PostgreSQL queries via `pg`, reading the same database
  as the main AdonisJS application.
- **No side effects**: all tools are read-only.

## Available Tools

| Tool | Description |
|---|---|
| `siapajar_health` | Ping the database and return connection latency. |
| `siapajar_list_schools` | List schools stored in the application (max 200 rows). |

All tools share a required `api_key` string argument.

`siapajar_list_schools` accepts an optional `limit` integer (1-200, default 50).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SIAPAJAR_MCP_API_KEY` | Yes | Shared secret used to authenticate tool calls. |
| `DB_HOST` | Yes | PostgreSQL host (default: `127.0.0.1`). |
| `DB_PORT` | No | PostgreSQL port (default: `5432`). |
| `DB_USER` | Yes | PostgreSQL user (default: `siapajar`). |
| `DB_PASSWORD` | Yes | PostgreSQL password. |
| `DB_DATABASE` | Yes | PostgreSQL database name (default: `siapajar`). |

Copy `.env.example` to `.env` and fill in the values before running.

## Build

```bash
# Build the full application (includes the MCP server)
npm run build

# Or build only the MCP server
npm run mcp:build
```

The compiled server lands at `build/mcp/index.js`.

## Running

```bash
SIAPAJAR_MCP_API_KEY=<your-key> node build/mcp/index.js
# or via the npm script:
SIAPAJAR_MCP_API_KEY=<your-key> npm run mcp:start
```

The process reads JSON-RPC from stdin and writes responses to stdout.
Log output (if any) goes to stderr.

## Configuring Clients

### Claude Code (`claude_desktop_config.json` or project `.mcp.json`)

```json
{
  "mcpServers": {
    "siapajar": {
      "command": "node",
      "args": ["/absolute/path/to/siapajar/build/mcp/index.js"],
      "env": {
        "SIAPAJAR_MCP_API_KEY": "<your-key>",
        "DB_HOST": "127.0.0.1",
        "DB_PORT": "5432",
        "DB_USER": "siapajar",
        "DB_PASSWORD": "<db-password>",
        "DB_DATABASE": "siapajar"
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
      - /absolute/path/to/siapajar/build/mcp/index.js
    env:
      SIAPAJAR_MCP_API_KEY: "<your-key>"
      DB_HOST: "127.0.0.1"
      DB_PORT: "5432"
      DB_USER: siapajar
      DB_PASSWORD: "<db-password>"
      DB_DATABASE: siapajar
```

### Generic MCP Client (via npm script)

```json
{
  "command": "npm",
  "args": ["run", "mcp:start"],
  "cwd": "/absolute/path/to/siapajar",
  "env": {
    "SIAPAJAR_MCP_API_KEY": "<your-key>",
    "DB_HOST": "127.0.0.1",
    "DB_PASSWORD": "<db-password>"
  }
}
```

## Smoke Test

After building, verify the server responds correctly by piping two JSON-RPC
messages (initialize + tool call) in one batch:

```bash
# With a valid key — both initialize and tool call should succeed
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"siapajar_health","arguments":{"api_key":"test-key"}}}' \
  | SIAPAJAR_MCP_API_KEY=test-key DB_HOST=127.0.0.1 DB_USER=siapajar DB_PASSWORD=<pw> DB_DATABASE=siapajar \
    node build/mcp/index.js

# With a wrong key — tool call returns an auth error
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"0"}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"siapajar_health","arguments":{"api_key":"wrong-key"}}}' \
  | SIAPAJAR_MCP_API_KEY=test-key node build/mcp/index.js
```

The server emits one JSON-RPC response per input message; the tool response
body is a JSON string in `result.content[0].text`.

## Security Notes

- The API key is never written to logs or stdout.
- All tools are read-only; no mutations are performed.
- The server does not expose HTTP endpoints; attack surface is limited to
  processes that can write to its stdin.
- Rotate `SIAPAJAR_MCP_API_KEY` if it is compromised; restart the server to pick
  up the new value.
