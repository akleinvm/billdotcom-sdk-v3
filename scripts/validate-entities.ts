#!/usr/bin/env npx tsx

/**
 * Entity Validation Script
 *
 * This script validates that your Zod schemas match the actual Bill.com API responses.
 * It helps identify:
 * - Missing fields in your schemas
 * - Incorrect types
 * - Extra fields returned by the API that you're not capturing
 *
 * Usage: npx tsx scripts/validate-entities.ts
 */

import { config } from 'dotenv'
import { z } from 'zod'
import { BillClient } from '../src/client'
import { VendorSchema } from '../src/schemas/entities/vendor'
import { BillSchema } from '../src/schemas/entities/bill'
import { ChartOfAccountSchema } from '../src/schemas/entities/chart-of-account'
import { AccountingClassSchema } from '../src/schemas/entities/accounting-class'

config()

interface ValidationResult {
  entity: string
  success: boolean
  totalRecords: number
  validRecords: number
  errors: Array<{
    recordId: string
    issues: z.ZodIssue[]
  }>
  extraFields: Set<string>
}

interface EntityConfig {
  name: string
  schema: z.ZodTypeAny
  fetch: (client: BillClient) => Promise<{ results: unknown[] }>
}

// Helper to find extra fields in API response not in schema
function findExtraFields(data: unknown, schema: z.ZodTypeAny, prefix = ''): string[] {
  const extraFields: string[] = []

  if (typeof data !== 'object' || data === null) {
    return extraFields
  }

  // Get schema shape if it's an object schema
  const schemaShape = (schema as z.ZodObject<z.ZodRawShape>)._def?.shape?.()

  if (!schemaShape) {
    return extraFields
  }

  for (const key of Object.keys(data as Record<string, unknown>)) {
    const fieldPath = prefix ? `${prefix}.${key}` : key

    if (!(key in schemaShape)) {
      extraFields.push(fieldPath)
    } else {
      // Recursively check nested objects
      const value = (data as Record<string, unknown>)[key]
      const fieldSchema = schemaShape[key]

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Unwrap optional schemas
        let innerSchema = fieldSchema
        if (innerSchema instanceof z.ZodOptional) {
          innerSchema = innerSchema._def.innerType
        }
        if (innerSchema instanceof z.ZodNullable) {
          innerSchema = innerSchema._def.innerType
        }

        extraFields.push(...findExtraFields(value, innerSchema, fieldPath))
      }
    }
  }

  return extraFields
}

async function validateEntity(
  client: BillClient,
  entityConfig: EntityConfig
): Promise<ValidationResult> {
  const result: ValidationResult = {
    entity: entityConfig.name,
    success: true,
    totalRecords: 0,
    validRecords: 0,
    errors: [],
    extraFields: new Set(),
  }

  try {
    console.log(`\nFetching ${entityConfig.name} records...`)
    const response = await entityConfig.fetch(client)
    result.totalRecords = response.results.length

    if (result.totalRecords === 0) {
      console.log(`  ⚠️  No ${entityConfig.name} records found to validate`)
      return result
    }

    for (const record of response.results) {
      const recordId = (record as { id?: string }).id ?? 'unknown'

      // Check for extra fields
      const extras = findExtraFields(record, entityConfig.schema)
      extras.forEach(field => result.extraFields.add(field))

      // Validate against schema
      const parseResult = entityConfig.schema.safeParse(record)

      if (parseResult.success) {
        result.validRecords++
      } else {
        result.success = false
        result.errors.push({
          recordId,
          issues: parseResult.error.issues,
        })
      }
    }
  } catch (error) {
    result.success = false
    console.error(`  ❌ Error fetching ${entityConfig.name}:`, error)
  }

  return result
}

function printResult(result: ValidationResult): void {
  const statusIcon = result.success ? '✅' : '❌'
  console.log(`\n${statusIcon} ${result.entity}`)
  console.log(`   Records: ${result.validRecords}/${result.totalRecords} valid`)

  if (result.extraFields.size > 0) {
    console.log(`   ⚠️  Extra fields in API (not in schema):`)
    for (const field of result.extraFields) {
      console.log(`      - ${field}`)
    }
  }

  if (result.errors.length > 0) {
    console.log(`   ❌ Validation errors:`)
    for (const error of result.errors.slice(0, 5)) { // Show first 5 errors
      console.log(`      Record ${error.recordId}:`)
      for (const issue of error.issues) {
        console.log(`        - ${issue.path.join('.')}: ${issue.message}`)
      }
    }
    if (result.errors.length > 5) {
      console.log(`      ... and ${result.errors.length - 5} more errors`)
    }
  }
}

async function main(): Promise<void> {
  console.log('🔍 Bill.com SDK Entity Validation')
  console.log('==================================\n')

  // Validate environment
  const requiredEnvVars = ['BILL_USERNAME', 'BILL_PASSWORD', 'BILL_ORGANIZATION_ID', 'BILL_DEV_KEY']
  const missingVars = requiredEnvVars.filter(v => !process.env[v])

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(v => console.error(`   - ${v}`))
    console.error('\nPlease copy .env.example to .env and fill in your credentials.')
    process.exit(1)
  }

  // Initialize client
  const client = new BillClient({
    username: process.env.BILL_USERNAME!,
    password: process.env.BILL_PASSWORD!,
    organizationId: process.env.BILL_ORGANIZATION_ID!,
    devKey: process.env.BILL_DEV_KEY!,
    environment: (process.env.BILL_ENVIRONMENT as 'sandbox' | 'production') ?? 'sandbox',
  })

  console.log('Logging in to Bill.com...')
  await client.login()
  console.log('✅ Logged in successfully\n')

  // Define entities to validate
  const entities: EntityConfig[] = [
    {
      name: 'Vendor',
      schema: VendorSchema,
      fetch: async (c) => c.vendors.list({ max: 10 }),
    },
    {
      name: 'Bill',
      schema: BillSchema,
      fetch: async (c) => c.bills.list({ max: 10 }),
    },
    {
      name: 'ChartOfAccount',
      schema: ChartOfAccountSchema,
      fetch: async (c) => c.chartOfAccounts.list({ max: 10 }),
    },
    {
      name: 'AccountingClass',
      schema: AccountingClassSchema,
      fetch: async (c) => c.accountingClasses.list({ max: 10 }),
    },
  ]

  // Validate each entity
  const results: ValidationResult[] = []

  for (const entityConfig of entities) {
    const result = await validateEntity(client, entityConfig)
    results.push(result)
    printResult(result)
  }

  // Summary
  console.log('\n\n📊 Summary')
  console.log('==========')

  const passed = results.filter(r => r.success && r.extraFields.size === 0).length
  const warnings = results.filter(r => r.success && r.extraFields.size > 0).length
  const failed = results.filter(r => !r.success).length

  console.log(`✅ Passed: ${passed}`)
  console.log(`⚠️  Warnings (extra fields): ${warnings}`)
  console.log(`❌ Failed: ${failed}`)

  if (failed > 0) {
    console.log('\n❌ Some entities have schema mismatches!')
    console.log('   Please update your Zod schemas to match the actual API responses.')
    process.exit(1)
  }

  if (warnings > 0) {
    console.log('\n⚠️  Some entities have extra fields not captured in schemas.')
    console.log('   Consider adding these fields to your schemas for completeness.')
  }

  if (passed === results.length) {
    console.log('\n✅ All entity schemas are accurate!')
  }
}

main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
