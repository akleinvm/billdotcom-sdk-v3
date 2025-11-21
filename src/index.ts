export { BillClient } from './client.ts'
export * from './types/index.ts'
export * from './utils/errors.ts'

// Re-export resources for direct usage
export { VendorResource } from './resources/vendor.ts'
export { BillResource } from './resources/bill.ts'
export { ChartOfAccountsResource } from './resources/chart-of-accounts.ts'
export { AccountingClassResource } from './resources/accounting-class.ts'
export { InvoiceResource } from './resources/invoice.ts'
export { CustomerResource } from './resources/customer.ts'
export { PaymentResource } from './resources/payment.ts'
export { CreditMemoResource } from './resources/credit-memo.ts'