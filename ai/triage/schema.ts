export const failureCategories = [
  'APP_BUG',
  'TEST_BUG',
  'ENVIRONMENT',
  'FLAKY',
  'REQUIREMENT_GAP',
  'INCONCLUSIVE',
] as const

export type FailureCategory = (typeof failureCategories)[number]

export type Confidence = 'HIGH' | 'MEDIUM' | 'LOW'

export interface TriageResult {
  testName: string
  category: FailureCategory
  confidence: Confidence
  summary: string
  evidence: string[]
  rootCause: string
  recommendation: string
  missingEvidence: string[]
}

export const triageJsonSchema = {
  type: 'object',
  properties: {
    testName: { type: 'string' },
    category: {
      type: 'string',
      enum: failureCategories,
    },
    confidence: {
      type: 'string',
      enum: ['HIGH', 'MEDIUM', 'LOW'],
    },
    summary: { type: 'string' },
    evidence: {
      type: 'array',
      items: { type: 'string' },
    },
    rootCause: { type: 'string' },
    recommendation: { type: 'string' },
    missingEvidence: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'testName',
    'category',
    'confidence',
    'summary',
    'evidence',
    'rootCause',
    'recommendation',
    'missingEvidence',
  ],
  additionalProperties: false,
} as const
