import { z } from 'zod'
import { callToolApi } from '../lib/api-client.js'

export const registeredOfficeSchema = z.object({
  companyNumber: z.string().describe('Gibraltar company registration number'),
  companyName: z.string().describe('Full registered company name'),
  currentBuilding: z.string().optional().describe('Current office building/number'),
  currentStreet: z.string().optional().describe('Current office street'),
  building: z.string().describe('New office building/number'),
  street: z.string().describe('New office street'),
  dateOfChange: z.string().optional().describe('Date of change in YYYY-MM-DD format'),
  signatoryName: z.string().describe('Name of person signing the forms'),
  signatoryPosition: z.string().describe('Position of signatory (e.g. "Director")'),
  directorName: z.string().optional().describe('Director name if also updating service address'),
  directorTitle: z.string().optional().describe('Director title (Mr, Mrs, etc.)'),
  directorDOB: z.string().optional().describe('Director date of birth in YYYY-MM-DD format'),
})

export async function handleRegisteredOffice(args: z.infer<typeof registeredOfficeSchema>) {
  const result = await callToolApi('/api/tools/registered-office-change', args)
  if (result.type === 'binary') {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          message: 'Office change forms ZIP generated successfully',
          filename: result.filename,
          mimeType: result.mimeType,
          base64Data: result.base64Data,
        }),
      }],
    }
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify(result.data, null, 2) }] }
}
