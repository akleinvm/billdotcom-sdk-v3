import type {
  BillClientConfig,
  LoginResponse,
  SessionInfo,
} from './types/common.js'
import { makeRequest, type RequestConfig } from './utils/request.js'
import { AuthenticationError, SessionExpiredError } from './utils/errors.js'

import { VendorResource } from './resources/vendor.js'
import { BillResource } from './resources/bill.js'
import { ChartOfAccountsResource } from './resources/chart-of-accounts.js'
import { AccountingClassResource } from './resources/accounting-class.js'

const BASE_URLS = {
  sandbox: 'https://gateway.stage.bill.com/connect',
  production: 'https://gateway.bill.com/connect',
} as const

export class BillClient {
  private readonly config: BillClientConfig
  private session: SessionInfo | null = null
  private readonly baseUrl: string

  public readonly vendors: VendorResource
  public readonly bills: BillResource
  public readonly chartOfAccounts: ChartOfAccountsResource
  public readonly accountingClasses: AccountingClassResource

  constructor(config: BillClientConfig) {
    this.config = {
      autoLogin: true,
      environment: 'sandbox',
      ...config,
    }
    this.baseUrl = BASE_URLS[this.config.environment ?? 'sandbox']

    const getConfig = () => this.getRequestConfig()

    this.vendors = new VendorResource(getConfig)
    this.bills = new BillResource(getConfig)
    this.chartOfAccounts = new ChartOfAccountsResource(getConfig)
    this.accountingClasses = new AccountingClassResource(getConfig)
  }

  private getRequestConfig(): RequestConfig {
    return {
      baseUrl: this.baseUrl,
      devKey: this.config.devKey,
      sessionId: this.session?.sessionId,
    }
  }

  async login(): Promise<SessionInfo> {
    const response = await makeRequest<LoginResponse>(
      {
        baseUrl: this.baseUrl,
        devKey: this.config.devKey,
      },
      {
        method: 'POST',
        path: '/v3/login',
        body: {
          username: this.config.username,
          password: this.config.password,
          organizationId: this.config.organizationId,
          devKey: this.config.devKey,
        },
      }
    )

    this.session = {
      sessionId: response.sessionId,
      organizationId: response.organizationId,
      userId: response.userId,
      apiEndPoint: response.apiEndPoint,
    }

    return this.session
  }

  async logout(): Promise<void> {
    if (!this.session) {
      return
    }

    try {
      await makeRequest(this.getRequestConfig(), {
        method: 'POST',
        path: '/v3/logout',
      })
    } finally {
      this.session = null
    }
  }

  async ensureLoggedIn(): Promise<void> {
    if (!this.session) {
      if (this.config.autoLogin) {
        await this.login()
      } else {
        throw new AuthenticationError(
          'Not logged in. Call login() first or set autoLogin to true.'
        )
      }
    }
  }

  isLoggedIn(): boolean {
    return this.session !== null
  }

  getSession(): SessionInfo | null {
    return this.session ? { ...this.session } : null
  }

  async withAutoRetry<T>(operation: () => Promise<T>): Promise<T> {
    await this.ensureLoggedIn()

    try {
      return await operation()
    } catch (error) {
      if (error instanceof SessionExpiredError && this.config.autoLogin) {
        await this.login()
        return await operation()
      }
      throw error
    }
  }
}