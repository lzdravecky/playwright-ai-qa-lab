import OpenAI from 'openai'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { triageJsonSchema, type TriageResult } from './schema'

async function main(): Promise<void> {
  // 1. Check configuration and input.
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }

  const inputPath = process.argv[2]

  if (!inputPath) {
    throw new Error('Usage: npx tsx ai/triage/triage.ts <input-file>')
  }

  // 2. Load agent instructions and failure evidence.
  const instructions = await readFile(resolve('ai/triage/instructions.md'), 'utf8')

  const evidence = await readFile(resolve(inputPath), 'utf8')

  // 3. Create the OpenAI client.
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 0,
  })

  console.log('Analyzing Playwright failure...')

  // 4. Ask the model to investigate the evidence.
  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    instructions,
    input: evidence,
    store: false,
    text: {
      format: {
        type: 'json_schema',
        name: 'triage_result',
        strict: true,
        schema: triageJsonSchema,
      },
    },
  })

  // 5. Check that a complete result was returned.
  if (response.status !== 'completed' || !response.output_text) {
    throw new Error(`AI response incomplete: ${response.status}`)
  }

  // 6. Parse and display the result.
  const result = JSON.parse(response.output_text) as TriageResult

  console.log('\n=== AI FAILURE TRIAGE RESULT ===')
  console.log(JSON.stringify(result, null, 2))

  const usage = response.usage

  if (usage) {
    // GPT-4.1 mini pricing in USD per 1 million tokens.
    const INPUT_PRICE = 0.4
    const CACHED_INPUT_PRICE = 0.1
    const OUTPUT_PRICE = 1.6

    const cachedTokens = usage.input_tokens_details?.cached_tokens ?? 0
    const regularInputTokens = usage.input_tokens - cachedTokens

    const inputCost = (regularInputTokens * INPUT_PRICE) / 1_000_000
    const cachedCost = (cachedTokens * CACHED_INPUT_PRICE) / 1_000_000
    const outputCost = (usage.output_tokens * OUTPUT_PRICE) / 1_000_000

    const totalCost = inputCost + cachedCost + outputCost

    console.log('\n=== API USAGE & COST ===')
    console.log('Model:', response.model)
    console.log('Input tokens:', usage.input_tokens)
    console.log('Cached input tokens:', cachedTokens)
    console.log('Output tokens:', usage.output_tokens)
    console.log('Total tokens:', usage.total_tokens)

    console.log('Input cost: $' + (inputCost + cachedCost).toFixed(8))
    console.log('Output cost: $' + outputCost.toFixed(8))
    console.log('Total estimated cost: $' + totalCost.toFixed(8))
  }
}

main().catch((error: unknown) => {
  console.error('Triage failed:', error)
  process.exitCode = 1
})
