# company-gi MCP Server

Gibraltar company tools for AI agents. Calculate corporate tax payments, check compliance deadlines, and generate pre-filled PDF form packs for Gibraltar Companies House.

6 tools, no API key, no rate limiting.

## Tools

| Tool | Description | Returns |
|------|-------------|---------|
| `poa_calculator` | Calculate Payments on Account (corporate tax instalments) | JSON |
| `deadlines` | Calculate all compliance deadlines for a given year | JSON |
| `annual_return` | Generate pre-filled FAR01 annual return form | ZIP |
| `registered_office_change` | Generate office change forms (FREG01 + board resolution) | ZIP |
| `company_formation` | Generate full incorporation pack (5 FINC forms) | ZIP |
| `egov_account` | Generate eGov account application forms | PDF |

## Setup

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "company-gi": {
      "command": "npx",
      "args": ["tsx", "/path/to/company-gi-mcp/src/server.ts"],
      "env": {
        "COMPANY_GI_API_URL": "https://company.gi"
      }
    }
  }
}
```

### Claude Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "company-gi": {
      "command": "npx",
      "args": ["tsx", "/path/to/company-gi-mcp/src/server.ts"],
      "env": {
        "COMPANY_GI_API_URL": "https://company.gi"
      }
    }
  }
}
```

### Cursor / Windsurf

Same configuration format in your MCP settings file.

## How it works

This MCP server is a thin wrapper around the [company.gi REST API](https://company.gi/developers). Each tool validates input with Zod and forwards the request to the corresponding API endpoint. The actual business logic (tax calculations, PDF generation, deadline calculations) runs on the server.

- **JSON tools** (POA calculator, deadlines) return structured data
- **Binary tools** (annual return, office change, formation, eGov) return base64-encoded PDFs/ZIPs

## Example usage

Ask your AI assistant:

- "Calculate my payments on account for 2026 if last year's tax was 5000"
- "What are my compliance deadlines? My company was incorporated on 2023-06-15"
- "Generate an annual return form for company number 12345"
- "Create a company formation pack for a new company called Acme Limited"

## Links

- [API Documentation](https://company.gi/developers)
- [API Playground](https://company.gi/developers/playground)
- [OpenAPI Spec](https://company.gi/openapi.json)
- [company.gi](https://company.gi)

## License

MIT
