# billdotcom-sdk-v3

TypeScript SDK for the Bill.com V3 API.

## Installation

```bash
npm install billdotcom-sdk-v3
```

## Quick Start

```typescript
import { BillClient } from 'billdotcom-sdk-v3'

const client = new BillClient({
  username: 'your-username',
  password: 'your-password',
  organizationId: 'your-org-id',
  devKey: 'your-dev-key',
  environment: 'sandbox', // or 'production'
})

// Login (auto-login is enabled by default)
await client.login()

// List vendors
const vendors = await client.vendors.list()
console.log(vendors.data)

// Create a vendor
const vendor = await client.vendors.create({
  name: 'Acme Corp',
  email: 'contact@acme.com',
})

// Get a vendor
const vendorDetails = await client.vendors.get(vendor.id)

// Update a vendor
const updatedVendor = await client.vendors.update(vendor.id, {
  phone: '555-123-4567',
})

// Archive a vendor
await client.vendors.archive(vendor.id)

// Logout
await client.logout()
```

## Configuration

```typescript
interface BillClientConfig {
  username: string
  password: string
  organizationId: string
  devKey: string
  environment?: 'sandbox' | 'production' // default: 'sandbox'
  autoLogin?: boolean // default: true
}
```

## Available Resources

The SDK provides access to the following Bill.com entities:

### Core Entities
- `client.vendors` - Vendor management
- `client.bills` - Bill management

### Classification Entities
- `client.chartOfAccounts` - Chart of accounts
- `client.accountingClasses` - Accounting classes

## Resource Methods

Most resources support the following operations:

```typescript
// List entities with optional pagination and filters
const result = await client.vendors.list({
  max: 10,
  page: 'next-page-token', // optional, for pagination
  filters: [
    { field: 'archived', op: 'eq', value: false },
    { field: 'name', op: 'eq', value: 'Acme' },
  ],
  sort: [{ field: 'name', order: 'asc' }],
})

// Get a single entity by ID
const vendor = await client.vendors.get('vendor-id')

// Create a new entity
const newVendor = await client.vendors.create({
  name: 'New Vendor',
  email: 'vendor@example.com',
})

// Update an existing entity
const updated = await client.vendors.update('vendor-id', {
  name: 'Updated Name',
})

// Archive an entity (soft delete)
await client.vendors.archive('vendor-id')

// Restore an archived entity
await client.vendors.restore('vendor-id')
```

## Working with Bills

```typescript
// Create a bill
const bill = await client.bills.create({
  vendorId: 'vendor-id',
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  billLineItems: [
    {
      amount: 100,
      chartOfAccountId: 'account-id',
      description: 'Office supplies',
    },
  ],
})

// Bulk create bills
const bills = await client.bills.bulkCreate([
  {
    vendorId: 'vendor-id',
    invoiceDate: '2024-01-20',
    dueDate: '2024-02-20',
    billLineItems: [{ amount: 200, chartOfAccountId: 'account-id' }],
  },
  {
    vendorId: 'vendor-id',
    invoiceDate: '2024-01-21',
    dueDate: '2024-02-21',
    billLineItems: [{ amount: 300, chartOfAccountId: 'account-id' }],
  },
])
```

## Working with Invoices

```typescript
// Create an invoice
const invoice = await client.invoices.create({
  customerId: 'customer-id',
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  invoiceLineItems: [
    {
      amount: 500,
      chartOfAccountId: 'account-id',
      description: 'Consulting services',
    },
  ],
})

// Get payment link for invoice
const { paymentLink } = await client.invoices.getPaymentLink(invoice.id)
```

## Working with Payments

```typescript
// List payments
const payments = await client.payments.list({
  filters: [
    { field: 'vendorId', op: 'eq', value: 'vendor-id' },
  ],
})

// Get payment options
const options = await client.payments.getOptions({
  vendorId: 'vendor-id',
  billIds: ['bill-id-1', 'bill-id-2'],
})

// Create a payment (requires bank account setup)
const payment = await client.payments.create({
  vendorId: 'vendor-id',
  processDate: '2024-02-01',
  chartOfAccountId: 'bank-account-id',
  billCredits: [
    {
      billId: 'bill-id',
      amount: 100,
    },
  ],
})

// Cancel a payment
await client.payments.cancel('payment-id')

// Void a payment
await client.payments.void('payment-id')
```

## Error Handling

The SDK provides custom error classes for different error scenarios:

```typescript
import {
  BillApiError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  SessionExpiredError,
} from 'billdotcom-sdk-v3'

try {
  const vendor = await client.vendors.get('invalid-id')
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Vendor not found')
  } else if (error instanceof AuthenticationError) {
    console.log('Authentication failed')
  } else if (error instanceof ValidationError) {
    console.log('Validation error:', error.message)
  } else if (error instanceof SessionExpiredError) {
    // Session will auto-renew if autoLogin is true
    console.log('Session expired')
  } else if (error instanceof BillApiError) {
    console.log('API error:', error.message)
  }
}
```

## Session Management

```typescript
// Manual login
await client.login()

// Check if logged in
if (client.isLoggedIn()) {
  console.log('Logged in')
}

// Get session info
const session = client.getSession()
console.log(session?.sessionId)

// Ensure logged in (auto-login if needed)
await client.ensureLoggedIn()

// Execute with auto-retry on session expiration
const result = await client.withAutoRetry(async () => {
  return await client.vendors.list()
})

// Logout
await client.logout()
```

## Development

### Setup

```bash
npm install
```

### Environment Variables

Create a `.env` file with your Bill.com credentials:

```
BILL_USERNAME=your-username
BILL_PASSWORD=your-password
BILL_ORGANIZATION_ID=your-org-id
BILL_DEV_KEY=your-dev-key
BILL_ENVIRONMENT=sandbox
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Type Check

```bash
npm run typecheck
```

## License

MIT
