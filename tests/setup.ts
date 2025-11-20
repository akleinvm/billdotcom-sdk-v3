import { config } from 'dotenv'

config()

export const testConfig = {
  username: process.env.BILL_USERNAME ?? '',
  password: process.env.BILL_PASSWORD ?? '',
  organizationId: process.env.BILL_ORGANIZATION_ID ?? '',
  devKey: process.env.BILL_DEV_KEY ?? '',
  environment: (process.env.BILL_ENVIRONMENT as 'sandbox' | 'production') ?? 'sandbox',
}

export function validateTestConfig(): void {
  if (!testConfig.username || !testConfig.password || !testConfig.organizationId || !testConfig.devKey) {
    throw new Error(
      'Missing test credentials. Please set BILL_USERNAME, BILL_PASSWORD, BILL_ORGANIZATION_ID, and BILL_DEV_KEY environment variables.'
    )
  }
}
