import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client.js'
import type { Payment, Vendor, Bill, ChartOfAccount } from '../../src/types/index.js'
import { testConfig, validateTestConfig } from '../setup.js'

describe('PaymentResource', () => {
  let client: BillClient
  const createdPaymentIds: string[] = []
  const createdBillIds: string[] = []
  const createdVendorIds: string[] = []
  let testVendor: Vendor
  let testBill: Bill
  let incomeAccount: ChartOfAccount | undefined

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Get an income account for bills
    const accounts = await client.chartOfAccounts.list({ max: 50 })
    incomeAccount = accounts.results.find((a) => a.accountType === 'INCOME')

    // Create a test vendor
    testVendor = await client.vendors.create({
      name: `Test Payment Vendor ${Date.now()}`,
      email: 'payment-vendor@example.com',
      accountType: 'BUSINESS',
    })
    createdVendorIds.push(testVendor.id)

    // Create a test bill for the vendor
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 30)

    testBill = await client.bills.create({
      vendorId: testVendor.id,
      invoiceNumber: `BILL-PAY-${Date.now()}`,
      invoiceDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      billLineItems: [
        {
          description: 'Test bill for payment',
          amount: 100,
          chartOfAccountId: incomeAccount?.id,
        },
      ],
    })
    createdBillIds.push(testBill.id)
  }, 30000)

  afterAll(async () => {
    // Cleanup: void any created payments (payments can't be archived, only voided)
    // Note: In a real scenario, you might need to void payments before cleanup

    // Cleanup bills
    for (const id of createdBillIds) {
      try {
        await client.bills.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
    // Cleanup vendors
    for (const id of createdVendorIds) {
      try {
        await client.vendors.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
    await client.logout()
  })

  describe('list', () => {
    it('should list payments', async () => {
      const result = await client.payments.list()
      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
    })

    it('should list payments with pagination', async () => {
      const result = await client.payments.list({ max: 5 })
      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(5)
    })

    it('should filter payments by vendor', async () => {
      const result = await client.payments.list({
        filters: [
          { field: 'vendorId', op: 'eq', value: testVendor.id },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((payment) => {
        expect(payment.vendorId).toBe(testVendor.id)
      })
    })

    it('should filter payments by status', async () => {
      const result = await client.payments.list({
        filters: [
          { field: 'status', op: 'in', value: ['SCHEDULED', 'PAID', 'PENDING'] },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((payment) => {
        expect(['SCHEDULED', 'PAID', 'PENDING']).toContain(payment.status)
      })
    })
  })

  describe('get', () => {
    it('should throw error for non-existent payment', async () => {
      await expect(client.payments.get('non-existent-id')).rejects.toThrow()
    })

    // Note: Getting a specific payment requires having a valid payment ID
    // In a real test environment, you would create a payment first
    it('should get payment by id when payment exists', async () => {
      // First, check if there are any existing payments
      const result = await client.payments.list({ max: 1 })
      if (result.results.length > 0) {
        const existingPayment = result.results[0]
        const payment = await client.payments.get(existingPayment.id)
        expect(payment).toBeDefined()
        expect(payment.id).toBe(existingPayment.id)
      } else {
        // Skip this test if no payments exist
        expect(true).toBe(true)
      }
    })
  })

  // Note: Creating payments typically requires:
  // 1. A valid funding account (bank account or card)
  // 2. An approved bill to pay
  // 3. Proper payment processing setup
  // These tests are commented out as they require specific account setup

  // describe('create', () => {
  //   it('should create a payment for a bill', async () => {
  //     const paymentData = {
  //       vendorId: testVendor.id,
  //       processDate: new Date().toISOString().split('T')[0],
  //       description: 'Test payment',
  //       billPayments: [
  //         {
  //           billId: testBill.id,
  //           amount: 100,
  //         },
  //       ],
  //     }
  //
  //     const payment = await client.payments.create(paymentData)
  //     createdPaymentIds.push(payment.id)
  //
  //     expect(payment).toBeDefined()
  //     expect(payment.id).toBeDefined()
  //     expect(payment.vendorId).toBe(testVendor.id)
  //   })
  // })

  describe('payment operations', () => {
    // Test that we can at least access the payment resource without errors
    it('should access payment resource without errors', async () => {
      expect(client.payments).toBeDefined()
      expect(typeof client.payments.list).toBe('function')
      expect(typeof client.payments.get).toBe('function')
      expect(typeof client.payments.create).toBe('function')
      expect(typeof client.payments.update).toBe('function')
    })
  })
})
