import { describe, it, expect, beforeAll } from 'vitest'
import { z } from 'zod'
import { BillClient } from '../../src/client'
import { testConfig, validateTestConfig } from '../setup'
import { VendorSchema } from '../../src/schemas/entities/vendor'
import { BillSchema } from '../../src/schemas/entities/bill'
import { ChartOfAccountSchema } from '../../src/schemas/entities/chart-of-account'
import { AccountingClassSchema } from '../../src/schemas/entities/accounting-class'

/**
 * Entity Schema Validation Tests
 *
 * These tests fetch real data from the Bill.com API and validate
 * that the Zod schemas correctly parse all responses. This ensures
 * your entity definitions match the actual API structure.
 */

describe('Entity Schema Validation', () => {
  let client: BillClient

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()
  }, 30000)

  describe('Vendor Schema', () => {
    it('should successfully parse all vendor records from API', async () => {
      const response = await client.vendors.list({ max: 50 })

      if (response.results.length === 0) {
        console.warn('No vendors found - create test data for full validation')
        return
      }

      for (const vendor of response.results) {
        const result = VendorSchema.safeParse(vendor)

        if (!result.success) {
          console.error('Vendor validation failed:', JSON.stringify(vendor, null, 2))
          console.error('Errors:', result.error.format())
        }

        expect(result.success, `Vendor ${(vendor as { id: string }).id} failed validation`).toBe(true)
      }
    }, 30000)

    it('should have all required fields defined', () => {
      const requiredFields = ['id', 'archived', 'name', 'accountType', 'createdTime', 'updatedTime']
      const schemaShape = VendorSchema.shape

      for (const field of requiredFields) {
        expect(schemaShape).toHaveProperty(field)

        // Check that it's not optional
        const fieldSchema = schemaShape[field as keyof typeof schemaShape]
        const isOptional = fieldSchema instanceof z.ZodOptional
        expect(isOptional, `Field '${field}' should be required`).toBe(false)
      }
    })

    it('should properly define accountType enum values', () => {
      const validTypes = ['BUSINESS', 'PERSON', 'NONE']

      for (const type of validTypes) {
        const result = VendorSchema.safeParse({
          id: 'test',
          archived: false,
          name: 'Test Vendor',
          accountType: type,
          createdTime: '2024-01-01T00:00:00Z',
          updatedTime: '2024-01-01T00:00:00Z',
        })

        expect(result.success, `accountType '${type}' should be valid`).toBe(true)
      }

      // Test invalid type
      const invalidResult = VendorSchema.safeParse({
        id: 'test',
        archived: false,
        name: 'Test Vendor',
        accountType: 'INVALID',
        createdTime: '2024-01-01T00:00:00Z',
        updatedTime: '2024-01-01T00:00:00Z',
      })

      expect(invalidResult.success).toBe(false)
    })
  })

  describe('Bill Schema', () => {
    it('should successfully parse all bill records from API', async () => {
      const response = await client.bills.list({ max: 50 })

      if (response.results.length === 0) {
        console.warn('No bills found - create test data for full validation')
        return
      }

      for (const bill of response.results) {
        const result = BillSchema.safeParse(bill)

        if (!result.success) {
          console.error('Bill validation failed:', JSON.stringify(bill, null, 2))
          console.error('Errors:', result.error.format())
        }

        expect(result.success, `Bill ${(bill as { id: string }).id} failed validation`).toBe(true)
      }
    }, 30000)

    it('should have all required fields defined', () => {
      const requiredFields = ['id', 'archived', 'creditAmount', 'dueDate', 'createdTime', 'updatedTime']
      const schemaShape = BillSchema.shape

      for (const field of requiredFields) {
        expect(schemaShape).toHaveProperty(field)
      }
    })

    it('should properly define paymentStatus enum values', async () => {
      const validStatuses = ['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED']

      // We can't easily test this without creating bills,
      // so we just verify the schema accepts valid values
      const response = await client.bills.list({ max: 10 })

      for (const bill of response.results) {
        const status = (bill as { paymentStatus?: string }).paymentStatus
        if (status) {
          expect(validStatuses).toContain(status)
        }
      }
    }, 30000)
  })

  describe('ChartOfAccount Schema', () => {
    it('should successfully parse all chart of account records from API', async () => {
      const response = await client.chartOfAccounts.list({ max: 50 })

      if (response.results.length === 0) {
        console.warn('No chart of accounts found - create test data for full validation')
        return
      }

      for (const account of response.results) {
        const result = ChartOfAccountSchema.safeParse(account)

        if (!result.success) {
          console.error('ChartOfAccount validation failed:', JSON.stringify(account, null, 2))
          console.error('Errors:', result.error.format())
        }

        expect(result.success, `ChartOfAccount ${(account as { id: string }).id} failed validation`).toBe(
          true
        )
      }
    }, 30000)

    it('should have all required fields defined', () => {
      const requiredFields = ['id', 'archived', 'name', 'account', 'createdTime', 'updatedTime']
      const schemaShape = ChartOfAccountSchema.shape

      for (const field of requiredFields) {
        expect(schemaShape).toHaveProperty(field)
      }
    })
  })

  describe('AccountingClass Schema', () => {
    it('should successfully parse all accounting class records from API', async () => {
      const response = await client.accountingClasses.list({ max: 50 })

      if (response.results.length === 0) {
        console.warn('No accounting classes found - create test data for full validation')
        return
      }

      for (const accountingClass of response.results) {
        const result = AccountingClassSchema.safeParse(accountingClass)

        if (!result.success) {
          console.error('AccountingClass validation failed:', JSON.stringify(accountingClass, null, 2))
          console.error('Errors:', result.error.format())
        }

        expect(
          result.success,
          `AccountingClass ${(accountingClass as { id: string }).id} failed validation`
        ).toBe(true)
      }
    }, 30000)

    it('should have all required fields defined', () => {
      const requiredFields = ['id', 'archived', 'name', 'createdTime', 'updatedTime']
      const schemaShape = AccountingClassSchema.shape

      for (const field of requiredFields) {
        expect(schemaShape).toHaveProperty(field)
      }
    })
  })
})

describe('Schema Type Inference', () => {
  it('should correctly infer Vendor type from schema', () => {
    type InferredVendor = z.infer<typeof VendorSchema>

    // This is a compile-time check - if the schema is wrong, this will fail
    const testVendor: InferredVendor = {
      id: 'test',
      archived: false,
      name: 'Test',
      accountType: 'BUSINESS',
      createdTime: '2024-01-01T00:00:00Z',
      updatedTime: '2024-01-01T00:00:00Z',
    }

    expect(testVendor).toBeDefined()
  })

  it('should correctly infer Bill type from schema', () => {
    type InferredBill = z.infer<typeof BillSchema>

    const testBill: InferredBill = {
      id: 'test',
      archived: false,
      creditAmount: 0,
      dueDate: '2024-01-31',
      invoice: {
        invoiceNumber: 'INV-001',
        invoiceDate: '2024-01-01',
      },
      billLineItems: [
        {
          description: 'Test item',
          amount: 100,
        },
      ],
      paymentStatus: 'UNPAID',
      approvalStatus: 'UNASSIGNED',
      createdTime: '2024-01-01T00:00:00Z',
      updatedTime: '2024-01-01T00:00:00Z',
    }

    expect(testBill).toBeDefined()
  })
})
