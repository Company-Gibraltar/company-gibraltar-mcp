const BASE_URL = process.env.COMPANY_GI_API_URL || 'http://localhost:3000'

export interface ApiJsonResult {
  type: 'json'
  data: unknown
}

export interface ApiBinaryResult {
  type: 'binary'
  base64Data: string
  filename: string
  mimeType: string
}

export type ApiResult = ApiJsonResult | ApiBinaryResult

export async function callToolApi(
  path: string,
  body: Record<string, unknown>
): Promise<ApiResult> {
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    let message: string
    try {
      const parsed = JSON.parse(errorBody)
      message = parsed.error || errorBody
    } catch {
      message = errorBody
    }
    throw new Error(`API error (${response.status}): ${message}`)
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const data = await response.json()
    return { type: 'json', data }
  }

  // Binary response (PDF, ZIP)
  const buffer = Buffer.from(await response.arrayBuffer())
  const disposition = response.headers.get('content-disposition') || ''
  const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/)
  const filename = filenameMatch?.[1] || 'download'

  return {
    type: 'binary',
    base64Data: buffer.toString('base64'),
    filename,
    mimeType: contentType.split(';')[0].trim(),
  }
}
