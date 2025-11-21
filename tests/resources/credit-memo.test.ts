import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client.js'
import type { CreditMemo, CreateCreditMemoRequest, Customer } from '../../src/types/index.js'
import { testConfig, validateTestConfig } from '../setup.js'

describe('CreditMemoResource', () => {
  let client: BillClient
  const createdCreditMemoIds: string[] = []
  const createdCustomerIds: string[] = []
  let testCustomer: Customer
  let testCreditMemo: CreditMemo

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Create a test customer for credit memos
    testCustomer = await client.customers.create({
      name: `Test CreditMemo Customer ${Date.now()}`,
      email: 'creditmemo-test@example.com',
    })
    createdCustomerIds.push(testCustomer.id)

    // Create a test credit memo for get/update tests
    const today = new Date()

    testCreditMemo = await client.creditMemos.create({
      customerId: testCustomer.id,
      creditDate: today.toISOString().split('T')[0],
      referenceNumber: `CM-TEST-${Date.now()}`,
      description: 'Test credit memo',
      creditMemoLineItems: [
        {
          description: 'Test Credit',
          price: 50,
          quantity: 1,
        },
      ],
    })
    createdCreditMemoIds.push(testCreditMemo.id)
  })

  afterAll(async () => {
    // Cleanup: archive all created credit memos
    for (const id of createdCreditMemoIds) {
      try {
        await client.creditMemos.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
    // Cleanup customers
    for (const id of createdCustomerIds) {
      try {
        await client.customers.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
    await client.logout()
  })

  describe('list', () => {
    it('should list credit memos', async () => {
      const result = await client.creditMemos.list()
      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list credit memos with pagination', async () => {
      const result = await client.creditMemos.list({ max: 5 })
      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(5)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should filter credit memos by customer', async () => {
      const result = await client.creditMemos.list({
        filters: [
          { field: 'customerId', op: 'eq', value: testCustomer.id },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((creditMemo) => {
        expect(creditMemo.customerId).toBe(testCustomer.id)
      })
    })

    it('should list active credit memos only', async () => {
      const result = await client.creditMemos.list({
        filters: [
          { field: 'archived', op: 'eq', value: false },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((creditMemo) => {
        expect(creditMemo.archived).toBe(false)
      })
    })
  })

  describe('create', () => {
    it('should create a credit memo with minimal fields', async () => {
      const today = new Date()

      const creditMemoData: CreateCreditMemoRequest = {
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        creditMemoLineItems: [
          {
            description: 'Basic Credit',
            price: 25,
            quantity: 1,
          },
        ],
      }

      const creditMemo = await client.creditMemos.create(creditMemoData)
      createdCreditMemoIds.push(creditMemo.id)

      expect(creditMemo).toBeDefined()
      expect(creditMemo.id).toBeDefined()
      expect(creditMemo.customerId).toBe(testCustomer.id)
      expect(creditMemo.archived).toBe(false)
    })

    it('should create a credit memo with reference number and description', async () => {
      const today = new Date()

      const creditMemoData: CreateCreditMemoRequest = {
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        referenceNumber: `CM-REF-${Date.now()}`,
        description: 'Full details credit memo',
        creditMemoLineItems: [
          {
            description: 'Credit with details',
            price: 75,
            quantity: 1,
          },
        ],
      }

      const creditMemo = await client.creditMemos.create(creditMemoData)
      createdCreditMemoIds.push(creditMemo.id)

      expect(creditMemo).toBeDefined()
      expect(creditMemo.referenceNumber).toBe(creditMemoData.referenceNumber)
      expect(creditMemo.description).toBe(creditMemoData.description)
    })

    it('should create a credit memo with multiple line items', async () => {
      const today = new Date()

      const creditMemoData: CreateCreditMemoRequest = {
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        creditMemoLineItems: [
          {
            description: 'Credit Item A',
            price: 30,
            quantity: 2,
          },
          {
            description: 'Credit Item B',
            price: 20,
            quantity: 1,
          },
        ],
      }

      const creditMemo = await client.creditMemos.create(creditMemoData)
      createdCreditMemoIds.push(creditMemo.id)

      expect(creditMemo).toBeDefined()
      expect(creditMemo.creditMemoLineItems).toBeDefined()
      expect(creditMemo.creditMemoLineItems?.length).toBe(2)
    })

    it('should create a credit memo with amount-based line items', async () => {
      const today = new Date()

      const creditMemoData: CreateCreditMemoRequest = {
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        creditMemoLineItems: [
          {
            description: 'Fixed Amount Credit',
            amount: 100,
          },
        ],
      }

      const creditMemo = await client.creditMemos.create(creditMemoData)
      createdCreditMemoIds.push(creditMemo.id)

      expect(creditMemo).toBeDefined()
      expect(creditMemo.creditMemoLineItems).toBeDefined()
    })
  })

  describe('get', () => {
    it('should get credit memo by id', async () => {
      const creditMemo = await client.creditMemos.get(testCreditMemo.id)
      expect(creditMemo).toBeDefined()
      expect(creditMemo.id).toBe(testCreditMemo.id)
      expect(creditMemo.customerId).toBe(testCustomer.id)
    })

    it('should throw error for non-existent credit memo', async () => {
      await expect(client.creditMemos.get('non-existent-id')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update credit memo description', async () => {
      const today = new Date()

      const created = await client.creditMemos.create({
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        description: 'Original description',
        creditMemoLineItems: [
          {
            description: 'Test Credit',
            price: 50,
            quantity: 1,
          },
        ],
      })
      createdCreditMemoIds.push(created.id)

      const newDescription = 'Updated description'
      const updated = await client.creditMemos.update(created.id, {
        description: newDescription,
      })

      expect(updated).toBeDefined()
      expect(updated.description).toBe(newDescription)
    })

    it('should update credit memo reference number', async () => {
      const today = new Date()

      const created = await client.creditMemos.create({
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        referenceNumber: `CM-ORIG-${Date.now()}`,
        creditMemoLineItems: [
          {
            description: 'Test Credit',
            price: 50,
            quantity: 1,
          },
        ],
      })
      createdCreditMemoIds.push(created.id)

      const newRefNumber = `CM-UPD-${Date.now()}`
      const updated = await client.creditMemos.update(created.id, {
        referenceNumber: newRefNumber,
      })

      expect(updated).toBeDefined()
      expect(updated.referenceNumber).toBe(newRefNumber)
    })
  })

  describe('archive and restore', () => {
    it('should archive a credit memo', async () => {
      const today = new Date()

      const created = await client.creditMemos.create({
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        creditMemoLineItems: [
          {
            description: 'Test Credit',
            price: 50,
            quantity: 1,
          },
        ],
      })

      const archived = await client.creditMemos.archive(created.id)
      expect(archived).toBeDefined()
      expect(archived.archived).toBe(true)
    })

    it('should restore an archived credit memo', async () => {
      const today = new Date()

      const created = await client.creditMemos.create({
        customerId: testCustomer.id,
        creditDate: today.toISOString().split('T')[0],
        creditMemoLineItems: [
          {
            description: 'Test Credit',
            price: 50,
            quantity: 1,
          },
        ],
      })
      createdCreditMemoIds.push(created.id)

      await client.creditMemos.archive(created.id)
      const restored = await client.creditMemos.restore(created.id)

      expect(restored).toBeDefined()
      expect(restored.archived).toBe(false)
    })
  })
})
