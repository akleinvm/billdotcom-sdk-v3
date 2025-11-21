import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client'
import type { Bill, CreateBillRequest, Vendor, ChartOfAccount } from '../../src/types'
import { testConfig, validateTestConfig } from '../setup'

describe('BillResource', () => {
  let client: BillClient
  const createdBillIds: string[] = []
  const createdVendorIds: string[] = []
  let testVendor: Vendor
  let testBill: Bill
  let testAccount: ChartOfAccount

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Create a test vendor for bills
    testVendor = await client.vendors.create({
      name: `Test Vendor for Bills ${Date.now()}`,
      accountType: "BUSINESS",
      address: {
        line1: "123 Test Street",
        city: "San Francisco",
        stateOrProvince: "CA",
        zipOrPostalCode: "94105",
        country: "US"
      }
    })
    createdVendorIds.push(testVendor.id)

    // Get or create a chart of account
    const accounts = await client.chartOfAccounts.list({ max: 1 })
    if (accounts.results.length > 0 && accounts.results[0]) {
      testAccount = accounts.results[0]
    } else {
      testAccount = await client.chartOfAccounts.create({
        name: `Test Account for Bills ${Date.now()}`,
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      })
    }

    // Create a test bill
    testBill = await client.bills.create({
      vendorId: testVendor.id,
      dueDate: '2024-02-15',
      invoice: {
        invoiceNumber: `INV-${Date.now()}`,
        invoiceDate: '2024-01-15',
      },
      billLineItems: [
        {
          amount: 100,
          description: 'Test line item',
          classifications: {
            chartOfAccountId: testAccount.id,
          },
        },
      ],
    })
    createdBillIds.push(testBill.id)
  })

  afterAll(async () => {
    for (const id of createdBillIds) {
      try {
        await client.bills.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
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
    it('should list bills', async () => {
      const result = await client.bills.list()

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list bills with pagination', async () => {
      const result = await client.bills.list({
        max: 5,
      })

      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(5)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list active bills only', async () => {
      const result = await client.bills.list({
        filters: [
          { field: 'archived', op: 'eq', value: false },
        ],
      })

      expect(result).toBeDefined()
      result.results.forEach((bill) => {
        expect(bill.archived).toBe(false)
      })
    })

    it('should filter bills by vendor', async () => {
      const result = await client.bills.list({
        filters: [
          { field: 'vendorId', op: 'eq', value: testVendor.id },
        ],
      })

      expect(result).toBeDefined()
      result.results.forEach((bill) => {
        expect(bill.vendorId).toBe(testVendor.id)
      })
    })
  })

  describe('create', () => {
    it('should create a bill with single line item', async () => {
      const billData: CreateBillRequest = {
        vendorId: testVendor.id,
        dueDate: '2024-02-20',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-20',
        },
        billLineItems: [
          {
            amount: 250,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      }

      const bill = await client.bills.create(billData)
      createdBillIds.push(bill.id)

      expect(bill).toBeDefined()
      expect(bill.id).toBeDefined()
      expect(bill.vendorId).toBe(testVendor.id)
      expect(bill.amount).toBe(250)
      expect(bill.archived).toBe(false)
    })

    it('should create a bill with multiple line items', async () => {
      const billData: CreateBillRequest = {
        vendorId: testVendor.id,
        dueDate: '2024-02-21',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-21',
        },
        billLineItems: [
          {
            amount: 100,
            description: 'Line 1',
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
          {
            amount: 200,
            description: 'Line 2',
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      }

      const bill = await client.bills.create(billData)
      createdBillIds.push(bill.id)

      expect(bill).toBeDefined()
      expect(bill.amount).toBe(300)
      expect(bill.billLineItems.length).toBe(2)
    })

    it('should create a bill with invoice number', async () => {
      const invoiceNumber = `INV-${Date.now()}`
      const billData: CreateBillRequest = {
        vendorId: testVendor.id,
        dueDate: '2024-02-22',
        invoice: {
          invoiceNumber,
          invoiceDate: '2024-01-22',
        },
        billLineItems: [
          {
            amount: 150,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      }

      const bill = await client.bills.create(billData)
      createdBillIds.push(bill.id)

      expect(bill).toBeDefined()
      expect(bill.invoice.invoiceNumber).toBe(invoiceNumber)
    })

    it('should create a bill with description', async () => {
      const billData: CreateBillRequest = {
        vendorId: testVendor.id,
        dueDate: '2024-02-23',
        description: 'Test bill description',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-23',
        },
        billLineItems: [
          {
            amount: 175,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      }

      const bill = await client.bills.create(billData)
      createdBillIds.push(bill.id)

      expect(bill).toBeDefined()
      expect(bill.description).toBe(billData.description)
    })

    it('should create a bill with PO number', async () => {
      const purchaseOrderNumber = `PO-${Date.now()}`
      const billData: CreateBillRequest = {
        vendorId: testVendor.id,
        dueDate: '2024-02-24',
        purchaseOrderNumber,
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-24',
        },
        billLineItems: [
          {
            amount: 125,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      }

      const bill = await client.bills.create(billData)
      createdBillIds.push(bill.id)

      expect(bill).toBeDefined()
      expect(bill.purchaseOrderNumber).toBe(purchaseOrderNumber)
    })
  })

  describe('get', () => {
    it('should get bill by id', async () => {
      const bill = await client.bills.get(testBill.id)

      expect(bill).toBeDefined()
      expect(bill.id).toBe(testBill.id)
      expect(bill.vendorId).toBe(testVendor.id)
    })

    it('should get bill with all fields', async () => {
      const bill = await client.bills.get(testBill.id)

      expect(bill).toBeDefined()
      expect(bill.id).toBeDefined()
      expect(bill.vendorId).toBeDefined()
      expect(bill.invoice).toBeDefined()
      expect(bill.dueDate).toBeDefined()
      expect(bill.amount).toBeDefined()
      expect(bill.dueAmount).toBeDefined()
      expect(bill.billLineItems).toBeDefined()
      expect(bill.createdTime).toBeDefined()
      expect(bill.updatedTime).toBeDefined()
    })

    it('should throw error for non-existent bill', async () => {
      await expect(client.bills.get('non-existent-id')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update bill description', async () => {
      const created = await client.bills.create({
        vendorId: testVendor.id,
        dueDate: '2024-02-25',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-25',
        },
        billLineItems: [
          {
            amount: 200,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      })
      createdBillIds.push(created.id)

      const updated = await client.bills.update(created.id, {
        description: 'Updated description',
      })

      expect(updated).toBeDefined()
      expect(updated.description).toBe('Updated description')
    })

    it('should update bill due date', async () => {
      const created = await client.bills.create({
        vendorId: testVendor.id,
        dueDate: '2024-02-26',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-26',
        },
        billLineItems: [
          {
            amount: 225,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      })
      createdBillIds.push(created.id)

      const updated = await client.bills.update(created.id, {
        dueDate: '2024-03-26',
      })

      expect(updated).toBeDefined()
      expect(updated.dueDate).toBe('2024-03-26')
    })
  })

  describe('createMultiple', () => {
    it('should create multiple bills at once', async () => {
      const bills: CreateBillRequest[] = [
        {
          vendorId: testVendor.id,
          dueDate: '2024-02-27',
          invoice: {
            invoiceNumber: `INV-${Date.now()}-1`,
            invoiceDate: '2024-01-27',
          },
          billLineItems: [
            {
              amount: 100,
              classifications: {
                chartOfAccountId: testAccount.id,
              },
            },
          ],
        },
        {
          vendorId: testVendor.id,
          dueDate: '2024-02-28',
          invoice: {
            invoiceNumber: `INV-${Date.now()}-2`,
            invoiceDate: '2024-01-28',
          },
          billLineItems: [
            {
              amount: 150,
              classifications: {
                chartOfAccountId: testAccount.id,
              },
            },
          ],
        },
      ]

      const result = await client.bills.createMultiple(bills)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)

      result.forEach((bill) => {
        createdBillIds.push(bill.id)
        expect(bill.id).toBeDefined()
        expect(bill.vendorId).toBe(testVendor.id)
      })
    })
  })

  describe('archive and restore', () => {
    it('should archive a bill', async () => {
      const created = await client.bills.create({
        vendorId: testVendor.id,
        dueDate: '2024-02-29',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-29',
        },
        billLineItems: [
          {
            amount: 300,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      })

      const archived = await client.bills.archive(created.id)

      expect(archived).toBeDefined()
      expect(archived.archived).toBe(true)
    })

    it('should restore an archived bill', async () => {
      const created = await client.bills.create({
        vendorId: testVendor.id,
        dueDate: '2024-03-01',
        invoice: {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceDate: '2024-01-30',
        },
        billLineItems: [
          {
            amount: 350,
            classifications: {
              chartOfAccountId: testAccount.id,
            },
          },
        ],
      })
      createdBillIds.push(created.id)

      await client.bills.archive(created.id)
      const restored = await client.bills.restore(created.id)

      expect(restored).toBeDefined()
      expect(restored.archived).toBe(false)
    })
  })
})