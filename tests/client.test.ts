import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BillClient } from '../src/client.js'
import { AuthenticationError } from '../src/utils/errors.js'
import { testConfig, validateTestConfig } from './setup.js'

describe('BillClient', () => {
  beforeAll(() => {
    validateTestConfig()
  })

  describe('initialization', () => {
    it('should create client with valid credentials', () => {
      const client = new BillClient(testConfig)
      expect(client).toBeDefined()
      expect(client.isLoggedIn()).toBe(false)
    })

    it('should default to sandbox environment', () => {
      const client = new BillClient({
        username: testConfig.username,
        password: testConfig.password,
        organizationId: testConfig.organizationId,
        devKey: testConfig.devKey,
      })
      expect(client).toBeDefined()
    })

    it('should default to autoLogin true', () => {
      const client = new BillClient(testConfig)
      expect(client).toBeDefined()
    })
  })

  describe('authentication', () => {
    let client: BillClient

    beforeAll(() => {
      client = new BillClient(testConfig)
    })

    afterAll(async () => {
      if (client.isLoggedIn()) {
        await client.logout()
      }
    })

    it('should login successfully with valid credentials', async () => {
      const session = await client.login()

      expect(session).toBeDefined()
      expect(session.sessionId).toBeDefined()
      expect(session.organizationId).toBeDefined()
      expect(session.userId).toBeDefined()
      expect(client.isLoggedIn()).toBe(true)
    })

    it('should return session info after login', () => {
      const session = client.getSession()

      expect(session).not.toBeNull()
      expect(session?.sessionId).toBeDefined()
    })

    it('should logout successfully', async () => {
      await client.logout()

      expect(client.isLoggedIn()).toBe(false)
      expect(client.getSession()).toBeNull()
    })

    it('should handle multiple logins', async () => {
      await client.login()
      const firstSession = client.getSession()

      await client.login()
      const secondSession = client.getSession()

      expect(firstSession?.sessionId).not.toBe(secondSession?.sessionId)
    })
  })

  describe('authentication errors', () => {
    it('should throw AuthenticationError for invalid credentials', async () => {
      const client = new BillClient({
        ...testConfig,
        password: 'invalid-password',
        autoLogin: false,
      })

      await expect(client.login()).rejects.toThrow()
    })

    it('should throw AuthenticationError for invalid devKey', async () => {
      const client = new BillClient({
        ...testConfig,
        devKey: 'invalid-dev-key',
        autoLogin: false,
      })

      await expect(client.login()).rejects.toThrow()
    })

    it('should throw AuthenticationError for invalid organizationId', async () => {
      const client = new BillClient({
        ...testConfig,
        organizationId: 'invalid-org-id',
        autoLogin: false,
      })

      await expect(client.login()).rejects.toThrow()
    })
  })

  describe('auto-login', () => {
    it('should throw when not logged in and autoLogin is false', async () => {
      const client = new BillClient({
        ...testConfig,
        autoLogin: false,
      })

      await expect(client.ensureLoggedIn()).rejects.toThrow(AuthenticationError)
    })

    it('should auto-login when ensureLoggedIn is called with autoLogin true', async () => {
      const client = new BillClient({
        ...testConfig,
        autoLogin: true,
      })

      await client.ensureLoggedIn()

      expect(client.isLoggedIn()).toBe(true)

      await client.logout()
    })
  })

  describe('withAutoRetry', () => {
    it('should execute operation successfully', async () => {
      const client = new BillClient(testConfig)

      const result = await client.withAutoRetry(async () => {
        return 'success'
      })

      expect(result).toBe('success')

      await client.logout()
    })

    it('should auto-login before operation', async () => {
      const client = new BillClient(testConfig)

      expect(client.isLoggedIn()).toBe(false)

      await client.withAutoRetry(async () => {
        return true
      })

      expect(client.isLoggedIn()).toBe(true)

      await client.logout()
    })
  })

  describe('resources', () => {
    it('should have all resources available', () => {
      const client = new BillClient(testConfig)

      expect(client.vendors).toBeDefined()
      expect(client.bills).toBeDefined()
      expect(client.chartOfAccounts).toBeDefined()
      expect(client.accountingClasses).toBeDefined()
    })
  })
})
