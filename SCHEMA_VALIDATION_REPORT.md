# Schema Validation Report

**Generated:** 2025-11-21
**Source:** Bill.com v3 Postman Collection (`billdotcom_v3.json`)
**Compared Against:** SDK Zod Schemas in `src/schemas/entities/`

## Executive Summary

This report compares the SDK's Zod entity schemas against the Bill.com v3 Postman collection to identify discrepancies, missing fields, and enum value gaps.

| Entity | Status | Issues Found |
|--------|--------|--------------|
| AccountingClass | MATCHES | 0 |
| ChartOfAccount | MATCHES | 0 |
| Bill | NEEDS UPDATE | 2 enum issues |
| Vendor | NEEDS UPDATE | 30+ missing fields/enums |

---

## Detailed Findings

### 1. AccountingClass Schema

**Status: MATCHES EXACTLY**

The SDK schema matches the Postman collection response structure perfectly.

| Field | SDK | Postman | Match |
|-------|-----|---------|-------|
| id | string | string | YES |
| name | string | string | YES |
| shortName | string (optional) | string | YES |
| description | string (optional) | string | YES |
| parentId | string (optional) | string | YES |
| archived | boolean | boolean | YES |
| createdTime | string | string | YES |
| updatedTime | string | string | YES |

---

### 2. ChartOfAccount Schema

**Status: MATCHES EXACTLY**

The SDK schema matches the Postman collection response structure perfectly.

| Field | SDK | Postman | Match |
|-------|-----|---------|-------|
| id | string | string | YES |
| archived | boolean | boolean | YES |
| name | string | string | YES |
| description | string (optional) | string | YES |
| parentId | string (optional) | string | YES |
| account.type | enum (17 values) | enum | YES |
| account.number | string (optional) | string | YES |
| createdTime | string | string | YES |
| updatedTime | string | string | YES |

---

### 3. Bill Schema

**Status: NEEDS UPDATE - 2 Enum Issues**

#### Enum Discrepancies

**BillPaymentStatusSchema**
```typescript
// Current SDK
z.enum(['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED'])

// Should be (from Postman)
z.enum(['PAID', 'UNPAID', 'PARTIAL', 'SCHEDULED', 'UNDEFINED'])
```

**ApproverStatusSchema**
```typescript
// Current SDK
z.enum(['WAITING', 'APPROVED', 'DENIED'])

// Should be (from Postman)
z.enum(['WAITING', 'APPROVED', 'DENIED', 'REROUTED', 'UNDEFINED'])
```

#### Recommended Changes

```typescript
// src/schemas/entities/bill.ts

export const BillPaymentStatusSchema = z.enum([
  'PAID',
  'UNPAID',
  'PARTIAL',
  'SCHEDULED',
  'UNDEFINED'  // ADD
])

export const ApproverStatusSchema = z.enum([
  'WAITING',
  'APPROVED',
  'DENIED',
  'REROUTED',   // ADD
  'UNDEFINED'   // ADD
])
```

---

### 4. Vendor Schema

**Status: NEEDS SIGNIFICANT UPDATE - 30+ Issues**

This entity has the most discrepancies between the SDK and the Postman collection.

#### Missing Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `accountNumber` | string | Vendor account number |
| `rppsId` | string | RPPS (Remote Payment and Presentment Service) ID |

#### Missing Address Fields

| Field | Type | Description |
|-------|------|-------------|
| `address.line2` | string | Second line of address |
| `address.countryName` | string | Full country name |

#### Missing PaymentInformation Fields

| Field | Type | Description |
|-------|------|-------------|
| `paymentInformation.email` | string | Payment notification email |
| `paymentInformation.lastPaymentDate` | string | Last payment date |
| `paymentInformation.payBySubType` | enum | Payment sub-type |
| `paymentInformation.paymentPurpose` | object | Payment purpose details |

**PaymentPurpose Structure:**
```typescript
paymentPurpose: z.object({
  text: z.string().optional(),
  code: z.object({
    name: z.string().optional(),
    value: z.string().optional(),
  }).optional(),
}).optional()
```

#### Missing VirtualCard Fields

| Field | Type | Description |
|-------|------|-------------|
| `virtualCard.remitEmail` | string | Remittance email |
| `virtualCard.enrollDate` | string | Enrollment date |
| `virtualCard.declineDate` | string | Decline date |
| `virtualCard.alternatePayByType` | enum | Alternate payment type |

#### Missing AdditionalInfo Fields

| Field | Type | Description |
|-------|------|-------------|
| `additionalInfo.taxId` | string | Tax ID |
| `additionalInfo.taxIdType` | enum | Tax ID type (SSN, EIN, UNDEFINED) |
| `additionalInfo.leadTimeInDays` | number | Lead time in days |
| `additionalInfo.paymentTermId` | string | Payment term ID |
| `additionalInfo.companyName` | string | Company name |

#### Missing BankAccount Fields

| Field | Type | Description |
|-------|------|-------------|
| `bankAccount.paymentCurrency` | string | Payment currency |

#### Missing Balance Fields

| Field | Type | Description |
|-------|------|-------------|
| `balance.lastUpdatedDate` | string | Last updated date |

#### Missing AutoPay Fields

| Field | Type | Description |
|-------|------|-------------|
| `autoPay.bankAccountId` | string | Bank account ID |
| `autoPay.createdBy` | string | Created by user ID |
| `autoPay.maxAmount` | number | Maximum auto-pay amount |
| `autoPay.daysBeforeDueDate` | number | Days before due date |

#### Enum Updates Required

**VendorAccountTypeSchema**
```typescript
// Current
z.enum(['BUSINESS', 'PERSON', 'NONE'])

// Should be
z.enum(['BUSINESS', 'PERSON', 'NONE', 'UNDEFINED'])
```

**VendorPayByTypeSchema**
```typescript
// Current
z.enum(['ACH', 'CHECK', 'VIRTUAL_CARD'])

// Should be
z.enum(['ACH', 'CHECK', 'VIRTUAL_CARD', 'RPPS', 'UNDEFINED'])
```

**VendorVirtualCardStatusSchema**
```typescript
// Current
z.enum(['ENROLLED', 'UNENROLLED', 'PENDING', 'UNKNOWN'])

// Should be
z.enum([
  'ENROLLED',
  'UNENROLLED',
  'PENDING',
  'UNKNOWN',
  'VERBAL_COMMITMENT',
  'REQUIRE_MORE_INFO',
  'UNDEFINED'
])
```

**New Enums to Add:**
```typescript
export const VendorPayBySubTypeSchema = z.enum([
  'MULTIPLE',
  'LOCAL',
  'WIRE'
])

export const VendorTaxIdTypeSchema = z.enum([
  'SSN',
  'EIN',
  'UNDEFINED'
])

export const VendorAlternatePayByTypeSchema = z.enum([
  'UNDEFINED',
  'CREDIT_CARD',
  'AMEX'
])
```

---

## Unimplemented Entities

The Postman collection contains 302 API endpoints, but only 4 entities are currently implemented. Key missing entities include:

### High Priority (Core AP/AR)

| Entity | Endpoint Base | Operations |
|--------|---------------|------------|
| Invoice | `/v3/invoices` | CRUD + bulk |
| Customer | `/v3/customers` | CRUD + bulk |
| Payment | `/v3/payments` | CRUD + bulk |
| Credit Memo | `/v3/credit-memos` | CRUD |
| Vendor Credit | `/v3/vendor-credits` | CRUD |

### Medium Priority (Classifications)

| Entity | Endpoint Base | Operations |
|--------|---------------|------------|
| Department | `/v3/classifications/departments` | CRUD + bulk |
| Location | `/v3/classifications/locations` | CRUD + bulk |
| Item | `/v3/classifications/items` | CRUD + bulk |
| Job | `/v3/classifications/jobs` | CRUD + bulk |
| Employee | `/v3/classifications/employees` | CRUD + bulk |
| Payment Term | `/v3/classifications/payment-terms` | CRUD + bulk |

### Additional Entities

| Entity | Endpoint Base | Operations |
|--------|---------------|------------|
| Funding Account | `/v3/funding-accounts` | List, Get |
| Document | `/v3/documents` | Upload, Download |
| User | `/v3/users` | List, Get |
| Recurring Bill | `/v3/recurring-bills` | CRUD |
| Bill Approval | `/v3/approvals` | Approve, Deny |

---

## Recommendations

### Immediate Actions

1. **Update Bill Enums**
   - Add `UNDEFINED` to `BillPaymentStatusSchema`
   - Add `REROUTED`, `UNDEFINED` to `ApproverStatusSchema`

2. **Update Vendor Schema**
   - Add all missing fields identified above
   - Update all enum definitions
   - Add new enum types for `payBySubType`, `taxIdType`, `alternatePayByType`

### Short-Term Actions

3. **Implement Core Entities**
   - Invoice (10 endpoints)
   - Customer (6 endpoints)
   - Payment (9 endpoints)

4. **Add Request Validation**
   - The SDK has response schemas but doesn't validate request bodies
   - Add `safeParse` calls before API requests

### Long-Term Actions

5. **Complete Entity Coverage**
   - Implement all classification entities
   - Add document upload/download support
   - Implement webhooks subscription management

6. **Automated Validation**
   - Set up CI/CD to run `npm run validate:entities` against live API
   - Add tests that compare schemas against Postman collection

---

## How to Use This Report

### Updating a Schema

1. Locate the schema file in `src/schemas/entities/`
2. Add missing fields as optional (`.optional()`) unless documented as required
3. Update enum values to include all possibilities
4. Run tests: `npm run test:schemas`

### Validating Against Live API

```bash
# Set environment variables
export BILL_USERNAME="your-username"
export BILL_PASSWORD="your-password"
export BILL_ORGANIZATION_ID="your-org-id"
export BILL_DEV_KEY="your-dev-key"

# Run validation
npm run validate:entities
```

---

## Appendix: Postman Collection Structure

The collection is organized into these main folders:

1. **AP & AR Authentication** - 9 endpoints
2. **AP & AR** - 207 endpoints
   - bills, vendors, payments, invoices, customers, classifications, etc.
3. **Spend & Expense** - 52 endpoints
4. **Partner Operations** - 14 endpoints
5. **BILL Network** - 9 endpoints
6. **Webhooks** - 11 endpoints

Total: **302 endpoints**
