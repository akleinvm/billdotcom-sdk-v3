import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client.js'
import type { Customer, CreateCustomerRequest } from '../../src/types/index.js'
import { testConfig, validateTestConfig } from '../setup.js'

describe('CustomerResource', () => {
  let client: BillClient
  const createdCustomerIds: string[] = []
  let testCustomer: Customer

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Create a test customer for get/update/archive tests
    testCustomer = await client.customers.create({
      name: `Test Customer ${Date.now()}`,
      email: 'test@example.com',
      description: 'Test customer for automated tests',
    })
    createdCustomerIds.push(testCustomer.id)
  })

  afterAll(async () => {
    // Cleanup: archive all created customers
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
    it('should list customers', async () => {
      const result = await client.customers.list()
      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list customers with pagination', async () => {
      const result = await client.customers.list({ max: 5 })
      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(5)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list active customers only', async () => {
      const result = await client.customers.list({
        filters: [
          { field: 'archived', op: 'eq', value: false },
        ],
      })
      expect(result).toBeDefined()
      result.results.forEach((customer) => {
        expect(customer.archived).toBe(false)
      })
    })
  })

  describe('create', () => {
    it('should create a customer with minimal fields', async () => {
      const customerData: CreateCustomerRequest = {
        name: `Test Customer Create ${Date.now()}`,
        email: `test-create-${Date.now()}@example.com`,
      }

      const customer = await client.customers.create(customerData)
      createdCustomerIds.push(customer.id)

      expect(customer).toBeDefined()
      expect(customer.id).toBeDefined()
      expect(customer.name).toBe(customerData.name)
      expect(customer.archived).toBe(false)
    })

    it('should create a customer with email and description', async () => {
      const customerData: CreateCustomerRequest = {
        name: `Test Customer Full ${Date.now()}`,
        email: 'full-test@example.com',
        description: 'A test customer with full details',
        phone: '555-0100',
      }

      const customer = await client.customers.create(customerData)
      createdCustomerIds.push(customer.id)

      expect(customer).toBeDefined()
      expect(customer.email).toBe(customerData.email)
      expect(customer.description).toBe(customerData.description)
      expect(customer.phone).toBe(customerData.phone)
    })

    it('should create a customer with contact information', async () => {
      const customerData: CreateCustomerRequest = {
        name: `Test Customer Contact ${Date.now()}`,
        email: `test-contact-${Date.now()}@example.com`,
        contact: {
          firstName: 'John',
          lastName: 'Doe',
        },
      }

      const customer = await client.customers.create(customerData)
      createdCustomerIds.push(customer.id)

      expect(customer).toBeDefined()
      expect(customer.contact).toBeDefined()
      expect(customer.contact?.firstName).toBe('John')
      expect(customer.contact?.lastName).toBe('Doe')
    })

    it('should create a customer with billing address', async () => {
      const customerData: CreateCustomerRequest = {
        name: `Test Customer Address ${Date.now()}`,
        email: `test-address-${Date.now()}@example.com`,
        billingAddress: {
          line1: '123 Main St',
          city: 'San Francisco',
          stateOrProvince: 'CA',
          zipOrPostalCode: '94105',
          country: 'US',
        },
      }

      const customer = await client.customers.create(customerData)
      createdCustomerIds.push(customer.id)

      expect(customer).toBeDefined()
      expect(customer.billingAddress).toBeDefined()
      expect(customer.billingAddress?.line1).toBe('123 Main St')
      expect(customer.billingAddress?.city).toBe('San Francisco')
    })

    it('should create a business account type customer', async () => {
      const customerData: CreateCustomerRequest = {
        name: `Test Business Customer ${Date.now()}`,
        email: `test-business-${Date.now()}@example.com`,
        accountType: 'BUSINESS',
        companyName: 'Test Company Inc',
      }

      const customer = await client.customers.create(customerData)
      createdCustomerIds.push(customer.id)

      expect(customer).toBeDefined()
      expect(customer.accountType).toBe('BUSINESS')
      expect(customer.companyName).toBe('Test Company Inc')
    })
  })

  describe('get', () => {
    it('should get customer by id', async () => {
      const customer = await client.customers.get(testCustomer.id)
      expect(customer).toBeDefined()
      expect(customer.id).toBe(testCustomer.id)
      expect(customer.name).toBe(testCustomer.name)
    })

    it('should throw error for non-existent customer', async () => {
      await expect(client.customers.get('non-existent-id')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update customer name', async () => {
      const created = await client.customers.create({
        name: `Test Customer Update ${Date.now()}`,
        email: `test-update-${Date.now()}@example.com`,
      })
      createdCustomerIds.push(created.id)

      const newName = `Updated Customer ${Date.now()}`
      const updated = await client.customers.update(created.id, {
        name: newName,
      })

      expect(updated).toBeDefined()
      expect(updated.name).toBe(newName)
    })

    it('should update customer email', async () => {
      const created = await client.customers.create({
        name: `Test Customer Email Update ${Date.now()}`,
        email: 'original@example.com',
      })
      createdCustomerIds.push(created.id)

      const newEmail = 'updated@example.com'
      const updated = await client.customers.update(created.id, {
        email: newEmail,
      })

      expect(updated).toBeDefined()
      expect(updated.email).toBe(newEmail)
    })

    it('should update customer description', async () => {
      const created = await client.customers.create({
        name: `Test Customer Desc Update ${Date.now()}`,
        email: `test-desc-update-${Date.now()}@example.com`,
      })
      createdCustomerIds.push(created.id)

      const newDescription = 'Updated description'
      const updated = await client.customers.update(created.id, {
        description: newDescription,
      })

      expect(updated).toBeDefined()
      expect(updated.description).toBe(newDescription)
    })
  })

  describe('archive and restore', () => {
    it('should archive a customer', async () => {
      const created = await client.customers.create({
        name: `Test Customer Archive ${Date.now()}`,
        email: `test-archive-${Date.now()}@example.com`,
      })

      const archived = await client.customers.archive(created.id)
      expect(archived).toBeDefined()
      expect(archived.archived).toBe(true)
    })

    it('should restore an archived customer', async () => {
      const created = await client.customers.create({
        name: `Test Customer Restore ${Date.now()}`,
        email: `test-restore-${Date.now()}@example.com`,
      })
      createdCustomerIds.push(created.id)

      await client.customers.archive(created.id)
      const restored = await client.customers.restore(created.id)

      expect(restored).toBeDefined()
      expect(restored.archived).toBe(false)
    })
  })
})
