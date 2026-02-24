import { z } from 'zod'
import { callToolApi } from '../lib/api-client.js'

const directorSchema = z.object({
  id: z.string().optional(),
  fullName: z.string(),
  formerNames: z.string().optional().default(''),
  dateOfBirth: z.string().optional().default(''),
  nationality: z.string().optional().default(''),
  occupation: z.string().optional().default(''),
  residentialAddress: z.string().optional().default(''),
  serviceAddress: z.string().optional().default(''),
})

const shareholderSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional().default(''),
  fullName: z.string(),
  address: z.string().optional().default(''),
  numberOfShares: z.string(),
})

export const companyFormationSchema = z.object({
  companyName: z.string().describe('Proposed company name (without "Limited" suffix)'),
  backupName1: z.string().optional().default(''),
  backupName2: z.string().optional().default(''),
  directors: z.array(directorSchema).min(1).describe('At least one director is required'),
  secretaryType: z.enum(['individual', 'company']).optional(),
  secretaryName: z.string().optional().default(''),
  secretaryAddress: z.string().optional().default(''),
  secretaryCompanyNumber: z.string().optional().default(''),
  totalShares: z.string().describe('Total number of shares to issue'),
  shareValue: z.string().describe('Nominal value per share in GBP'),
  shareholders: z.array(shareholderSchema).min(1).describe('At least one shareholder is required'),
  registeredOffice: z.object({
    building: z.string().optional().default(''),
    street: z.string().optional().default(''),
    town: z.string().optional().default(''),
    region: z.string().optional().default(''),
    postcode: z.string().optional().default(''),
    country: z.string().optional().default(''),
  }).optional(),
  contactEmail: z.string().optional().default(''),
  sicCode: z.string().optional().default(''),
  complianceSigner: z.string().optional().default(''),
  complianceSignerRole: z.enum(['director', 'secretary']).optional(),
})

export async function handleCompanyFormation(args: z.infer<typeof companyFormationSchema>) {
  const result = await callToolApi('/api/tools/company-formation', args)
  if (result.type === 'binary') {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          message: 'Company formation forms ZIP generated successfully',
          filename: result.filename,
          mimeType: result.mimeType,
          base64Data: result.base64Data,
        }),
      }],
    }
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify(result.data, null, 2) }] }
}
