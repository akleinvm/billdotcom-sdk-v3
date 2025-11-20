# Bill.com SDK v3 - Improvement Plan

This document outlines recommended improvements for the SDK, prioritized by impact.

## Table of Contents

- [Testing Entity Accuracy](#testing-entity-accuracy)
- [High Priority Improvements](#high-priority-improvements)
- [Medium Priority Improvements](#medium-priority-improvements)
- [Low Priority Improvements](#low-priority-improvements)

---

## Testing Entity Accuracy

Your entities (Zod schemas) need to match the actual Bill.com API responses exactly. Here's how to validate them:

### Quick Validation

```bash
# Run the entity validation script
npm run validate:entities

# Run schema-specific tests
npm run test:schemas
```

### What the Validation Script Does

1. **Connects** to Bill.com API with your credentials
2. **Fetches** records from each entity (Vendor, Bill, ChartOfAccount, AccountingClass)
3. **Validates** each record against your Zod schemas
4. **Reports** any mismatches:
   - Missing fields in your schemas (schema doesn't accept the field)
   - Wrong types (e.g., expecting string but got number)
   - Extra fields in API responses (fields you're not capturing)

### Understanding the Output

```
✅ Vendor
   Records: 10/10 valid
   ⚠️  Extra fields in API (not in schema):
      - metadata.syncedAt
      - address.line2
```

- **✅ Valid** = Schema matches API
- **⚠️ Extra fields** = API returns fields not in your schema (consider adding them)
- **❌ Errors** = Schema validation failed (fix required)

### Comparing Against Official Documentation

To ensure complete accuracy, compare your schemas against the official Bill.com API v3 documentation:

1. **Access API Docs**: https://developer.bill.com/reference
2. **For each entity**, compare:
   - Field names (case-sensitive)
   - Field types (string, number, boolean, object, array)
   - Required vs optional fields
   - Enum values (e.g., paymentStatus options)
   - Nested object structures

### Example Comparison Checklist

For the **Vendor** entity:

| API Doc Field | Your Schema | Status |
|--------------|-------------|--------|
| `id` | `z.string()` | ✅ |
| `name` | `z.string()` | ✅ |
| `accountType` | `z.enum(['BUSINESS', 'PERSON', 'NONE'])` | ✅ |
| `address.line2` | *Missing* | ⚠️ Add |
| `taxId` | *Missing* | ⚠️ Add |

### Adding Missing Fields

When you find missing fields:

```typescript
// In src/schemas/entities/vendor.ts

export const VendorAddressSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),  // Added
  city: z.string().optional(),
  // ...
})
```

### Testing After Updates

After updating schemas, run:

```bash
# Validate all entities
npm run validate:entities

# Run full test suite
npm run test:run

# Type check
npm run typecheck
```

---

## High Priority Improvements

### 1. Fix Stale Documentation

**Issue**: README documents `invoices` and `payments` that don't exist

**Fix Options**:
- Option A: Implement Invoice and Payment resources
- Option B: Update README to mark them as "Coming Soon"

```markdown
## Coming Soon
- `client.invoices` - Invoice management
- `client.payments` - Payment processing
```

### 2. Implement Missing Core Entities

These are commonly used Bill.com entities:

```typescript
// Priority order:
1. Invoice
2. Payment
3. Customer
4. ReceivedPay / SentPay
```

**Implementation Steps**:

```bash
# For each new entity:
1. Create src/schemas/entities/{entity}.ts
2. Create src/types/entities/{entity}.ts
3. Create src/resources/{entity}.ts
4. Export from src/index.ts
5. Add to BillClient
6. Create tests/resources/{entity}.test.ts
```

### 3. Add Unit Tests

**Issue**: Only integration tests exist (slow, require API)

**Solution**: Add mocked unit tests

```bash
npm install -D msw  # Mock Service Worker
```

```typescript
// tests/unit/vendor.test.ts
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('*/v3/vendors', () => {
    return HttpResponse.json({
      results: [{ id: '1', name: 'Test Vendor', ... }]
    })
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())
```

### 4. Add Linting

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

Create `eslint.config.js`:

```javascript
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
    }
  }
)
```

---

## Medium Priority Improvements

### 5. Add Request Timeout

```typescript
// src/utils/request.ts
export async function makeRequest<T>(
  config: RequestConfig,
  options: RequestOptions & { timeout?: number },
  schema?: ZodType<T>
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? 30000)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    // ...
  } finally {
    clearTimeout(timeoutId)
  }
}
```

### 6. Add Retry Logic for Transient Failures

```typescript
async function makeRequestWithRetry<T>(
  config: RequestConfig,
  options: RequestOptions,
  schema?: ZodType<T>,
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await makeRequest(config, options, schema)
    } catch (error) {
      if (attempt === retries - 1) throw error
      if (error instanceof RateLimitError) {
        await sleep(Math.pow(2, attempt) * 1000)
        continue
      }
      throw error
    }
  }
}
```

### 7. Add Code Coverage

```bash
npm install -D @vitest/coverage-v8
```

Update `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['tests/**', 'scripts/**'],
    }
  }
})
```

### 8. Add CI/CD with GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
```

---

## Low Priority Improvements

### 9. Add Request/Response Interceptors

```typescript
type Interceptor = (request: Request) => Request | Promise<Request>

class BillClient {
  private interceptors: Interceptor[] = []

  addInterceptor(interceptor: Interceptor) {
    this.interceptors.push(interceptor)
  }
}
```

### 10. Generate API Documentation

```bash
npm install -D typedoc
```

Add JSDoc comments to all public methods:

```typescript
/**
 * Lists vendors with optional pagination and filtering
 * @param params - List parameters
 * @returns Paginated list of vendors
 * @example
 * const vendors = await client.vendors.list({ max: 10 })
 */
async list(params?: VendorListParams): Promise<PaginatedResponse<Vendor>>
```

### 11. Add CHANGELOG

Create `CHANGELOG.md`:

```markdown
# Changelog

## [1.1.0] - 2024-XX-XX

### Added
- Invoice resource
- Payment resource
- Entity validation script

### Fixed
- Vendor schema missing `taxId` field
```

### 12. Simplify Type Re-exports

Current pattern creates unnecessary files. Consider:

```typescript
// Just export types directly from schemas
export type { Vendor, CreateVendorRequest } from './schemas/entities/vendor'
```

---

## Implementation Roadmap

### Week 1
- [ ] Run entity validation, fix any schema issues
- [ ] Update README (remove/mark unimplemented features)
- [ ] Add ESLint and Prettier

### Week 2
- [ ] Add unit tests with mocking
- [ ] Add code coverage reporting
- [ ] Set up CI/CD

### Week 3-4
- [ ] Implement Invoice resource
- [ ] Implement Payment resource
- [ ] Implement Customer resource

### Ongoing
- [ ] Add remaining entities as needed
- [ ] Improve documentation
- [ ] Add request timeout and retry logic

---

## Quick Start

1. **Validate current entities**:
   ```bash
   npm run validate:entities
   ```

2. **Run tests**:
   ```bash
   npm run test:run
   ```

3. **Type check**:
   ```bash
   npm run typecheck
   ```

4. **Build**:
   ```bash
   npm run build
   ```
