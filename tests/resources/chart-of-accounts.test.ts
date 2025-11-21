import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../../src/client'
import type { ChartOfAccount, CreateChartOfAccountRequest } from '../../src/types'
import { testConfig, validateTestConfig } from '../setup'

describe('ChartOfAccountsResource', () => {
  let client: BillClient
  const createdAccountIds: string[] = []
  let testAccount: ChartOfAccount

  beforeAll(async () => {
    validateTestConfig()
    client = new BillClient(testConfig)
    await client.login()

    // Create a test chart of account to ensure we have data
    testAccount = await client.chartOfAccounts.create({
      name: `Test Account ${Date.now()}`,
      account: {
        type: 'EXPENSE',
        number: `${Date.now()}`.slice(-6),
      },
    })
    createdAccountIds.push(testAccount.id)
  })

  afterAll(async () => {
    for (const id of createdAccountIds) {
      try {
        await client.chartOfAccounts.archive(id)
      } catch {
        // Ignore cleanup errors
      }
    }
    await client.logout()
  })

  describe('list', () => {
    it('should list chart of accounts', async () => {
      const result = await client.chartOfAccounts.list()

      expect(result).toBeDefined()
      expect(result.results).toBeDefined()
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should list chart of accounts with pagination', async () => {
      const result = await client.chartOfAccounts.list({
        max: 10,
      })

      expect(result).toBeDefined()
      expect(result.results.length).toBeLessThanOrEqual(10)
      expect(result.results.length).toBeGreaterThan(0)
    })

    it('should filter by id', async () => {
      const result = await client.chartOfAccounts.list({
        filters: [
          { field: 'id', op: 'eq', value: createdAccountIds[0] },
        ],
      })

      expect(result).toBeDefined()
      result.results.forEach((account) => {
        expect(account.account.type).toBe('EXPENSE')
      })
    })

    it('should list active accounts only', async () => {
      const result = await client.chartOfAccounts.list({
        filters: [
          { field: 'archived', op: 'eq', value: false },
        ],
      })

      expect(result).toBeDefined()
      result.results.forEach((account) => {
        expect(account.archived).toBe(false)
      })
    })
  })

  describe('create', () => {
    it('should create an expense account', async () => {
      const accountData: CreateChartOfAccountRequest = {
        name: `Test Expense ${Date.now()}`,
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      }

      const account = await client.chartOfAccounts.create(accountData)
      createdAccountIds.push(account.id)

      expect(account).toBeDefined()
      expect(account.id).toBeDefined()
      expect(account.name).toBe(accountData.name)
      expect(account.account.type).toBe('EXPENSE')
      expect(account.archived).toBe(false)
    })

    it('should create an income account', async () => {
      const accountData: CreateChartOfAccountRequest = {
        name: `Test Income ${Date.now()}`,
        account: {
          type: 'INCOME',
          number: `${Date.now()}`.slice(-6),
        },
      }

      const account = await client.chartOfAccounts.create(accountData)
      createdAccountIds.push(account.id)

      expect(account).toBeDefined()
      expect(account.account.type).toBe('INCOME')
    })

    it('should create an asset account', async () => {
      const accountData: CreateChartOfAccountRequest = {
        name: `Test Asset ${Date.now()}`,
        account: {
          type: 'OTHER_ASSET',
          number: `${Date.now()}`.slice(-6),
        },
      }

      const account = await client.chartOfAccounts.create(accountData)
      createdAccountIds.push(account.id)

      expect(account).toBeDefined()
      expect(account.account.type).toBe('OTHER_ASSET')
    })

    it('should create account with description', async () => {
      const accountData: CreateChartOfAccountRequest = {
        name: `Test Account Desc ${Date.now()}`,
        description: 'Test account with description',
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      }

      const account = await client.chartOfAccounts.create(accountData)
      createdAccountIds.push(account.id)

      expect(account).toBeDefined()
      expect(account.description).toBe(accountData.description)
    })
  })

  describe('createMultiple', () => {
    it('should create multiple chart of accounts at once', async () => {
      const accounts: CreateChartOfAccountRequest[] = [
        {
          name: `Test Account Bulk ${Date.now()}-1`,
          account: {
            type: 'EXPENSE',
            number: `${Date.now()}`.slice(-6),
          },
        },
        {
          name: `Test Account Bulk ${Date.now()}-2`,
          account: {
            type: 'EXPENSE',
            number: `${Date.now() + 1}`.slice(-6),
          },
        },
      ]

      const result = await client.chartOfAccounts.createMultiple(accounts)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)

      result.forEach((account) => {
        createdAccountIds.push(account.id)
        expect(account.id).toBeDefined()
        expect(account.archived).toBe(false)
      })
    })
  })

  describe('get', () => {
    it('should get chart of account by id', async () => {
      const account = await client.chartOfAccounts.get(testAccount.id)

      expect(account).toBeDefined()
      expect(account.id).toBe(testAccount.id)
      expect(account.name).toBe(testAccount.name)
    })

    it('should throw error for non-existent account', async () => {
      await expect(client.chartOfAccounts.get('non-existent-id')).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update account name', async () => {
      const created = await client.chartOfAccounts.create({
        name: `Test Account Update ${Date.now()}`,
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      })
      createdAccountIds.push(created.id)

      const newName = `Updated Account ${Date.now()}`
      const updated = await client.chartOfAccounts.update(created.id, {
        name: newName,
      })

      expect(updated).toBeDefined()
      expect(updated.name).toBe(newName)
    })

    it('should update account description', async () => {
      const created = await client.chartOfAccounts.create({
        name: `Test Account Update Desc ${Date.now()}`,
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      })
      createdAccountIds.push(created.id)

      const updated = await client.chartOfAccounts.update(created.id, {
        description: 'Updated description',
      })

      expect(updated).toBeDefined()
      expect(updated.description).toBe('Updated description')
    })
  })

  describe('archive and restore', () => {
    it('should archive a chart of account', async () => {
      const created = await client.chartOfAccounts.create({
        name: `Test Account Archive ${Date.now()}`,
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      })

      const archived = await client.chartOfAccounts.archive(created.id)

      expect(archived).toBeDefined()
      expect(archived.archived).toBe(true)
    })

    it('should restore an archived chart of account', async () => {
      const created = await client.chartOfAccounts.create({
        name: `Test Account Restore ${Date.now()}`,
        account: {
          type: 'EXPENSE',
          number: `${Date.now()}`.slice(-6),
        },
      })
      createdAccountIds.push(created.id)

      await client.chartOfAccounts.archive(created.id)
      const restored = await client.chartOfAccounts.restore(created.id)

      expect(restored).toBeDefined()
      expect(restored.archived).toBe(false)
    })
  })
})
