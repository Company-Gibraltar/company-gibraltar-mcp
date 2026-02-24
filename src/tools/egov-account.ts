import { z } from 'zod'
import { callToolApi } from '../lib/api-client.js'

const depositSchema = z.object({
  title: z.string().optional().default(''),
  dob: z.string().optional().default(''),
  forenames: z.string(),
  surname: z.string(),
  building: z.string().optional().default(''),
  street: z.string().optional().default(''),
  town: z.string().optional().default(''),
  region: z.string().optional().default(''),
  postcode: z.string().optional().default(''),
  country: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  idType: z.string().optional().default('passport'),
  jobTitle: z.string().optional().default(''),
  signatoryName: z.string().optional().default(''),
  signDate: z.string().optional().default(''),
})

const webSchema = z.object({
  depositAccountName: z.string(),
  depositAccountNumber: z.string(),
  nameSearchUsername: z.string().optional().default(''),
  nameSearchPassword: z.string().optional().default(''),
  profileUsername: z.string().optional().default(''),
  profilePassword: z.string().optional().default(''),
  signatoryName: z.string().optional().default(''),
  signDate: z.string().optional().default(''),
})

const uidSchema = z.object({
  title: z.string().optional().default(''),
  initials: z.string().optional().default(''),
  forenames: z.string(),
  surname: z.string(),
  honours: z.string().optional().default(''),
  otherForenames: z.string().optional().default(''),
  formerSurnames: z.string().optional().default(''),
  dob: z.string().optional().default(''),
  nationality: z.string().optional().default(''),
  nationalityOfOrigin: z.string().optional().default(''),
  occupation: z.string().optional().default(''),
  building: z.string().optional().default(''),
  street: z.string().optional().default(''),
  town: z.string().optional().default(''),
  region: z.string().optional().default(''),
  postcode: z.string().optional().default(''),
  country: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  idType: z.string().optional().default('passport'),
  signatoryName: z.string().optional().default(''),
  signDate: z.string().optional().default(''),
})

export const egovAccountSchema = z.object({
  deposit: depositSchema.optional().describe('Deposit account application data'),
  web: webSchema.optional().describe('Web filing account application data'),
  uid: uidSchema.optional().describe('Unique identifier application data'),
})

export async function handleEgovAccount(args: z.infer<typeof egovAccountSchema>) {
  const result = await callToolApi('/api/tools/egov-account', args)
  if (result.type === 'binary') {
    return {
      content: [{
        type: 'text' as const,
        text: JSON.stringify({
          message: 'eGov account forms PDF generated successfully',
          filename: result.filename,
          mimeType: result.mimeType,
          base64Data: result.base64Data,
        }),
      }],
    }
  }
  return { content: [{ type: 'text' as const, text: JSON.stringify(result.data, null, 2) }] }
}
