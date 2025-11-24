# billdotcom-sdk-v3

TypeScript SDK for the Bill.com V3 API with full type safety and developer guidance.

## Features

- **Full TypeScript support** with accurate type definitions
- **Auto-complete friendly** - exported constants for all enum values
- **Type-safe filters and sorts** - know exactly which fields are filterable/sortable
- **JSDoc documentation** on all fields
- **Zero client-side validation** - trust the server for validation, keep the SDK lightweight

## Installation

```bash
npm install billdotcom-sdk-v3
```

## Quick Start

```typescript
import {
  BillClient,
  VENDOR_ACCOUNT_TYPES,  // ['BUSINESS', 'PERSON', 'NONE', 'UNDEFINED']
  BILL_PAYMENT_STATUSES, // ['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED', 'UNDEFINED']
} from 'billdotcom-sdk-v3'

// Create client (credentials supplied at login)
const client = new BillClient()

// Login with credentials
await client.login({
  username: 'your-username',
  password: 'your-password',
  organizationId: 'your-org-id',
  devKey: 'your-dev-key',
  environment: 'sandbox', // or 'production'
})

// List vendors
const vendors = await client.vendors.list()
console.log(vendors.data)

// Create a vendor with type hints
const vendor = await client.vendors.create({
  name: 'Acme Corp',
  accountType: 'BUSINESS', // IDE shows valid options from VENDOR_ACCOUNT_TYPES
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

### Constructor Options

```typescript
interface BillClientOptions {
  autoLogin?: boolean // default: true
}
```

### Login Credentials

```typescript
interface LoginCredentials {
  username: string
  password: string
  organizationId: string
  devKey: string
  environment?: 'sandbox' | 'production' // default: 'sandbox'
}
```

### Deferred Configuration

You can create the client without credentials and supply them later at login time:

```typescript
// Create client without credentials
const client = new BillClient()

// Or with autoLogin disabled
const client = new BillClient({ autoLogin: false })

// Check if configured
console.log(client.isConfigured()) // false

// Later, login with credentials
await client.login({
  username: 'your-username',
  password: 'your-password',
  organizationId: 'your-org-id',
  devKey: 'your-dev-key',
  environment: 'production',
})

console.log(client.isConfigured()) // true
```

### Legacy Configuration (deprecated)

The old pattern of passing credentials to the constructor still works but is deprecated:

```typescript
// Deprecated: pass credentials to login() instead
const client = new BillClient({
  username: 'your-username',
  password: 'your-password',
  organizationId: 'your-org-id',
  devKey: 'your-dev-key',
  environment: 'sandbox',
  autoLogin: true,
})
await client.login()
```

## Available Resources

The SDK provides access to the following Bill.com entities:

### Core Entities
- `client.vendors` - Vendor management
- `client.bills` - Bill management
- `client.invoices` - Invoice management
- `client.customers` - Customer management
- `client.payments` - Payment management
- `client.creditMemos` - Credit memo management

### Classification Entities
- `client.chartOfAccounts` - Chart of accounts
- `client.accountingClasses` - Accounting classes

## Type-Safe Constants

All enum values are exported as constants for autocomplete and validation:

```typescript
import {
  // Vendor constants
  VENDOR_ACCOUNT_TYPES,        // ['BUSINESS', 'PERSON', 'NONE', 'UNDEFINED']
  VENDOR_PAY_BY_TYPES,         // ['ACH', 'CHECK', 'VIRTUAL_CARD', 'RPPS', 'UNDEFINED']
  VENDOR_FILTERABLE_FIELDS,    // ['id', 'archived', 'name', ...]
  VENDOR_SORTABLE_FIELDS,      // ['name', 'createdTime', 'updatedTime']

  // Bill constants
  BILL_PAYMENT_STATUSES,       // ['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED', 'UNDEFINED']
  BILL_APPROVAL_STATUSES,      // ['UNASSIGNED', 'ASSIGNED', 'APPROVING', 'APPROVED', 'DENIED']
  BILL_FILTERABLE_FIELDS,      // ['id', 'archived', 'vendorId', 'amount', ...]

  // Invoice constants
  INVOICE_STATUSES,            // ['OPEN', 'PARTIAL_PAYMENT', 'PAID', 'SCHEDULED', 'VOID', 'UNDEFINED']

  // Payment constants
  PAYMENT_STATUSES,            // ['APPROVING', 'PAID', 'VOID', 'SCHEDULED', 'FAILED', ...]
  PAYMENT_DISBURSEMENT_TYPES,  // ['ACH', 'CHECK', 'RPPS', 'INTERNATIONAL', 'VCARD', ...]

  // Chart of Account constants
  ACCOUNT_TYPES,               // ['BANK', 'EXPENSE', 'INCOME', ...]

  // Type-safe field types
  type VendorFilterField,      // 'id' | 'archived' | 'name' | ...
  type BillSortField,          // 'dueDate' | 'amount' | 'createdTime' | 'updatedTime'
} from 'billdotcom-sdk-v3'
```

## Resource Methods

Most resources support the following operations:

```typescript
import {
  VENDOR_FILTERABLE_FIELDS, // Use for reference
  type VendorFilterField,   // Type-safe field names
} from 'billdotcom-sdk-v3'

// List entities with optional pagination and filters
const result = await client.vendors.list({
  max: 10,
  page: 'next-page-token', // optional, for pagination
  filters: [
    { field: 'archived', op: 'eq', value: false },
    { field: 'name', op: 'sw', value: 'Acme' }, // starts with
  ],
  sort: [{ field: 'name', order: 'asc' }],
})

// Filter operators: eq, ne, gt, gte, lt, lte, sw (starts with), in, nin

// Get a single entity by ID
const vendor = await client.vendors.get('vendor-id')

// Create a new entity
const newVendor = await client.vendors.create({
  name: 'New Vendor',
  accountType: 'BUSINESS',
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
import { BILL_PAYMENT_STATUSES } from 'billdotcom-sdk-v3'

// Create a bill
const bill = await client.bills.create({
  vendorId: 'vendor-id',
  dueDate: '2024-02-15',
  invoice: {
    invoiceNumber: 'INV-001',
    invoiceDate: '2024-01-15',
  },
  billLineItems: [
    {
      amount: 100,
      description: 'Office supplies',
      classifications: {
        chartOfAccountId: 'account-id',
      },
    },
  ],
})

// List bills by payment status
const unpaidBills = await client.bills.list({
  filters: [
    { field: 'paymentStatus', op: 'eq', value: 'UNPAID' },
  ],
  sort: [{ field: 'dueDate', order: 'asc' }],
})

// Bulk create bills
const bills = await client.bills.bulkCreate([
  {
    vendorId: 'vendor-id',
    dueDate: '2024-02-20',
    invoice: { invoiceNumber: 'INV-002', invoiceDate: '2024-01-20' },
    billLineItems: [{ amount: 200 }],
  },
  {
    vendorId: 'vendor-id',
    dueDate: '2024-02-21',
    invoice: { invoiceNumber: 'INV-003', invoiceDate: '2024-01-21' },
    billLineItems: [{ amount: 300 }],
  },
])
```

## Working with Invoices

```typescript
import { INVOICE_STATUSES } from 'billdotcom-sdk-v3'

// Create an invoice
const invoice = await client.invoices.create({
  invoiceNumber: 'INV-2024-001',
  invoiceDate: '2024-01-15',
  dueDate: '2024-02-15',
  customer: { id: 'customer-id' },
  invoiceLineItems: [
    {
      price: 500,
      quantity: 1,
      description: 'Consulting services',
      classifications: {
        chartOfAccountId: 'account-id',
      },
    },
  ],
})

// List open invoices
const openInvoices = await client.invoices.list({
  filters: [
    { field: 'status', op: 'eq', value: 'OPEN' },
  ],
  sort: [{ field: 'dueDate', order: 'asc' }],
})
```

## Working with Payments

```typescript
import { PAYMENT_STATUSES, PAYMENT_DISBURSEMENT_TYPES } from 'billdotcom-sdk-v3'

// List payments
const payments = await client.payments.list({
  filters: [
    { field: 'vendorId', op: 'eq', value: 'vendor-id' },
    { field: 'status', op: 'eq', value: 'SCHEDULED' },
  ],
})

// Create a payment
const payment = await client.payments.create({
  vendorId: 'vendor-id',
  processDate: '2024-02-01',
  billPayments: [
    {
      billId: 'bill-id',
      amount: 100,
    },
  ],
  fundingAccount: {
    type: 'BANK_ACCOUNT',
    id: 'bank-account-id',
  },
})

// Get payment details
const paymentDetails = await client.payments.get('payment-id')
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
  ConfigurationError,
} from 'billdotcom-sdk-v3'

try {
  const vendor = await client.vendors.get('invalid-id')
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.log('Client not configured - call login() with credentials first')
  } else if (error instanceof NotFoundError) {
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
// Login with credentials
await client.login({
  username: 'your-username',
  password: 'your-password',
  organizationId: 'your-org-id',
  devKey: 'your-dev-key',
})

// Check if configured (credentials provided)
if (client.isConfigured()) {
  console.log('Client has credentials')
}

// Check if logged in (has active session)
if (client.isLoggedIn()) {
  console.log('Logged in')
}

// Get session info
const session = client.getSession()
console.log(session?.sessionId)

// Ensure logged in (auto-login if credentials configured and autoLogin is true)
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
