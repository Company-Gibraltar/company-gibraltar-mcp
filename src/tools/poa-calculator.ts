import { z } from 'zod'
import { callToolApi } from '../lib/api-client.js'

export const poaCalculatorSchema = z.object({
  lastYearTax: z.string().optional().describe('Last year total tax liability in GBP. Provide this OR lastYearProfit.'),
  lastYearProfit: z.string().optional().describe('Last year taxable profit in GBP. Provide this OR lastYearTax.'),
  taxRate: z.string().optional().describe('Corporate tax rate percentage. Defaults to 15.'),
  paymentYear: z.string().optional().describe('Year for POA dates. Defaults to current year.'),
})

export async function handlePoaCalculator(args: z.infer<typeof poaCalculatorSchema>) {
  const result = await callToolApi('/api/tools/poa-calculator', args)
  if (result.type === 'json') {
    return { content: [{ type: 'text' as const, text: JSON.stringify(result.data, null, 2) }] }
  }
  throw new Error('Unexpected binary response from POA calculator')
}
