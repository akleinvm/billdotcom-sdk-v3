import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client.js'
import type { AccountingClass, CreateAccountingClassRequest } from '../../src/types/index.js'
import { testConfig, validateTestConfig } from '../setup.js'

describe('AccountingClassResource', () => {
  let client: BillClient
  const createdClassIds: string[] = []
  let testClass: AccountingClass

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Create a test accounting class
    testClass = await client.accountingClasses.create({
      name: `Test Class ${Date.now()}`,
      description: 'Test accounting class for tests',
    })
    createdClassIds.push(testClass.id)
  })

  afterAll(async () => {
    for (const id of createdClassIds) {
      try {
        await client.accountingClasses.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
    await client.logout()
  })

  describe('list', () => {
    it('should list accounting classes', async () => {
      const result = await client.accountingClasses.list()

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list accounting classes with pagination', async () => {
      const result = await client.accountingClasses.list({
        max: 5,
      })

      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(5)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list active classes only', async () => {
      const result = await client.accountingClasses.list({
        filters: [
          { field: 'archived', op: 'eq', value: false },
        ],
      })

      expect(result).toBeDefined()
      result.results.forEach((cls) => {
        expect(cls.archived).toBe(false)
      })
    })
  })

  describe('create', () => {
    it('should create an accounting class', async () => {
      const classData: CreateAccountingClassRequest = {
        name: `Test Class Create ${Date.now()}`,
      }

      const cls = await client.accountingClasses.create(classData)
      createdClassIds.push(cls.id)

      expect(cls).toBeDefined()
      expect(cls.id).toBeDefined()
      expect(cls.name).toBe(classData.name)
      expect(cls.archived).toBe(false)
    })

    it('should create an accounting class with description', async () => {
      const classData: CreateAccountingClassRequest = {
        name: `Test Class Desc ${Date.now()}`,
        description: 'A test accounting class with description',
      }

      const cls = await client.accountingClasses.create(classData)
      createdClassIds.push(cls.id)

      expect(cls).toBeDefined()
      expect(cls.description).toBe(classData.description)
    })

    it('should create a child accounting class', async () => {
      const classData: CreateAccountingClassRequest = {
        name: `Test Child Class ${Date.now()}`,
        parentId: testClass.id,
      }

      const cls = await client.accountingClasses.create(classData)
      createdClassIds.push(cls.id)

      expect(cls).toBeDefined()
      expect(cls.parentId).toBe(testClass.id)
    })
  })

  describe('createMultiple', () => {
    it('should create multiple accounting classes at once', async () => {
      const classes: CreateAccountingClassRequest[] = [
        {
          name: `Test Class Bulk ${Date.now()}-1`,
          description: 'Bulk class 1',
        },
        {
          name: `Test Class Bulk ${Date.now()}-2`,
          description: 'Bulk class 2',
        },
      ]

      const result = await client.accountingClasses.createMultiple(classes)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)

      result.forEach((cls) => {
        createdClassIds.push(cls.id)
        expect(cls.id).toBeDefined()
        expect(cls.archived).toBe(false)
      })
    })
  })

  describe('get', () => {
    it('should get accounting class by id', async () => {
      const cls = await client.accountingClasses.get(testClass.id)

      expect(cls).toBeDefined()
      expect(cls.id).toBe(testClass.id)
      expect(cls.name).toBe(testClass.name)
    })

    it('should throw error for non-existent class', async () => {
      await expect(client.accountingClasses.get('non-existent-id')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update accounting class name', async () => {
      const created = await client.accountingClasses.create({
        name: `Test Class Update ${Date.now()}`,
      })
      createdClassIds.push(created.id)

      const newName = `Updated Class ${Date.now()}`
      const updated = await client.accountingClasses.update(created.id, {
        name: newName,
      })

      expect(updated).toBeDefined()
      expect(updated.name).toBe(newName)
    })

    it('should update accounting class description', async () => {
      const created = await client.accountingClasses.create({
        name: `Test Class Update Desc ${Date.now()}`,
      })
      createdClassIds.push(created.id)

      const updated = await client.accountingClasses.update(created.id, {
        description: 'Updated description',
      })

      expect(updated).toBeDefined()
      expect(updated.description).toBe('Updated description')
    })
  })

  describe('archive and restore', () => {
    it('should archive an accounting class', async () => {
      const created = await client.accountingClasses.create({
        name: `Test Class Archive ${Date.now()}`,
      })

      const archived = await client.accountingClasses.archive(created.id)

      expect(archived).toBeDefined()
      expect(archived.archived).toBe(true)
    })

    it('should restore an archived accounting class', async () => {
      const created = await client.accountingClasses.create({
        name: `Test Class Restore ${Date.now()}`,
      })
      createdClassIds.push(created.id)

      await client.accountingClasses.archive(created.id)
      const restored = await client.accountingClasses.restore(created.id)

      expect(restored).toBeDefined()
      expect(restored.archived).toBe(false)
    })
  })
})
