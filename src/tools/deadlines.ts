import { z } from 'zod'
import { callToolApi } from '../lib/api-client.js'

export const deadlinesSchema = z.object({
  incorporationDate: z.string().describe('Company incorporation date in YYYY-MM-DD format'),
  accountingRefMonth: z.string().optional().describe('Accounting reference date month (1-12). Defaults to 12.'),
  accountingRefDay: z.string().optional().describe('Accounting reference date day. Defaults to 31.'),
  year: z.string().optional().describe('Target year for deadlines. Defaults to current year.'),
})

export async function handleDeadlines(args: z.infer<typeof deadlinesSchema>) {
  const result = await callToolApi('/api/tools/deadlines', args)
  if (result.type === 'json') {
    return { content: [{ type: 'text' as const, text: JSON.stringify(result.data, null, 2) }] }
  }
  throw new Error('Unexpected binary response from deadlines calculator')
}
