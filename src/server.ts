import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

import { poaCalculatorSchema, handlePoaCalculator } from './tools/poa-calculator.js'
import { deadlinesSchema, handleDeadlines } from './tools/deadlines.js'
import { annualReturnSchema, handleAnnualReturn } from './tools/annual-return.js'
import { registeredOfficeSchema, handleRegisteredOffice } from './tools/registered-office.js'
import { companyFormationSchema, handleCompanyFormation } from './tools/company-formation.js'
import { egovAccountSchema, handleEgovAccount } from './tools/egov-account.js'

const server = new McpServer({
  name: 'company-gi',
  version: '1.0.0',
})

server.tool(
  'poa_calculator',
  'Calculate Gibraltar Payments on Account. Splits the annual corporate tax liability into two equal payments due 28 February and 30 September. Provide either lastYearTax or lastYearProfit with optional taxRate.',
  poaCalculatorSchema.shape,
  handlePoaCalculator,
)

server.tool(
  'deadlines',
  'Calculate all Gibraltar company compliance deadlines for a given year. Returns annual return, accounts filing, tax return (CT1), payments on account, and PAYE deadlines based on incorporation date and accounting reference date.',
  deadlinesSchema.shape,
  handleDeadlines,
)

server.tool(
  'annual_return',
  'Generate a pre-filled FAR01 annual return form for Gibraltar Companies House. Returns a ZIP containing the filled PDF and a signing guide.',
  annualReturnSchema.shape,
  handleAnnualReturn,
)

server.tool(
  'registered_office_change',
  'Generate forms to change a Gibraltar company registered office address. Returns a ZIP with FREG01 form, board resolution, and guide. Optionally includes FDMS02 for director service address update.',
  registeredOfficeSchema.shape,
  handleRegisteredOffice,
)

server.tool(
  'company_formation',
  'Generate all forms needed to incorporate a new Gibraltar company. Returns a ZIP with FINC01 application, FINC02 secretary consent, FINC30 memorandum, FINC40 model articles, FINC23 compliance statement, and a formation guide.',
  companyFormationSchema.shape,
  handleCompanyFormation,
)

server.tool(
  'egov_account',
  'Generate Gibraltar eGov account application forms. Provide at least one of: deposit (deposit account), web (web filing account), uid (unique identifier). Returns a PDF with selected forms and a signing guide.',
  egovAccountSchema.shape,
  handleEgovAccount,
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('MCP server error:', error)
  process.exit(1)
})
