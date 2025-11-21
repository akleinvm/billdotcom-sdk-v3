import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client.js'
import type { Invoice, CreateInvoiceRequest, Customer } from '../../src/types/index.js'
import { testConfig, validateTestConfig } from '../setup.js'

describe('InvoiceResource', () => {
  let client: BillClient
  const createdInvoiceIds: string[] = []
  const createdCustomerIds: string[] = []
  let testCustomer: Customer
  let testInvoice: Invoice

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Create a test customer for invoices
    testCustomer = await client.customers.create({
      name: `Test Invoice Customer ${Date.now()}`,
      email: 'invoice-test@example.com',
    })
    createdCustomerIds.push(testCustomer.id)

    // Create a test invoice for get/update tests
    const today = new Date()
    const dueDate = new Date(today)
    dueDate.setDate(dueDate.getDate() + 30)

    testInvoice = await client.invoices.create({
      invoiceNumber: `INV-TEST-${Date.now()}`,
      invoiceDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      customerId: testCustomer.id,
      invoiceLineItems: [
        {
          description: 'Test Service',
          price: 100,
          quantity: 1,
        },
      ],
    })
    createdInvoiceIds.push(testInvoice.id)
  })

  afterAll(async () => {
    // Cleanup: archive all created invoices
    for (const id of createdInvoiceIds) {
      try {
        await client.invoices.archive(id)
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
    it('should list invoices', async () => {
      const result = await client.invoices.list()
      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list invoices with pagination', async () => {
      const result = await client.invoices.list({ max: 5 })
      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(5)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should filter invoices by customer', async () => {
      const result = await client.invoices.list({
        filters: [
          { field: 'customerId', op: 'eq', value: testCustomer.id },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((invoice) => {
        expect(invoice.customerId).toBe(testCustomer.id)
      })
    })

    it('should list active invoices only', async () => {
      const result = await client.invoices.list({
        filters: [
          { field: 'archived', op: 'eq', value: false },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((invoice) => {
        expect(invoice.archived).toBe(false)
      })
    })
  })

  describe('create', () => {
    it('should create an invoice with minimal fields', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const invoiceData: CreateInvoiceRequest = {
        invoiceNumber: `INV-MIN-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Basic Service',
            price: 50,
            quantity: 1,
          },
        ],
      }

      const invoice = await client.invoices.create(invoiceData)
      createdInvoiceIds.push(invoice.id)

      expect(invoice).toBeDefined()
      expect(invoice.id).toBeDefined()
      expect(invoice.invoiceNumber).toBe(invoiceData.invoiceNumber)
      expect(invoice.customerId).toBe(testCustomer.id)
      expect(invoice.archived).toBe(false)
    })

    it('should create an invoice with multiple line items', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const invoiceData: CreateInvoiceRequest = {
        invoiceNumber: `INV-MULTI-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Service A',
            price: 100,
            quantity: 2,
          },
          {
            description: 'Service B',
            price: 50,
            quantity: 3,
          },
        ],
      }

      const invoice = await client.invoices.create(invoiceData)
      createdInvoiceIds.push(invoice.id)

      expect(invoice).toBeDefined()
      expect(invoice.invoiceLineItems).toBeDefined()
      expect(invoice.invoiceLineItems?.length).toBe(2)
    })

    it('should create an invoice with card payment enabled', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const invoiceData: CreateInvoiceRequest = {
        invoiceNumber: `INV-CARD-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Premium Service',
            price: 200,
            quantity: 1,
          },
        ],
        enableCardPayment: true,
      }

      const invoice = await client.invoices.create(invoiceData)
      createdInvoiceIds.push(invoice.id)

      expect(invoice).toBeDefined()
      expect(invoice.enableCardPayment).toBe(true)
    })
  })

  describe('get', () => {
    it('should get invoice by id', async () => {
      const invoice = await client.invoices.get(testInvoice.id)
      expect(invoice).toBeDefined()
      expect(invoice.id).toBe(testInvoice.id)
      expect(invoice.invoiceNumber).toBe(testInvoice.invoiceNumber)
    })

    it('should throw error for non-existent invoice', async () => {
      await expect(client.invoices.get('non-existent-id')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update invoice number', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const created = await client.invoices.create({
        invoiceNumber: `INV-UPD-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Test Service',
            price: 100,
            quantity: 1,
          },
        ],
      })
      createdInvoiceIds.push(created.id)

      const newInvoiceNumber = `INV-UPDATED-${Date.now()}`
      const updated = await client.invoices.update(created.id, {
        invoiceNumber: newInvoiceNumber,
      })

      expect(updated).toBeDefined()
      expect(updated.invoiceNumber).toBe(newInvoiceNumber)
    })

    it('should update invoice due date', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const created = await client.invoices.create({
        invoiceNumber: `INV-DUE-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Test Service',
            price: 100,
            quantity: 1,
          },
        ],
      })
      createdInvoiceIds.push(created.id)

      const newDueDate = new Date(today)
      newDueDate.setDate(newDueDate.getDate() + 60)
      const updated = await client.invoices.update(created.id, {
        dueDate: newDueDate.toISOString().split('T')[0],
      })

      expect(updated).toBeDefined()
      expect(updated.dueDate).toBe(newDueDate.toISOString().split('T')[0])
    })
  })

  describe('archive and restore', () => {
    it('should archive an invoice', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const created = await client.invoices.create({
        invoiceNumber: `INV-ARCH-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Test Service',
            price: 100,
            quantity: 1,
          },
        ],
      })

      const archived = await client.invoices.archive(created.id)
      expect(archived).toBeDefined()
      expect(archived.archived).toBe(true)
    })

    it('should restore an archived invoice', async () => {
      const today = new Date()
      const dueDate = new Date(today)
      dueDate.setDate(dueDate.getDate() + 30)

      const created = await client.invoices.create({
        invoiceNumber: `INV-REST-${Date.now()}`,
        invoiceDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        customerId: testCustomer.id,
        invoiceLineItems: [
          {
            description: 'Test Service',
            price: 100,
            quantity: 1,
          },
        ],
      })
      createdInvoiceIds.push(created.id)

      await client.invoices.archive(created.id)
      const restored = await client.invoices.restore(created.id)

      expect(restored).toBeDefined()
      expect(restored.archived).toBe(false)
    })
  })
})
